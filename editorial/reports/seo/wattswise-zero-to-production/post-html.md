# WattsWise — SEO + AI Discoverability v0.3.0 post-HTML audit

Date: 2026-09-30. Source: explicit public-site artifact from PR #27.

The exact `seo-ai-discoverability v0.3.0` rule registry passed integrity/freshness validation. The static validator was run against the actual PR build with the configuration saved beside this report.

- ES new article: **10 PASS, 1 INFO, 0 WARN, 0 FAIL**.
- EN new article: **10 PASS, 1 INFO, 0 WARN, 0 FAIL**.
- IndexNow: **INFO** (disabled; optional).
- No aggregate SEO ranking score.

The INFO on the new article pages describes the separate GPTBot training-crawler policy, not a search-eligibility problem.

The broader site check produced **175 PASS, 22 WARN, 2 INFO**. All 22 warnings concern pre-existing non-article utility/legal surfaces; none concerns the new ES/EN WattsWise pages.

Independent artifact QA confirms: source-to-HTML contextual links **ES 10/10** and **EN 8/8**; canonical and reciprocal hreflang (including x-default); BlogPosting JSON-LD and mainEntityOfPage; hero WebP dimensions 760×428; matching listing thumbnails 120×68; image hashes matching manifest; visible captions qualifying illustrative historical figures; old blog URL removed from sitemap; noindex static transition page; and centralized analytics/consent integration.

GitHub Actions on the PR passed builder source fidelity, sitemap contract, source SEO, editorial foundation, explicit public-site boundary, consent-aware analytics, artifact SEO and AI discoverability. The temporary generated-output sync was restored to the strict original workflow before merge.

Validation demonstrates conformance to the defined contract, not a guarantee of indexing, ranking, citations, traffic or conversions.
