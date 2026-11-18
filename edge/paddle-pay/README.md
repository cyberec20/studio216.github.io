# Studios 216 — optional Paddle payment-link bridge

## Scope and ownership

This Cloudflare Worker serves the shared Paddle payment-link paths:

- `https://studios216.com/pay/sandbox/` — Paddle Sandbox, with a `test_...` client-side token.
- `https://studios216.com/pay/` — Paddle Live, with a `live_...` token, **only when explicitly enabled**.

Both paths use the same institutional page, stylesheet and Paddle-specific
JavaScript. The URL selects the Paddle environment for each request. Live
enablement is an **additional global launch safeguard**, not a per-SaaS mode
selector: when Live is enabled, Sandbox remains available simultaneously.

This is an optional **Paddle Billing adapter**, not a requirement for other
Merchants of Record (MoRs). It does not replace DentiTrace, DiffDocs or future
SaaS backend payments/webhooks/entitlements. Each SaaS owns its own product IDs,
customer/tenant context, order verification and access. The page neither
creates nor confirms payment transactions.

## Branding and copy

The shell reuses the institutional logo
`https://studios216.com/assets/studio_logo.jpeg`, CSS
`/assets/css/institutional-brand.css`, **STUDIOS** (white) + **216** (blue),
Inter, and the dark corporate palette. It has no catalog promotion, analytics
or marketing cookies. Privacy, terms and refunds are grouped by SaaS.

The URL `?_ptxn=txn_...` is expected from Paddle-generated payment links.
Without it, the page must explain how to return to the originating SaaS;
it must not load Paddle.js or suggest that an order was placed. For valid
links, the official Paddle.js integration opens the transaction automatically.
Do **not** also call `Paddle.Checkout.open()`.

Messages distinguish missing/invalid links, loading errors, canceled checkout
and `checkout.completed`. The completion event is **not** settlement evidence;
the SaaS backend verifies payment before activating any purchase or subscription.
If a completed checkout is followed by a close event, the completion message
must not be overwritten. Never assert that a buyer paid merely from browser
events.

## Legal URL condition — publication gate

Canonical legal application routes established from the source repos:

| Application | Terms | Privacy | Refund |
| --- | --- | --- | --- |
| DentiTrace | `https://dentitrace.studios216.com/terms` | `https://dentitrace.studios216.com/privacy` | `https://dentitrace.studios216.com/refund-policy` |
| DiffDocs | `https://diffdocs.studios216.com/terms` | `https://diffdocs.studios216.com/privacy` | `https://diffdocs.studios216.com/refund-policy` |

**As observed 2026-11-18:** the three DiffDocs links serve application routes,
but the DentiTrace production hostname currently redirects those legal URLs to
`https://studios216.com/dentitrace/` rather than serving their respective
documents. The DentiTrace React application declares the three routes, and
`dentalchart-dev.studios216.com` serves them, but development is not a valid
production legal destination. **Do not promote the version with the new legal
links to live Cloudflare traffic until the DentiTrace canonical routes are
actually available and verified end-to-end.** A 200 response after redirecting
to a marketing landing page is **FAIL** for the legal-link acceptance criterion.

This is an external production-routing prerequisite, not something to fix by
altering this Worker's DNS, the GitHub Pages publication whitelist or SaaS
applications without separate permission.

## Runtime variables and safety

Configure these only in Cloudflare Worker **Runtime variables and secrets**,
not in GitHub source or merely in Workers Builds:

- `PAY_BRIDGE_PROVIDER=paddle`: selects the only registered adapter. Other
  provider values fail closed; they do not use Paddle.js or Paddle links.
- `PADDLE_CLIENT_TOKEN_SANDBOX=test_...`: public Paddle.js Sandbox token,
  stored as a Runtime Secret.
- `PADDLE_CLIENT_TOKEN_LIVE=live_...`: public Paddle.js Live token (only
  when an authorized rollout requires it).
- `PADDLE_LIVE_ENABLED=false`: no Live checkout until explicitly authorized.

The checked-in `wrangler.jsonc` has `keep_vars: true` to preserve
Dashboard-managed runtime variables during future Wrangler version uploads.
It contains **no actual token**, no route, no zone ID, and no production secret.
The route `studios216.com/pay/*` is Cloudflare-managed. Cloudflare Worker
Deployments and version **uploads** are distinct: a successful CI/build does not
promote the version serving users.

Never place private Paddle API keys, webhook secrets, Cloudflare tokens,
transaction identifiers, personal or clinical data in the public assets,
GitHub commits, console logs, analytics, redirects or debugging output. The
Worker uses an explicit HTTP path allowlist, CSP, frame protection,
`no-store`, `no-referrer`, noindex and no cookies. Static institutional assets
remain served by GitHub Pages; `edge/` is excluded from GitHub Pages by
`data/public_site.json`.

## Verification and rollout

From `edge/paddle-pay`, use `npm run check`: syntax, independent Node tests
and `wrangler deploy --dry-run` (no release). Validate the root explicit
GitHub Pages build/whitelist separately. Knowledge Accordion uses Graphify,
Codebase Memory and CocoIndex from the repository's own Python environment
(`.venv/Scripts/ccc.exe`).

Before promoting a Cloudflare version, verify: all six legal destinations,
logo/CSS/font from the actual site, no accidental cross-domain marketing link,
mobile and keyboard accessibility, missing and invalid `_ptxn`, Sandbox
response, Live 503 with the current flag, existing Dashboard runtime variables
and that the new version preserves the active `studios216.com/pay/*` route.
An actual Paddle Sandbox checkout and payment-method update still require
end-to-end browser testing; deterministic tests do not establish payment
success or webhook delivery.

Official references:
- https://developer.paddle.com/build/transactions/default-payment-link/
- https://developer.paddle.com/build/transactions/pass-transaction-checkout/
- https://developer.paddle.com/build/subscriptions/update-payment-details/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/wrangler/configuration/
