import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/ticketing', label: 'Ticketing' },
  { path: '/zones', label: 'Zones' },
  { path: '/map', label: 'Map' },
  { path: '/sustainability', label: 'Sustainability' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="navbar-logo">
            <span className="logo-icon">UoS</span>
          </div>
          <div className="navbar-brand-text">
            <span className="brand-title">Sustainable Travel Hub</span>
            <span className="brand-sub">University of Sunderland</span>
          </div>
        </NavLink>

        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
