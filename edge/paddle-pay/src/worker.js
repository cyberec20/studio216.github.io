import { resolveCheckoutAdapter } from './providerRegistry.js';
import { validPaddleTransactionQuery } from './adapters/paddle.js';

const ASSET_PATHS = Object.freeze({
  '/pay/app.js': '/app.js',
  '/pay/styles.css': '/styles.css',
});
const CONFIG_MARKER = '<!-- STUDIOS216_BRIDGE_CONFIG -->';

const CSP = [
  "default-src 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  "script-src 'self' https://cdn.paddle.com",
  "connect-src 'self' https://*.paddle.com https://*.paddlecdn.com",
  "frame-src https://*.paddle.com https://*.paddlecdn.com",
  "img-src 'self' data: https://*.paddle.com https://*.paddlecdn.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.paddle.com https://*.paddlecdn.com",
  "font-src 'self' data: https://fonts.gstatic.com https://*.paddle.com https://*.paddlecdn.com",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

const BASE_HEADERS = Object.freeze({
  'Cache-Control': 'no-store, max-age=0',
  'Content-Security-Policy': CSP,
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Resource-Policy': 'same-origin',
});

function plain(status, message, method = 'GET') {
  const headers = { ...BASE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' };
  if (status === 405) headers.Allow = 'GET, HEAD';
  return new Response(method === 'HEAD' ? null : message, { status, headers });
}

async function fetchAsset(env, request, assetPath) {
  if (!env?.ASSETS?.fetch) return null;
  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  assetUrl.search = '';
  const response = await env.ASSETS.fetch(new Request(assetUrl, { method: 'GET' }));
  return response.ok ? response : null;
}

function safeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const staticAsset = Object.prototype.hasOwnProperty.call(ASSET_PATHS, pathname)
    ? ASSET_PATHS[pathname]
    : null;
  const paymentPage = pathname === '/pay/' || pathname === '/pay'
    || pathname === '/pay/sandbox/' || pathname === '/pay/sandbox';
  const adapter = resolveCheckoutAdapter(env);
  const environment = adapter?.resolveEnvironment(pathname) ?? null;

  // Separate path registration from the provider. Selecting another MoR
  // disables this optional Paddle adapter; it does not erase the route.
  if (!paymentPage && !staticAsset) return plain(404, 'Not found.', request.method);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return plain(405, 'Method not allowed.', request.method);
  }
  if (!adapter) return plain(503, 'Checkout provider unavailable.', request.method);
  if (environment && !validPaddleTransactionQuery(url)) {
    return plain(400, 'Invalid payment link.', request.method);
  }
  // Static JS/CSS are public. Their availability must not depend on a
  // Sandbox token when only Live is configured (or vice versa).
  // Never return checkout HTML unless the requested environment is authorized.
  const resolved = environment ? adapter.configuration(env, environment) : null;
  if (environment && !resolved) {
    return plain(503, 'Checkout currently unavailable.', request.method);
  }

  try {
    const asset = await fetchAsset(env, request, staticAsset || '/index.html');
    if (!asset) return plain(503, 'Checkout temporarily unavailable.', request.method);
    const headers = new Headers(BASE_HEADERS);

    if (staticAsset) {
      headers.set('Content-Type', staticAsset.endsWith('.js')
        ? 'application/javascript; charset=utf-8'
        : 'text/css; charset=utf-8');
      return new Response(request.method === 'HEAD' ? null : asset.body, {
        status: 200, headers,
      });
    }

    const template = await asset.text();
    if (template.split(CONFIG_MARKER).length !== 2) {
      return plain(503, 'Checkout temporarily unavailable.', request.method);
    }
    // Only Paddle's PUBLIC client token reaches this HTML. Never access API keys.
    const config = '<script id="s216-bridge-config" type="application/json">'
      + safeJsonForScript(resolved) + '</script>';
    headers.set('Content-Type', 'text/html; charset=utf-8');
    return new Response(request.method === 'HEAD'
      ? null : template.replace(CONFIG_MARKER, config), { status: 200, headers });
  } catch {
    // Never log query strings, transaction IDs, headers, cookies or tokens.
    return plain(503, 'Checkout temporarily unavailable.', request.method);
  }
}

export default { fetch: handleRequest };
