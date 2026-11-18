/* Studios216 Paddle adapter: optional, never used by other Merchants of Record. */
(() => {
  'use strict';

  const status = document.getElementById('status');
  const configScript = document.getElementById('s216-bridge-config');
  const report = (message) => { if (status) status.textContent = message; };
  const query = new URLSearchParams(window.location.search);
  const transactions = query.getAll('_ptxn');

  // A valid payment link is the only way to initiate this checkout.
  if (!configScript || !status) return;
  let config;
  try {
    config = JSON.parse(configScript.textContent || 'null');
  } catch {
    report('This checkout is currently unavailable.');
    return;
  }
  const sandbox = window.location.pathname === '/pay/sandbox/'
    || window.location.pathname === '/pay/sandbox';
  const environment = sandbox ? 'sandbox' : 'live';
  const prefix = sandbox ? 'test_' : 'live_';
  if (!config || config.provider !== 'paddle' || config.environment !== environment
      || typeof config.clientToken !== 'string'
      || !config.clientToken.startsWith(prefix)) {
    report('The payment environment is not available.');
    return;
  }

  if (transactions.length === 0) {
    report('No payment link was supplied. Return to the application that issued your link.');
    return;
  }
  if (transactions.length !== 1 || !/^txn_[a-z0-9]{26}$/.test(transactions[0])) {
    report('The payment link is invalid. Request a new link from your application.');
    return;
  }

  report('Opening the secure Paddle checkout…');
  const sdkScript = document.createElement('script');
  sdkScript.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  sdkScript.async = true;
  sdkScript.onerror = () => report('The secure checkout could not be loaded. Please retry later.');
  sdkScript.onload = () => {
    const paddle = window.Paddle;
    if (!paddle?.Initialize || !paddle?.Checkout) {
      report('The payment provider is unavailable. Please retry later.');
      return;
    }
    try {
      if (sandbox) paddle.Environment.set('sandbox');
      paddle.Initialize({
        token: config.clientToken,
        checkout: {
          settings: { displayMode: 'overlay', theme: 'light' },
        },
        eventCallback: (event) => {
          if (event?.name === 'checkout.completed') {
            report('Checkout finished. Your application will verify payment before enabling access.');
          } else if (event?.name === 'checkout.closed') {
            report('Checkout closed. If you submitted payment, check its status in your application before retrying.');
          } else if (event?.name === 'checkout.error') {
            report('Paddle could not complete the checkout. Review your payment status in your application.');
          }
        },
      });
      // Official Paddle.js automatically opens the transaction in ?_ptxn=txn_...
      // Do NOT call Checkout.open() here; that would risk opening it twice.
    } catch {
      report('Unable to initialize the payment provider. Please retry later.');
    }
  };
  document.head.appendChild(sdkScript);
})();
