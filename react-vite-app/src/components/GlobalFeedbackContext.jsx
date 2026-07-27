import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GlobalFeedbackContext = createContext(null);
const SUCCESS_DISMISS_DELAY_MS = 5000;

export function GlobalFeedbackProvider({ children }) {
  const { pathname } = useLocation();
  const [message, setMessage] = useState(null);
  const dismissTimer = useRef(null);

  const dismissFeedback = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = null;
    setMessage(null);
  }, []);

  const showFeedback = useCallback((nextMessage) => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setMessage(nextMessage);

    if (nextMessage.type === 'success') {
      dismissTimer.current = setTimeout(dismissFeedback, SUCCESS_DISMISS_DELAY_MS);
    }
  }, [dismissFeedback]);

  useEffect(() => {
    dismissFeedback();
  }, [pathname, dismissFeedback]);

  useEffect(() => () => dismissFeedback(), [dismissFeedback]);

  return (
    <GlobalFeedbackContext.Provider value={{ message, showFeedback, dismissFeedback }}>
      {children}
    </GlobalFeedbackContext.Provider>
  );
}

export function useGlobalFeedback() {
  const context = useContext(GlobalFeedbackContext);
  if (!context) throw new Error('useGlobalFeedback must be used within GlobalFeedbackProvider.');
  return context;
}
