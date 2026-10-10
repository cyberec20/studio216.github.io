# Studios216 Visual Quality Lab — Web v0.4.0

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
- Markdown prompt for an external AI and enriched JSON share an assessment ID and timestamp. TXT remains the concise summary; PDF uses browser print. Optional localStorage only on explicit Save.
- JSON lists all selected criteria; Markdown lists EVERY self-reported finding, pending unknown, N/A and met criterion.
- The bilingual three-part guide explains how to use ChatGPT, Claude, Gemini, or another external AI with MD, JSON and the learner-provided original file.
- This website provides no AI editing service or upload endpoint; the original file is given by the learner directly to their chosen AI.
- Related courses, author profile and educational articles are secondary to the assessment.

## Source and claims

Inspired at the concept level by Cole Nussbaumer Knaflic's *Storytelling with Data* and Dave McKinsey's *Strategic Storytelling*; original questions and guidance, not reproduced figures or a claim of empirical validation. This is guided self-assessment, not an external technical certification.

## QA

`node scripts/qa_visual_quality_lab.mjs`

`node scripts/qa_visual_quality_handoff.mjs`

The Node tests assert 56 unique rules and 420 graph/task/medium/depth combinations, pagination, scoring and critical gate. Additional Edge DevTools integration tested ES/EN, logo, five choices, saved answer across language switching, full report, JSON/TXT downloads, print-to-PDF, mobile overflow and absence of console errors, broken HTTP responses or external network requests on tested pages.

The source root remains a static site, with no framework or dependency installation. Avoid exposing students' response payloads to third-party analytics, including session recording, without a separate explicit privacy review.

## v0.4.0 export contract

- Frozen ID and timestamp shared across JSON, MD and TXT; switching languages retains them.
- New handoff schema 0.4.0 while rubric schema remains unchanged.
- No browser-to-AI network traffic, file uploads, or claiming to have inspected an original chart.
- Full ES/EN browser and programmatic regression, privacy boundary and public artifact validation required.
