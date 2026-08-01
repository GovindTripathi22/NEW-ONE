import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Sprout, User, LogOut, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Header({ onToggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--color-surface-elevated)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Brand & Mobile Menu Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', minWidth: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sprout size={18} />
          </div>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
              KrishiSahayak
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls (Theme Toggle & Auth) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color var(--transition-fast)',
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} style={{ color: 'var(--color-accent)' }} />}
        </button>

        {/* User Auth Quick Action */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              <User size={14} />
              <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
            </Link>
            <Button
              variant="text"
              size="sm"
              icon={LogOut}
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Button variant="outline" size="sm" icon={LogIn} onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
