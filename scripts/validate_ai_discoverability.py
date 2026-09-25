#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]

parser = argparse.ArgumentParser(description="Validate Studios216 AI discoverability contracts.")
parser.add_argument("--root", default=str(REPO_ROOT), help="Public site root to validate.")
parser.add_argument(
    "--config",
    default=str(REPO_ROOT / "data" / "site.json"),
    help="Studios216 site/discoverability policy JSON.",
)
args = parser.parse_args()

ROOT = Path(args.root).resolve()
CONFIG = Path(args.config).resolve()

passes: list[str] = []
warnings: list[str] = []
errors: list[str] = []
infos: list[str] = []

def passed(message: str) -> None:
    passes.append(message)

def warn(message: str) -> None:
    warnings.append(message)

def fail(message: str) -> None:
    errors.append(message)

def info(message: str) -> None:
    infos.append(message)

def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="strict")

def meta_values(text: str, name: str) -> list[str]:
    return re.findall(
        rf'<meta\s+[^>]*name=["\']{re.escape(name)}["\'][^>]*content=["\']([^"\']*)["\'][^>]*>',
        text,
        flags=re.I,
    )

def canonical(text: str) -> str | None:
    found = re.findall(
        r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\'][^>]*>',
        text,
        flags=re.I,
    )
    return found[0] if len(found) == 1 else None

