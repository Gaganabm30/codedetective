import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ArrowRight,
  Filter,
  Search,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { INITIAL_ATTEMPTS } from '../data/userData';
import '../styles/attempts.css';

export default function MyAttemptsPage() {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PASSED' | 'FAILED'
  const [search, setSearch] = useState('');

  const attempts = INITIAL_ATTEMPTS.filter(att => {
    if (filter !== 'ALL' && att.status !== filter) return false;
    if (search.trim() && !att.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalCount = INITIAL_ATTEMPTS.length;
  const passedCount = INITIAL_ATTEMPTS.filter(a => a.status === 'PASSED').length;
  const avgScore = Math.round(
    INITIAL_ATTEMPTS.reduce((acc, curr) => acc + curr.score, 0) / (totalCount || 1)
  );

  return (
    <div className="attempts-page">
      {/* Header Banner */}
      <div className="attempts-header card">
        <div className="att-header-left">
          <div className="att-badge">
            <History size={15} />
            <span>Audit Trail & Submission History</span>
          </div>
          <h1 className="att-title">My Debugging Attempts</h1>
          <p className="att-desc">
            Review past test executions, assertion pass rates, and time spent diagnosing
            each multi-file and snippet challenge.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="att-stats-summary">
          <div className="att-stat-item">
            <span className="att-stat-val">{totalCount}</span>
            <span className="att-stat-lbl">Total Attempts</span>
          </div>
          <div className="att-stat-item">
            <span className="att-stat-val text-success">
              {Math.round((passedCount / (totalCount || 1)) * 100)}%
            </span>
            <span className="att-stat-lbl">Pass Rate</span>
          </div>
          <div className="att-stat-item">
            <span className="att-stat-val text-gradient">{avgScore}%</span>
            <span className="att-stat-lbl">Avg Score</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="attempts-controls card">
        <div className="search-wrap">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Filter past submissions by challenge name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="att-search-input"
          />
        </div>

        <div className="att-status-filters">
          {['ALL', 'PASSED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`filter-btn ${filter === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Attempts Table */}
      <div className="card attempts-table-card">
        <div className="table-responsive">
          <table className="attempts-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Challenge Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Assertions</th>
                <th>Score</th>
                <th>Time Spent</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((att) => {
                const isPass = att.status === 'PASSED';
                const formattedDate = new Date(att.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <tr key={att.id} className="attempt-row">
                    <td>
                      <span className={`status-pill ${isPass ? 'passed' : 'failed'}`}>
                        {isPass ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {att.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/challenges/${att.challengeId}`} className="att-challenge-link">
                        {att.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-purple">{att.category}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${att.difficulty.toLowerCase()}`}>
                        {att.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="test-counts">
                        {att.testsPassed} / {att.testsTotal}
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${att.score === 100 ? 'perfect' : ''}`}>
                        {att.score}%
                      </span>
                    </td>
                    <td>
                      <div className="time-cell">
                        <Clock size={13} className="text-muted" />
                        <span>{att.timeSpent}</span>
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">{formattedDate}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/challenges/${att.challengeId}`}
                        className="btn btn-sm btn-outline review-btn"
                      >
                        <span>{isPass ? 'Review Solution' : 'Re-attempt'}</span>
                        <ArrowRight size={13} />
                      </Link>
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

