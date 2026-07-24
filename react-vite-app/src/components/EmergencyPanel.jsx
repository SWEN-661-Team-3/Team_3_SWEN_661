import { useState, useEffect, useCallback, useRef } from 'react';

const COUNTDOWN_SECONDS = 5;

export default function EmergencyPanel({ contacts }) {
  const [phase, setPhase] = useState('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef(null);
  const statusRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  function startAlert() {
    setPhase('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    announce('Emergency alert countdown started');
  }

  function cancelAlert() {
    clearInterval(intervalRef.current);
    setPhase('idle');
    setCountdown(COUNTDOWN_SECONDS);
    announce('Emergency alert canceled');
  }

  useEffect(() => {
    if (phase !== 'countdown') return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setPhase('confirmed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [phase]);

  // Countdown announcements: only the 2-second mark is announced to avoid
  // overwhelming screen reader users with per-second updates. The visual
  // countdown still updates every second for sighted users.
  useEffect(() => {
    if (phase === 'countdown' && countdown === 2) {
      announce('2 seconds remaining');
    }
  }, [phase, countdown, announce]);

  // The sent-state announcement uses aria-live="assertive" (set on the
  // status region above) because this is a critical safety transition that
  // must interrupt whatever the screen reader is currently saying.
  useEffect(() => {
    if (phase === 'confirmed') {
      announce('Emergency alert sent');
    }
  }, [phase, announce]);

  return (
    <section aria-labelledby="emergency-panel-heading">
      <div
        ref={statusRef}
        className="visually-hidden"
        aria-live="assertive"
        aria-atomic="true"
      />

      {phase === 'idle' && (
        <div className="emergency-panel">
          <div className="emergency-panel__icon emergency-panel__icon--warning" aria-hidden="true">
            !
          </div>
          <h2 id="emergency-panel-heading">Need Help?</h2>
          <p className="emergency-panel__copy">
            Press the button below to send an alert to your emergency contacts.
            A {COUNTDOWN_SECONDS}-second countdown will begin before the alert is sent.
          </p>
          <button
            type="button"
            className="emergency-help-button"
            onClick={startAlert}
            aria-label="Send emergency alert"
          >
            Get Help Now
          </button>

          {contacts.length > 0 && (
            <div className="emergency-contacts">
              <h3>Emergency Contacts</h3>
              <ul className="emergency-contacts__list" role="list">
                {contacts.map((c) => (
                  <li key={c.id} className="emergency-contact">
                    <span className="emergency-contact__avatar" aria-hidden="true">
                      {c.initials}
                    </span>
                    <div className="emergency-contact__details">
                      <span className="emergency-contact__name">{c.name}</span>
                      <span className="emergency-contact__relationship">
                        {c.relationship} &mdash; {c.phone}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {phase === 'countdown' && (
        <div className="emergency-panel">
          <h2 id="emergency-panel-heading">Sending Alert...</h2>
          <p className="emergency-panel__copy">
            Alert will be sent in {countdown} second{countdown !== 1 ? 's' : ''}.
          </p>
          <button
            type="button"
            className="danger-btn"
            onClick={cancelAlert}
          >
            Cancel Alert
          </button>
        </div>
      )}

      {phase === 'confirmed' && (
        <div className="emergency-panel">
          <div className="emergency-panel__icon emergency-panel__icon--success" aria-hidden="true">
            &#10003;
          </div>
          <h2 id="emergency-panel-heading">Alert Sent</h2>
          <p className="emergency-panel__copy">
            Help is on the way. Your emergency contacts have been notified.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setPhase('idle');
              setCountdown(COUNTDOWN_SECONDS);
            }}
          >
            Return to Safety
          </button>
        </div>
      )}
    </section>
  );
}
