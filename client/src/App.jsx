import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ChallengesPage from './pages/ChallengesPage';
import PlaygroundPage from './pages/PlaygroundPage';
import DebugLabPage from './pages/DebugLabPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MyAttemptsPage from './pages/MyAttemptsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DocumentationPage from './pages/DocumentationPage';

// Global Styles
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public SaaS Layout (Navbar + Footer) ── */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/docs" element={<DocumentationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* ── Protected Dashboard Layout (Navbar + Sidebar) ── */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/debug-lab" element={<DebugLabPage />} />
              <Route path="/attempts" element={<MyAttemptsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* ── Protected Fullscreen IDE ── */}
            <Route
              path="/playground"
              element={
                <ProtectedRoute>
                  <PlaygroundPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playground/:id"
              element={
                <ProtectedRoute>
                  <PlaygroundPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/:id"
              element={
                <ProtectedRoute>
                  <PlaygroundPage />
                </ProtectedRoute>
              }
            />

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
