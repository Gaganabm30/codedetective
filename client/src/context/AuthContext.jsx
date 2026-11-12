import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Start with null — user must explicitly log in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codedetective_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('codedetective_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('codedetective_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codedetective_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('codedetective_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('codedetective_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const DEMO_USER = {
    id: 'usr_dev01',
    name: 'Alex Chen',
    email: 'alex.chen@codedetective.dev',
    role: 'Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 1420,
    level: 4,
    streak: 7,
    accuracy: 92,
    solvedCount: 16,
    rank: 12,
    completedChallenges: ['ch_fullstack_01', 'ch_auth_01', 'ch_dsa_01'],
    badges: [
      { id: 'b1', name: 'Bug Hunter', icon: '🐛', description: 'Solved first 10 bugs' },
      { id: 'b2', name: 'Async Ninja', icon: '⚡', description: 'Fixed 5 Promise & Async issues' },
      { id: 'b3', name: '7-Day Streak', icon: '🔥', description: 'Debugged 7 days in a row' },
      { id: 'b4', name: 'Stack Traced', icon: '🔍', description: 'Zero-hint resolution on Hard challenge' }
    ]
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Try real backend first
      try {
        const res = await axios.post('/api/auth/login', { email, password });
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setToken(res.data.token || 'auth_token');
          setLoading(false);
          return { success: true };
        }
      } catch (apiErr) {
        console.warn('API login fallback triggered:', apiErr.message);
      }

      // Demo fallback — works without backend
      const demoUser = {
        ...DEMO_USER,
        email: email || DEMO_USER.email,
        name: email ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : DEMO_USER.name,
      };
      setUser(demoUser);
      setToken('demo_token_xyz');
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      try {
        const res = await axios.post('/api/auth/register', { name, email, password });
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setToken(res.data.token || 'auth_token');
          setLoading(false);
          return { success: true };
        }
      } catch (apiErr) {
        console.warn('API register fallback triggered:', apiErr.message);
      }

      const newUser = {
        ...DEMO_USER,
        id: `usr_${Date.now()}`,
        name: name || 'Code Detective',
        email: email || 'detective@codedetective.dev',
        xp: 100,
        level: 1,
        streak: 1,
        accuracy: 100,
        solvedCount: 0,
        completedChallenges: [],
        badges: [{ id: 'b1', name: 'Fresh Detective', icon: '🕵️', description: 'Joined CodeDetective' }]
      };
      setUser(newUser);
      setToken('demo_token_new');
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codedetective_user');
    localStorage.removeItem('codedetective_token');
  };

  const addSolvedChallenge = (challengeId, xp = 150) => {
    if (!user) return;
    setUser(prev => {
      const alreadySolved = prev.completedChallenges?.includes(challengeId);
      const newCompleted = alreadySolved
        ? prev.completedChallenges
        : [...(prev.completedChallenges || []), challengeId];
      const newXp = (prev.xp || 0) + (alreadySolved ? 25 : xp);
      const newCount = alreadySolved ? prev.solvedCount : (prev.solvedCount || 0) + 1;
      const newLevel = Math.floor(newXp / 400) + 1;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        solvedCount: newCount,
        completedChallenges: newCompleted,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        addSolvedChallenge,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
