#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import build_articles as builder

ROOT = Path(__file__).resolve().parents[1]
SITEMAP_CONFIG = ROOT / "data" / "sitemap.json"
POSTS_JSON = ROOT / "articles" / "posts.json"

errors: list[str] = []


def fail(message: str) -> None:
    errors.append(message)


def visible_text(fragment: str) -> str:
    cleaned = re.sub(r"<script\b.*?</script>", " ", fragment, flags=re.I | re.S)
    cleaned = re.sub(r"<style\b.*?</style>", " ", cleaned, flags=re.I | re.S)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    return re.sub(r"\s+", " ", html.unescape(cleaned)).strip()


def hrefs(fragment: str) -> list[str]:
    return re.findall(r"""<a\b[^>]*href=["']([^"']+)["']""", fragment, flags=re.I)


def article_body(page: str) -> str:
    match = re.search(
        r"""<div\s+class=["']article-body["']>(.*?)</div>\s*</article>""",
        page,
        flags=re.I | re.S,
    )
    return match.group(1) if match else ""


def external_anchor_contract(fragment: str, label: str) -> None:
    for tag in re.findall(r"<a\b[^>]*>", fragment, flags=re.I):
        href_match = re.search(r"""\bhref=["']([^"']+)["']""", tag, flags=re.I)
        if not href_match:
            continue
        href = html.unescape(href_match.group(1))
        parsed = urlparse(href)
        if parsed.scheme not in {"http", "https"}:
            continue
        host = (parsed.hostname or "").lower()
        if host in {"studios216.com", "www.studios216.com"}:
            continue
        class_match = re.search(r"""\bclass=["']([^"']*)["']""", tag, flags=re.I)
        rel_match = re.search(r"""\brel=["']([^"']*)["']""", tag, flags=re.I)
        classes = set(class_match.group(1).split()) if class_match else set()
        rels = set(rel_match.group(1).split()) if rel_match else set()
        if "editorial-link" not in classes:
            fail(f"{label}: external link lacks editorial-link class: {href}")
        if "noopener" not in rels:
            fail(f"{label}: external link lacks noopener rel: {href}")


def validate_articles() -> None:
    checked = 0
    for meta_path, meta in builder.load_metadata():
        if meta.get("status") != "published":
            continue
        for lang in sorted(meta["versions"]):
            version = meta["versions"][lang]
            source = ROOT / version["source"]
            target = ROOT / "articles" / lang / version["slug"] / "index.html"
            if not target.exists():
                fail(f"{meta_path}: generated article missing: {target.relative_to(ROOT)}")
                continue

            page = target.read_text(encoding="utf-8")
            body = article_body(page)
            if not body:
                fail(f"{target.relative_to(ROOT)}: article-body not found")
                continue

            rendered_source = builder.markdown_to_html(source)
            source_text = visible_text(rendered_source)
            generated_text = visible_text(body)
            if source_text != generated_text:
                fail(f"{target.relative_to(ROOT)}: visible article text does not match source Markdown")

            source_hrefs = hrefs(rendered_source)
            generated_hrefs = hrefs(body)
            if source_hrefs != generated_hrefs:
                fail(f"{target.relative_to(ROOT)}: article links do not match source Markdown")

            external_anchor_contract(body, str(target.relative_to(ROOT)))
            checked += 1

    if checked == 0:
        fail("no published generated articles were checked")
    else:
        print(f"PASS builder source fidelity for {checked} generated article pages")


def sitemap_entries(path: Path) -> list[dict[str, str]]:
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    tree = ET.parse(path)
    entries: list[dict[str, str]] = []
    for node in tree.getroot().findall("sm:url", namespace):
        entry: dict[str, str] = {}
        for key in ("loc", "lastmod", "changefreq", "priority"):
            value = node.findtext(f"sm:{key}", default="", namespaces=namespace).strip()
            if value:
                entry[key] = value
        entries.append(entry)
    return entries


def expected_sitemap_entries() -> list[dict[str, str]]:
    config = json.loads(SITEMAP_CONFIG.read_text(encoding="utf-8"))
    posts = json.loads(POSTS_JSON.read_text(encoding="utf-8"))
    entries = [dict(item) for item in config.get("static", [])]
    generated_posts = [
        post for post in posts
        if str(post.get("url") or "").startswith("/articles/")
    ]
    if generated_posts:
        latest = max(str(post["date"]) for post in generated_posts)
        for hub in config.get("article_hubs", []):
            item = dict(hub)
            item["lastmod"] = latest
            entries.append(item)
        priority = str(config.get("article_priority") or "0.8")
        for post in sorted(generated_posts, key=lambda item: str(item.get("url") or "")):
            entries.append({
                "loc": "https://studios216.com" + str(post["url"]),
                "lastmod": str(post["date"]),
                "priority": priority,
            })
    return entries


def validate_sitemap() -> None:
    actual = sitemap_entries(ROOT / "sitemap.xml")
    expected = expected_sitemap_entries()
    if actual != expected:
        fail("sitemap.xml does not match data/sitemap.json + published article registry")
    else:
        print(f"PASS deterministic sitemap contract for {len(actual)} URLs")


def main() -> int:
    validate_articles()
    validate_sitemap()

    if errors:
        print("Builder contract validation failed:")
        for item in errors:
            print(f"  - {item}")
        return 1

    print("Builder contract validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
