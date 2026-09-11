import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',              label: 'Home' },
  { to: '/browse',        label: 'Browse' },
  { to: '/report-lost',   label: 'Report Lost' },
  { to: '/report-found',  label: 'Report Found' },
  { to: '/claims',        label: 'Claims' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/admin',         label: 'Admin' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__brand-icon">🎒</span>
          <span className="navbar__brand-text">Campus Lost &amp; Found</span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="navbar__hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="navbar__drawer" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'navbar__drawer-link' + (isActive ? ' navbar__drawer-link--active' : '')
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
