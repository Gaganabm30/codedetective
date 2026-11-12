import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle2, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page the user tried to visit, or /dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid developer email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex.chen@codedetective.dev');
    setPassword('secret123');
    setSubmitting(true);
    await login('alex.chen@codedetective.dev', 'secret123');
    setSubmitting(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-container">
        {/* LEFT COLUMN: White Background Form */}
        <div className="auth-left-pane">
          <div className="auth-pane-content">
            <Link to="/" className="auth-brand-head">
              <div className="logo-box">
                <span className="code-brackets">&lt;/&gt;</span>
              </div>
              <span className="brand-name">CodeDetective</span>
            </Link>

            <div className="auth-form-header">
              <div className="auth-tech-tag">// AUTHENTICATION PIPELINE</div>
              <h1 className="auth-heading">Sign In to CodeDetective</h1>
              <p className="auth-subtext">Access your multi-file debugging workspace and challenge audit history.</p>
            </div>

            {error && (
              <div className="auth-error-banner">
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Pill */}
            <div className="auth-demo-box">
              <div className="flex-between">
                <div className="flex-center flex-gap-sm">
                  <Zap size={14} className="text-amber" />
                  <span className="demo-text">Recruiter / Portfolio Demo:</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="btn btn-sm btn-secondary demo-click-btn"
                >
                  One-Click Sign In
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-fields">
              <div className="form-field-group">
                <label className="field-label">DEVELOPER EMAIL</label>
                <div className="field-input-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    placeholder="name@company.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <div className="flex-between">
                  <label className="field-label">PASSWORD</label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Reset link simulated for demo environment.'); }}
                    className="forgot-password-link"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-pw-icon"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-auth-submit"
              >
                {submitting ? 'Verifying Credentials...' : 'Sign In to Workspace'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-switch-footer">
              <span>New detective? </span>
              <Link to="/register" className="auth-switch-link">
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dark Charcoal / Deep Purple Showcase */}
        <div className="auth-right-pane">
          <div className="auth-right-content">
            <div className="right-badge-pill">
              <Terminal size={14} />
              <span>// PLATFORM RUNTIME</span>
            </div>

            <h2 className="right-hero-title">
              Think Like a Developer.<br />
              <span className="accent-text">Debug Like a Pro.</span>
            </h2>

            <p className="right-hero-desc">
              Receive realistic codebases with intentional defects across Full Stack,
              React, Node.js, MongoDB, and DSA. Investigate stack traces, pass automated
              assertions, and get progressive hints from your AI debugging mentor.
            </p>

            <div className="right-feature-checklist">
              <div className="check-row">
                <div className="sq-check">&#10003;</div>
                <span>Isolated Node.js VM Sandboxed Code Execution</span>
              </div>
              <div className="check-row">
                <div className="sq-check">&#10003;</div>
                <span>Multi-File Monaco IDE with Tabs &amp; Terminal</span>
              </div>
              <div className="check-row">
                <div className="sq-check">&#10003;</div>
                <span>4-Tier Socratic AI Mentorship (Gemini API)</span>
              </div>
            </div>

            <div className="right-pane-footer flex-between">
              <span className="rp-ver">v1.2.0-PRO</span>
              <span className="rp-sec">&#128274; 256-BIT ISOLATED VM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
