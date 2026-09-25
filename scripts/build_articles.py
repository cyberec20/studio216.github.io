#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META_DIR = ROOT / "content" / "articles" / "meta"
TEMPLATE = ROOT / "templates" / "article.html"
INDEX_TEMPLATE = ROOT / "templates" / "articles-index.html"
POSTS_JSON = ROOT / "articles" / "posts.json"
SITEMAP = ROOT / "sitemap.xml"
SITE_CONFIG = ROOT / "data" / "site.json"
LEGACY_POSTS_JSON = ROOT / "data" / "legacy_articles.json"

VALID_LANGS = {"es", "en"}
VALID_STATUS = {"draft", "ready", "published"}

class BuildError(RuntimeError):
    pass

def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))

def parse_iso(value: str | None, field: str, source: Path) -> None:
    if not value:
        raise BuildError(f"{source}: missing {field}")
    try:
        date.fromisoformat(value)
    except ValueError as exc:
        raise BuildError(f"{source}: invalid {field}: {value}") from exc

def validate_version(meta_path: Path, lang: str, version: dict, published: bool) -> None:
    if lang not in VALID_LANGS:
        raise BuildError(f"{meta_path}: unsupported language {lang}")
    for key in ("slug", "title", "description", "source", "topics"):
        if not version.get(key):
            raise BuildError(f"{meta_path}: {lang}.{key} is required")
    source = ROOT / version["source"]
    if not source.exists():
        raise BuildError(f"{meta_path}: source not found: {version['source']}")
    if published:
        parse_iso(version.get("published"), f"{lang}.published", meta_path)
        parse_iso(version.get("updated"), f"{lang}.updated", meta_path)
        for key in ("hero", "hero_alt", "og_image"):
            if not version.get(key):
                raise BuildError(f"{meta_path}: published {lang}.{key} is required")
        hero = version.get("hero")
        if isinstance(hero, str) and hero.startswith("/") and not (ROOT / hero.lstrip("/")).exists():
            raise BuildError(f"{meta_path}: published {lang}.hero asset not found: {hero}")
        editorial = version.get("editorial") or {}
        ddc = editorial.get("desire_driven_copy") or {}
        if editorial.get("profile") != "thought-leadership":
            raise BuildError(f"{meta_path}: published {lang} version requires profile=thought-leadership")
        if ddc.get("status") != "passed":
            raise BuildError(f"{meta_path}: published {lang} version requires Desire-Driven Copy status=passed")
        for report_key in ("report", "full_report"):
            report = ddc.get(report_key)
            if not report or not (ROOT / report).exists():
                raise BuildError(f"{meta_path}: published {lang} version requires existing {report_key}")
        if editorial.get("seo_review") != "passed":
            raise BuildError(f"{meta_path}: published {lang} version requires seo_review=passed")
        if editorial.get("punctuation_review") != "passed":
            raise BuildError(f"{meta_path}: published {lang} version requires punctuation_review=passed")
        if editorial.get("human_read_aloud_review") != "passed":
            raise BuildError(f"{meta_path}: published {lang} version requires human_read_aloud_review=passed")
        if editorial.get("human_approval") != "approved":
            raise BuildError(f"{meta_path}: published {lang} version requires human_approval=approved")

def metadata_files() -> list[Path]:
    return sorted(p for p in META_DIR.glob("*.json") if p.is_file())

def load_metadata() -> list[tuple[Path, dict]]:
    loaded = []
    for path in metadata_files():
        data = load_json(path)
        if data.get("status") not in VALID_STATUS:
            raise BuildError(f"{path}: invalid status")
        if not data.get("id") or not data.get("translation_key"):
            raise BuildError(f"{path}: id and translation_key are required")
        versions = data.get("versions") or {}
        if not versions:
            raise BuildError(f"{path}: at least one language version is required")
        published = data["status"] == "published"
        for lang, version in versions.items():
            validate_version(path, lang, version, published)
        loaded.append((path, data))
    return loaded

def markdown_to_html(source: Path) -> str:
    try:
        import markdown
    except ImportError as exc:
        raise BuildError("Python-Markdown is required for build mode. Run: pip install -r requirements-editorial.txt") from exc
    text = source.read_text(encoding="utf-8")
    text = re.sub(r"\A#\s+[^\n]+\n+", "", text, count=1)
    text = re.sub(r"(?<![<(])(https://[^\s)]+)", r"<\1>", text)
    return markdown.markdown(text, extensions=["extra", "sane_lists", "smarty"])

