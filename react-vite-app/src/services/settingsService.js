import { clone, simulateAsync } from './serviceUtils';

export const defaultSettings = Object.freeze({
  largeText: false,
  highContrast: false,
  darkTheme: false,
  reduceMotion: true,
});

let settings = clone(defaultSettings);

/** @param {import('./serviceUtils').ServiceOptions} [options] */
export function getSettings(options) {
  return simulateAsync(() => settings, options);
}

/** @param {Record<string, boolean>} nextSettings @param {import('./serviceUtils').ServiceOptions} [options] */
export function saveSettings(nextSettings, options) {
  return simulateAsync(() => {
    settings = clone(nextSettings);
    return settings;
  }, options);
}
