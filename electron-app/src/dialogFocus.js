let lastInteractionWasKeyboard = false;

document.addEventListener('keydown', () => {
  lastInteractionWasKeyboard = true;
}, true);

document.addEventListener('pointerdown', () => {
  lastInteractionWasKeyboard = false;
}, true);

export function showModalWithInitialFocus(dialog) {
  dialog.showModal();

  if (lastInteractionWasKeyboard) {
    dialog.tabIndex = -1;
    dialog.focus({ preventScroll: true });
    dialog.addEventListener('blur', () => {
      dialog.removeAttribute('tabindex');
    }, { once: true });
  }
}
