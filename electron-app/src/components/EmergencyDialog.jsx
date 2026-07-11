import { useEffect, useRef, useState } from 'react';
import { showModalWithInitialFocus } from '../dialogFocus';

const INITIAL_COUNTDOWN = 10;

export default function EmergencyDialog({
  open,
  contacts = [],
  onClose,
  onAlertSent,
}) {
  const dialogRef = useRef(null);
  const [phase, setPhase] = useState('idle');
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);

  useEffect(() => {
    if (!open) {
      setPhase('idle');
      setCountdown(INITIAL_COUNTDOWN);
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) showModalWithInitialFocus(dialog);
  }, [open]);

  useEffect(() => {
    if (!open || phase !== 'countdown') return undefined;

    if (countdown === 0) {
      setPhase('confirmed');
      onAlertSent?.();
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [countdown, onAlertSent, open, phase]);

  if (!open) return null;

  function startCountdown() {
    setPhase('countdown');
    setCountdown(INITIAL_COUNTDOWN);
  }

  function closeDialog() {
    setPhase('idle');
    setCountdown(INITIAL_COUNTDOWN);
    onClose?.();
  }

  return (
    <dialog
      className={`dialog dialog--emergency dialog--emergency-${phase}`}
      ref={dialogRef}
      aria-labelledby="emergency-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={closeDialog}
    >
      <div className="dialog__inner">
        <header className="dialog__header">
          <h2 id="emergency-dialog-title">
            {phase === 'confirmed' ? 'Help Is On The Way' : 'Emergency Help'}
          </h2>
          <button
            type="button"
            className="dialog__close"
            aria-label="Close"
            onClick={closeDialog}
          >
            <span aria-hidden="true">X</span>
          </button>
        </header>

        {phase === 'idle' && (
          <div className="emergency-panel">
            <div className="emergency-panel__icon emergency-panel__icon--warning" aria-hidden="true">
              !
            </div>
            <p className="emergency-panel__heading">Emergency Help</p>
            <p className="emergency-panel__copy" id="emergency-start-description">
              Use the button below if you need immediate help. Your emergency
              contacts will be notified.
            </p>

            <button
              type="button"
              className="emergency-help-button"
              aria-describedby="emergency-start-description"
              onClick={startCountdown}
            >
              I Need Help
            </button>

            <button
              type="button"
              className="emergency-link-button"
              onClick={closeDialog}
            >
              Cancel
            </button>
          </div>
        )}

        {phase === 'countdown' && (
          <div className="emergency-panel emergency-panel--countdown">
            <p className="emergency-panel__label">Sending alert in</p>
            <p
              className="emergency-panel__countdown"
              aria-live="polite"
              aria-label={`Sending alert in ${countdown} seconds`}
            >
              {countdown}
            </p>
            <p className="emergency-panel__label">seconds</p>

            <ContactList
              title="Notifying:"
              contacts={contacts}
              statusLabel={null}
            />

            <button
              type="button"
              className="emergency-cancel-button"
              onClick={closeDialog}
            >
              Cancel
            </button>
          </div>
        )}

        {phase === 'confirmed' && (
          <div className="emergency-panel emergency-panel--confirmed" role="status">
            <div className="emergency-panel__icon emergency-panel__icon--success" aria-hidden="true">
              OK
            </div>
            <p className="emergency-panel__heading">Help Is On The Way</p>
            <p className="emergency-panel__copy">
              Your emergency contacts have been notified. Stay calm and stay
              where you are.
            </p>

            <ContactList
              title="Notified:"
              contacts={contacts}
              statusLabel="Notified"
            />

            <button
              type="button"
              className="primary-btn emergency-return-button"
              onClick={closeDialog}
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

function ContactList({ title, contacts, statusLabel }) {
  return (
    <section className="emergency-contacts" aria-labelledby="emergency-contacts-title">
      <h3 id="emergency-contacts-title">{title}</h3>
      <ul className="emergency-contacts__list">
        {contacts.map((contact) => (
          <li className="emergency-contact" key={contact.id ?? contact.name}>
            <span className="emergency-contact__avatar" aria-hidden="true">
              {contact.initials ?? contact.name.slice(0, 1)}
            </span>
            <span className="emergency-contact__details">
              <span className="emergency-contact__name">{contact.name}</span>
              {contact.relationship && (
                <span className="emergency-contact__relationship">
                  {contact.relationship}
                </span>
              )}
            </span>
            {statusLabel && (
              <span className="emergency-contact__status">{statusLabel}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
