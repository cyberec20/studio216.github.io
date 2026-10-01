# DiffDocs in 3.5 Months: What AI Accelerated—and What Still Required Engineering

The problem is familiar: if AI made every developer faster on every project, the debate would already be over. It is not. A controlled [Microsoft Research](https://www.microsoft.com/en-us/research/publication/the-impact-of-ai-on-developer-productivity-evidence-from-github-copilot/) experiment reported a striking result: with GitHub Copilot, one specific programming task finished 55.8% faster. A [METR randomized trial with experienced developers](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf) found the opposite in mature repositories: when AI tools were allowed, completion time increased by 19%. In 2026, METR explained another limitation. Its newer sample could no longer provide a clean estimate because many developers would not participate if they had to work without AI.

That tension is exactly what makes DiffDocs interesting. DiffDocs does not prove a universal ten-times productivity gain. The useful distinction is narrower: **when domain knowledge, architecture, testing, and decisions remain under clear ownership, AI can compress work that previously required more coordination, more hands, or more calendar time**.

DiffDocs moved from a concrete need to a functioning SaaS in 3.5 months. Project records put incremental external cash outlay at roughly USD 140 during that sprint; that number is not the project's total economic cost, because it excludes professional time, existing hardware, electricity, connectivity, and accumulated expertise. The two figures should be read separately: one describes delivery time; the other describes incremental external cash. Neither, by itself, represents total product cost or a universal savings rate.

## The problem was not writing code

Manual document comparison sounds simple until the work matters. Two versions of a contract, engineering specification, spreadsheet, or report can contain small changes with large consequences: a date, a number, a deleted clause, a moved row, a rewritten condition.

Manual review forces a person to hold two contexts at once: **what changed and what that change means**. It is the same problem across contracts, engineering specifications, and spreadsheets; the format changes, but the cognitive burden remains. DiffDocs therefore began with a more specific goal than “build a diff”: reduce comparison noise and return differences that remain understandable in context. The current public product supports [DOCX, PDF, XLSX, and CSV](https://diffdocs.studios216.com/), using a consistent visual language for added, modified, deleted, and moved content.

The visible product, however, was only part of the work. Behind the screen were authentication, tenant isolation, asynchronous processing, job queues, temporary storage, credits, billing, webhooks, transactional email, security, observability, testing, and deployment. That is where the difference between a script that runs and a SaaS that operates begins.

## What was actually built

The scope became closer to a small ecosystem than a single application:

- **document ingestion and comparison:** DOCX, PDF, XLSX, and CSV; extraction, normalization, and change detection.
- **asynchronous processing:** background jobs, with differentiated queues for normal and heavy workloads.
- **reactive frontend:** uploads, job tracking, and rendered results.
- **multi-tenancy and access:** users, organizations, permissions, and data isolation.
- **billing:** credits, checkout, webhooks, and reconciliation.
- **security and QA:** static and dynamic analysis, secret scanning, upload antimalware, container hardening, smoke tests, and release gates.
- **operations:** analytics, SEO, observability, and reproducible deployment.

Multi-tenant architecture is not decorative complexity. The [AWS SaaS Lens](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html) treats tenant isolation, tenant-aware identity, instrumentation, and repeatable onboarding as structural concerns; successful login is not enough if one tenant can reach another tenant's resources.

## What does “3.5 months” actually measure?

It does not mean every phase happened in a clean sequence. Work overlapped: while the comparison engine matured, the interface, queues, billing, and security controls also changed. For traceability, the build can be read as seven blocks:

1. **Base architecture:** authentication, data schema, Docker Compose, and API structure.
2. **Diff engine:** parsers, normalization, comparison logic, and rendering.
3. **Frontend:** React/Vite, file uploads, and job tracking.
4. **Workers and queues:** Celery, Redis, and separation between normal and heavy workloads.
5. **Billing:** Lemon Squeezy integration, webhooks, credits, and reconciliation.
6. **Hardening and QA:** security, smoke tests, SEO, analytics, and release gates.
7. **Production:** final configuration, validation, and go-live.

Separating queues was not gratuitous sophistication. [Celery documents task routing](https://docs.celeryq.dev/en/main/userguide/routing.html) precisely so different kinds of work can be directed to different queues; in DiffDocs, a heavy XLSX should not compete exactly like a lightweight comparison. Billing also did not end at “show a checkout”: [Lemon Squeezy recommends validating webhook signatures](https://docs.lemonsqueezy.com/help/webhooks/signing-requests), returning reliable responses, and building for recoverable event processing.

## What does the economic comparison actually show?

A useful economic comparison does not need an agency quote or a supposed universal “market benchmark.” A clearer method is to define a staffing scenario, state which roles it includes and for how long, then keep salary-equivalent cost, overhead, vendor margin, and project cash outlay conceptually separate.

A simple lower-bound model shows the order of magnitude. In May 2025, the U.S. [Bureau of Labor Statistics](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm) reported median annual wages of USD 135,980 for software developers and USD 104,300 for software QA analysts and testers. **Two developers plus one QA role for eight months** represent roughly **USD 250,840 in direct salary-equivalent cost**, before product management, UX, DevOps, benefits, overhead, recruiting, or vendor margin are added.

That calculation is not a quote for DiffDocs and does not represent what any particular agency would charge. It does explain why the economic comparison is meaningful when its assumptions are visible: **the project concentrated under one technical owner responsibilities that, in another operating model, are commonly distributed across several roles**.

A second distinction matters just as much: the roughly USD 140 in project records was **incremental external cash**, not total cost. Professional time had value; hardware had cost; prior expertise had value too. The story gets stronger when those boundaries are explicit.

## What changed was not only speed; it was the topology of coordination

Traditional teams have real advantages: specialization, peer review, organizational continuity, and parallel work. They also have an unavoidable coordination cost. A product decision may travel through design, backend, frontend, QA, and DevOps before it reaches production; every handoff carries context that must be explained, checked, and kept aligned.

The DiffDocs workflow removed many of those handoffs. Architecture and acceptance criteria remained in one place; different models and tools acted as implementers, reviewers, or accelerators for specific tasks. That structure does not eliminate engineering. **It concentrates engineering accountability.**

The distinction matters. If a specification is ambiguous, an agent can generate ambiguous code very quickly. If the data model is wrong, it can propagate the mistake across more files. If a shallow test confirms the wrong behavior, automation merely ships the error sooner. Useful productivity appears when the loop contains specification, implementation, validation, and evidence.

## The AI stack evolved while the product was being built

The workflow was not optimized on day one. Early work relied heavily on Codex inside the editor, copy-paste, and manual execution. Then came Skills and MCP; later, CLINE/ROO, code indexing with local embeddings, and a multi-model strategy reduced dependence on a single provider.

The durable lesson is not to freeze tool names—they change too quickly—but to identify which capabilities changed the work:

- **repository context:** understanding files and relationships without re-explaining the project every turn.
- **tool use:** reading, editing, executing, and validating inside a controlled workflow.
- **specialization:** choosing different models when different tasks benefited from different capabilities.
- **continuity:** having alternatives when token limits, latency, or availability appeared.
- **auditability:** refusing to treat “done” as sufficient evidence.

External research keeps the interpretation grounded. Microsoft's controlled task showed a large speedup; METR found the opposite effect for experienced developers in mature repositories. **AI does not supply a fixed productivity multiplier.** Its effect interacts with task type, context, expertise, and workflow design.

## Security from day one—without inventing a certification

The project used “Tier 3” internally to describe an advanced set of controls and release gates. To be clear, there is an important limitation: that label is internal; it is not an official NIST, OWASP, or third-party certification level.

What matters is the verifiable control set. [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final) recommends integrating secure practices into the software development life cycle rather than bolting them on at the end. [OWASP ASVS](https://owasp.org/projects/asvs) provides a basis for verifying technical application-security controls. In that spirit, DiffDocs incorporated secret scanning, SAST/DAST, upload antimalware, security headers, container hardening, SBOM generation, and automated release gates.

Some controls have a direct operational purpose. [GitHub Push Protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection) aims to block secrets before they enter repository history; CISA's 2025 guidance on [minimum SBOM elements](https://www.cisa.gov/sites/default/files/2025-08/2025_CISA_SBOM_Minimum_Elements.pdf) emphasizes associating an SBOM with each software version or update. None of these controls proves that a system has no vulnerabilities; together, they reduce blind spots and create evidence for release decisions.

## There is more engineering between “Upload” and “Diff” than the screen suggests

The interface can summarize the experience in four steps: upload, extraction and normalization, diff engine, results. Beneath that sequence are decisions the user should not have to manage: validate type and size, scan files, prepare text, tables, and structure, route heavy workloads, preserve history, render differences, and deliver an understandable result.

That is also why the four colors matter. Green, yellow, red, and blue are not decorative; they turn change types into visible signals: added, modified, deleted, and moved. The goal is not for the machine to “decide for the user,” but to lower the cost of finding what deserves human review.

## What AI accelerated—and what still needed an owner

AI helped most where tasks were extensive but verifiable: scaffolding, refactors, test generation, codebase search, documentation, configuration, alternative exploration, and repetitive execution. It also made it possible to move quickly between implementation and audit without convening a separate team for every transition.

But several decisions could not be delegated without losing control. The workflow still needed definitions for a “moved” change, tenant isolation, malicious files, heavy-queue thresholds, and release-blocking conditions. For example, those are architecture, product, and risk decisions—not merely code generation.

That is the thesis that aged best: **AI reduced the cost of executing decisions, while increasing the value of formulating them clearly and verifying them rigorously.**

## The result today

DiffDocs is no longer a private experiment. The current public product runs in the browser, supports DOCX, PDF, XLSX, and CSV, offers visual comparison results, and presents privacy by design as part of the product experience. It can be explored directly at [DiffDocs](https://diffdocs.studios216.com/).

That does not turn one project into a universal recipe. A regulated system, a strict availability contract, extremely sensitive data, or a large organization may require more people, stronger separation of duties, and independent review. Nor does it mean developers should replace specialization with agents. It means the lower bound of what one technically accountable person can build has moved.

## Five lessons that mattered more than any single model

**1. Context is as valuable as model quality.** A brilliant agent that does not understand the repository keeps asking, duplicates logic, and loses prior decisions.

**2. Speed without gates is not productivity.** A change only counts when it builds, passes tests, respects security, and preserves the product contract.

**3. Tools change; contracts survive.** Editors, models, and providers rotate. Specifications, tests, observability, and acceptance criteria should remain.

**4. Provider backup is operational continuity, not model collecting.** Redundancy only matters if work can move without reconstructing the entire context.

**5. Human architecture remains the right bottleneck.** When producing code gets cheaper, deciding what to build, how to verify it, and when not to deploy becomes more valuable.

## Conclusion

DiffDocs does not prove that six people are unnecessary, or that USD 140 replaces the value of months of professional work. It demonstrates something narrower and more defensible: **domain expertise, explicit architecture, AI agents, automation, and verifiable gates can concentrate a body of work that would previously have required a much larger operating structure**.

The interesting question is no longer “can AI write the code?” It can write a lot of it. The harder question determines whether a product appears instead of a pile of files: **who keeps the mental model, the criteria, and the accountability when code becomes cheap to produce?**

DiffDocs became one practical answer. The product can be tested; the architecture, limitations, and lessons are more useful than any savings headline.