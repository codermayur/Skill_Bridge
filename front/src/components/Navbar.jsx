import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap, BarChart2, User, LogOut,
  Menu, X, Plus, ChevronDown, Settings,
  List, Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './notifications/NotificationBell';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import './ui/Button.css';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     exact: true },
  { to: '/requests', label: 'Requests'              },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const dropRef  = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, user } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdown(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        {/* Top accent line */}
        <div className="navbar-accent" aria-hidden="true" />

        <div className="navbar-inner">

          {/* ── Logo ── */}
          <Link to="/" className="navbar-logo" aria-label="Skill Bridge — home">
            <div className="navbar-logo-icon">
              <Zap size={16} strokeWidth={3} />
            </div>
            <span className="navbar-logo-text">
              Skill<span className="navbar-logo-accent">Bridge</span>
            </span>
          </Link>

          {/* ── Separator ── */}
          <div className="navbar-sep" aria-hidden="true" />

          {/* ── Desktop links ── */}
          <ul className="navbar-links" role="list">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'navbar-link-active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Right side ── */}
          <div className="navbar-right">

            {isLoggedIn && (
              <Button
                as={Link}
                to="/requests/new"
                size="sm"
                leftIcon={<Plus size={14} strokeWidth={2.5} />}
                className="navbar-post-btn"
              >
                New Request
              </Button>
            )}

            <NotificationBell />

            {isLoggedIn ? (
              <div className="navbar-profile" ref={dropRef}>
                <button
                  className="navbar-avatar-btn"
                  onClick={() => setDropdown((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                >
                  <Avatar name={user?.fullName || 'User'} size="sm" />
                  <span className="navbar-name">
                    {user?.fullName?.split(' ')[0] || 'Me'}
                  </span>
                  <ChevronDown
                    size={13}
                    strokeWidth={2.5}
                    className={`navbar-chevron ${dropdownOpen ? 'navbar-chevron-open' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="navbar-dropdown animate-scale-in" role="menu">

                    {/* User card */}
                    <div className="navbar-dropdown-user">
                      <Avatar name={user?.fullName || 'User'} size="md" />
                      <div className="navbar-dropdown-user-info">
                        <p className="navbar-dropdown-name">{user?.fullName}</p>
                        <p className="navbar-dropdown-email">{user?.email}</p>
                      </div>
                    </div>

                    <div className="navbar-dropdown-section-label">Account</div>

                    {[
                      { to: '/profile',  icon: <User      size={14} />, label: 'My Profile'    },
                      { to: '/stats',    icon: <BarChart2 size={14} />, label: 'Statistics'    },
                      { to: '/requests', icon: <List      size={14} />, label: 'Help Requests' },
                    ].map(({ to, icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="navbar-dropdown-item"
                        role="menuitem"
                        onClick={() => setDropdown(false)}
                      >
                        <span className="navbar-dropdown-item-icon">{icon}</span>
                        {label}
                      </Link>
                    ))}

                    {user?.role === 'admin' && (
                      <>
                        <div className="navbar-dropdown-divider" />
                        <div className="navbar-dropdown-section-label">Admin</div>
                        <Link
                          to="/admin"
                          className="navbar-dropdown-item navbar-dropdown-item-admin"
                          role="menuitem"
                          onClick={() => setDropdown(false)}
                        >
                          <span className="navbar-dropdown-item-icon">
                            <Settings size={14} />
                          </span>
                          Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="navbar-dropdown-divider" />

                    <button
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <span className="navbar-dropdown-item-icon"><LogOut size={14} /></span>
                      Sign Out
                    </button>

                  </div>
                )}
              </div>

            ) : (
              <div className="navbar-auth-btns">
                <Button as={Link} to="/login"  variant="ghost"   size="sm">Sign in</Button>
                <Button as={Link} to="/signup" variant="primary" size="sm">Get started</Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="mobile-drawer animate-fade-in-down" role="dialog" aria-label="Mobile navigation">

          {isLoggedIn && (
            <div className="mobile-user">
              <Avatar name={user?.fullName || 'User'} size="sm" />
              <div>
                <p className="mobile-user-name">{user?.fullName}</p>
                <p className="mobile-user-email">{user?.email}</p>
              </div>
            </div>
          )}

          <div className="mobile-drawer-divider" />

          <ul role="list">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {isLoggedIn ? (
            <>
              <div className="mobile-drawer-divider" />
              <ul role="list">
                {[
                  { to: '/requests/new', label: 'Post a Request', icon: <Plus     size={15} /> },
                  { to: '/profile',      label: 'My Profile',     icon: <User     size={15} /> },
                  { to: '/stats',        label: 'Statistics',     icon: <BarChart2 size={15} /> },
                ].map(({ to, label, icon }) => (
                  <li key={to}>
                    <Link to={to} className="mobile-nav-link">
                      <span className="mobile-nav-icon">{icon}</span>
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button className="mobile-nav-link mobile-nav-logout" onClick={handleLogout}>
                    <span className="mobile-nav-icon"><LogOut size={15} /></span>
                    Sign Out
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <div className="mobile-auth">
              <Button as={Link} to="/login"  variant="outline"  size="md" fullWidth>Sign In</Button>
              <Button as={Link} to="/signup" variant="primary"  size="md" fullWidth>Get Started</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
