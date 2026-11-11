import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Trophy,
  BookOpen,
  Sun,
  Moon,
  Zap,
  LogOut,
  Flame,
  LayoutDashboard,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="brutalist-navbar">
      <div className="navbar-container">
        {/* Left Brand */}
        <div className="brand-section">
          <Link to="/" className="brand-logo-wrap">
            <div className="logo-box">
              <span className="code-brackets">&lt;/&gt;</span>
            </div>
            <span className="brand-name">CodeDetective</span>
          </Link>
          <div className="nav-vertical-divider">|</div>
        </div>

        {/* Center Nav Links */}
        <nav className="nav-links-center">
          <NavLink
            to="/"
            className={({ isActive }) => `brutalist-nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/challenges"
            className={({ isActive }) => `brutalist-nav-link ${isActive ? 'active' : ''}`}
          >
            Challenges
          </NavLink>
          <NavLink
            to="/playground"
            className={({ isActive }) => `brutalist-nav-link ${isActive ? 'active' : ''}`}
          >
            Playground
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => `brutalist-nav-link ${isActive ? 'active' : ''}`}
          >
            Docs
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `brutalist-nav-link ${isActive ? 'active' : ''}`}
          >
            Leaderboard
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions-right">
          {/* GitHub Square Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="icon-square-btn"
            title="GitHub Repository"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>

          {isAuthenticated && user ? (
            <div className="auth-user-bar">
              <Link to="/dashboard" className="nav-dashboard-link" title="Dashboard">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <div className="nav-stat-pill" title="Daily Streak">
                <Flame size={14} className="text-amber" />
                <span>{user.streak}d</span>
              </div>

              <div className="nav-stat-pill xp" title="Total XP">
                <Zap size={13} />
                <span>{user.xp} XP</span>
              </div>

              <Link to="/profile" className="nav-avatar-box" title={user.name}>
                <img src={user.avatar} alt={user.name} />
              </Link>

              <button onClick={logout} className="logout-square-btn" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="guest-nav-actions">
              <Link to="/login" className="btn btn-primary btn-sign-in">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
