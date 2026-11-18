import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const program = readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/app.js'), 'utf8');
const txn = 'txn_' + 'k'.repeat(26);

function run({ pathname = '/pay/sandbox/', search = '?_ptxn=' + txn,
  config = { provider: 'paddle', environment: 'sandbox', clientToken: 'test_' + 'z'.repeat(32) },
  scriptError = false } = {}) {
  const status = { textContent: '' };
  const heading = { textContent: '' };
  const configElement = { textContent: JSON.stringify(config) };
  const initialized = [];
  const environmentCalls = [];
  const checkoutOpenCalls = [];
  let appended = 0;
  const paddle = {
    Environment: { set: (value) => environmentCalls.push(value) },
    Initialize: (options) => initialized.push(options),
    Checkout: { open: (options) => checkoutOpenCalls.push(options) },
  };
  const fakeWindow = { location: { pathname, search }, Paddle: paddle };
  const document = {
    getElementById(id) {
      return id === 'status' ? status : id === 'heading' ? heading
        : id === 's216-bridge-config' ? configElement : null;
    },
    createElement(tag) {
      assert.equal(tag, 'script');
      return {};
    },
    head: {
      appendChild(script) {
        appended++;
        assert.equal(script.src, 'https://cdn.paddle.com/paddle/v2/paddle.js');
        if (scriptError) script.onerror();
        else script.onload();
      },
    },
  };
  vm.runInNewContext(program, { document, window: fakeWindow, URLSearchParams });
  return { status, heading, initialized, environmentCalls, checkoutOpenCalls, appended };
}

test('Paddle.js only initializes for a valid _ptxn link', () => {
  const result = run();
  assert.equal(result.appended, 1);
  assert.deepEqual(result.environmentCalls, ['sandbox']);
  assert.equal(result.initialized.length, 1);
  assert.equal(result.initialized[0].token, 'test_' + 'z'.repeat(32));
  assert.equal(result.initialized[0].checkout.settings.displayMode, 'overlay');
  assert.equal(result.checkoutOpenCalls.length, 0, 'avoid double opening the same _ptxn');
});

test('a bare default link does not trigger checkout or fabricate a paid order', () => {
  const result = run({ search: '' });
  assert.equal(result.appended, 0);
  assert.match(result.status.textContent, /No payment request/);
  assert.match(result.heading.textContent, /Payment link required/);
  assert.match(result.status.textContent, /If you already purchased/);
});

test('invalid or duplicate transaction ID never loads the SDK', () => {
  for (const search of ['?_ptxn=bad', '?_ptxn=' + txn + '&_ptxn=' + txn]) {
    const result = run({ search });
    assert.equal(result.appended, 0);
    assert.match(result.status.textContent, /invalid/);
  }
});

test('a mismatched Paddle token is rejected before SDK load', () => {
  const result = run({ config: { provider: 'paddle', environment: 'sandbox',
    clientToken: 'live_' + 'z'.repeat(32) } });
  assert.equal(result.appended, 0);
  assert.match(result.status.textContent, /not available/);
});

test('non-Paddle configuration never initializes Paddle.js', () => {
  const result = run({ config: { provider: 'lemon', environment: 'sandbox',
    clientToken: 'test_' + 'z'.repeat(32) } });
  assert.equal(result.appended, 0);
});

test('live mode never switches Paddle into sandbox', () => {
  const result = run({ pathname: '/pay/', config: { provider: 'paddle', environment: 'live',
    clientToken: 'live_' + 'z'.repeat(32) } });
  assert.equal(result.appended, 1);
  assert.equal(result.initialized.length, 1);
  assert.equal(result.environmentCalls.length, 0);
});

test('SDK error is visible without exposing the transaction ID', () => {
  const result = run({ scriptError: true });
  assert.equal(result.initialized.length, 0);
  assert.match(result.status.textContent, /could not load/);
  assert.ok(!result.status.textContent.includes(txn));
});

test('completed callback never grants entitlements or redirects to a SaaS', () => {
  const result = run();
  const callback = result.initialized[0].eventCallback;
  callback({ name: 'checkout.completed' });
  assert.match(result.status.textContent, /cannot confirm settlement/);
  assert.match(result.heading.textContent, /verify your purchase/);
  assert.doesNotMatch(result.status.textContent, /payment confirmed|access active/i);
  assert.equal(result.checkoutOpenCalls.length, 0);
});

test('closing the overlay does not falsely assert that payment failed', () => {
  const result = run();
  result.initialized[0].eventCallback({ name: 'checkout.closed' });
  assert.match(result.status.textContent, /If you entered payment information/);
});

test('completed checkout message survives a later close event and never asserts payment settled', () => {
  const result = run();
  const callback = result.initialized[0].eventCallback;
  callback({ name: 'checkout.completed' });
  callback({ name: 'checkout.closed' });
  assert.match(result.heading.textContent, /verify your purchase/);
  assert.match(result.status.textContent, /cannot confirm settlement/);
  assert.doesNotMatch(result.status.textContent, /subscription is active|payment is settled/i);
});

test('Paddle error never indicates a successful payment', () => {
  const result = run();
  result.initialized[0].eventCallback({ name: 'checkout.error' });
  assert.match(result.heading.textContent, /problem/);
  assert.match(result.status.textContent, /No successful payment is confirmed here/);
});

test('missing transaction in Live mode does not load Paddle or imply a charge', () => {
  const result = run({
    pathname: '/pay/',
    search: '',
    config: { provider: 'paddle', environment: 'live', clientToken: 'live_' + 'z'.repeat(32) },
  });
  assert.equal(result.appended, 0);
  assert.match(result.heading.textContent, /Payment link required/);
  assert.match(result.status.textContent, /If you have not purchased/);
});
