import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Trophy,
  BookOpen,
  Sun,
  Moon,
  Search,
  Zap,
  User,
  LogOut,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="logo-icon-wrap">
            <Code2 className="logo-icon" size={22} />
          </div>
          <span className="brand-text">
            Code<span className="brand-accent">Detective</span>
          </span>
          <span className="brand-badge">PRO</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/challenges"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Challenges
          </NavLink>
          <NavLink
            to="/playground"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Terminal size={16} />
            Playground
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Trophy size={16} />
            Leaderboard
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            Docs
          </NavLink>
        </nav>

        {/* Right Action Controls */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon size={18} className="theme-icon" />
            ) : (
              <Sun size={18} className="theme-icon" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="user-nav-group">
              {/* Streak Pill */}
              <div className="streak-pill" title={`${user.streak} day debugging streak!`}>
                <Flame size={16} className="flame-icon" />
                <span>{user.streak}d</span>
              </div>

              {/* XP Pill */}
              <div className="xp-pill" title="Total Experience Points">
                <Zap size={14} className="zap-icon" />
                <span>{user.xp} XP</span>
              </div>

              {/* User Avatar Menu */}
              <div className="user-profile-menu">
                <Link to="/profile" className="avatar-link" title={user.name}>
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="nav-avatar"
                  />
                </Link>
                <button
                  onClick={logout}
                  className="btn-logout"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

