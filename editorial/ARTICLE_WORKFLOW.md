# Studios216 article workflow

This is the publication contract for new and migrated articles.

## Principle

No article is published because a model says it is finished. It is published after editorial review, Desire-Driven Copy validation, SEO validation, and Franklin's approval.

## Required sequence

1. **Source review**
   - Identify the canonical source text.
   - Preserve the original thesis, evidence and intended audience.
   - If a legacy article is materially outdated, update it deliberately rather than silently rewriting history.

2. **SEO brief**
   - Define search intent, primary topic/entity, title/H1 strategy, description, internal-link opportunities and language scope.
   - SEO must support a useful human article; it must not turn the article into keyword stuffing.

3. **Desire-Driven Copy editorial pass**
   - Use the `desire-driven-copy` skill in editorial/thought-leadership mode.
   - The objective is qualified attention, curiosity, comprehension, retention and reader-owned conclusions — not artificial sales pressure.
   - Preserve truthfulness and the article's technical meaning.
   - English and Spanish are editorial adaptations of the same thesis, not forced literal translations.

4. **Editorial-priority validation**
   - Run the applicable Desire-Driven Copy validators, but do not optimize a thought-leadership article for a sales-letter score.
   - Prioritize: attention load, comprehension, information pacing, glanceability, repetition discipline, memory anchor, message retention, meaning compression, narrative economy, story transmissibility, data-to-story proof, value-first/editorial route, truthfulness, autonomy and covert-manipulation safety.
   - Raw DDC Overall, SELF-CTA, provider trust, post-purchase and other sales-specific dimensions remain secondary diagnostics. Never distort truthful editorial copy merely to raise them.
   - Store the editorial report and full raw report under:
     `editorial/reports/desire-driven-copy/<article-id>/`
   - A publishable language version must declare `desire_driven_copy.status = "passed"` and point to the final report.

5. **Punctuation and read-aloud pass**
   - Use punctuation as prose requires: commas, semicolons, colons, dashes, questions and periods should all be available tools.
   - Group sentences into paragraphs by idea and cadence; avoid the mechanical one-sentence / full-stop / new-paragraph rhythm often associated with generated copy.
   - Do not change factual content merely to satisfy a heuristic.
   - Require `punctuation_review = "passed"` and `human_read_aloud_review = "passed"`.

6. **Human approval**
   - Franklin reviews the final article after the punctuation/read-aloud pass.
   - Set `human_approval = "approved"` only after that review.

7. **Build**
   - Article source stays in Markdown.
   - Metadata stays in JSON under `content/articles/meta/`.
   - `scripts/build_articles.py` generates HTML, language links, structured data, indexes and the article portion of the sitemap.

8. **Technical validation**
   - Run `scripts/validate_editorial.py`.
   - Run `scripts/validate_seo.py`.
   - Pull-request checks must pass before merge.

9. **Publish**
   - Merge the validated branch into `main`.
   - `main` remains the canonical production source.

## Language policy

Spanish and English are separate URLs. A translation pair shares one `translation_key`. Do not create an English version merely to fill a slot; translate/adapt it when it adds value.

## Asset policy

Use `assets/articles/manifest.json` to recover the artwork associated with each legacy article. Final hero and Open Graph assets are created during the article's editorial pass. Alt text is written in context, not copied mechanically from the title.

## Legacy prompting article

The old prompting article is deliberately not migrated as-is. It is a candidate for the first editorial experiment: update the thesis for the current AI landscape, create an English adaptation, generate new ES/EN artwork, run Desire-Driven Copy, run its validators, then publish only after approval.
