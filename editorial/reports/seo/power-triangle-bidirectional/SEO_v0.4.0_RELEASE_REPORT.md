# Power triangle bilingual publication — SEO + AI Discoverability v0.4.0

**Assessment:** PASS for tested scope. **Date:** 2026-09-30. **Basis:** exact GitHub Actions explicit public artifact; not a Markdown-only or prebuilt-HTML evaluation.

## Identity and scope

- Release candidate: Studios216 PR #29; source commit `40e263b5a5925197ec23d1f49d22eaec56a56b9b`.
- Successful `SEO and editorial validation` workflow run `36754437742`.
- Audited **GitHub Actions built public artifact**: `explicit-public-site`, artifact ID `11115303058`.
- New article URLs: `/articles/es/triangulo-de-potencia-bidireccional/` and `/articles/en/bidirectional-power-triangle/`.
- SEO skill: exact uploaded package **seo-ai-discoverability v0.4.0**; package validation PASS and automated skill unit tests **72/72 PASS**.
- Desire-Driven Copy validation is governed separately by the v0.14.1 release reports attached to the article family; SEO has no numeric total score.

## Independent v0.4.0 validator runs

| Audit | PASS | WARN | FAIL | INFO | Test scope |
|---|---:|---:|---:|---:|---|
| Targeted ES/EN live-layout HTML *built artifact* | 22 | 0 | 0 | 2 | Only the two new article pages plus sitemap/robots; reciprocal `hreflang`, BlogPosting JSON-LD, title, descriptions, canonical, ALT and discovery eligibility |
| All built article-library HTML | 223 | 0 | 0 | 22 | Articles listing pages and published article pages, including the previous WattsWise article in both languages |
| IndexNow optional check | 0 | 0 | 0 | 1 | Optional feature disabled; no submission implied |

The `INFO` findings describe non-blocking rule applicability, not unreported WARN/FAIL. Because the targeted/library runs deliberately scan only article pages, standalone internal-link discovery was left out of those **v0.4.0 scoped runs**; repository-native full-site validators and public-boundary tests independently passed.

Google Play ASO is a **conditional** module in v0.4.0 and is **not invoked** for these two web articles. No Play Console metadata or localized store-listing copy is claimed to have been assessed.

## Actual HTML, generated-source fidelity, and public site

The repository builder regenerated the source-derived pages. GitHub Actions confirmed that regenerated output is byte-identical to committed files, and its independent builder-contract, sitemap, source SEO, editorial foundation, public-boundary, built-site SEO, and AI discoverability checks all PASSED.

Release inspection of the **actual 40-page public HTML artifact** confirmed:

- Each new article has exactly one optimized 760×428 hero, one original WattsWise product-demo GIF (`/blog/assets/power/power-demo.gif`) in the body, and no duplicate hero or obsolete image-correction notice.
- Local references exist; canonical, reciprocal `hreflang`, author identity, image ALT, and BlogPosting JSON-LD match their intended pages.
- The old English power-triangle URL is `noindex`, canonicalizes and redirects to the new English article, and is absent from the sitemap; its original HTML is preserved byte-identically in `editorial/legacy/power-triangle/`.
- The retained historic SVG and original product-demo GIF remain in their original repository locations.

## Global analytics & consent — all touched pages

The public-site build inserts the **global layer**, not page-specific legacy scripts, into every output HTML file. Both new articles, the previous WattsWise ES/EN editions, the legacy redirect, and other public pages were inspected: **40/40 HTML files** contain exactly one global analytics config marker, one loader, and one analytics stylesheet marker. Configuration enables **GA4, Microsoft Clarity and Meta Pixel** while preserving `consent.required=true` and `consent.default=denied`. The project's `validate_analytics.py --root _site` passed in GitHub Actions. The prior WattsWise article already meets the global analytics contract; no content change to that earlier article was necessary.

## Mathematics and image provenance

- Article example: 30 kW mechanical at η=0.90, displacement PF=0.80, 400 V balanced 3φ yields 33.333 kW electrical, 41.667 kVA, 25 kVAR, **60.14 A**. Ignoring η yields **54.13 A** (a difference of about 6.01 A).
- Separate approved hero concept: 350 kW mechanical at η=0.92, PF=0.85, balanced 480 V 3φ yields ≈380.4 kW electrical, 447.6 kVA, 235.8 kVAR and 538.3 A. Its caption explicitly states that the illustrated UI is **concept art, not a screenshot**, and that this is a separate example from the article body.

## Reference checks & publication limits

The article links to identifiable engineering resources, including the U.S. Department of Energy motor sourcebook and Schneider Electric guidance on true vs displacement power factor. Those resources serve technical explanation and are **not** presented as independent proof of WattsWise-specific functional test coverage.

**Deployment-dependent:** these tests cover the CI-built artifact and GitHub Actions checks. A live HTTP/canonical recheck of the deployed new URLs and old redirect remains necessary **after** the merge/Pages release. Until then, no live-publication PASS is claimed.

## Raw validator evidence

- `seo-v0.4.0-targeted.json`: 24 rule results.
- `seo-v0.4.0-article-library.json`: 245 rule results.
- `seo-v0.4.0-indexnow.json`: 1 informational result.

These JSON files preserve original rule IDs and messages from the uploaded v0.4.0 validator. Local audit absolute paths identify the temporary GitHub Actions artifact extraction directory and are not meant as public URLs.
