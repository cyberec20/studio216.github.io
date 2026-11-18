/* Studios216 Paddle adapter: optional, never used by other Merchants of Record. */
(() => {
  'use strict';

  const status = document.getElementById('status');
  const heading = document.getElementById('heading');
  const configScript = document.getElementById('s216-bridge-config');
  const report = (title, message) => {
    if (heading) heading.textContent = title;
    if (status) status.textContent = message;
  };
  const query = new URLSearchParams(window.location.search);
  const transactions = query.getAll('_ptxn');

  // Only a valid payment-link transaction may initiate Paddle.js.
  if (!configScript || !status) return;
  let config;
  try {
    config = JSON.parse(configScript.textContent || 'null');
  } catch {
    report('Checkout unavailable', 'The payment page could not be prepared. Please return to your application and try again later.');
    return;
  }
  const sandbox = window.location.pathname === '/pay/sandbox/'
    || window.location.pathname === '/pay/sandbox';
  const environment = sandbox ? 'sandbox' : 'live';
  const prefix = sandbox ? 'test_' : 'live_';
  if (!config || config.provider !== 'paddle' || config.environment !== environment
      || typeof config.clientToken !== 'string'
      || !config.clientToken.startsWith(prefix)) {
    report('Checkout unavailable', 'This payment environment is not available. Please return to your application.');
    return;
  }

  if (transactions.length === 0) {
    report('Payment link required', 'No payment request was included in this page. If you have not purchased, return to your application, choose a plan and start checkout there. If you already purchased, check your billing status in the application before paying again.');
    return;
  }
  if (transactions.length !== 1 || !/^txn_[a-z0-9]{26}$/.test(transactions[0])) {
    report('Invalid payment link', 'This payment link is invalid or incomplete. Please request a new checkout link from your application; do not enter payment details here.');
    return;
  }

  report('Opening secure checkout', 'Paddle is loading your payment form. Complete it only if the selected plan and amount are correct.');
  const sdkScript = document.createElement('script');
  sdkScript.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  sdkScript.async = true;
  sdkScript.onerror = () => report('Checkout could not open', 'The secure payment form could not load. Please check your application’s billing status before trying again.');
  sdkScript.onload = () => {
    const paddle = window.Paddle;
    if (!paddle?.Initialize || !paddle?.Checkout) {
      report('Checkout unavailable', 'Paddle is not responding. Please return to your application and try again later.');
      return;
    }
    try {
      if (sandbox) paddle.Environment.set('sandbox');
      let checkoutFinished = false;
      paddle.Initialize({
        token: config.clientToken,
        checkout: {
          settings: { displayMode: 'overlay', theme: 'light' },
        },
        eventCallback: (event) => {
          if (event?.name === 'checkout.completed') {
            checkoutFinished = true;
            report('Checkout finished — verify your purchase', 'Paddle reported that the checkout finished. This page cannot confirm settlement or activate access. Return to your application to verify your order or subscription status before paying again.');
          } else if (event?.name === 'checkout.closed' && !checkoutFinished) {
            report('Payment window closed', 'You closed the checkout. This page cannot confirm whether a payment was made. If you entered payment information, check your application’s billing status before trying again.');
          } else if (event?.name === 'checkout.error' && !checkoutFinished) {
            report('Checkout encountered a problem', 'Paddle could not finish this checkout. No successful payment is confirmed here. Check your application’s billing status before retrying.');
          }
        },
      });
      // Official Paddle.js automatically opens ?_ptxn=txn_...
      // Do not invoke Checkout.open(): doing so may open the same transaction twice.
    } catch {
      report('Checkout unavailable', 'The payment form could not be initialized. Please return to your application and try again later.');
    }
  };
  document.head.appendChild(sdkScript);
})();
