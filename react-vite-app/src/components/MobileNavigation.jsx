import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const MOBILE_BREAKPOINT = 720;

export default function MobileNavigation({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const closeOnDesktop = (event) => {
      if (!event.matches) setIsOpen(false);
    };

    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!navigationRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="mobile-navigation" ref={navigationRef}>
      <button
        type="button"
        className="mobile-navigation__toggle"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" className="mobile-navigation__icon">☰</span>
        <span>Menu</span>
      </button>

      {isOpen && (
        <nav id="mobile-navigation" aria-label="Primary" className="mobile-navigation__panel">
          <ul className="mobile-navigation__links">
            {items.map(({ label, to, end, danger }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `mobile-navigation__link${isActive ? ' mobile-navigation__link--active' : ''}${danger ? ' mobile-navigation__link--danger' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
