# Studios216 — optional Paddle payment-link bridge (local phase 1)

## Purpose and boundary

This small, independently deployed Cloudflare Worker will eventually serve
`https://studios216.com/pay/` and `https://studios216.com/pay/sandbox/`.
It is a **Paddle Billing-specific adapter**, **not** the core Merchant of Record
(MoR) of DentalChart, DiffDocs, or Studios216. Other MoRs may use their own
checkout strategy and do not need this page, URL contract or Paddle.js.

Paddle uses one default payment link per environment, including links for
updating a customer's payment method. Paddle.js automatically recognizes a
Paddle transaction URL of the form `?_ptxn=txn_...` when initialized.
This bridge hosts only that browser checkout; it never creates transactions.

**No payments, remote deployment, credentials or Live activation in phase 1.**
Its checked-in config has neither a Cloudflare route nor a DNS zone, and
`PADDLE_LIVE_ENABLED` defaults to **off** in the runtime.

Official references:
- https://developer.paddle.com/build/transactions/default-payment-link/
- https://developer.paddle.com/build/transactions/pass-transaction-checkout/
- https://developer.paddle.com/build/subscriptions/update-payment-details/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/wrangler/configuration/

## Source layout

- `src/worker.js`: generic path/method/asset/HTTP security layer.
- `src/providerRegistry.js`: explicit provider dispatch; unrecognized or disabled MoRs fail closed.
- `src/adapters/paddle.js`: all Paddle-only mode, token and `_ptxn` rules.
- `public/index.html`: neutral shell with existing product legal links.
- `public/app.js`: Paddle.js loader; relies on Paddle's automatic `_ptxn` opening.
- `public/styles.css`: isolated presentation.
- `tests/`: Node test runner, including security, isolation, and nonpublication.
- `wrangler.jsonc`: build-only by design; **no production route** or environment token.
- `.dev.vars.example`: **nonfunctional placeholders**, never actual client tokens.

The already published institutional GitHub Pages artifact is built from
`data/public_site.json` through `scripts/build_public_site.py`. It does not
include the `edge/` tree. Keep that whitelist exclusion intact.

## Explicit runtime configuration (Cloudflare, not committed)

| Binding | Example / behavior |
| --- | --- |
| `PAY_BRIDGE_PROVIDER` | `paddle` enables this optional adapter. Other values disable it. |
| `PADDLE_CLIENT_TOKEN_SANDBOX` | Public Paddle.js `test_...` token; sandbox page only. |
| `PADDLE_CLIENT_TOKEN_LIVE` | Public Paddle.js `live_...` token; Live page only. |
| `PADDLE_LIVE_ENABLED` | Defaults to disabled. Only literal `true` opens Live, and only **after** a separate authorization. |

Do not supply Paddle API keys, webhook signing secrets, or Cloudflare API tokens
to browser assets or this Worker. Do not put real tokens, tenant IDs, raw
transactions, e-mails, clinical records, or webhook payloads in GitHub.

The Worker requires an `ASSETS` binding to `public/` and uses an explicit
allowlist of HTTP paths. It returns `no-store`, `no-referrer`, frame
protection, noindex, and a restrictive CSP. It does not log payment link
queries or run advertising/analytics. It has no database, payment secret,
cookies, redirects, billing provider API access, or entitlement logic.

## Operations and ownership

- Purchases initiated in **DentiTrace** or **DiffDocs** still use their own
  backend-selected MoR and, if it is Paddle, their own Paddle.js overlay.
- This bridge is the optional fallback for **Paddle-generated payment links**.
  The token does not select the SaaS; the existing Paddle transaction does.
- After `checkout.completed`, **each SaaS backend** verifies its own webhooks,
  product IDs, tenant/owner data and grants its own rights. Never use a browser
  callback from this bridge to grant entitlements.
- Do not copy or replay `_ptxn` links into logs, analytics, debug errors,
  redirect URLs, or other users' sessions.
- Different SaaS products must have independent, corroborated webhook routes
  or event filtering. Shared Paddle events never justify cross-tenant rights.
- A future non-Paddle MoR does **not** inherit this `_ptxn` link requirement.

## Local verification

Requires Node >=22. Install only the Worker-local dependency with
`npm ci` after the lockfile is generated; then `npm run check` runs
JavaScript syntax checks, Node tests and `wrangler deploy --dry-run`.
**Dry-run is bundling only; it must not deploy.**

A successful local test proves our routing and initialization contract, **not**
that a real Paddle `_ptxn` checkout or update-method flow succeeded.
End-to-end Paddle sandbox/browser/webhook tests are gated until the later
Cloudflare phase, with an authorized test account and no Live charges.

## Future phase 2: GitHub (separate click)

Review the local diff, remote HEAD and actions permissions before any commit.
Publish only after new authorization; `.github/workflows/paddle-pay-ci.yml`
runs checks, no `wrangler deploy` or GitHub Pages publication of `edge/`.
Do not overwrite unrelated site changes or store Cloudflare deployment tokens.

## Future phase 3: Cloudflare and Paddle (separate click)

Before attaching `studios216.com/pay/*`, verify Cloudflare zone ownership,
proxied DNS and the existing GitHub Pages origin. Scope routes narrowly, check
route precedence and rollback, configure public Sandbox/Live tokens as distinct
Worker bindings, and test Sandbox with a genuine `_ptxn` link. Verify Live
stays disabled until separately approved. Only then consider changing the
Paddle **Sandbox** default payment link. Changing Live Paddle settings needs
its own explicit authorization and independent checkout proof.

No DNS, Cloudflare, Paddle Dashboard, Hetzner, Docker or NGINX changes have
been authorized for this local work.
