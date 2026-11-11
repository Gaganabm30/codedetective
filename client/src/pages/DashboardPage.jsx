import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  CheckCircle,
  Target,
  ArrowRight,
  Play,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Atom,
  Cpu,
  Database,
  Binary,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CHALLENGES } from '../data/challengesData';
import { INITIAL_ATTEMPTS } from '../data/userData';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();

  const solvedCount = user?.solvedCount || 16;
  const streak = user?.streak || 7;
  const xp = user?.xp || 1420;
  const accuracy = user?.accuracy || 92;

  // Active in-progress challenge
  const activeChallenge = CHALLENGES[0];
  const recommendedChallenges = CHALLENGES.slice(1, 4);

  const weeklyData = [
    { day: 'Mon', bugsFixed: 3, height: 60 },
    { day: 'Tue', bugsFixed: 2, height: 40 },
    { day: 'Wed', bugsFixed: 4, height: 80 },
    { day: 'Thu', bugsFixed: 5, height: 100 },
    { day: 'Fri', bugsFixed: 3, height: 60 },
    { day: 'Sat', bugsFixed: 2, height: 40 },
    { day: 'Sun', bugsFixed: 4, height: 80 }
  ];

  const skillBreakdown = [
    { name: 'Full Stack Systems', percentage: 88, color: '#5420C9' },
    { name: 'React & State', percentage: 95, color: '#0284C7' },
    { name: 'Node.js & Express', percentage: 82, color: '#10B981' },
    { name: 'MongoDB Queries', percentage: 68, color: '#D97706' },
    { name: 'DSA & Algorithms', percentage: 74, color: '#7C4DFF' }
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner card">
        <div className="welcome-left">
          <div className="welcome-tag">
            <Sparkles size={14} />
            <span>Detective Status: Active</span>
          </div>
          <h1 className="welcome-title">
            Welcome back, <span className="text-gradient">{user?.name || 'Alex Chen'}</span>!
          </h1>
          <p className="welcome-desc">
            You're on a <strong>{streak}-day debugging streak</strong>. You have 1 in-progress
            multi-file investigation waiting for review.
          </p>
        </div>
        <div className="welcome-right">
          <Link to={`/challenges/${activeChallenge.id}`} className="btn btn-primary">
            <Play size={16} />
            <span>Resume Debugging</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="kpi-card card">
          <div className="kpi-header">
            <span className="kpi-title">Challenges Solved</span>
            <div className="kpi-icon-wrap icon-purple">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="kpi-value">{solvedCount}</div>
          <div className="kpi-subtext text-success flex-gap-sm flex-center">
            <TrendingUp size={14} /> +3 this week
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-header">
            <span className="kpi-title">Debugging Streak</span>
            <div className="kpi-icon-wrap icon-amber">
              <Flame size={18} />
            </div>
          </div>
          <div className="kpi-value">{streak} <span className="kpi-unit">days</span></div>
          <div className="kpi-subtext">Personal best: 14 days</div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-header">
            <span className="kpi-title">Total XP Earned</span>
            <div className="kpi-icon-wrap icon-primary">
              <Zap size={18} />
            </div>
          </div>
          <div className="kpi-value">{xp} <span className="kpi-unit">XP</span></div>
          <div className="kpi-subtext">Level {user?.level || 4} Detective</div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-header">
            <span className="kpi-title">Test Accuracy</span>
            <div className="kpi-icon-wrap icon-green">
              <Target size={18} />
            </div>
          </div>
          <div className="kpi-value">{accuracy}%</div>
          <div className="kpi-subtext text-success">Top 8% on platform</div>
        </div>
      </div>

      {/* Main Grid: Continue Learning + Progress Charts */}
      <div className="dashboard-grid-main">
        {/* Left Column: Continue Learning & Recommended */}
        <div className="dashboard-col-left">
          {/* Continue Learning Card */}
          <div className="card section-card">
            <div className="section-card-header">
              <h2 className="card-section-title">Continue Learning</h2>
              <span className="badge badge-purple">In Progress</span>
            </div>

            <div className="active-challenge-box">
              <div className="ac-header">
                <span className="badge badge-medium">{activeChallenge.difficulty}</span>
                <span className="ac-tech">{activeChallenge.technology}</span>
                <span className="ac-time"><Clock size={13} /> {activeChallenge.timeEstimate}</span>
              </div>
              <h3 className="ac-title">{activeChallenge.title}</h3>
              <p className="ac-desc">{activeChallenge.shortDescription}</p>

              <div className="ac-progress-bar-wrap">
                <div className="ac-progress-info">
                  <span>Investigation Progress</span>
                  <span>75% (3/4 test cases passing)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="ac-actions">
                <Link to={`/challenges/${activeChallenge.id}`} className="btn btn-primary btn-sm">
                  Continue in Playground <ArrowRight size={14} />
                </Link>
                <Link to={`/debug-lab`} className="btn btn-outline btn-sm">
                  Quick Snippet Mode
                </Link>
              </div>
            </div>
          </div>

          {/* Recommended Challenges */}
          <div className="card section-card">
            <div className="section-card-header flex-between">
              <h2 className="card-section-title">Recommended for You</h2>
              <Link to="/challenges" className="view-all-link">
                View all ({CHALLENGES.length}) →
              </Link>
            </div>

            <div className="recommended-list">
              {recommendedChallenges.map((ch) => (
                <div key={ch.id} className="rec-challenge-row">
                  <div className="rec-info">
                    <div className="rec-badges">
                      <span className={`badge badge-${ch.difficulty.toLowerCase()}`}>
                        {ch.difficulty}
                      </span>
                      <span className="badge badge-outline">{ch.category}</span>
                      <span className="rec-xp"><Zap size={12} /> +{ch.xp} XP</span>
                    </div>
                    <Link to={`/challenges/${ch.id}`} className="rec-title">
                      {ch.title}
                    </Link>
                    <p className="rec-snippet">{ch.shortDescription}</p>
                  </div>
                  <Link to={`/challenges/${ch.id}`} className="btn btn-outline btn-sm">
                    Solve
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Activity & Skill Mastery */}
        <div className="dashboard-col-right">
          {/* Weekly Progress Chart */}
          <div className="card section-card">
            <div className="section-card-header flex-between">
              <div>
                <h2 className="card-section-title">Weekly Debugging Output</h2>
                <span className="card-subtitle">23 bugs resolved this week</span>
              </div>
              <TrendingUp size={18} className="text-success" />
            </div>

            <div className="weekly-chart">
              {weeklyData.map((d) => (
                <div key={d.day} className="chart-bar-col">
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${d.height}%` }}
                      title={`${d.bugsFixed} bugs fixed on ${d.day}`}
                    ></div>
                  </div>
                  <span className="bar-label">{d.day}</span>
                  <span className="bar-count">{d.bugsFixed}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Progress by Category */}
          <div className="card section-card">
            <div className="section-card-header">
              <h2 className="card-section-title">Skill Mastery Breakdown</h2>
              <span className="card-subtitle">Calculated by first-attempt test pass rates</span>
            </div>

            <div className="skills-list">
              {skillBreakdown.map((s) => (
                <div key={s.name} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{s.name}</span>
                    <span className="skill-pct">{s.percentage}%</span>
                  </div>
                  <div className="skill-track">
                    <div
                      className="skill-fill"
                      style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="card section-card">
            <div className="section-card-header flex-between">
              <h2 className="card-section-title">Recent Submissions</h2>
              <Link to="/attempts" className="view-all-link">History →</Link>
            </div>

            <div className="activity-timeline">
              {INITIAL_ATTEMPTS.slice(0, 3).map((att) => (
                <div key={att.id} className="timeline-item">
                  <div className={`status-badge-mini ${att.status === 'PASSED' ? 'pass' : 'fail'}`}>
                    {att.status === 'PASSED' ? 'PASS' : 'FAIL'}
                  </div>
                  <div className="timeline-details">
                    <span className="timeline-title">{att.title}</span>
                    <span className="timeline-meta">
                      {att.testsPassed}/{att.testsTotal} tests • Score: {att.score}% • {att.timeSpent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

