import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Guards routes that require authentication.
 *
 * Usage 1 — wrap a layout element (DashboardLayout renders its own <Outlet>):
 *   <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 *
 * Usage 2 — wrap a standalone page:
 *   <Route path="/playground" element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} />
 *
 * When the user is NOT authenticated, redirects to /login and stores
 * the attempted URL in location.state.from so LoginPage can redirect back.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If children is provided render it, otherwise render nested <Outlet>
  return children ?? <Outlet />;
}
