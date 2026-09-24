#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.rglob("*.html"))
SITEMAP = ROOT / "sitemap.xml"

errors: list[str] = []
warnings: list[str] = []

def fail(path: Path | str, message: str) -> None:
    errors.append(f"{path}: {message}")

def warn(path: Path | str, message: str) -> None:
    warnings.append(f"{path}: {message}")

def meta_content(text: str, name: str) -> list[str]:
    pattern = rf'<meta\s+[^>]*name=["\']{re.escape(name)}["\'][^>]*content=["\']([^"\']*)["\'][^>]*>'
    return re.findall(pattern, text, flags=re.I)

def canonical_links(text: str) -> list[str]:
    return re.findall(
        r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\'][^>]*>',
        text,
        flags=re.I,
    )

def has_noindex(text: str) -> bool:
    values = meta_content(text, "robots")
    return any("noindex" in value.lower() for value in values)

for path in HTML_FILES:
    rel = path.relative_to(ROOT)
    text = path.read_text(encoding="utf-8", errors="strict")

    if "RafWebPlugin" in text or "GLS/100.10.9637.96" in text:
        fail(rel, "unexpected browser/user-agent spoofing code is present")

    if '"ratingCount": "1250"' in text or '"ratingValue": "4.8"' in text:
        fail(rel, "unverified aggregateRating markup is present")

    title = re.findall(r"<title>(.*?)</title>", text, flags=re.I | re.S)
    if not title or not title[0].strip():
        fail(rel, "missing or empty <title>")

    if has_noindex(text):
        continue

    descriptions = meta_content(text, "description")
    if len(descriptions) != 1 or not descriptions[0].strip():
        fail(rel, f"expected exactly one non-empty meta description, found {len(descriptions)}")

    canonicals = canonical_links(text)
    if len(canonicals) != 1:
        fail(rel, f"expected exactly one canonical URL, found {len(canonicals)}")
    else:
        parsed = urlparse(canonicals[0])
        if parsed.scheme != "https" or not parsed.netloc:
            fail(rel, f"canonical must be an absolute HTTPS URL: {canonicals[0]}")

    for block in re.findall(
        r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>',
        text,
        flags=re.I | re.S,
    ):
        try:
            json.loads(block)
        except json.JSONDecodeError as exc:
            fail(rel, f"invalid JSON-LD: {exc}")

if not SITEMAP.exists():
    fail("sitemap.xml", "missing sitemap")
else:
    try:
        tree = ET.parse(SITEMAP)
        root = tree.getroot()
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        for url in root.findall("sm:url", ns):
            loc = url.findtext("sm:loc", default="", namespaces=ns).strip()
            lastmod = url.findtext("sm:lastmod", default="", namespaces=ns).strip()
            if not loc.startswith("https://studios216.com/"):
                fail("sitemap.xml", f"unexpected sitemap host: {loc}")
            if lastmod:
                try:
                    date.fromisoformat(lastmod)
                except ValueError:
                    fail("sitemap.xml", f"invalid lastmod date: {lastmod}")
    except ET.ParseError as exc:
        fail("sitemap.xml", f"invalid XML: {exc}")

if warnings:
    print("SEO warnings:")
    for item in warnings:
        print(f"  - {item}")

if errors:
    print("SEO validation failed:")
    for item in errors:
        print(f"  - {item}")
    sys.exit(1)

print(f"SEO validation passed for {len(HTML_FILES)} HTML files.")
