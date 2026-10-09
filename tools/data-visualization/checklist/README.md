# Studios216 Visual Quality Lab — Web v0.3.0

Published educational self-assessment integrated with Studios216.

## Routes

- ES: `/es/herramientas/visualizacion-datos/`
- EN: `/tools/data-visualization/checklist/`
- Directory: `/tools/`

Both routes share the canonical engine in `/assets/visual-quality-lab/` and use the site's real logo, product links and navigation. The JS language toggle preserves responses; canonical and hreflang tags describe the initial language of each page.

## Functional scope

- 56 independently written validation rules, eight persistent report dimensions, ten chart families, seven analytic tasks, two depths and medium/audience selection.
- Adaptive rubric: 22 questions maximum in Essentials, 34 in Full. Dashboard-specific checks reflect only explicitly selected chart components.
- Five response choices: meets, partly, does not meet, N/A and cannot assess.
- Completion, observed compliance, assessed coverage, critical failures and unverified critical criteria remain separate.
- No account, backend, file upload, image recognition or automatically transmitted assessment answers.
- JSON and TXT download via browser Blob, PDF via native browser print; optional localStorage only on explicit Save.
- Related courses, author profile and educational articles are secondary to the assessment.

## Source and claims

Inspired at the concept level by Cole Nussbaumer Knaflic's *Storytelling with Data* and Dave McKinsey's *Strategic Storytelling*; original questions and guidance, not reproduced figures or a claim of empirical validation. This is guided self-assessment, not an external technical certification.

## QA

`node scripts/qa_visual_quality_lab.mjs`

The Node tests assert 56 unique rules and 420 graph/task/medium/depth combinations, pagination, scoring and critical gate. Additional Edge DevTools integration tested ES/EN, logo, five choices, saved answer across language switching, full report, JSON/TXT downloads, print-to-PDF, mobile overflow and absence of console errors, broken HTTP responses or external network requests on tested pages.

The source root remains a static site, with no framework or dependency installation. Avoid exposing students' response payloads to third-party analytics, including session recording, without a separate explicit privacy review.
