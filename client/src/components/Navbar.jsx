import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { HiMenu, HiX, HiUser, HiLogout, HiDocumentText, HiViewGrid, HiSearch, HiHome } from 'react-icons/hi';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <HiHome /> },
    { path: '/builder', label: 'Resume Builder', icon: <HiDocumentText /> },
  ];

  if (user) {
    navLinks.push(
      { path: '/dashboard', label: 'Dashboard', icon: <HiViewGrid /> },
      { path: '/screener', label: 'AI Screener', icon: <HiSearch /> }
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
              <line x1="9" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="19" x2="17" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="21" cy="22" r="5" fill="url(#grad)" stroke="currentColor" strokeWidth="1.5" />
              <path d="M19 22l1.5 1.5L24 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="16" y1="17" x2="26" y2="27">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Resume<span className="gradient-text">AI</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <ThemeToggle />

          {user ? (
            <div className="user-menu">
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                ) : (
                  <div className="user-avatar-fallback">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="user-dropdown glass-card">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.displayName || 'User'}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <HiViewGrid /> Dashboard
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <HiLogout /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
