export const DEFAULT_DELAY_MS = 40;

/**
 * @typedef {{ delayMs?: number, fail?: boolean, errorMessage?: string }} ServiceOptions
 */

/** @template T @param {T} value @returns {T} */
export function clone(value) {
  return structuredClone(value);
}

/**
 * Resolves a cloned result after a short simulated processing delay.
 * @template T
 * @param {T | (() => T)} result
 * @param {ServiceOptions} [options]
 * @returns {Promise<T>}
 */
export function simulateAsync(result, options = {}) {
  const delay = options.delayMs ?? DEFAULT_DELAY_MS;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (options.fail) {
        reject(new Error(options.errorMessage ?? 'The requested service operation failed.'));
        return;
      }

      const value = typeof result === 'function' ? result() : result;
      resolve(clone(value));
    }, delay);
  });
}
