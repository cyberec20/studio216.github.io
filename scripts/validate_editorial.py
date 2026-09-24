#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []

def fail(message: str) -> None:
    errors.append(message)

required = [
    ROOT / "data" / "site.json",
    ROOT / "templates" / "article.html",
    ROOT / "templates" / "articles-index.html",
    ROOT / "editorial" / "ARTICLE_WORKFLOW.md",
    ROOT / "assets" / "articles" / "manifest.json",
    ROOT / "articles" / "posts.json",
]

for path in required:
    if not path.exists():
        fail(f"missing required editorial foundation file: {path.relative_to(ROOT)}")

try:
    site = json.loads((ROOT/"data"/"site.json").read_text(encoding="utf-8"))
    founder = site["founder"]
    if founder.get("url") != "https://studios216.com/about/founder/":
        fail("founder.url must use the canonical /about/founder/ URL")
    if founder.get("job_title") != "Founder & CEO":
        fail("founder.job_title must be Founder & CEO")
except Exception as exc:
    fail(f"invalid data/site.json: {exc}")

try:
    posts = json.loads((ROOT/"articles"/"posts.json").read_text(encoding="utf-8"))
    if not isinstance(posts, list):
        fail("articles/posts.json must contain a JSON array")
except Exception as exc:
    fail(f"invalid articles/posts.json: {exc}")

for lang in ("es", "en"):
    index = ROOT / "articles" / lang / "index.html"
    if not index.exists():
        fail(f"missing articles/{lang}/index.html")

meta_dir = ROOT / "content" / "articles" / "meta"
for meta_path in sorted(meta_dir.glob("*.json")):
    try:
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"{meta_path.relative_to(ROOT)} invalid JSON: {exc}")
        continue
    if meta.get("status") == "published":
        for lang, version in (meta.get("versions") or {}).items():
            editorial = version.get("editorial") or {}
            ddc = editorial.get("desire_driven_copy") or {}
            if ddc.get("status") != "passed":
                fail(f"{meta_path.relative_to(ROOT)} {lang}: Desire-Driven Copy validation is not passed")
            report = ddc.get("report")
            if not report or not (ROOT/report).exists():
                fail(f"{meta_path.relative_to(ROOT)} {lang}: Desire-Driven Copy report missing")
            if editorial.get("seo_review") != "passed":
                fail(f"{meta_path.relative_to(ROOT)} {lang}: SEO review is not passed")
            if editorial.get("human_approval") != "approved":
                fail(f"{meta_path.relative_to(ROOT)} {lang}: human approval is not approved")

if errors:
    print("Editorial validation failed:")
    for item in errors:
        print(f"  - {item}")
    sys.exit(1)

print("Editorial validation passed.")
