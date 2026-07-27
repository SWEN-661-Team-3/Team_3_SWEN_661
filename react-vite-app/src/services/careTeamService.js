import { caregivers } from '../data/careData';
import { hasE2EMode } from './e2eTestMode';
import { clone, simulateAsync } from './serviceUtils';

let careTeam = clone(caregivers);

/** @param {import('./serviceUtils').ServiceOptions} [options] */
export function getCareTeam(options) {
  if (hasE2EMode('empty-team')) return simulateAsync(() => [], options);
  return simulateAsync(() => careTeam, options);
}

/** @param {string} caregiverId @param {import('./serviceUtils').ServiceOptions} [options] */
export function getCaregiver(caregiverId, options) {
  return simulateAsync(() => careTeam.find((caregiver) => caregiver.id === caregiverId) ?? null, options);
}

/** @param {Record<string, unknown> & { id: string }} caregiver @param {import('./serviceUtils').ServiceOptions} [options] */
export function saveCaregiver(caregiver, options) {
  return simulateAsync(() => {
    const nextCaregiver = clone(caregiver);
    const index = careTeam.findIndex((item) => item.id === nextCaregiver.id);
    careTeam = index === -1
      ? [...careTeam, nextCaregiver]
      : careTeam.map((item) => (item.id === nextCaregiver.id ? nextCaregiver : item));
    return nextCaregiver;
  }, options);
}
