import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes';

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <NavLink to={ROUTES.today} className="app-header__brand" aria-label="CareConnect home">
        <img
          src="/icons/icon-192x192.svg"
          alt="CareConnect logo"
          className="app-header__logo-img"
          width="44"
          height="44"
        />
        <span className="app-header__title">CareConnect</span>
      </NavLink>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span className="visually-hidden">Menu</span>
        <span className="menu-toggle__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id="main-navigation"
        className={`app-header__nav${isMenuOpen ? ' app-header__nav--open' : ''}`}
        aria-label="Main navigation"
      >
        <ul className="nav-links">
          <li>
            <NavLink
              to={ROUTES.today}
              end
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Today&apos;s Plan
            </NavLink>
          </li>
          <li>
            <NavLink
              to={ROUTES.careTeam}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Care Team
            </NavLink>
          </li>
          <li aria-hidden="true"><span className="nav-divider" /></li>
          <li>
            <NavLink
              to={ROUTES.settings}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to={ROUTES.emergency}
              className="nav-link nav-link--danger"
              onClick={() => setIsMenuOpen(false)}
            >
              Emergency
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