def reading_time(source: Path, lang: str) -> str:
    text = source.read_text(encoding="utf-8")
    words = len(re.findall(r"\b\w+\b", text, flags=re.UNICODE))
    minutes = max(1, round(words / 220))
    return f"{minutes} min de lectura" if lang == "es" else f"{minutes} min read"

def replace_tokens(template: str, values: dict[str, str]) -> str:
    out = template
    for key, value in values.items():
        out = out.replace("{{" + key + "}}", value)
    unresolved = re.findall(r"\{\{[A-Z0-9_]+\}\}", out)
    if unresolved:
        raise BuildError(f"Unresolved template tokens: {', '.join(sorted(set(unresolved)))}")
    return out

def public_url(lang: str, slug: str) -> str:
    return f"https://studios216.com/articles/{lang}/{slug}/"

def load_legacy_posts() -> list[dict]:
    if not LEGACY_POSTS_JSON.exists():
        return []
    data = load_json(LEGACY_POSTS_JSON)
    if not isinstance(data, list):
        raise BuildError("data/legacy_articles.json must contain a JSON array")
    return data

def optional_link_sections(site: dict) -> tuple[str, str]:
    explore_items = []
    for item in site.get("navigation", {}).get("future_editorial", []):
        if item.get("enabled") and item.get("href") and item.get("label"):
            explore_items.append(f'<a class="block" href="{html.escape(item["href"], quote=True)}">{html.escape(item["label"])}</a>')
    explore = ""
    if explore_items:
        explore = '<div class="mt-6"><p class="text-xs uppercase tracking-[.16em] text-gray-600 mb-2">Explore</p><div class="space-y-2 text-sm">' + "".join(explore_items) + "</div></div>"
    social_items = []
    for label, href in site.get("founder", {}).get("social", {}).items():
        if href:
            social_items.append(f'<a class="block" rel="me noopener" href="{html.escape(href, quote=True)}">{html.escape(label.title())}</a>')
    social = ""
    if social_items:
        social = '<div class="mt-6"><p class="text-xs uppercase tracking-[.16em] text-gray-600 mb-2">Social</p><div class="space-y-2 text-sm">' + "".join(social_items) + "</div></div>"
    return explore, social

def render_article(meta: dict, lang: str, version: dict, site: dict) -> dict:
    template = TEMPLATE.read_text(encoding="utf-8")
    source = ROOT / version["source"]
    versions = meta["versions"]
    alternates, switch = [], []
    for alt_lang, alt_version in versions.items():
        alt_url = public_url(alt_lang, alt_version["slug"])
        alternates.append(f'  <link rel="alternate" hreflang="{alt_lang}" href="{html.escape(alt_url)}">')
        label = "Español" if alt_lang == "es" else "English"
        switch.append(f'<span class="active">{label}</span>' if alt_lang == lang else f'<a href="{html.escape(alt_url)}">{label}</a>')
    default_lang = "en" if "en" in versions else next(iter(versions))
    default_url = public_url(default_lang, versions[default_lang]["slug"])
    alternates.append(f'  <link rel="alternate" hreflang="x-default" href="{html.escape(default_url)}">')

    labels = {
        "es": {"about":"Acerca de","articles":"Artículos","written":"Escrito por","about_franklin":"Sobre Franklin"},
        "en": {"about":"About","articles":"Articles","written":"Written by","about_franklin":"About Franklin"},
    }[lang]
    url = public_url(lang, version["slug"])
    founder = site["founder"]
    json_ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": version["title"],
        "description": version["description"],
        "image": version["og_image"],
        "datePublished": version["published"],
        "dateModified": version["updated"],
        "inLanguage": lang,
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "author": {"@type": "Person", "@id": founder["id"], "name": founder["name"], "url": founder["url"]},
        "publisher": {"@type": "Organization", "@id": site["organization"]["id"], "name": site["organization"]["name"], "url": site["organization"]["url"]},
    }
    hero_block = ""
    if version.get("show_hero", True):
        hero_src = version["hero"]
        hero_width = int(version.get("hero_width", 760))
        hero_height = int(version.get("hero_height", 428))
        hero_block = f'<figure class="article-hero"><img src="{html.escape(hero_src, quote=True)}" alt="{html.escape(version["hero_alt"], quote=True)}" width="{hero_width}" height="{hero_height}" loading="eager" decoding="async"></figure>'
    explore_links, social_links = optional_link_sections(site)
    rendered = replace_tokens(template, {
        "HTML_LANG": lang,
        "PAGE_TITLE": html.escape(version["title"] + " | Studios 216"),
        "META_DESCRIPTION": html.escape(version["description"], quote=True),
        "CANONICAL": html.escape(url, quote=True),
        "HREFLANG_LINKS": "\n".join(alternates),
        "OG_TITLE": html.escape(version["title"], quote=True),
        "OG_IMAGE": html.escape(version["og_image"], quote=True),
        "PUBLISHED": version["published"],
        "MODIFIED": version["updated"],
        "JSON_LD": json.dumps(json_ld, ensure_ascii=False),
        "NAV_ABOUT": labels["about"],
        "NAV_ARTICLES": labels["articles"],
        "WRITTEN_BY": labels["written"],
        "ABOUT_FRANKLIN": labels["about_franklin"],
        "EXPLORE_LINKS": explore_links,
        "SOCIAL_LINKS": social_links,
        "LANGUAGE_SWITCH": '<div class="language-switch">' + "".join(switch) + "</div>",
        "TOPICS": html.escape(" · ".join(version.get("topics") or [])),
        "ARTICLE_TITLE": html.escape(version["title"]),
        "DATE_LINE": html.escape(version["updated"]),
        "READING_TIME": reading_time(source, lang),
        "HERO_BLOCK": hero_block,
        "ARTICLE_BODY": markdown_to_html(source),
    })
    target = ROOT / "articles" / lang / version["slug"] / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(rendered, encoding="utf-8")
    return {
        "id": meta["id"], "translation_key": meta["translation_key"], "lang": lang,
        "title": version["title"], "description": version["description"],
        "url": f"/articles/{lang}/{version['slug']}/", "date": version["updated"],
        "topics": version.get("topics") or [], "topic_ids": version.get("topic_ids") or [],
        "cover": version.get("listing_cover", version["hero"]), "cover_alt": version["hero_alt"],
        "reading_time": reading_time(source, lang),
    }

