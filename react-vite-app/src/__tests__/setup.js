import '@testing-library/jest-dom';

if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
} else {
  Object.defineProperty(window, 'HTMLDialogElement', { value: class {} });
}

if (typeof window.Notification === 'undefined') {
  const MockNotification = function (title, options) {
    this.title = title;
    this.body = options?.body;
    this.icon = options?.icon;
    this.tag = options?.tag;
  };
  MockNotification.permission = 'default';
  MockNotification.requestPermission = jest.fn(() =>
    Promise.resolve(MockNotification.permission),
  );
  window.Notification = MockNotification;
}
