import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
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
          <h1 className="auth-title">Create Developer Account</h1>
          <p className="auth-subtitle">Level up your software engineering debugging skills today.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name or Handle</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
            <label className="form-label">Create Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
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
                className="toggle-pw-btn"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
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
            className="btn btn-primary btn-block"
          >
            {submitting ? 'Creating Profile...' : 'Complete Registration'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-nav-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

