import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Compass,
  Terminal,
  Layers,
  Globe,
  Server,
  FileCode,
  Atom,
  Cpu,
  Binary,
  Database,
  History,
  Award,
  User,
  Settings,
  Flame,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isCategoryActive = (category) => {
    const searchParams = new URLSearchParams(location.search);
    return (
      location.pathname === '/challenges' &&
      searchParams.get('category') === category
    );
  };

  return (
    <aside className="app-sidebar">
      {/* ── User Quick Info ── */}
      {user && (
        <div className="sidebar-user-card">
          <img src={user.avatar} alt={user.name} className="sidebar-avatar" />
          <div className="sidebar-user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">// LVL {user.level || 4} DETECTIVE</span>
          </div>
          <div className="user-xp-badge">
            <Zap size={11} />
            {user.xp} XP
          </div>
        </div>
      )}

      <div className="sidebar-scroll-area">
        {/* ── MAIN Section ── */}
        <div className="nav-group">
          <div className="nav-group-title">// MAIN</div>
          <ul className="nav-list">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                end
              >
                <LayoutDashboard size={16} className="nav-icon" />
                <span>Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/debug-lab"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FlaskConical size={16} className="nav-icon" />
                <span>Debug Lab</span>
                <span className="pill-hot">NEW</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges"
                className={({ isActive }) =>
                  `sidebar-link ${isActive && !location.search ? 'active' : ''}`
                }
              >
                <Compass size={16} className="nav-icon" />
                <span>Challenges</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/playground"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Terminal size={16} className="nav-icon" />
                <span>Playground</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ── LEARNING Section ── */}
        <div className="nav-group">
          <div className="nav-group-title">// LEARNING</div>
          <ul className="nav-list">
            <li>
              <NavLink
                to="/challenges?category=Full Stack"
                className={`sidebar-link ${isCategoryActive('Full Stack') ? 'active' : ''}`}
              >
                <Layers size={15} className="nav-icon" />
                <span>Full Stack</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=Frontend"
                className={`sidebar-link ${isCategoryActive('Frontend') ? 'active' : ''}`}
              >
                <Globe size={15} className="nav-icon" />
                <span>Frontend</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=Backend"
                className={`sidebar-link ${isCategoryActive('Backend') ? 'active' : ''}`}
              >
                <Server size={15} className="nav-icon" />
                <span>Backend</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=JavaScript"
                className={`sidebar-link ${isCategoryActive('JavaScript') ? 'active' : ''}`}
              >
                <FileCode size={15} className="nav-icon" />
                <span>JavaScript</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=React"
                className={`sidebar-link ${isCategoryActive('React') ? 'active' : ''}`}
              >
                <Atom size={15} className="nav-icon" />
                <span>React</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=Node.js"
                className={`sidebar-link ${isCategoryActive('Node.js') ? 'active' : ''}`}
              >
                <Cpu size={15} className="nav-icon" />
                <span>Node.js</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=DSA"
                className={`sidebar-link ${isCategoryActive('DSA') ? 'active' : ''}`}
              >
                <Binary size={15} className="nav-icon" />
                <span>DSA</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/challenges?category=Database"
                className={`sidebar-link ${isCategoryActive('Database') ? 'active' : ''}`}
              >
                <Database size={15} className="nav-icon" />
                <span>Database</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ── ACCOUNT Section ── */}
        <div className="nav-group">
          <div className="nav-group-title">// ACCOUNT</div>
          <ul className="nav-list">
            <li>
              <NavLink
                to="/attempts"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <History size={15} className="nav-icon" />
                <span>My Attempts</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile?tab=achievements"
                className={({ isActive }) =>
                  `sidebar-link ${isActive && location.search.includes('achievements') ? 'active' : ''}`
                }
              >
                <Award size={15} className="nav-icon" />
                <span>Achievements</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `sidebar-link ${isActive && !location.search ? 'active' : ''}`
                }
                end
              >
                <User size={15} className="nav-icon" />
                <span>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile?tab=settings"
                className={({ isActive }) =>
                  `sidebar-link ${isActive && location.search.includes('settings') ? 'active' : ''}`
                }
              >
                <Settings size={15} className="nav-icon" />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Sidebar Footer Tip ── */}
      <div className="sidebar-footer">
        <div className="debug-tip-card">
          <div className="tip-header">
            <Flame size={12} className="tip-icon" />
            // DAILY PRO TIP
          </div>
          <p className="tip-text">
            Avoid mutating state in React hooks. Always return new object and array references!
          </p>
        </div>
      </div>
    </aside>
  );
}
