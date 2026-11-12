import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Terminal, AlertCircle } from 'lucide-react';
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

  // Redirect back to originally requested destination or default to /dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid developer email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setSubmitting(true);
    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Invalid email or password.');
    }
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
              <h1 className="auth-heading">Welcome Back</h1>
              <p className="auth-subtext">Continue your debugging journey and tackle real-world defects.</p>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-fields" noValidate>
              <div className="form-field-group">
                <label className="field-label" htmlFor="login-email">
                  DEVELOPER EMAIL
                </label>
                <div className="field-input-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="alex@company.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <div className="flex-between">
                  <label className="field-label" htmlFor="login-password">
                    PASSWORD
                  </label>
                </div>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-pw-icon"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ background: 'none', border: 'none' }}
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
              <Link to="/register" state={{ from: location.state?.from }} className="auth-switch-link">
                Sign Up for an account
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
              assertions, and get progressive hints from your AI mentor.
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

            <div style={{ marginTop: '0.75rem' }}>
              <Link
                to="/register"
                state={{ from: location.state?.from }}
                className="auth-right-switch-btn"
              >
                Don't have an account? Sign Up →
              </Link>
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
