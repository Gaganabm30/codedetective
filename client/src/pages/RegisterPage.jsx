import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Terminal,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Password strength evaluation
  const evaluateStrength = (pw) => {
    if (!pw) return { score: 0, label: '', bars: 0, class: '' };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 1) return { score, label: 'Weak', bars: 1, class: 'active-weak' };
    if (score <= 2) return { score, label: 'Fair', bars: 2, class: 'active-weak' };
    if (score === 3) return { score, label: 'Good', bars: 3, class: 'active-medium' };
    return { score, label: 'Strong', bars: 4, class: 'active-strong' };
  };

  const strength = evaluateStrength(password);
  const hasMinLength = password.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name or developer handle.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid developer email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setSubmitting(true);
    const res = await register(name.trim(), email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      // Immediately navigate to dashboard as requested
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.error || 'Registration failed. Please try again.');
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
              <div className="auth-tech-tag">// DEVELOPER ONBOARDING</div>
              <h1 className="auth-heading">Create Detective Profile</h1>
              <p className="auth-subtext">Level up your software engineering debugging skills today.</p>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-fields" noValidate>
              <div className="form-field-group">
                <label className="field-label" htmlFor="reg-name">
                  FULL NAME OR HANDLE
                </label>
                <div className="field-input-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label" htmlFor="reg-email">
                  DEVELOPER EMAIL
                </label>
                <div className="field-input-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="reg-email"
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
                <label className="field-label" htmlFor="reg-password">
                  PASSWORD
                </label>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="pw-strength-meter">
                    <div className="pw-strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`pw-strength-bar ${i <= strength.bars ? strength.class : ''}`}
                        />
                      ))}
                    </div>
                    <div className="pw-strength-label">
                      <span>STRENGTH: {strength.label}</span>
                      <span>{password.length} CHARS</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-field-group">
                <label className="field-label" htmlFor="reg-confirm-password">
                  CONFIRM PASSWORD
                </label>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="reg-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={submitting}
                  />
                </div>

                {/* Password requirements inline checklist */}
                <div className="pw-requirements-list">
                  <div className={`pw-req-item ${hasMinLength ? 'met' : ''}`}>
                    {hasMinLength ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>Minimum 6 characters</span>
                  </div>
                  <div className={`pw-req-item ${hasNumberOrSymbol ? 'met' : ''}`}>
                    {hasNumberOrSymbol ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>Includes number or special character</span>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className={`pw-req-item ${passwordsMatch ? 'met' : ''}`}>
                      {passwordsMatch ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-auth-submit"
              >
                {submitting ? 'Creating Profile in MongoDB...' : 'Complete Registration'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-switch-footer">
              <span>Already registered? </span>
              <Link to="/login" state={{ from: location.state?.from }} className="auth-switch-link">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dark Charcoal / Deep Purple Showcase */}
        <div className="auth-right-pane">
          <div className="auth-right-content">
            <div className="right-badge-pill">
              <Terminal size={14} />
              <span>// WHY CODEDETECTIVE</span>
            </div>

            <h2 className="right-hero-title">
              Writing code is easy.<br />
              <span className="accent-text">Finding bugs is an art.</span>
            </h2>

            <p className="right-hero-desc">
              Most platforms make you write boilerplate functions. CodeDetective
              tests your capacity to read existing codebases, locate race conditions,
              fix memory leaks, and pass production assertion suites.
            </p>

            <div className="right-feature-checklist">
              <div className="check-row">
                <div className="sq-check">&#10003;</div>
                <span>Full-Stack, React, Node.js, MongoDB &amp; DSA Tracks</span>
              </div>
              <div className="check-row">
                <div className="sq-check">&#10003;</div>
                <span>Real-World Multi-File Incident Assessments</span>
              </div>
              <div className="check-row">
                <div className="sq-check">&#10003;</div>
                <span>Global Leaderboard &amp; Verifiable XP Badges</span>
              </div>
            </div>

            {/* Clearly Visible Switch Button */}
            <div style={{ marginTop: '0.75rem' }}>
              <Link
                to="/login"
                state={{ from: location.state?.from }}
                className="auth-right-switch-btn"
              >
                Already have an account? Sign In →
              </Link>
            </div>

            <div className="right-pane-footer flex-between">
              <span className="rp-ver">FREE COMMUNITY EDITION</span>
              <span className="rp-sec">&#128274; ISOLATED RUNTIME</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
