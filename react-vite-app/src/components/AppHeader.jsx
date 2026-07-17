import { NavLink } from 'react-router-dom';

export default function AppHeader() {
  return (
    <header className="app-header" role="banner">
      <NavLink to="/" className="app-header__brand" aria-label="CareConnect home">
        <img
          src="/icons/icon-192x192.svg"
          alt="CareConnect logo"
          className="app-header__logo-img"
          width="44"
          height="44"
        />
        <h1 className="app-header__title">CareConnect</h1>
      </NavLink>

      <nav aria-label="Main navigation">
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              Today&apos;s Plan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/care-team"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              Care Team
            </NavLink>
          </li>
          <li aria-hidden="true"><span className="nav-divider" /></li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/emergency"
              className="nav-link nav-link--danger"
            >
              Emergency
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
