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

4. **Desire-Driven Copy validators**
   - Run the applicable validators on the final ES/EN copy.
   - Store the resulting report under:
     `editorial/reports/desire-driven-copy/<article-id>/<lang>.*`
   - A publishable language version must declare `desire_driven_copy.status = "passed"` and point to that report.

5. **Human approval**
   - Franklin reviews the final article.
   - Set `human_approval = "approved"` only after that review.

6. **Build**
   - Article source stays in Markdown.
   - Metadata stays in JSON under `content/articles/meta/`.
   - `scripts/build_articles.py` generates HTML, language links, structured data, indexes and the article portion of the sitemap.

7. **Technical validation**
   - Run `scripts/validate_editorial.py`.
   - Run `scripts/validate_seo.py`.
   - Pull-request checks must pass before merge.

8. **Publish**
   - Merge the validated branch into `main`.
   - `main` remains the canonical production source.

## Language policy

Spanish and English are separate URLs. A translation pair shares one `translation_key`. Do not create an English version merely to fill a slot; translate/adapt it when it adds value.

## Asset policy

Use `assets/articles/manifest.json` to recover the artwork associated with each legacy article. Final hero and Open Graph assets are created during the article's editorial pass. Alt text is written in context, not copied mechanically from the title.

## Legacy prompting article

The old prompting article is deliberately not migrated as-is. It is a candidate for the first editorial experiment: update the thesis for the current AI landscape, create an English adaptation, generate new ES/EN artwork, run Desire-Driven Copy, run its validators, then publish only after approval.
