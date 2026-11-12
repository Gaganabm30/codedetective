import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Bug,
  Terminal,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Cpu,
  Database,
  Binary,
  Atom,
  Play,
  RotateCcw,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export default function LandingPage() {
  const [activeCodeTab, setActiveCodeTab] = useState('buggy');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // CTA: go to challenges if logged in, else go to login
  const handleStartDebugging = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/challenges');
    } else {
      navigate('/login', { state: { from: { pathname: '/challenges' } } });
    }
  };

  // Playground CTA: protected too
  const handleLaunchPlayground = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/playground');
    } else {
      navigate('/login', { state: { from: { pathname: '/playground' } } });
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI-Powered Developer Debugging Platform</span>
          </div>

          <h1 className="hero-heading">
            Think Like a Developer.<br />
            <span className="text-gradient">Debug Like a Pro.</span>
          </h1>

          <p className="hero-subtitle">
            Most platforms teach you to write code from scratch. CodeDetective trains you for the
            real world: navigating existing codebases, reproducing elusive bugs, diagnosing root causes,
            and passing automated test suites with guidance from an AI mentor.
          </p>

          <div className="hero-cta-group">
            <button onClick={handleStartDebugging} className="btn btn-primary btn-lg">
              <span>Start Debugging</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={handleLaunchPlayground} className="btn btn-secondary btn-lg">
              <Terminal size={18} />
              <span>Launch Playground</span>
            </button>
          </div>

          {/* Interactive Code Diff Preview Showcase */}
          <div className="hero-ide-preview">
            <div className="ide-preview-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="ide-preview-tabs">
                <button
                  className={`preview-tab ${activeCodeTab === 'buggy' ? 'active-buggy' : ''}`}
                  onClick={() => setActiveCodeTab('buggy')}
                >
                  <Bug size={14} /> buggy_auth_middleware.js
                </button>
                <button
                  className={`preview-tab ${activeCodeTab === 'fixed' ? 'active-fixed' : ''}`}
                  onClick={() => setActiveCodeTab('fixed')}
                >
                  <CheckCircle2 size={14} /> fixed_auth_middleware.js
                </button>
              </div>
              <span className="ide-lang-badge">JavaScript</span>
            </div>

            <div className="ide-preview-content">
              {activeCodeTab === 'buggy' ? (
                <pre className="code-block">
                  <code>{`// ⚠️ BUGGY IMPLEMENTATION
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing header' });

  // ❌ DEFECT: Splits on space and takes index 0 ('Bearer') instead of the token string!
  const token = authHeader.split(' ')[0];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // ❌ Fails silently with 401 on every request
    res.status(401).json({ error: 'Token rejected' });
  }
}`}</code>
                </pre>
              ) : (
                <pre className="code-block fixed-highlight">
                  <code>{`// ✅ FIXED IMPLEMENTATION
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing header' });

  // ✨ RESOLVED: Extracts token at index 1 and handles whitespace
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
}`}</code>
                </pre>
              )}
            </div>

            <div className="ide-preview-footer">
              <div className="terminal-status">
                {activeCodeTab === 'buggy' ? (
                  <span className="text-error flex-gap-sm flex-center">
                    <span className="status-dot" style={{ backgroundColor: 'var(--error)' }}></span>
                    Test Suite: 1 passed, 3 failed (TypeError: malformed token)
                  </span>
                ) : (
                  <span className="text-success flex-gap-sm flex-center">
                    <span className="status-dot" style={{ backgroundColor: 'var(--success)' }}></span>
                    Test Suite: 4 of 4 tests passed (100% assertions green)
                  </span>
                )}
              </div>
              <Link to="/challenges/ch_auth_01" className="btn btn-sm btn-outline">
                Inspect Full Challenge →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">120+</span>
              <span className="stat-label">Real-World Bug Challenges</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">8 Categories</span>
              <span className="stat-label">Full Stack to DSA & Mongo</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">98.4%</span>
              <span className="stat-label">Evaluation Precision</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4 Tiers</span>
              <span className="stat-label">Progressive Socratic Hints</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">The Engineering Debugging Workflow</h2>
            <p className="section-desc">
              Simulate real-life developer incidents from incident triage to verified hotfix.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card card">
              <div className="step-badge">01</div>
              <div className="step-icon-wrap">
                <Layers className="step-icon" size={24} />
              </div>
              <h3 className="step-title">Explore Real Codebases</h3>
              <p className="step-text">
                Receive production-like codebases containing real-world defects: race conditions,
                broken middleware pipelines, state mutations, and uncast database queries.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-badge">02</div>
              <div className="step-icon-wrap">
                <Bug className="step-icon" size={24} />
              </div>
              <h3 className="step-title">Triage & Locate Defect</h3>
              <p className="step-text">
                Inspect stack traces, terminal output, and failing test assertions. Read through
                multi-file relationships without solutions being handed to you.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-badge">03</div>
              <div className="step-icon-wrap">
                <Sparkles className="step-icon" size={24} />
              </div>
              <h3 className="step-title">AI Socratic Mentorship</h3>
              <p className="step-text">
                Stuck on a tricky error? CodeDetective's Gemini-powered mentor provides
                progressive 4-tier hints without spoiling the answer immediately.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-badge">04</div>
              <div className="step-icon-wrap">
                <CheckCircle2 className="step-icon" size={24} />
              </div>
              <h3 className="step-title">Verify & Pass Test Suite</h3>
              <p className="step-text">
                Run automated assertion suites in an isolated sandbox. Earn XP, increase your
                accuracy score, and climb the global developer leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Categories Preview */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <h2 className="section-title">Explore Core Debugging Tracks</h2>
              <p className="section-desc">From frontend state glitches to complex full-stack microservices.</p>
            </div>
            <Link to="/challenges" className="btn btn-outline">
              View All 120+ Challenges →
            </Link>
          </div>

          <div className="categories-grid">
            <Link to="/challenges?category=Full Stack" className="category-card card">
              <div className="cat-icon-wrap bg-purple">
                <Layers size={22} />
              </div>
              <h3 className="cat-title">Full Stack Systems</h3>
              <p className="cat-desc">
                Debug CORS mismatch, JWT header splitting, payload validation, and client-server sync.
              </p>
              <div className="cat-footer">
                <span className="badge badge-purple">Multi-file</span>
                <span className="cat-count">24 Challenges</span>
              </div>
            </Link>

            <Link to="/challenges?category=React" className="category-card card">
              <div className="cat-icon-wrap bg-blue">
                <Atom size={22} />
              </div>
              <h3 className="cat-title">React & UI State</h3>
              <p className="cat-desc">
                Master state immutability, infinite re-render loops, stale closures in useEffect, and key reconciliation.
              </p>
              <div className="cat-footer">
                <span className="badge badge-purple">Components</span>
                <span className="cat-count">18 Challenges</span>
              </div>
            </Link>

            <Link to="/challenges?category=Node.js" className="category-card card">
              <div className="cat-icon-wrap bg-green">
                <Cpu size={22} />
              </div>
              <h3 className="cat-title">Node.js & Express</h3>
              <p className="cat-desc">
                Fix unhandled promise rejections, middleware next() pipelines, stream backpressure, and async error handlers.
              </p>
              <div className="cat-footer">
                <span className="badge badge-purple">APIs</span>
                <span className="cat-count">20 Challenges</span>
              </div>
            </Link>

            <Link to="/challenges?category=Database" className="category-card card">
              <div className="cat-icon-wrap bg-amber">
                <Database size={22} />
              </div>
              <h3 className="cat-title">MongoDB & Mongoose</h3>
              <p className="cat-desc">
                Resolve uncast ObjectId in $match, nested aggregation pipeline grouping, index bottlenecks, and schema hooks.
              </p>
              <div className="cat-footer">
                <span className="badge badge-purple">Aggregation</span>
                <span className="cat-count">16 Challenges</span>
              </div>
            </Link>

            <Link to="/challenges?category=DSA" className="category-card card">
              <div className="cat-icon-wrap bg-indigo">
                <Binary size={22} />
              </div>
              <h3 className="cat-title">DSA & Algorithms</h3>
              <p className="cat-desc">
                Diagnose edge-case flaws, hash collision oversights, off-by-one pointer errors, and exponential complexity bugs.
              </p>
              <div className="cat-footer">
                <span className="badge badge-purple">Algorithms</span>
                <span className="cat-count">22 Challenges</span>
              </div>
            </Link>

            <Link to="/debug-lab" className="category-card card special-card">
              <div className="cat-icon-wrap bg-primary">
                <Terminal size={22} />
              </div>
              <h3 className="cat-title">Interactive Debug Lab</h3>
              <p className="cat-desc">
                Quick-fire snippet challenges to drill closures, event loops, prototypes, and JavaScript runtime behaviors.
              </p>
              <div className="cat-footer">
                <span className="badge badge-purple">Interactive</span>
                <span className="cat-count">Play Now →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Test Your Debugging Acumen?</h2>
              <p className="cta-text">
                Join thousands of software engineers leveling up their codebase reading,
                troubleshooting speed, and production debugging skills.
              </p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Free Account
                </Link>
                <Link to="/playground" className="btn btn-outline btn-lg">
                  Open IDE Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

