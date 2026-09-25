#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]

parser = argparse.ArgumentParser(description="Validate Studios216 SEO contracts.")
parser.add_argument(
    "--root",
    default=str(REPO_ROOT),
    help="Site root to validate. Defaults to the repository root; use _site for the built Pages artifact.",
)
args = parser.parse_args()

ROOT = Path(args.root).resolve()
HTML_FILES = sorted(
    p for p in ROOT.rglob("*.html")
    if "templates" not in p.relative_to(ROOT).parts
)
SITEMAP = ROOT / "sitemap.xml"
POSTS_JSON = ROOT / "articles" / "posts.json"

errors: list[str] = []
warnings: list[str] = []

def fail(path: Path | str, message: str) -> None:
    errors.append(f"{path}: {message}")

def warn(path: Path | str, message: str) -> None:
    warnings.append(f"{path}: {message}")

def rel(path: Path) -> Path:
    try:
        return path.relative_to(ROOT)
    except ValueError:
        return path

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

if not ROOT.exists():
    fail(ROOT, "validation root does not exist")

for path in HTML_FILES:
    relative = rel(path)
    text = path.read_text(encoding="utf-8", errors="strict")

    if "RafWebPlugin" in text or "GLS/100.10.9637.96" in text:
        fail(relative, "unexpected browser/user-agent spoofing code is present")

    if '"ratingCount": "1250"' in text or '"ratingValue": "4.8"' in text:
        fail(relative, "unverified aggregateRating markup is present")

    title = re.findall(r"<title>(.*?)</title>", text, flags=re.I | re.S)
    if not title or not title[0].strip():
        fail(relative, "missing or empty <title>")

    blocks = jsonld_blocks(text)
    for block in blocks:
        if "__invalid__" in block:
            fail(relative, f"invalid JSON-LD: {block['__invalid__']}")

    if has_noindex(text):
        continue

    descriptions = meta_content(text, "description")
    if len(descriptions) != 1 or not descriptions[0].strip():
        fail(relative, f"expected exactly one non-empty meta description, found {len(descriptions)}")

    canonicals = canonical_links(text)
    if len(canonicals) != 1:
        fail(relative, f"expected exactly one canonical URL, found {len(canonicals)}")
    else:
        parsed = urlparse(canonicals[0])
        if parsed.scheme != "https" or not parsed.netloc:
            fail(relative, f"canonical must be an absolute HTTPS URL: {canonicals[0]}")

# Founder identity is a stable SEO/entity contract.
founder = ROOT / "about" / "founder" / "index.html"
if not founder.exists():
    fail(rel(founder), "missing founder profile page")
else:
    text = founder.read_text(encoding="utf-8")
    if canonical_links(text) != ["https://studios216.com/about/founder/"]:
        fail(rel(founder), "founder canonical must be https://studios216.com/about/founder/")
    if '"@type": "ProfilePage"' not in text or '"@type": "Person"' not in text:
        fail(rel(founder), "founder page must expose ProfilePage + Person structured data")
    if '"jobTitle": "Founder & CEO"' not in text:
        fail(rel(founder), "founder Person must declare Founder & CEO")

# Generated article pages must obey the language/author/template contract.
for lang in ("es", "en"):
    lang_dir = ROOT / "articles" / lang
    if not lang_dir.exists():
        fail(rel(lang_dir), "missing language directory")
        continue
    for page in sorted(lang_dir.glob("*/index.html")):
        relative = rel(page)
        text = page.read_text(encoding="utf-8")
        html_lang = re.search(r'<html\s+lang=["\']([^"\']+)["\']', text, flags=re.I)
        if not html_lang or html_lang.group(1) != lang:
            fail(relative, f"html lang must be {lang}")
        if has_noindex(text):
            fail(relative, "published article page must not be noindex")
        if "https://studios216.com/about/founder/" not in text:
            fail(relative, "article must link authorship to the founder profile")
        if 'hreflang="x-default"' not in text:
            fail(relative, "article must contain x-default hreflang")
        for tag in re.findall(r"<img\b[^>]*>", text, flags=re.I):
            if not re.search(r"\balt=", tag, flags=re.I):
                fail(relative, "all article images must carry an alt attribute")

posts = []
if POSTS_JSON.exists():
    try:
        posts = json.loads(POSTS_JSON.read_text(encoding="utf-8"))
        if not isinstance(posts, list):
            fail("articles/posts.json", "must contain a JSON array")
            posts = []
    except json.JSONDecodeError as exc:
        fail("articles/posts.json", f"invalid JSON: {exc}")

article_indexes = (
    ROOT / "articles" / "index.html",
    ROOT / "articles" / "es" / "index.html",
    ROOT / "articles" / "en" / "index.html",
)
if not posts:
    for index_path in article_indexes:
        if index_path.exists() and not has_noindex(index_path.read_text(encoding="utf-8")):
            fail(rel(index_path), "empty article index must remain noindex")
else:
    for index_path in article_indexes:
        if not index_path.exists():
            fail(rel(index_path), "published article library requires this index")
        elif has_noindex(index_path.read_text(encoding="utf-8")):
            fail(rel(index_path), "non-empty article index must be indexable")

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

if posts:
    for hub in (
        "https://studios216.com/articles/",
        "https://studios216.com/articles/es/",
        "https://studios216.com/articles/en/",
    ):
        if hub not in sitemap_urls:
            fail("sitemap.xml", f"article hub missing from sitemap: {hub}")

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

print(f"SEO validation passed for {len(HTML_FILES)} HTML files under {ROOT}.")
