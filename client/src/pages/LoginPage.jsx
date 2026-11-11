import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
      navigate('/dashboard');
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
    navigate('/dashboard');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="logo-icon-wrap sm">
              <Code2 size={20} />
            </div>
            <span className="brand-text">
              Code<span className="brand-accent">Detective</span>
            </span>
          </Link>
          <h1 className="auth-title">Welcome back, Detective</h1>
          <p className="auth-subtitle">Sign in to resume investigating complex codebases and passing test suites.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Login Pill */}
        <div className="demo-login-box">
          <div className="flex-between">
            <div className="flex-center flex-gap-sm">
              <Zap size={14} className="text-amber" />
              <span className="demo-text">Quick Portfolio Demo?</span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-sm btn-secondary"
            >
              One-Click Sign In
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Developer Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="name@company.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to demo inbox.'); }} className="forgot-link">
                Forgot password?
              </a>
            </div>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
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
                className="toggle-pw-btn"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-nav-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

