import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(base, '../../..');
const bridge = path.resolve(base, '..');
const read = (p) => readFileSync(p, 'utf8');

test('strict GitHub Pages whitelist excludes edge code and any bridge assets', () => {
  const whitelist = JSON.parse(read(path.join(root, 'data/public_site.json')));
  assert.ok(!whitelist.directories.includes('edge'));
  assert.ok(!whitelist.root_files.includes('edge'));
  assert.ok(!whitelist.generated_files.includes('edge'));
  assert.ok(!whitelist.directories.some((d) => d.startsWith('edge/')));
  assert.ok(!whitelist.root_files.some((d) => d.startsWith('edge/')));
});

test('publications preserve current institutional site ownership and workflows', () => {
  assert.equal(read(path.join(root, 'CNAME')).trim(), 'studios216.com');
  const pipeline = read(path.join(root, '.github/workflows/pages-explicit.yml'));
  assert.match(pipeline, /build_public_site\.py/);
  assert.match(pipeline, /validate_public_site\.py/);
  assert.match(pipeline, /upload-pages-artifact/);
  assert.doesNotMatch(pipeline, /edge\/paddle-pay/);
});

test('bridge never embeds keys, signing secrets, webhooks, or production checkout links', () => {
  for (const file of ['public/index.html', 'public/app.js', 'src/worker.js',
    'src/providerRegistry.js', 'src/adapters/paddle.js']) {
    const content = read(path.join(bridge, file));
    assert.doesNotMatch(content, /sk_(live|test)_[a-z0-9]{16,}/i, file);
    assert.doesNotMatch(content, /https?:\/\/[^\s]+\.workers\.dev/i, file);
    assert.doesNotMatch(content, /PADDLE_WEBHOOK_SECRET|PADDLE_API_KEY_[A-Z]/, file);
  }
  assert.equal(existsSync(path.join(bridge, '.dev.vars')), false);
  assert.equal(existsSync(path.join(bridge, '.env')), false);
});

test('the neutral page exposes all product legal terms without marketing loaders', () => {
  const html = read(path.join(bridge, 'public/index.html'));
  assert.match(html, /dentitrace\/terms\.html/);
  assert.match(html, /dentitrace\/refund-policy\.html/);
  assert.match(html, /diffdocs\/terms\.html/);
  assert.match(html, /diffdocs\/refund-policy\.html/);
  assert.match(html, /studios216\.com\/privacy\.html/);
  assert.doesNotMatch(html, /googletagmanager|facebook\.net|clarity\.ms|analytics/i);
});

test('worker cannot be deployed to the production route by its checked-in config', () => {
  const cfg = read(path.join(bridge, 'wrangler.jsonc'));
  assert.match(cfg, /"workers_dev": false/);
  assert.doesNotMatch(cfg, /"routes"\s*:/);
  assert.doesNotMatch(cfg, /"zone_id"\s*:/);
  const scripts = JSON.parse(read(path.join(bridge, 'package.json'))).scripts;
  assert.ok(!Object.keys(scripts).includes('deploy'));
});
