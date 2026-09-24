#!/usr/bin/env python3
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
errors=[]
def fail(message:str)->None: errors.append(message)

required=[
    ROOT/"data"/"site.json", ROOT/"templates"/"article.html",
    ROOT/"templates"/"articles-index.html", ROOT/"editorial"/"ARTICLE_WORKFLOW.md",
    ROOT/"assets"/"articles"/"manifest.json", ROOT/"articles"/"posts.json",
    ROOT/"data"/"legacy_articles.json",
]
for path in required:
    if not path.exists(): fail(f"missing required editorial foundation file: {path.relative_to(ROOT)}")

try:
    site=json.loads((ROOT/"data"/"site.json").read_text(encoding="utf-8"))
    founder=site["founder"]
    if founder.get("url")!="https://studios216.com/about/founder/": fail("founder.url must use canonical /about/founder/")
    if founder.get("job_title")!="Founder & CEO": fail("founder.job_title must be Founder & CEO")
except Exception as exc:
    fail(f"invalid data/site.json: {exc}")

try:
    posts=json.loads((ROOT/"articles"/"posts.json").read_text(encoding="utf-8"))
    if not isinstance(posts,list): fail("articles/posts.json must contain a JSON array")
except Exception as exc:
    fail(f"invalid articles/posts.json: {exc}")

for lang in ("es","en"):
    if not (ROOT/"articles"/lang/"index.html").exists(): fail(f"missing articles/{lang}/index.html")

for meta_path in sorted((ROOT/"content"/"articles"/"meta").glob("*.json")):
    try: meta=json.loads(meta_path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"{meta_path.relative_to(ROOT)} invalid JSON: {exc}"); continue
    if meta.get("status")=="published":
        versions=meta.get("versions") or {}
        if len(versions)>1 and meta.get("translation_key") is None:
            fail(f"{meta_path.relative_to(ROOT)}: bilingual publication requires translation_key")
        for lang,version in versions.items():
            editorial=version.get("editorial") or {}
            ddc=editorial.get("desire_driven_copy") or {}
            if editorial.get("profile")!="thought-leadership": fail(f"{meta_path.relative_to(ROOT)} {lang}: profile must be thought-leadership")
            if ddc.get("status")!="passed": fail(f"{meta_path.relative_to(ROOT)} {lang}: Desire-Driven Copy validation is not passed")
            for key in ("report","full_report"):
                report=ddc.get(key)
                if not report or not (ROOT/report).exists(): fail(f"{meta_path.relative_to(ROOT)} {lang}: {key} missing")
            if editorial.get("seo_review")!="passed": fail(f"{meta_path.relative_to(ROOT)} {lang}: SEO review is not passed")
            if editorial.get("punctuation_review")!="passed": fail(f"{meta_path.relative_to(ROOT)} {lang}: punctuation review is not passed")
            if editorial.get("human_read_aloud_review")!="passed": fail(f"{meta_path.relative_to(ROOT)} {lang}: human read-aloud review is not passed")
            if editorial.get("human_approval")!="approved": fail(f"{meta_path.relative_to(ROOT)} {lang}: human approval is not approved")
            if not version.get("hero_alt"): fail(f"{meta_path.relative_to(ROOT)} {lang}: hero_alt missing")
            hero_b64=version.get("hero_b64")
            if hero_b64 and not (ROOT/hero_b64).exists(): fail(f"{meta_path.relative_to(ROOT)} {lang}: hero_b64 payload missing")

try:
    legacy=json.loads((ROOT/"data"/"legacy_articles.json").read_text(encoding="utf-8"))
    if not isinstance(legacy,list): fail("data/legacy_articles.json must contain a JSON array")
    for item in legacy:
        for key in ("id","lang","title","description","url","date","topics","cover"):
            if not item.get(key): fail(f"legacy article {item.get('id','<unknown>')}: missing {key}")
except Exception as exc:
    fail(f"invalid data/legacy_articles.json: {exc}")

if errors:
    print("Editorial validation failed:")
    for item in errors: print(f"  - {item}")
    sys.exit(1)
print("Editorial validation passed.")
