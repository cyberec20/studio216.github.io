#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

parser = argparse.ArgumentParser(description="Validate the explicit GitHub Pages publication boundary.")
parser.add_argument("--root", default="_site", help="Built public-site root to inspect.")
parser.add_argument(
    "--config",
    default=str(REPO_ROOT / "data" / "public_site.json"),
    help="Public-site whitelist JSON.",
)
parser.add_argument(
    "--require-nojekyll",
    action="store_true",
    help="Require .nojekyll for an explicitly built, non-Jekyll Pages artifact.",
)
args = parser.parse_args()

root = Path(args.root).resolve()
config_path = Path(args.config).resolve()

errors: list[str] = []

forbidden_roots = {
    ".github",
    "content",
    "data",
    "editorial",
    "scripts",
    "templates",
}

required_files = {
    "index.html",
    "about.html",
    "privacy.html",
    "about/founder/index.html",
    "articles/index.html",
    "articles/es/index.html",
    "articles/en/index.html",
    "robots.txt",
    "sitemap.xml",
    "CNAME",
}
if args.require_nojekyll:
    required_files.add(".nojekyll")

if not config_path.exists():
    errors.append(f"public-site config not found: {config_path}")
    config = {}
else:
    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"invalid public-site config: {exc}")
        config = {}

allowed_top_level = set(config.get("root_files") or [])
allowed_top_level.update(config.get("directories") or [])
allowed_top_level.update(config.get("generated_files") or [])
excluded_names = set(config.get("excluded_names") or [])
excluded_suffixes = tuple(config.get("excluded_suffixes") or [])

if not root.exists():
    errors.append(f"{root}: built site root does not exist")
else:
    actual_top_level = {path.name for path in root.iterdir()}
    unexpected_top_level = sorted(actual_top_level - allowed_top_level)
    for name in unexpected_top_level:
        errors.append(f"unexpected top-level public artifact entry: {name}")

    for name in sorted(forbidden_roots):
        if (root / name).exists():
            errors.append(f"{name} must not be present in the public Pages artifact")

    for name in sorted(required_files):
        if not (root / name).exists():
            errors.append(f"{name} is required in the public Pages artifact")

    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        rel = path.relative_to(root)
        if path.name in excluded_names:
            errors.append(f"excluded file leaked into public artifact: {rel}")
        if excluded_suffixes and path.name.endswith(excluded_suffixes):
            errors.append(f"excluded file type leaked into public artifact: {rel}")
        if path.is_symlink():
            errors.append(f"symlink must not be present in public artifact: {rel}")

    duplicate_source_patterns = (
        "content/articles/es/*.html",
        "content/articles/en/*.html",
        "editorial/**/*.html",
    )
    for pattern in duplicate_source_patterns:
        for path in root.glob(pattern):
            errors.append(
                f"{path.relative_to(root)} is an internal/generated duplicate and must not be public"
            )

if errors:
    print("Publication boundary validation failed:")
    for item in errors:
        print(f"  - {item}")
    sys.exit(1)

file_count = sum(1 for path in root.rglob("*") if path.is_file())
print(f"Publication boundary validation passed for {file_count} public files.")
