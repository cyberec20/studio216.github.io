/**
 * Paddle-only implementation: _ptxn is not a universal Merchant of Record
 * contract. Non-Paddle providers never need to implement or consume it.
 */
export const paddleAdapter = Object.freeze({
  id: 'paddle',
  resolveEnvironment(pathname) {
    if (pathname === '/pay/' || pathname === '/pay') return 'live';
    if (pathname === '/pay/sandbox/' || pathname === '/pay/sandbox') return 'sandbox';
    return null;
  },
  configuration(env, environment) {
    if (environment === 'live' && env?.PADDLE_LIVE_ENABLED !== 'true') return null;
    const key = environment === 'sandbox'
      ? 'PADDLE_CLIENT_TOKEN_SANDBOX'
      : 'PADDLE_CLIENT_TOKEN_LIVE';
    const token = env?.[key];
    const prefix = environment === 'sandbox' ? 'test_' : 'live_';
    // Reject unset, dummy, cross-environment and placeholder tokens.
    if (typeof token !== 'string' || !token.startsWith(prefix)
        || token.length < 20
        || /placeholder|replace|example|change.me|dummy/i.test(token)) return null;
    return { provider: 'paddle', environment, clientToken: token };
  },
});

export function validPaddleTransactionQuery(url) {
  const values = url.searchParams.getAll('_ptxn');
  return values.length === 0
    || (values.length === 1 && /^txn_[a-z0-9]{26}$/.test(values[0]));
}
