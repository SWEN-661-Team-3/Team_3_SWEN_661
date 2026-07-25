// E2E-only modes are deliberately limited to localhost and query parameters.
// They exercise visible resilience states against the in-memory services
// without introducing a test backend or changing deployed behavior.
function activeModes() {
  if (typeof window === 'undefined' || window.location.hostname !== 'localhost') return new Set();

  return new Set(
    new URLSearchParams(window.location.search)
      .get('__e2e')
      ?.split(',')
      .filter(Boolean),
  );
}

export function hasE2EMode(mode) {
  return activeModes().has(mode);
}

export function e2eOperationOptions(operation, options = {}) {
  const modes = activeModes();

  if (modes.has(`fail-${operation}`)) {
    return { ...options, fail: true, errorMessage: `E2E ${operation} failure.` };
  }

  if (modes.has(`slow-${operation}`)) {
    return { ...options, delayMs: 700 };
  }

  return options;
}
