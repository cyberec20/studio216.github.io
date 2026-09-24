# Desire-Driven Copy validation reports

Store the final validation output for each publishable article version here.

Recommended path:

`editorial/reports/desire-driven-copy/<article-id>/<lang>.md`

or

`editorial/reports/desire-driven-copy/<article-id>/<lang>.json`

A report must correspond to the final copy that will be published. If the article changes materially after validation, rerun the relevant validators and replace the report before publication.

The article metadata must point to the report and set:

- `desire_driven_copy.status = "passed"`
- `seo_review = "passed"`
- `human_approval = "approved"`

The build gate refuses to publish a language version when those conditions are not satisfied.
