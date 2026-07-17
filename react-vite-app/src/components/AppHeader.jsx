import { NavLink } from 'react-router-dom';

export default function AppHeader() {
  return (
    <header className="app-header" role="banner">
      <NavLink to="/" className="app-header__brand" aria-label="CareConnect home">
        <span className="app-header__logo" aria-hidden="true">CC</span>
        <h1 className="app-header__title">CareConnect</h1>
      </NavLink>

      <nav aria-label="Main navigation">
        <ul className="nav-links" role="menubar">
          <li role="none">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              role="menuitem"
            >
              Today&apos;s Plan
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/care-team"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              role="menuitem"
            >
              Care Team
            </NavLink>
          </li>
          <li role="none" aria-hidden="true"><span className="nav-divider" /></li>
          <li role="none">
            <NavLink
              to="/settings"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              role="menuitem"
            >
              Settings
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/emergency"
              className="nav-link nav-link--danger"
              role="menuitem"
            >
              Emergency
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
