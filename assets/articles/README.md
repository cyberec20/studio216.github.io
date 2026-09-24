# Studios216 article assets

This directory is the canonical visual-asset registry for articles migrated from LinkedIn.

## Structure

- One folder per article family.
- `reference-es.webp` and `reference-en.webp` preserve the visual association for language-specific artwork.
- `manifest.json` is the source of truth for which source image belongs to which article, including source filename, SHA-256, dimensions, intended usage, and pending production work.

## Important

The committed reference files are deliberately lightweight. They are **not** the final full-resolution hero or Open Graph images. During each article editorial pass we will create the production hero and a dedicated 1200×630 social/Open Graph card from the best available master.

Alt text is also written during the final editorial pass, when the surrounding article context is known.

The legacy prompting article has no imported image by design: it will be rewritten first and then receive new ES/EN artwork.
