import '@testing-library/jest-dom';

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

HTMLDialogElement.prototype.showModal =
  HTMLDialogElement.prototype.showModal ||
  jest.fn(function () {
    this.setAttribute('open', '');
    this.open = true;
  });

HTMLDialogElement.prototype.close =
  HTMLDialogElement.prototype.close ||
  jest.fn(function () {
    this.removeAttribute('open');
    this.open = false;
  });

delete window.careConnect;
