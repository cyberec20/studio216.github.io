import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleRequest } from '../src/worker.js';
import { resolveCheckoutAdapter, supportedProviders } from '../src/providerRegistry.js';

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const goodTestToken = 'test_' + 'a'.repeat(32);
const goodLiveToken = 'live_' + 'b'.repeat(32);
const txn = 'txn_' + 'c'.repeat(26);
const assetRequests = [];

function fixtures(overrides = {}) {
  return {
    PAY_BRIDGE_PROVIDER: 'paddle',
    PADDLE_CLIENT_TOKEN_SANDBOX: goodTestToken,
    PADDLE_CLIENT_TOKEN_LIVE: goodLiveToken,
    PADDLE_LIVE_ENABLED: 'false',
    ASSETS: {
      async fetch(request) {
        const requestedPath = new URL(request.url).pathname;
        assetRequests.push(requestedPath);
        const filename = path.basename(requestedPath);
        if (!['index.html', 'app.js', 'styles.css'].includes(filename)) {
          return new Response('Missing', { status: 404 });
        }
        return new Response(await readFile(path.join(assetsDir, filename)), { status: 200 });
      },
    },
    ...overrides,
  };
}
function req(route, options = {}) {
  return new Request('https://studios216.com' + route, options);
}
function urlTxn(value = txn) {
  return '/pay/sandbox/?_ptxn=' + value;
}

test('registry selects Paddle only when explicitly configured (never universal MoR)', () => {
  assert.deepEqual(supportedProviders(), ['paddle']);
  assert.equal(resolveCheckoutAdapter({ PAY_BRIDGE_PROVIDER: 'lemon' }), null);
  assert.equal(resolveCheckoutAdapter({ PAY_BRIDGE_PROVIDER: 'adyen' }), null);
  assert.equal(resolveCheckoutAdapter({ PAY_BRIDGE_PROVIDER: '' }), null);
  assert.equal(resolveCheckoutAdapter({ PAY_BRIDGE_PROVIDER: 'PADDLE' })?.id, 'paddle');
});

test('sandbox link returns neutral HTML, validated public token and strict headers', async () => {
  const response = await handleRequest(req(urlTxn()), fixtures());
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /"provider":"paddle"/);
  assert.match(html, /"environment":"sandbox"/);
  assert.match(html, /test_a{32}/);
  assert.ok(!html.includes('live_' + 'b'.repeat(32)));
  assert.ok(html.includes('/pay/app.js'));
  assert.ok(html.includes('https://dentitrace.studios216.com/terms'));
  assert.ok(html.includes('https://diffdocs.studios216.com/terms'));
  assert.ok(html.includes('/assets/studio_logo.jpeg'));
  assert.ok(html.includes('studio-brand-wordmark'));
  assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  assert.match(response.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.match(response.headers.get('Content-Security-Policy'), /style-src[^;]*fonts.googleapis.com/);
  assert.match(response.headers.get('Content-Security-Policy'), /font-src[^;]*fonts.gstatic.com/);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow, noarchive');
  assert.equal(response.headers.get('Set-Cookie'), null);
  assert.equal(response.headers.get('Content-Type'), 'text/html; charset=utf-8');
});

test('live route remains closed by default even with a valid public Live token', async () => {
  const response = await handleRequest(req('/pay/?_ptxn=' + txn), fixtures());
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /live_b{32}/);
});

test('live requires explicit flag and its own Live client token', async () => {
  const response = await handleRequest(req('/pay/?_ptxn=' + txn), fixtures({
    PADDLE_LIVE_ENABLED: 'true',
    PADDLE_CLIENT_TOKEN_SANDBOX: undefined,
  }));
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /"environment":"live"/);
  assert.match(body, /live_b{32}/);
  assert.doesNotMatch(body, /test_a{32}/);
});

test('a non-Paddle provider cannot render Paddle checkout nor assets', async () => {
  assetRequests.length = 0;
  const env = fixtures({ PAY_BRIDGE_PROVIDER: 'lemon' });
  const res = await handleRequest(req(urlTxn()), env);
  const asset = await handleRequest(req('/pay/app.js'), env);
  assert.equal(res.status, 503);
  assert.equal(asset.status, 503);
  assert.deepEqual(assetRequests, []);
  assert.doesNotMatch(await res.text(), /cdn\.paddle/);
});

test('sandbox cannot accidentally initialize with a Live token', async () => {
  const response = await handleRequest(req(urlTxn()), fixtures({
    PADDLE_CLIENT_TOKEN_SANDBOX: goodLiveToken,
  }));
  assert.equal(response.status, 503);
});

test('rejects placeholders and does not create a usable checkout', async () => {
  const response = await handleRequest(req(urlTxn()), fixtures({
    PADDLE_CLIENT_TOKEN_SANDBOX: 'test_REPLACE_ME_WITH_PUBLIC_CLIENT_TOKEN',
  }));
  assert.equal(response.status, 503);
});

test('rejects malformed and duplicate transaction parameters before loading assets', async () => {
  assetRequests.length = 0;
  for (const route of [
    urlTxn('bad'),
    urlTxn('txn_ABC'),
    urlTxn(txn) + '&_ptxn=' + txn,
    urlTxn('txn_' + 'd'.repeat(27)),
  ]) {
    const response = await handleRequest(req(route), fixtures());
    assert.equal(response.status, 400, route);
  }
  assert.deepEqual(assetRequests, []);
});

test('does not accept arbitrary paths or methods and does not proxy other pages', async () => {
  assert.equal((await handleRequest(req('/dentitrace/pricing.html'), fixtures())).status, 404);
  assert.equal((await handleRequest(req('/pay/anything'), fixtures())).status, 404);
  const response = await handleRequest(req(urlTxn(), { method: 'POST', body: '{}' }), fixtures());
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'GET, HEAD');
});

test('static assets work with a Live-only or Sandbox-only configuration', async () => {
  const env = fixtures({ PADDLE_CLIENT_TOKEN_SANDBOX: undefined, PADDLE_LIVE_ENABLED: 'true' });
  const js = await handleRequest(req('/pay/app.js'), env);
  assert.equal(js.status, 200);
  assert.equal(js.headers.get('Content-Type'), 'application/javascript; charset=utf-8');
  assert.match(await js.text(), /Paddle/);
  const css = await handleRequest(req('/pay/styles.css'), env);
  assert.equal(css.status, 200);
  assert.equal(css.headers.get('Content-Type'), 'text/css; charset=utf-8');
});

test('HEAD never returns a body and does not disclose a token', async () => {
  const response = await handleRequest(req(urlTxn(), { method: 'HEAD' }), fixtures());
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('fails closed when assets binding is absent or HTML marker is missing', async () => {
  const noAssets = await handleRequest(req(urlTxn()), fixtures({ ASSETS: undefined }));
  assert.equal(noAssets.status, 503);
  const brokenAsset = await handleRequest(req(urlTxn()), fixtures({
    ASSETS: { fetch: async () => new Response('<p>unsafe</p>', { status: 200 }) },
  }));
  assert.equal(brokenAsset.status, 503);
});

test('unknown URL parameters never change provider or environment', async () => {
  const response = await handleRequest(
    req(urlTxn() + '&provider=lemon&env=live&returnTo=https://bad.example'), fixtures(),
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /"environment":"sandbox"/);
  assert.doesNotMatch(html, /bad\.example/);
});