def render_index_cards(posts: list[dict]) -> str:
    cards: list[str] = []
    for post in posts:
        topics = [str(item) for item in (post.get("topics") or [])]
        topic_attr = "||".join(topics)
        lang = str(post.get("lang") or "")
        lang_label = "ES" if lang == "es" else "EN"
        url = html.escape(str(post.get("url") or ""), quote=True)
        cover = str(post.get("cover") or "")
        cover_alt = html.escape(str(post.get("cover_alt") or ""), quote=True)
        title = html.escape(str(post.get("title") or ""))
        description = html.escape(str(post.get("description") or ""))
        date_value = html.escape(str(post.get("date") or ""))
        reading = html.escape(str(post.get("reading_time") or ""))
        attrs = (
            f'data-lang="{html.escape(lang, quote=True)}" '
            f'data-topics="{html.escape(topic_attr, quote=True)}"'
        )
        image = ""
        if cover:
            image = (
                f'<img src="{html.escape(cover, quote=True)}" alt="{cover_alt}" '
                'width="120" height="68" loading="lazy" class="article-list-cover">'
            )
        pills = "".join(
            f'<span class="topic-pill">{html.escape(topic)}</span>' for topic in topics
        )
        cards.append(
            f'<a class="article-list-card" href="{url}" {attrs}>'
            f'{image}<div class="article-list-body">'
            f'<p class="text-xs uppercase tracking-wider text-blue-400">{lang_label} · {date_value} · {reading}</p>'
            f'<h2 class="text-xl font-bold text-white mt-2">{title}</h2>'
            f'<p class="text-gray-400 mt-2">{description}</p>'
            f'<div class="topic-pills mt-4">{pills}</div>'
            '</div></a>'
        )
    return "".join(cards)


def render_topic_options(posts: list[dict], all_label: str) -> str:
    labels = sorted(
        {str(topic) for post in posts for topic in (post.get("topics") or [])},
        key=str.casefold,
    )
    options = [f'<option value="">{html.escape(all_label)}</option>']
    options.extend(
        f'<option value="{html.escape(label, quote=True)}">{html.escape(label)}</option>'
        for label in labels
    )
    return "".join(options)


