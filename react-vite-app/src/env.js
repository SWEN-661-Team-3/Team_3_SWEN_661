/** @typedef {{ appEnv: string, publicSiteUrl: string, enableMockFailures: boolean, serviceDelayMs: number }} CareConnectEnv */

// Vite injects this single validated object at build time. Keeping environment
// reads here prevents components and services from developing inconsistent
// defaults or production checks.
const injectedEnv = typeof __CARECONNECT_ENV__ === 'undefined'
  ? { appEnv: 'test', publicSiteUrl: 'http://localhost:5173', enableMockFailures: false, serviceDelayMs: 40 }
  : __CARECONNECT_ENV__;

function validDelay(value) {
  return Number.isFinite(value) && value >= 0;
}

if (!injectedEnv.publicSiteUrl) {
  throw new Error('CareConnect configuration error: VITE_PUBLIC_SITE_URL is required for production builds.');
}

if (!validDelay(injectedEnv.serviceDelayMs)) {
  throw new Error('CareConnect configuration error: VITE_SERVICE_DELAY_MS must be a non-negative number.');
}

/** @type {Readonly<CareConnectEnv>} */
export const env = Object.freeze(injectedEnv);
