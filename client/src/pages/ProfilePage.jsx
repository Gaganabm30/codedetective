import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Zap,
  Flame,
  Target,
  CheckCircle,
  Award,
  Settings,
  Mail,
  Briefcase,
  Calendar,
  ShieldCheck,
  Edit3,
  Moon,
  Sun,
  Bell,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { INITIAL_ATTEMPTS } from '../data/userData';
import '../styles/profile.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabParam);

  const handleTabChange = (t) => {
    setActiveTab(t);
    if (t === 'overview') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', t);
    }
    setSearchParams(searchParams);
  };

  const badges = user?.badges || [
    { id: 'b1', name: 'Bug Hunter', icon: '🐛', description: 'Solved first 10 bugs', unlockedAt: 'Nov 2026' },
    { id: 'b2', name: 'Async Ninja', icon: '⚡', description: 'Fixed 5 Promise & Async issues', unlockedAt: 'Nov 2026' },
    { id: 'b3', name: '7-Day Streak', icon: '🔥', description: 'Debugged 7 consecutive days', unlockedAt: 'Nov 2026' },
    { id: 'b4', name: 'Stack Traced', icon: '🔍', description: 'Zero-hint resolution on Hard challenge', unlockedAt: 'Nov 2026' },
    { id: 'b5', name: 'CORS Master', icon: '🌐', description: 'Solved 3 full stack cross-origin bugs', unlockedAt: 'In Progress (2/3)' },
    { id: 'b6', name: 'Mongo Guru', icon: '🍃', description: 'Fixed complex aggregation pipelines', unlockedAt: 'In Progress (1/3)' }
  ];

  const skillMetrics = [
    { name: 'JavaScript & Closures', level: 90, color: '#5420C9' },
    { name: 'React State & Hooks', level: 94, color: '#0284C7' },
    { name: 'Node.js & Express APIs', level: 86, color: '#10B981' },
    { name: 'MongoDB Aggregations', level: 70, color: '#D97706' },
    { name: 'DSA & Algorithmic Logic', level: 78, color: '#7C4DFF' }
  ];

  return (
    <div className="profile-page">
      {/* Profile Header Hero */}
      <div className="profile-hero card">
        <div className="profile-hero-left">
          <img src={user?.avatar} alt={user?.name} className="profile-avatar-lg" />
          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{user?.name || 'Alex Chen'}</h1>
              <span className="badge badge-purple">Level {user?.level || 4} Detective</span>
            </div>
            <div className="profile-meta-row">
              <span className="p-meta-item">
                <Mail size={14} /> {user?.email || 'alex.chen@codedetective.dev'}
              </span>
              <span className="p-meta-item">
                <Briefcase size={14} /> {user?.role || 'Full Stack Engineer'}
              </span>
              <span className="p-meta-item">
                <Calendar size={14} /> Joined November 2026
              </span>
            </div>
          </div>
        </div>

        {/* Header Stats */}
        <div className="profile-hero-stats">
          <div className="p-stat-box">
            <span className="stat-num text-gradient">{user?.xp || 1420}</span>
            <span className="stat-lbl">XP EARNED</span>
          </div>
          <div className="p-stat-box">
            <span className="stat-num">{user?.solvedCount || 16}</span>
            <span className="stat-lbl">SOLVED</span>
          </div>
          <div className="p-stat-box">
            <span className="stat-num text-amber">{user?.streak || 7}d</span>
            <span className="stat-lbl">STREAK</span>
          </div>
          <div className="p-stat-box">
            <span className="stat-num text-success">{user?.accuracy || 92}%</span>
            <span className="stat-lbl">ACCURACY</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="profile-tabs-bar">
        <button
          onClick={() => handleTabChange('overview')}
          className={`p-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <User size={15} /> Overview & Skills
        </button>
        <button
          onClick={() => handleTabChange('achievements')}
          className={`p-tab ${activeTab === 'achievements' ? 'active' : ''}`}
        >
          <Award size={15} /> Achievements & Badges ({badges.length})
        </button>
        <button
          onClick={() => handleTabChange('settings')}
          className={`p-tab ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={15} /> Account Settings
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="profile-tab-content">
          <div className="profile-grid">
            {/* Left: Skill Distribution */}
            <div className="card p-card">
              <h3 className="p-card-title">Debugging Competencies</h3>
              <p className="p-card-sub">Measured through first-attempt accuracy across challenge tracks.</p>

              <div className="skills-bar-group">
                {skillMetrics.map((skill) => (
                  <div key={skill.name} className="skill-meter">
                    <div className="skill-meter-header">
                      <span className="meter-name">{skill.name}</span>
                      <span className="meter-val">{skill.level}%</span>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill"
                        style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recent Submissions */}
            <div className="card p-card">
              <h3 className="p-card-title">Recent Solved Defects</h3>
              <p className="p-card-sub">Your latest successful resolutions.</p>

              <div className="recent-subs-list">
                {INITIAL_ATTEMPTS.slice(0, 4).map((att) => (
                  <div key={att.id} className="rec-sub-row">
                    <div className="sub-left">
                      <span className="sub-title">{att.title}</span>
                      <span className="sub-time">
                        {att.testsPassed}/{att.testsTotal} passed • {att.timeSpent}
                      </span>
                    </div>
                    <span className="badge badge-easy">Verified</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="achievements-tab-content">
          <div className="badges-grid">
            {badges.map((badge) => (
              <div key={badge.id} className="badge-card card">
                <div className="badge-icon-wrap">{badge.icon}</div>
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-desc">{badge.description}</p>
                <span className="badge-footer-meta">{badge.unlockedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-tab-content card p-card">
          <h3 className="p-card-title">Preferences & Configuration</h3>

          <div className="settings-list">
            <div className="setting-item flex-between">
              <div>
                <span className="setting-title">Interface Appearance</span>
                <p className="setting-desc">Switch between Light SaaS and Dark charcoal themes.</p>
              </div>
              <button onClick={toggleTheme} className="btn btn-outline btn-sm">
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
              </button>
            </div>

            <div className="setting-item flex-between">
              <div>
                <span className="setting-title">AI Debugging Mentor Mode</span>
                <p className="setting-desc">Progressive Socratic assistance (Gemini 2.5 API).</p>
              </div>
              <span className="badge badge-easy">Active</span>
            </div>

            <div className="setting-item flex-between">
              <div>
                <span className="setting-title">Code Execution Environment</span>
                <p className="setting-desc">Node.js VM isolated sandboxing with timeout protection.</p>
              </div>
              <span className="badge badge-purple">Secured</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

