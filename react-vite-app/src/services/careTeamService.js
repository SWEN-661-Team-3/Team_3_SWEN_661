import { caregivers } from '../data/careData';
import { clone, simulateAsync } from './serviceUtils';

let careTeam = clone(caregivers);

/** @param {import('./serviceUtils').ServiceOptions} [options] */
export function getCareTeam(options) {
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