def alternates(text: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for tag in re.findall(r"<link\b[^>]*>", text, flags=re.I):
        if not re.search(r'\brel=["\']alternate["\']', tag, flags=re.I):
            continue
        lang = re.search(r'\bhreflang=["\']([^"\']+)["\']', tag, flags=re.I)
        href = re.search(r'\bhref=["\']([^"\']+)["\']', tag, flags=re.I)
        if lang and href:
            result[lang.group(1)] = html_lib.unescape(href.group(1))
    return result

def jsonld_blocks(text: str) -> list[dict]:
    blocks: list[dict] = []
    for raw in re.findall(
        r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>',
        text,
        flags=re.I | re.S,
    ):
        try:
            value = json.loads(raw)
        except json.JSONDecodeError as exc:
            fail(f"invalid JSON-LD: {exc}")
            continue
        if isinstance(value, dict):
            blocks.append(value)
    return blocks

def visible_text(fragment: str) -> str:
    cleaned = re.sub(r"<script\b.*?</script>", " ", fragment, flags=re.I | re.S)
    cleaned = re.sub(r"<style\b.*?</style>", " ", cleaned, flags=re.I | re.S)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    return re.sub(r"\s+", " ", html_lib.unescape(cleaned)).strip()

def robots_blocks(text: str) -> list[tuple[list[str], list[tuple[str, str]]]]:
    groups: list[tuple[list[str], list[tuple[str, str]]]] = []
    agents: list[str] = []
    rules: list[tuple[str, str]] = []
    for raw in text.splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line or ":" not in line:
            continue
        key, value = (part.strip() for part in line.split(":", 1))
        key_l = key.lower()
        if key_l == "user-agent":
            if rules:
                groups.append((agents, rules))
                agents, rules = [], []
            agents.append(value.lower())
        elif agents and key_l in {"allow", "disallow"}:
            rules.append((key_l, value))
    if agents or rules:
        groups.append((agents, rules))
    return groups

def root_blocked(robots: str, agent: str) -> bool:
    agent_l = agent.lower()
    groups = robots_blocks(robots)
    exact = [rules for agents, rules in groups if agent_l in agents]
    applicable = exact or [rules for agents, rules in groups if "*" in agents]
    for rules in applicable:
        for directive, value in rules:
            if directive == "allow" and value == "/":
                return False
        for directive, value in rules:
            if directive == "disallow" and value in {"/", "/*"}:
                return True
    return False

if not ROOT.exists():
    fail(f"site root does not exist: {ROOT}")
if not CONFIG.exists():
    fail(f"discoverability config does not exist: {CONFIG}")

if errors:
    for item in errors:
        print(f"FAIL {item}")
    raise SystemExit(1)

site = json.loads(read_text(CONFIG))
policy = site.get("discoverability") or {}
goals = policy.get("goals") or {}
expected_x_default = str(policy.get("article_x_default_language") or "en")
founder_id = site["founder"]["id"]
founder_url = site["founder"]["url"]
organization_id = site["organization"]["id"]

robots_path = ROOT / "robots.txt"
if not robots_path.exists():
    fail("robots.txt is missing")
else:
    robots = read_text(robots_path)
    for enabled, agent, label in (
        (goals.get("google_search"), "Googlebot", "Google Search"),
        (goals.get("bing_search"), "Bingbot", "Bing Search/Copilot"),
        (goals.get("chatgpt_search"), "OAI-SearchBot", "ChatGPT Search"),
    ):
        if enabled:
            if root_blocked(robots, agent):
                fail(f"{agent} is blocked although {label} discovery is enabled")
            else:
                passed(f"{agent} is not blocked")
    if root_blocked(robots, "GPTBot"):
        info("GPTBot is blocked; this is independent from OAI-SearchBot search discovery")
    else:
        info("GPTBot inherits an allowed crawl policy; training control remains a separate owner choice")

if not (ROOT / "llms.txt").exists():
    info("llms.txt is absent; the skill does not require it for Google Search or AI visibility")

article_pages: list[Path] = []
for lang in ("es", "en"):
    lang_dir = ROOT / "articles" / lang
    if lang_dir.exists():
        article_pages.extend(sorted(lang_dir.glob("*/index.html")))

page_by_canonical: dict[str, tuple[Path, dict[str, str]]] = {}
for page in article_pages:
    rel = page.relative_to(ROOT)
    lang = rel.parts[1]
    text = read_text(page)
    page_canonical = canonical(text)
    if not page_canonical:
        fail(f"{rel}: expected exactly one canonical URL")
        continue
    if urlparse(page_canonical).scheme != "https":
        fail(f"{rel}: canonical must use HTTPS")

    robots_meta = " ".join(meta_values(text, "robots")).lower()
    if "noindex" in robots_meta:
        fail(f"{rel}: noindex conflicts with configured search discovery goals")
    if "nosnippet" in robots_meta:
        fail(f"{rel}: nosnippet conflicts with configured generative/search citation goals")

    alts = alternates(text)
    if alts.get(lang) != page_canonical:
        fail(f"{rel}: hreflang {lang} must self-reference the canonical URL")
    if expected_x_default in alts:
        expected_url = alts[expected_x_default]
        if alts.get("x-default") != expected_url:
            fail(f"{rel}: x-default must follow configured language {expected_x_default} ({expected_url})")
    elif alts.get("x-default") != page_canonical:
        fail(f"{rel}: x-default must fall back to the canonical URL when configured language is absent")

    blocks = jsonld_blocks(text)
    postings = [block for block in blocks if block.get("@type") == "BlogPosting"]
    if len(postings) != 1:
        fail(f"{rel}: expected exactly one BlogPosting JSON-LD object")
    else:
        post = postings[0]
        required = ("headline", "description", "image", "datePublished", "dateModified", "inLanguage")
        missing = [key for key in required if not post.get(key)]
        if missing:
            fail(f"{rel}: BlogPosting missing {', '.join(missing)}")
        if post.get("inLanguage") != lang:
            fail(f"{rel}: BlogPosting.inLanguage must be {lang}")
        author = post.get("author") or {}
        publisher = post.get("publisher") or {}
        main_entity = post.get("mainEntityOfPage") or {}
        if author.get("@id") != founder_id or author.get("url") != founder_url:
            fail(f"{rel}: BlogPosting author must use the stable founder entity")
        if publisher.get("@id") != organization_id:
            fail(f"{rel}: BlogPosting publisher must use the stable organization entity")
        if main_entity.get("@id") != page_canonical:
            fail(f"{rel}: mainEntityOfPage must match canonical URL")

    if founder_url not in text:
        fail(f"{rel}: visible authorship must link to the founder profile")
    body_match = re.search(
        r'<div\s+class=["\']article-body["\']>(.*?)</div>\s*</article>',
        text,
        flags=re.I | re.S,
    )
    if not body_match or not visible_text(body_match.group(1)):
        fail(f"{rel}: essential article information must be available as HTML text")

    page_by_canonical[page_canonical] = (page, alts)

for source_url, (source_page, source_alts) in page_by_canonical.items():
    source_lang = source_page.relative_to(ROOT).parts[1]
    for alt_lang in ("es", "en"):
        target_url = source_alts.get(alt_lang)
        if not target_url or target_url == source_url:
            continue
        target = page_by_canonical.get(target_url)
        if not target:
            fail(f"{source_page.relative_to(ROOT)}: hreflang target is not a built article: {target_url}")
            continue
        target_alts = target[1]
        if target_alts.get(source_lang) != source_url:
            fail(f"{source_page.relative_to(ROOT)}: hreflang relation with {target_url} is not reciprocal")

if article_pages and not errors:
    passed(f"{len(article_pages)} generated article pages expose stable entities, reciprocal hreflang and text content")

posts_path = ROOT / "articles" / "posts.json"
if not posts_path.exists():
    fail("articles/posts.json is missing")
else:
    posts = json.loads(read_text(posts_path))
    hubs = {
        "all": ROOT / "articles" / "index.html",
        "es": ROOT / "articles" / "es" / "index.html",
        "en": ROOT / "articles" / "en" / "index.html",
    }
    hub_links: dict[str, set[str]] = {}
    for key, path in hubs.items():
        if not path.exists():
            fail(f"missing article hub: {path.relative_to(ROOT)}")
            continue
        hrefs = set(re.findall(r'<a\b[^>]*href=["\']([^"\']+)["\']', read_text(path), flags=re.I))
        hub_links[key] = hrefs
    for post in posts:
        url = str(post.get("url") or "")
        lang = str(post.get("lang") or "")
        if url and url not in hub_links.get("all", set()):
            fail(f"articles/index.html must expose a crawlable HTML link to {url}")
        if url and lang in {"es", "en"} and url not in hub_links.get(lang, set()):
            fail(f"articles/{lang}/index.html must expose a crawlable HTML link to {url}")
    if posts and not errors:
        passed("article hubs expose server-rendered crawlable links to every listed article")

for item in warnings:
    print(f"WARN {item}")
for item in infos:
    print(f"INFO {item}")
for item in passes:
    print(f"PASS {item}")
if errors:
    for item in errors:
        print(f"FAIL {item}")
    print(f"AI discoverability validation failed with {len(errors)} blocking issue(s).")
    sys.exit(1)

print("AI discoverability validation passed. No aggregate ranking score is produced.")
