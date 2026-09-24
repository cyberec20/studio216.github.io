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
POSTS_JSON = ROOT / "articles" / "posts.json"

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
    return any("noindex" in value.lower() for value in meta_content(text, "robots"))

def jsonld_blocks(text: str) -> list[dict]:
    blocks = []
    for raw in re.findall(
        r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>',
        text,
        flags=re.I | re.S,
    ):
        try:
            blocks.append(json.loads(raw))
        except json.JSONDecodeError as exc:
            blocks.append({"__invalid__": str(exc)})
    return blocks

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

    blocks = jsonld_blocks(text)
    for block in blocks:
        if "__invalid__" in block:
            fail(rel, f"invalid JSON-LD: {block['__invalid__']}")

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

# Founder identity is a stable SEO/entity contract.
founder = ROOT / "about" / "founder" / "index.html"
if not founder.exists():
    fail(founder.relative_to(ROOT), "missing founder profile page")
else:
    text = founder.read_text(encoding="utf-8")
    if canonical_links(text) != ["https://studios216.com/about/founder/"]:
        fail(founder.relative_to(ROOT), "founder canonical must be https://studios216.com/about/founder/")
    if '"@type": "ProfilePage"' not in text or '"@type": "Person"' not in text:
        fail(founder.relative_to(ROOT), "founder page must expose ProfilePage + Person structured data")
    if '"jobTitle": "Founder & CEO"' not in text:
        fail(founder.relative_to(ROOT), "founder Person must declare Founder & CEO")

# Future generated article pages must obey the language/author/template contract.
for lang in ("es", "en"):
    lang_dir = ROOT / "articles" / lang
    if not lang_dir.exists():
        fail(lang_dir.relative_to(ROOT), "missing language directory")
        continue
    for page in sorted(lang_dir.glob("*/index.html")):
        rel = page.relative_to(ROOT)
        text = page.read_text(encoding="utf-8")
        html_lang = re.search(r'<html\s+lang=["\']([^"\']+)["\']', text, flags=re.I)
        if not html_lang or html_lang.group(1) != lang:
            fail(rel, f"html lang must be {lang}")
        if has_noindex(text):
            fail(rel, "published article page must not be noindex")
        if 'https://studios216.com/about/founder/' not in text:
            fail(rel, "article must link authorship to the founder profile")
        if 'hreflang="x-default"' not in text:
            fail(rel, "article must contain x-default hreflang")
        for tag in re.findall(r"<img\b[^>]*>", text, flags=re.I):
            if not re.search(r"\balt=", tag, flags=re.I):
                fail(rel, "all article images must carry an alt attribute")

posts = []
if POSTS_JSON.exists():
    try:
        posts = json.loads(POSTS_JSON.read_text(encoding="utf-8"))
        if not isinstance(posts, list):
            fail("articles/posts.json", "must contain a JSON array")
            posts = []
    except json.JSONDecodeError as exc:
        fail("articles/posts.json", f"invalid JSON: {exc}")

# Empty article indexes remain intentionally noindex until the first article is published.
if not posts:
    for index_path in (ROOT/"articles"/"index.html", ROOT/"articles"/"es"/"index.html", ROOT/"articles"/"en"/"index.html"):
        if index_path.exists() and not has_noindex(index_path.read_text(encoding="utf-8")):
            fail(index_path.relative_to(ROOT), "empty article index must remain noindex")

sitemap_urls: set[str] = set()
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
            sitemap_urls.add(loc)
            if not loc.startswith("https://studios216.com/"):
                fail("sitemap.xml", f"unexpected sitemap host: {loc}")
            if lastmod:
                try:
                    date.fromisoformat(lastmod)
                except ValueError:
                    fail("sitemap.xml", f"invalid lastmod date: {lastmod}")
    except ET.ParseError as exc:
        fail("sitemap.xml", f"invalid XML: {exc}")

if "https://studios216.com/about/founder/" not in sitemap_urls:
    fail("sitemap.xml", "founder profile page must be present in sitemap")

for post in posts:
    url = "https://studios216.com" + str(post.get("url", ""))
    if url not in sitemap_urls:
        fail("sitemap.xml", f"published article missing from sitemap: {url}")

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
