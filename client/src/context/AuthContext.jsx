import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate existing session on application startup
  useEffect(() => {
    let isMounted = true;

    async function checkCurrentSession() {
      try {
        const res = await authService.getMe();
        if (isMounted && res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // Unauthenticated visitor or expired session
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('codedetective_token');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkCurrentSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('codedetective_token', res.data.token);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Malformed login response' };
    } catch (err) {
      let errorMessage = 'Invalid email or password.';
      if (!err.response || err.code === 'ERR_NETWORK') {
        errorMessage =
          'Cannot connect to the CodeDetective backend server. Please ensure the backend is running on port 5000 (cd server && npm run dev).';
      } else if (err.response) {
        const data = err.response.data;
        if (data && typeof data === 'object') {
          errorMessage = data.error || data.message || 'Authentication failed.';
        } else if (typeof data === 'string') {
          if (data.includes('ECONNREFUSED') || data.includes('proxy error') || data.startsWith('<!DOCTYPE')) {
            errorMessage =
              'Backend server is not running on port 5000. Please start it with: cd server && npm run dev';
          } else {
            errorMessage = data;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('codedetective_token', res.data.token);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Malformed registration response' };
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (!err.response || err.code === 'ERR_NETWORK') {
        errorMessage =
          'Cannot connect to the CodeDetective backend server. Please ensure the backend is running on port 5000 (cd server && npm run dev).';
      } else if (err.response) {
        const data = err.response.data;
        if (data && typeof data === 'object') {
          errorMessage = data.error || data.message || 'Registration failed.';
        } else if (typeof data === 'string') {
          if (data.includes('ECONNREFUSED') || data.includes('proxy error') || data.startsWith('<!DOCTYPE')) {
            errorMessage =
              'Backend server is not running on port 5000. Please start it with: cd server && npm run dev';
          } else {
            errorMessage = data;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API cleanup notice:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem('codedetective_token');
    }
  };

  const addSolvedChallenge = (challengeId, xp = 150) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return prev;
      const solvedList = prev.solvedChallenges || prev.completedChallenges || [];
      const alreadySolved = solvedList.includes(challengeId);
      const updatedList = alreadySolved ? solvedList : [...solvedList, challengeId];
      const newXp = (prev.totalXP || prev.xp || 0) + (alreadySolved ? 25 : xp);
      const newLevel = Math.max(1, Math.floor(newXp / 400) + 1);

      return {
        ...prev,
        totalXP: newXp,
        xp: newXp,
        level: newLevel,
        solvedChallenges: updatedList,
        completedChallenges: updatedList,
        solvedCount: updatedList.length,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        addSolvedChallenge,
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