def render_indexes(posts: list[dict]) -> None:
    template = INDEX_TEMPLATE.read_text(encoding="utf-8")
    hreflang_links = '<link rel="alternate" hreflang="es" href="https://studios216.com/articles/es/">\n  <link rel="alternate" hreflang="en" href="https://studios216.com/articles/en/">\n  <link rel="alternate" hreflang="x-default" href="https://studios216.com/articles/">'
    pages = [
      (ROOT/"articles"/"index.html","en","Articles | Studios 216","Bilingual articles from Studios 216 on AI systems, engineering, data, software and communication.","https://studios216.com/articles/","Ideas worth developing in full.","Long-form thinking on AI systems, engineering, software, data and communication.","","All articles","Search articles","All topics"),
      (ROOT/"articles"/"es"/"index.html","es","Artículos en español | Studios 216","Artículos de Studios 216 sobre sistemas de IA, ingeniería, datos, software y comunicación.","https://studios216.com/articles/es/","Artículos","Ideas sobre IA, ingeniería, software, datos y comunicación, desarrolladas en profundidad.","es","Todos los artículos","Buscar artículos","Todos los temas"),
      (ROOT/"articles"/"en"/"index.html","en","English Articles | Studios 216","Studios 216 articles on AI systems, engineering, data, software and communication.","https://studios216.com/articles/en/","Articles","Long-form ideas on AI, engineering, software, data and communication.","en","All articles","Search articles","All topics"),
    ]
    for path, lang, title, desc, canonical, heading, intro, filter_lang, all_label, search_label, topics_label in pages:
        page_posts = posts if not filter_lang else [p for p in posts if p["lang"] == filter_lang]
        page_robots = "index, follow" if page_posts else "noindex, follow"
        language_filters = ""
        if not filter_lang:
            language_filters = '<div class="filter-chips" aria-label="Language filters"><button class="filter-chip active" data-lang="">All</button><button class="filter-chip" data-lang="es">Español</button><button class="filter-chip" data-lang="en">English</button></div>'
        else:
            language_filters = '<div class="language-switch"><a href="/articles/">All</a>' + ('<span class="active">Español</span><a href="/articles/en/">English</a>' if filter_lang=="es" else '<a href="/articles/es/">Español</a><span class="active">English</span>') + '</div>'
        rendered = replace_tokens(template, {
            "HTML_LANG":lang,"PAGE_TITLE":html.escape(title),"META_DESCRIPTION":html.escape(desc,quote=True),
            "ROBOTS":page_robots,"CANONICAL":canonical,"HREFLANG_LINKS":hreflang_links,
            "HEADING":html.escape(heading),"INTRO":html.escape(intro),"FILTER_LANG_JSON":json.dumps(filter_lang),
            "LANGUAGE_FILTERS":language_filters,"SEARCH_PLACEHOLDER":html.escape(search_label,quote=True),
            "ALL_TOPICS_LABEL":html.escape(topics_label),"TOPIC_OPTIONS":render_topic_options(page_posts, topics_label),
            "ARTICLE_CARDS":render_index_cards(page_posts),"EMPTY_STATE":html.escape("No se encontraron artículos." if lang=="es" else "No articles found."),
        })
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(rendered, encoding="utf-8")

def update_sitemap(posts: list[dict]) -> None:
    ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    for node in list(root):
        loc = node.find(ns+"loc")
        if loc is not None and loc.text and loc.text.startswith("https://studios216.com/articles/"):
            root.remove(node)
    if posts:
        latest=max(p["date"] for p in posts)
        for hub in ("https://studios216.com/articles/","https://studios216.com/articles/es/","https://studios216.com/articles/en/"):
            url=ET.SubElement(root, ns+"url")
            ET.SubElement(url, ns+"loc").text=hub
            ET.SubElement(url, ns+"lastmod").text=latest
    existing_locs={node.findtext(ns+"loc") for node in root.findall(ns+"url")}
    for post in posts:
        absolute="https://studios216.com"+post["url"]
        if absolute in existing_locs:
            continue
        url=ET.SubElement(root, ns+"url")
        ET.SubElement(url, ns+"loc").text=absolute
        ET.SubElement(url, ns+"lastmod").text=post["date"]
        existing_locs.add(absolute)
    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)

def main() -> int:
    parser=argparse.ArgumentParser()
    parser.add_argument("--check",action="store_true",help="Validate article metadata without writing output")
    args=parser.parse_args()
    site=load_json(SITE_CONFIG)
    loaded=load_metadata()
    if args.check:
        print(f"Editorial metadata check passed ({len(loaded)} article families).")
        return 0
    posts=load_legacy_posts()
    for _,meta in loaded:
        if meta["status"]!="published":
            continue
        for lang,version in meta["versions"].items():
            posts.append(render_article(meta,lang,version,site))
    posts.sort(key=lambda p:p["date"],reverse=True)
    POSTS_JSON.write_text(json.dumps(posts,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    render_indexes(posts)
    update_sitemap(posts)
    print(f"Built {len(posts)} published article versions.")
    return 0

if __name__=="__main__":
    try:
        raise SystemExit(main())
    except (BuildError,json.JSONDecodeError) as exc:
        print(f"Article build failed: {exc}",file=sys.stderr)
        raise SystemExit(1)
