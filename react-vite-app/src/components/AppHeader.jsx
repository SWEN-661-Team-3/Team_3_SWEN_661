import { NavLink } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';
import { navigationItems } from './navigationItems';

export default function AppHeader() {
  return (
    <header className="app-header">
      <NavLink to="/" className="app-header__brand" aria-label="CareConnect home">
        <img
          src="/icons/icon-192x192.svg"
          alt="CareConnect logo"
          className="app-header__logo-img"
          width="44"
          height="44"
        />
        <span className="app-header__title">CareConnect</span>
      </NavLink>

      <nav className="desktop-navigation" aria-label="Main navigation">
        <ul className="nav-links">
          {navigationItems.slice(0, 2).map(({ label, to, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
                {label}
              </NavLink>
            </li>
          ))}
          <li aria-hidden="true"><span className="nav-divider" /></li>
          {navigationItems.slice(2).map(({ label, to, danger }) => (
            <li key={to}>
              <NavLink to={to} className={`nav-link${danger ? ' nav-link--danger' : ''}`}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <MobileNavigation items={navigationItems} />
    </header>
  );
}
