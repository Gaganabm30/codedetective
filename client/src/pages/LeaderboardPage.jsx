import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Zap,
  Target,
  CheckCircle,
  Award,
  Crown,
  Search,
  Filter
} from 'lucide-react';
import { LEADERBOARD_USERS } from '../data/userData';
import { useAuth } from '../context/AuthContext';
import '../styles/leaderboard.css';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('global'); // 'global' | 'weekly' | 'monthly'
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const filteredUsers = LEADERBOARD_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="rank-crown gold"><Crown size={18} /></span>;
    if (rank === 2) return <span className="rank-crown silver"><Medal size={18} /></span>;
    if (rank === 3) return <span className="rank-crown bronze"><Medal size={18} /></span>;
    return <span className="rank-number">#{rank}</span>;
  };

  return (
    <div className="leaderboard-page container">
      {/* Header Banner */}
      <div className="leaderboard-header card">
        <div className="lb-header-text">
          <div className="lb-badge">
            <Trophy size={15} />
            <span>Developer Hall of Fame</span>
          </div>
          <h1 className="lb-title">Global Debugging Leaderboard</h1>
          <p className="lb-desc">
            Compete with engineers worldwide. Earn XP by resolving multi-file system defects,
            minimizing hints used, and maintaining your daily debugging streak.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="timeframe-tabs">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`time-tab ${timeframe === 'weekly' ? 'active' : ''}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`time-tab ${timeframe === 'monthly' ? 'active' : ''}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('global')}
            className={`time-tab ${timeframe === 'global' ? 'active' : ''}`}
          >
            All-Time Global
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="podium-grid">
        {LEADERBOARD_USERS.slice(0, 3).map((podiumUser) => (
          <div
            key={podiumUser.rank}
            className={`podium-card card rank-${podiumUser.rank}`}
          >
            <div className="podium-rank-badge">
              {getRankBadge(podiumUser.rank)}
            </div>
            <img src={podiumUser.avatar} alt={podiumUser.name} className="podium-avatar" />
            <h3 className="podium-name">{podiumUser.name}</h3>
            <span className="podium-handle">{podiumUser.username}</span>
            <span className="badge badge-purple">{podiumUser.badge}</span>

            <div className="podium-stats">
              <div className="p-stat">
                <span className="p-val text-gradient">{podiumUser.xp}</span>
                <span className="p-lbl">XP</span>
              </div>
              <div className="p-stat">
                <span className="p-val">{podiumUser.solved}</span>
                <span className="p-lbl">Solved</span>
              </div>
              <div className="p-stat">
                <span className="p-val">{podiumUser.accuracy}%</span>
                <span className="p-lbl">Accuracy</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table-card card">
        <div className="table-search-bar">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search detective by name or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="table-search-input"
          />
        </div>

        <div className="table-responsive">
          <table className="lb-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Developer</th>
                <th>Streak</th>
                <th>Challenges</th>
                <th>Accuracy</th>
                <th style={{ textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isCurrent = u.isCurrentUser || u.username.includes('alexchen');
                return (
                  <tr
                    key={u.rank}
                    className={`lb-row ${isCurrent ? 'current-user-row' : ''}`}
                  >
                    <td>
                      <div className="rank-cell">
                        {getRankBadge(u.rank)}
                      </div>
                    </td>
                    <td>
                      <div className="user-info-cell">
                        <img src={u.avatar} alt={u.name} className="user-avatar-sm" />
                        <div className="user-names">
                          <span className="name-bold">
                            {u.name} {isCurrent && <span className="you-pill">You</span>}
                          </span>
                          <span className="username-sub">{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="streak-cell">
                        <Flame size={15} className="text-amber" />
                        <span>{u.streak}d</span>
                      </div>
                    </td>
                    <td>
                      <span className="solved-count">{u.solved} solved</span>
                    </td>
                    <td>
                      <span className="accuracy-badge">{u.accuracy}%</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="xp-highlight">
                        <Zap size={14} /> {u.xp} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

