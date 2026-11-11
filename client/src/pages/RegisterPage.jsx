import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, User, Mail, Lock, Eye, EyeOff, ArrowRight, Terminal } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name or developer handle.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid developer email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    const res = await register(name, email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Try again.');
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
              <div className="auth-error-banner">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-fields">
              <div className="form-field-group">
                <label className="field-label">FULL NAME OR HANDLE</label>
                <div className="field-input-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    placeholder="Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                <label className="field-label">PASSWORD</label>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
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

              <div className="form-field-group">
                <label className="field-label">CONFIRM PASSWORD</label>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-auth-submit"
              >
                {submitting ? 'Creating Profile...' : 'Complete Registration'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-switch-footer">
              <span>Already registered? </span>
              <Link to="/login" className="auth-switch-link">
                Sign in
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
