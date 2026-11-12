import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute
 * Only accessible to unauthenticated visitors.
 * If already authenticated, redirects directly to /dashboard or the originally requested destination.
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--text-primary, #17131F)',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3px solid #24202C',
            backgroundColor: '#FFFFFF',
            boxShadow: '4px 4px 0 #24202C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#5420C9',
          }}
        >
          &lt;/&gt;
        </div>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          // VERIFYING SESSION STATUS...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  return children ?? <Outlet />;
}

