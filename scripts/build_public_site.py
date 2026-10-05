#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = REPO_ROOT / "data" / "public_site.json"
DEFAULT_SITE_CONFIG = REPO_ROOT / "data" / "site.json"
DEFAULT_PRODUCT_IMAGE_CONFIG = REPO_ROOT / "data" / "product-image-derivatives.json"

class BuildError(RuntimeError):
    pass

def load_config(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    for key in ("root_files", "directories", "excluded_names", "excluded_suffixes", "generated_files"):
        if key not in data or not isinstance(data[key], list):
            raise BuildError(f"{path}: {key} must be a list")
    return data

def load_site_config(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    analytics = data.get("analytics") or {}
    consent = analytics.get("consent") or {}
    providers = analytics.get("providers") or {}
    if consent.get("required") is not True or consent.get("default") != "denied":
        raise BuildError("site analytics must require consent with default=denied")
    for key in ("ga4", "meta_pixel", "clarity"):
        if not (providers.get(key) or {}).get("enabled"):
            raise BuildError(f"analytics provider {key} must be enabled")
    return data

def load_product_image_config(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema_version") != "1.0":
        raise BuildError(f"{path}: unsupported schema_version")
    defaults = data.get("defaults") or {}
    images = data.get("images")
    if not isinstance(images, list) or not images:
        raise BuildError(f"{path}: images must be a non-empty list")
    if defaults.get("format") != "webp":
        raise BuildError(f"{path}: only webp derivatives are supported")
    return data


def validate_relpath(value: str) -> Path:
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        raise BuildError(f"unsafe public-site path: {value}")
    return path

def should_exclude(path: Path, config: dict) -> bool:
    if path.name in set(config["excluded_names"]):
        return True
    return any(path.name.endswith(suffix) for suffix in config["excluded_suffixes"])

def copy_file(source: Path, destination: Path) -> None:
    if source.is_symlink():
        raise BuildError(f"symlinks are not allowed in the public artifact: {source}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)

def strip_legacy_tracking(text: str) -> str:
    script_pattern = re.compile(r"<script\b[^>]*>.*?</script>", flags=re.I | re.S)
    provider_markers = (
        "connect.facebook.net/en_US/fbevents.js",
        "fbq(",
        "googletagmanager.com/gtag/js",
        "function gtag(",
        "gtag('config'",
        'gtag("config"',
        "clarity.ms/tag/",
    )

    def strip_script(match: re.Match[str]) -> str:
        block = match.group(0)
        if any(marker in block for marker in provider_markers):
            return ""
        return block

    text = script_pattern.sub(strip_script, text)
    text = re.sub(
        r"<noscript\b[^>]*>.*?facebook\.com/tr\?.*?</noscript>",
        "",
        text,
        flags=re.I | re.S,
    )
    text = re.sub(
        r"\s*<!--\s*(?:Meta Pixel Code|End Meta Pixel Code|Google tag.*?|End Google Analytics GA4)\s*-->\s*",
        "\n",
        text,
        flags=re.I,
    )
    return text

def optimize_product_images(source_root: Path, destination: Path, config: dict) -> dict[str, str]:
    defaults = config.get("defaults") or {}
    max_width = int(defaults.get("max_width", 720))
    quality = int(defaults.get("quality", 82))
    mapping: dict[str, str] = {}
    total_source = 0
    total_derivative = 0

    for item in config["images"]:
        source_url = str(item.get("source") or "")
        target_url = str(item.get("target") or "")
        if not source_url.startswith("/") or not target_url.startswith("/"):
            raise BuildError("product image source/target paths must be root-relative")
        if source_url in mapping:
            raise BuildError(f"duplicate product image source mapping: {source_url}")

        source = source_root / source_url.lstrip("/")
        target = destination / target_url.lstrip("/")
        if not source.is_file():
            raise BuildError(f"product image source missing: {source_url}")

        item_max_width = int(item.get("max_width", max_width))
        item_quality = int(item.get("quality", quality))
        if item_max_width <= 0 or not 1 <= item_quality <= 100:
            raise BuildError(f"invalid optimization settings for {source_url}")

        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            if image.width > item_max_width:
                new_height = max(1, round(image.height * item_max_width / image.width))
                image = image.resize((item_max_width, new_height), Image.Resampling.LANCZOS)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            image.save(target, "WEBP", quality=item_quality, method=6)

        mapping[source_url] = target_url
        total_source += source.stat().st_size
        total_derivative += target.stat().st_size

    reduction = 0.0 if total_source == 0 else 100 * (1 - total_derivative / total_source)
    print(
        f"Generated {len(mapping)} optimized product images: "
        f"{total_source} -> {total_derivative} bytes ({reduction:.1f}% reduction)."
    )
    return mapping


def rewrite_html_image_sources(path: Path, mapping: dict[str, str]) -> None:
    if not mapping:
        return
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(r'(<img\b[^>]*?\bsrc\s*=\s*["\'])([^"\']+)(["\'])', flags=re.I)

    def replace(match: re.Match[str]) -> str:
        source = match.group(2)
        target = mapping.get(source)
        if not target:
            return match.group(0)
        return f"{match.group(1)}{target}{match.group(3)}"

    updated = pattern.sub(replace, text)
    if updated != text:
        path.write_text(updated, encoding="utf-8")


def analytics_markup(site_config: dict) -> str:
    analytics = site_config["analytics"]
    payload = {
        "consent": analytics["consent"],
        "providers": analytics["providers"],
        "events": analytics["events"],
    }
    encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    return (
        '\n  <link rel="stylesheet" href="/assets/css/site-analytics.css" data-studios216-analytics-style="v1">\n'
        f'  <script data-studios216-analytics="v1">window.Studios216AnalyticsConfig={encoded};</script>\n'
        '  <script defer src="/assets/js/site-analytics.js" data-studios216-analytics-loader="v1"></script>\n'
    )

def instrument_html(path: Path, site_config: dict) -> None:
    text = path.read_text(encoding="utf-8")
    text = strip_legacy_tracking(text)
    if 'data-studios216-analytics="v1"' in text or 'data-studios216-analytics-loader="v1"' in text:
        raise BuildError(f"{path}: source already contains centralized analytics injection")
    closing_head = re.search(r"</head\s*>", text, flags=re.I)
    if not closing_head:
        raise BuildError(f"{path}: HTML document has no closing head tag")
    marker = analytics_markup(site_config)
    text = text[:closing_head.start()] + marker + text[closing_head.start():]
    path.write_text(text, encoding="utf-8")

def build_public_site(source_root: Path, destination: Path, config: dict, site_config: dict, product_image_config: dict) -> int:
    source_root = source_root.resolve()
    destination = destination.resolve()

    if destination == source_root:
        raise BuildError("destination must not be the repository root")

    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True, exist_ok=True)

    copied = 0

    for item in config["root_files"]:
        rel = validate_relpath(str(item))
        source = source_root / rel
        if not source.is_file():
            raise BuildError(f"required public root file is missing: {rel.as_posix()}")
        copy_file(source, destination / rel)
        copied += 1

    for item in config["directories"]:
        rel_dir = validate_relpath(str(item))
        source_dir = source_root / rel_dir
        if not source_dir.is_dir():
            raise BuildError(f"required public directory is missing: {rel_dir.as_posix()}")

        for source in sorted(p for p in source_dir.rglob("*") if p.is_file()):
            rel = source.relative_to(source_root)
            if should_exclude(rel, config):
                continue
            copy_file(source, destination / rel)
            copied += 1

    for item in config["generated_files"]:
        rel = validate_relpath(str(item))
        target = destination / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("", encoding="utf-8")
        copied += 1

    image_mapping = optimize_product_images(source_root, destination, product_image_config)

    html_files = sorted(destination.rglob("*.html"))
    for html_file in html_files:
        rewrite_html_image_sources(html_file, image_mapping)
        instrument_html(html_file, site_config)

    print(f"Rewrote optimized product image sources on {len(html_files)} public HTML pages.")
    print(f"Instrumented analytics consent on {len(html_files)} public HTML pages.")
    return copied

def main() -> int:
    parser = argparse.ArgumentParser(description="Build the explicit public GitHub Pages artifact.")
    parser.add_argument("--source", default=str(REPO_ROOT), help="Repository/source root.")
    parser.add_argument("--destination", default=str(REPO_ROOT / "_site"), help="Output directory.")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG), help="Public-site whitelist JSON.")
    parser.add_argument("--site-config", default=str(DEFAULT_SITE_CONFIG), help="Site-level configuration JSON.")
    parser.add_argument("--product-image-config", default=str(DEFAULT_PRODUCT_IMAGE_CONFIG), help="Product-image derivative configuration JSON.")
    args = parser.parse_args()

    source_root = Path(args.source)
    destination = Path(args.destination)
    config_path = Path(args.config)
    site_config_path = Path(args.site_config)
    product_image_config_path = Path(args.product_image_config)

    if not config_path.exists():
        raise BuildError(f"public-site config not found: {config_path}")
    if not site_config_path.exists():
        raise BuildError(f"site config not found: {site_config_path}")
    if not product_image_config_path.exists():
        raise BuildError(f"product image config not found: {product_image_config_path}")

    config = load_config(config_path)
    site_config = load_site_config(site_config_path)
    product_image_config = load_product_image_config(product_image_config_path)
    copied = build_public_site(source_root, destination, config, site_config, product_image_config)
    print(f"Built explicit public site with {copied} files at {destination.resolve()}.")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (BuildError, json.JSONDecodeError) as exc:
        print(f"Public-site build failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
