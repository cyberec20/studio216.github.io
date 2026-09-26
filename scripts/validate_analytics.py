#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description="Validate global analytics and consent coverage.")
parser.add_argument("--root", default="_site", help="Built public-site root.")
parser.add_argument("--site-config", default=str(REPO_ROOT / "data" / "site.json"))
args = parser.parse_args()

root = Path(args.root).resolve()
config_path = Path(args.site_config).resolve()
errors: list[str] = []

try:
    site = json.loads(config_path.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as exc:
    print(f"Analytics validation failed: cannot read site config: {exc}")
    raise SystemExit(1)

analytics = site.get("analytics") or {}
consent = analytics.get("consent") or {}
providers = analytics.get("providers") or {}
events = analytics.get("events") or {}

if consent.get("required") is not True:
    errors.append("analytics.consent.required must be true")
if consent.get("default") != "denied":
    errors.append("analytics.consent.default must be denied")
if consent.get("policy_url") != "/privacy.html":
    errors.append("analytics consent policy_url must point to /privacy.html")

patterns = {
    "ga4": r"^G-[A-Z0-9]+$",
    "meta_pixel": r"^[0-9]+$",
    "clarity": r"^[A-Za-z0-9]+$",
}
fields = {"ga4": "measurement_id", "meta_pixel": "pixel_id", "clarity": "project_id"}
for name, pattern in patterns.items():
    cfg = providers.get(name) or {}
    value = str(cfg.get(fields[name]) or "")
    if cfg.get("enabled") is not True:
        errors.append(f"{name} must be enabled")
    if not re.match(pattern, value):
        errors.append(f"{name} has invalid {fields[name]}")

if (providers.get("ga4") or {}).get("consent_mode") != "advanced":
    errors.append("GA4 must use advanced consent mode")
if (providers.get("meta_pixel") or {}).get("requires_consent") is not True:
    errors.append("Meta Pixel must remain blocked until consent")
if (providers.get("clarity") or {}).get("consent_mode") != "v2":
    errors.append("Clarity must use ConsentV2")
if (providers.get("clarity") or {}).get("no_consent_mode") is not True:
    errors.append("Clarity no-consent mode must be enabled")

expected_events = {"product_impression", "product_click", "product_cta_click", "external_product_visit"}
if set(events.get("ga4") or []) != expected_events:
    errors.append("GA4 event taxonomy must contain exactly the four approved product events")
if set(events.get("clarity") or []) != expected_events:
    errors.append("Clarity event taxonomy must contain exactly the four approved product events")
if set(events.get("meta_pixel") or []) != {"product_cta_click", "external_product_visit"}:
    errors.append("Meta Pixel must remain limited to commercial product events")

asset_js = root / "assets/js/site-analytics.js"
asset_css = root / "assets/css/site-analytics.css"
for asset in (asset_js, asset_css, root / "privacy.html"):
    if not asset.is_file():
        errors.append(f"required analytics asset missing: {asset.relative_to(root)}")

if asset_js.is_file():
    runtime = asset_js.read_text(encoding="utf-8", errors="ignore")
    required_runtime_markers = (
        '"consent", "default"',
        'analytics_storage: "denied"',
        'googletagmanager.com/gtag/js',
        'consentv2',
        'analytics_Storage: choice === "accepted" ? "granted" : "denied"',
        'connect.facebook.net/en_US/fbevents.js',
        'readChoice() !== "accepted"',
        'loadMeasurementProviders(choice || "rejected")',
        'data-analytics-event',
        'data-analytics-impression',
    )
    for marker in required_runtime_markers:
        if marker not in runtime:
            errors.append(f"analytics runtime missing consent/event marker: {marker}")

html_files = sorted(root.rglob("*.html")) if root.exists() else []
if not html_files:
    errors.append("no public HTML files found")

legacy_signatures = (
    "connect.facebook.net/en_US/fbevents.js",
    "www.facebook.com/tr?",
    "googletagmanager.com/gtag/js",
    "clarity.ms/tag/",
)
covered = 0
for path in html_files:
    text = path.read_text(encoding="utf-8", errors="ignore")
    rel = path.relative_to(root)
    if text.count('data-studios216-analytics="v1"') != 1:
        errors.append(f"{rel}: expected exactly one centralized analytics config marker")
        continue
    if text.count('data-studios216-analytics-loader="v1"') != 1:
        errors.append(f"{rel}: expected exactly one centralized analytics loader")
        continue
    if "/assets/css/site-analytics.css" not in text:
        errors.append(f"{rel}: analytics consent stylesheet missing")
        continue
    if "/assets/js/site-analytics.js" not in text:
        errors.append(f"{rel}: centralized analytics runtime missing")
        continue
    for provider_name, field_name in fields.items():
        value = str((providers.get(provider_name) or {}).get(field_name) or "")
        if value not in text:
            errors.append(f"{rel}: centralized config missing {provider_name} identifier")
    for signature in legacy_signatures:
        if signature in text:
            errors.append(f"{rel}: legacy/direct provider loader leaked into public HTML: {signature}")
    covered += 1

if errors:
    print("Analytics/consent validation failed:")
    for item in errors:
        print(f"  - {item}")
    raise SystemExit(1)

print(f"Analytics/consent validation passed for {covered}/{len(html_files)} public HTML pages.")
print("Providers: GA4 advanced Consent Mode + Clarity ConsentV2 + consent-gated Meta Pixel.")
print("GA4 and Clarity retain limited cookieless/no-consent measurement; Meta Pixel remains blocked until consent.")
print("Custom product events remain consent-gated; Meta Pixel custom events stay limited to commercial actions.")
