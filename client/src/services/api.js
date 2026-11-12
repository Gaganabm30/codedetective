import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HttpOnly session cookie on every request
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token if stored in memory/storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codedetective_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const challengeService = {
  getChallenges: (params) => api.get('/challenges', { params }),
  getChallengeById: (id) => api.get(`/challenges/${id}`),
  runCode: (id, data) => api.post(`/challenges/${id}/run`, data),
  submitChallenge: (id, data) => api.post(`/challenges/${id}/submit`, data),
  getSnippetChallenges: () => api.get('/challenges/snippets'),
};

export const aiService = {
  getHint: (challengeId, level, code) =>
    api.post('/ai/hint', { challengeId, level, code }),
  explainError: (challengeId, errorOutput, code) =>
    api.post('/ai/explain-error', { challengeId, errorOutput, code }),
  reviewCode: (challengeId, code) =>
    api.post('/ai/review', { challengeId, code }),
  askMentor: (challengeId, message, code, context) =>
    api.post('/ai/mentor', { challengeId, message, code, context }),
};

export const leaderboardService = {
  getLeaderboard: (timeframe = 'global') =>
    api.get(`/leaderboard?timeframe=${timeframe}`),
};

export const attemptsService = {
  getUserAttempts: () => api.get('/attempts'),
  getAttemptById: (id) => api.get(`/attempts/${id}`),
};

export default api;
