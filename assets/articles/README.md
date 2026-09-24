# Studios216 article assets

This directory is the canonical mapping between article families and the artwork originally used on LinkedIn.

## What is committed here

Each article family has a tiny language-specific WebP thumbnail:

- `reference-es.webp`
- `reference-en.webp`

These thumbnails are **identity references only**. They exist so the article/image relationship cannot be lost while the editorial migration is still in progress. They are not intended to be the final hero image shown in the published article.

The original PNG filenames, SHA-256 hashes, original dimensions, language, and intended future use are recorded in `manifest.json`.

## Production rule

When an article is rebuilt for Studios216, use the source master associated in `manifest.json` to create:

1. a production hero image at web quality;
2. a dedicated Open Graph/social image when useful;
3. contextual alt text written for the final article, not copied mechanically from the title.

If an article is substantially rewritten, the old artwork can remain only as historical reference and a new ES/EN visual can be created.

The legacy prompting article intentionally has no imported image: it will be rewritten first, then receive new Spanish and English artwork.
