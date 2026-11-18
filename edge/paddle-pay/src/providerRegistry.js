/**
 * An optional MoR bridge, not a requirement of the common payments contract.
 * A future MoR may use its own website or a separate adapter, without Paddle.
 */
import { paddleAdapter } from './adapters/paddle.js';

const adapters = Object.freeze({ paddle: paddleAdapter });

export function resolveCheckoutAdapter(env) {
  const selected = typeof env?.PAY_BRIDGE_PROVIDER === 'string'
    ? env.PAY_BRIDGE_PROVIDER.trim().toLowerCase()
    : '';
  return Object.prototype.hasOwnProperty.call(adapters, selected)
    ? adapters[selected]
    : null;
}

export function supportedProviders() {
  return Object.keys(adapters);
}
