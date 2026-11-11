import { CHALLENGES } from '../../client/src/data/challengesData.js';

export const SERVER_CHALLENGES = CHALLENGES.map(ch => ({
  ...ch,
  challengeId: ch.id,
}));

export const SERVER_LEADERBOARD = [
  { rank: 1, name: 'Sarah Connor', username: '@sconnor_dev', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', xp: 4890, solved: 54, accuracy: 98, streak: 32, badge: 'Legendary Detective' },
  { rank: 2, name: 'Marcus Vance', username: '@marcus_v', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', xp: 4520, solved: 49, accuracy: 95, streak: 21, badge: 'Code Sherpa' },
  { rank: 3, name: 'Elena Rostova', username: '@elena_codes', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', xp: 4210, solved: 46, accuracy: 94, streak: 19, badge: 'Architecture Guru' },
  { rank: 4, name: 'Alex Chen', username: '@alexchen (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', xp: 1420, solved: 16, accuracy: 92, streak: 7, badge: 'Bug Hunter', isCurrentUser: true },
  { rank: 5, name: 'Tanya Patel', username: '@tanyap', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', xp: 1390, solved: 15, accuracy: 90, streak: 6, badge: 'Trace Master' }
];

export const SERVER_ATTEMPTS = [
  {
    id: 'att_01',
    challengeId: 'ch_auth_01',
    title: 'Auth API — Debug Login & Token Verification',
    category: 'Full Stack',
    difficulty: 'Medium',
    status: 'PASSED',
    score: 100,
    testsPassed: 4,
    testsTotal: 4,
    timeSpent: '18m 42s',
    date: '2026-11-10T14:22:00Z',
    hintsUsed: 1
  },
  {
    id: 'att_02',
    challengeId: 'ch_react_01',
    title: 'React Todo App — State Mutation & Stale Closures',
    category: 'React',
    difficulty: 'Easy',
    status: 'PASSED',
    score: 100,
    testsPassed: 3,
    testsTotal: 3,
    timeSpent: '12m 15s',
    date: '2026-11-09T18:10:00Z',
    hintsUsed: 0
  }
];
