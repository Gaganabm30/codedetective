import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  PlayCircle,
  Layers,
  Code2,
  FlaskConical,
  Box,
  Monitor,
  Sparkles,
  BarChart2,
  Key,
  Database,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';
import '../styles/docs.css';

export default function DocumentationPage() {
  const [activeItem, setActiveItem] = useState('overview');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testPhase, setTestPhase] = useState(5); // 5 passing, 1 failing, 1 running

  const handleSimulateRun = () => {
    setIsTestRunning(true);
    setTestPhase(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setTestPhase(current);
      if (current >= 6) {
        clearInterval(interval);
        setIsTestRunning(false);
      }
    }, 400);
  };

  return (
    <div className="docs-page-container">
      <div className="docs-layout-grid">
        {/* LEFT SIDEBAR: DOCUMENTATION INDEX */}
        <aside className="docs-index-sidebar card">
          <div className="index-header flex-between">
            <span className="index-title">DOCUMENTATION INDEX</span>
            <span className="index-path-tag">/docs</span>
          </div>

          {/* Active Platform Overview Guide Box */}
          <div
            onClick={() => setActiveItem('overview')}
            className={`platform-overview-box ${activeItem === 'overview' ? 'active' : ''}`}
          >
            <div className="po-left flex-center flex-gap-sm">
              <BookOpen size={16} />
              <span className="po-title">Platform Overview</span>
            </div>
            <span className="po-guide-badge">Guide</span>
          </div>

          {/* Section: GETTING STARTED */}
          <div className="index-section">
            <div className="section-head flex-between">
              <span className="head-label">
                <ChevronDown size={14} className="chevron-icon" /> GETTING STARTED
              </span>
              <span className="head-sub">Set up CodeDetective</span>
            </div>
            <ul className="index-links-list">
              <li>
                <button
                  onClick={() => setActiveItem('account')}
                  className={`index-item-btn ${activeItem === 'account' ? 'active' : ''}`}
                >
                  <PlayCircle size={14} className="item-icon" />
                  <span className="item-name">Create an account</span>
                  <span className="item-time-pill">2 min</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('challenges')}
                  className={`index-item-btn ${activeItem === 'challenges' ? 'active' : ''}`}
                >
                  <Layers size={14} className="item-icon" />
                  <span className="item-name">Explore challenges</span>
                  <span className="item-time-pill">Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('debug')}
                  className={`index-item-btn ${activeItem === 'debug' ? 'active' : ''}`}
                >
                  <Code2 size={14} className="item-icon" />
                  <span className="item-name">Run your first debug</span>
                  <span className="item-time-pill">5 min</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('tests')}
                  className={`index-item-btn ${activeItem === 'tests' ? 'active' : ''}`}
                >
                  <FlaskConical size={14} className="item-icon" />
                  <span className="item-name">Understand test cases</span>
                  <span className="item-time-pill">3 min</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section: PLATFORM FEATURES */}
          <div className="index-section">
            <div className="section-head flex-between">
              <span className="head-label">
                <ChevronDown size={14} className="chevron-icon" /> PLATFORM FEATURES
              </span>
              <span className="head-sub">Explore core features</span>
            </div>
            <ul className="index-links-list">
              <li>
                <button
                  onClick={() => setActiveItem('debug-lab')}
                  className={`index-item-btn ${activeItem === 'debug-lab' ? 'active' : ''}`}
                >
                  <Box size={14} className="item-icon" />
                  <span className="item-name">Debug Lab</span>
                  <span className="item-time-pill">Docs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('playground')}
                  className={`index-item-btn ${activeItem === 'playground' ? 'active' : ''}`}
                >
                  <Monitor size={14} className="item-icon" />
                  <span className="item-name">Playground (Projects)</span>
                  <span className="item-time-pill">Docs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('mentor')}
                  className={`index-item-btn ${activeItem === 'mentor' ? 'active' : ''}`}
                >
                  <Sparkles size={14} className="item-icon" />
                  <span className="item-name">AI Debugging Mentor</span>
                  <span className="item-time-pill">Docs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('progress')}
                  className={`index-item-btn ${activeItem === 'progress' ? 'active' : ''}`}
                >
                  <BarChart2 size={14} className="item-icon" />
                  <span className="item-name">Progress & Leaderboard</span>
                  <span className="item-time-pill">Docs</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section: REFERENCE */}
          <div className="index-section">
            <div className="section-head flex-between">
              <span className="head-label">
                <ChevronDown size={14} className="chevron-icon" /> REFERENCE
              </span>
              <span className="head-sub">Configuration & help</span>
            </div>
            <ul className="index-links-list">
              <li>
                <button
                  onClick={() => setActiveItem('api')}
                  className={`index-item-btn ${activeItem === 'api' ? 'active' : ''}`}
                >
                  <Key size={14} className="item-icon" />
                  <span className="item-name">API Reference</span>
                  <span className="item-time-pill">API</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('schema')}
                  className={`index-item-btn ${activeItem === 'schema' ? 'active' : ''}`}
                >
                  <Database size={14} className="item-icon" />
                  <span className="item-name">Database Schema</span>
                  <span className="item-time-pill">Schema</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveItem('faq')}
                  className={`index-item-btn ${activeItem === 'faq' ? 'active' : ''}`}
                >
                  <HelpCircle size={14} className="item-icon" />
                  <span className="item-name">FAQ & Troubleshooting</span>
                  <span className="item-time-pill">Help</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* RIGHT MAIN ARTICLE AREA */}
        <main className="docs-main-article">
          {/* Top Article Header Box */}
          <div className="article-header-card card">
            <div className="article-badge-chip">
              <Box size={14} />
              <span>Architecture Case Study • Scalable Debugging Platform</span>
            </div>

            <h1 className="article-title">
              How CodeDetective Handles Code Execution &amp; Evaluation
            </h1>

            <p className="article-lead">
              A deep dive into how we securely run user code, execute test cases and evaluate
              solutions in a real-world, scalable environment without compromising security or performance.
            </p>
          </div>

          {/* System Design Heading Marker */}
          <div className="system-design-marker-row flex-between">
            <div className="sd-left flex-center flex-gap-sm">
              <span className="purple-square-marker"></span>
              <h2 className="sd-heading">System Design: Code Execution &amp; Evaluation Pipeline</h2>
            </div>
            <span className="sd-figure-tag">Figure 1.0 &amp; 1.1</span>
          </div>

          {/* Two Side-By-Side Visual Cards */}
          <div className="system-figures-grid">
            {/* FIGURE 1.0: Execution Pipeline Logs */}
            <div className="figure-box-card card">
              <div className="figure-top-bar flex-between">
                <h3 className="figure-card-title">Execution Pipeline Logs</h3>
                <span className="badge badge-outline figure-badge">Test Execution</span>
              </div>

              {/* Inner Live Execution Window */}
              <div className="inner-preview-window">
                <div className="preview-window-head flex-between">
                  <div className="mini-brand flex-center flex-gap-sm">
                    <div className="mini-logo-box">&lt;/&gt;</div>
                    <span className="mini-brand-text">CodeDetective</span>
                  </div>
                  <div className="mini-nav-links">
                    <span>Challenges</span>
                    <span>Playground</span>
                    <span>Leaderboard</span>
                  </div>
                </div>

                <div className="preview-window-body">
                  <div className="preview-challenge-title-row flex-between">
                    <div>
                      <h4 className="preview-ch-name">React Todo App — Fix the Bugs</h4>
                      <span className="preview-ch-sub">Test execution • Running 8 test cases</span>
                    </div>
                    <button
                      onClick={handleSimulateRun}
                      disabled={isTestRunning}
                      className="btn btn-sm btn-primary run-tests-mini-btn"
                    >
                      {isTestRunning ? 'Evaluating...' : 'Run Tests'}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="preview-progress-row">
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: '79%' }}></div>
                    </div>
                    <span className="progress-pct">79%</span>
                  </div>

                  {/* Test Assertions List */}
                  <div className="test-assertions-table">
                    <div className="assertion-row pass">
                      <span className="ast-icon text-success">✔</span>
                      <span className="ast-name">renders todo list correctly</span>
                      <span className="ast-time">✔ 124 ms</span>
                    </div>

                    <div className="assertion-row pass">
                      <span className="ast-icon text-success">✔</span>
                      <span className="ast-name">adds a new todo</span>
                      <span className="ast-time">✔ 98 ms</span>
                    </div>

                    <div className="assertion-row pass">
                      <span className="ast-icon text-success">✔</span>
                      <span className="ast-name">toggles todo completion</span>
                      <span className="ast-time">✔ 101 ms</span>
                    </div>

                    <div className="assertion-row pass">
                      <span className="ast-icon text-success">✔</span>
                      <span className="ast-name">deletes a todo</span>
                      <span className="ast-time">✔ 97 ms</span>
                    </div>

                    <div className="assertion-row fail">
                      <span className="ast-icon text-error">✖</span>
                      <span className="ast-name">persists todos in localStorage</span>
                      <span className="ast-time text-error">✖ 204 ms</span>
                    </div>

                    <div className="assertion-row pending">
                      <span className="ast-dot-pending"></span>
                      <span className="ast-name">handles empty input</span>
                      <span className="ast-time text-muted">... Running...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Figure 1.0 Caption */}
              <div className="figure-caption">
                <strong>Figure 1.0:</strong> Live test execution for a React debugging challenge,
                showing <span className="text-success-bold">passed</span> and <span className="text-error-bold">failed</span> test cases.
              </div>
            </div>

            {/* FIGURE 1.1: Evaluation & Performance Metrics */}
            <div className="figure-box-card card">
              <div className="figure-top-bar flex-between">
                <h3 className="figure-card-title">Evaluation &amp; Performance Metrics</h3>
                <span className="badge badge-outline figure-badge">Accuracy &amp; Time</span>
              </div>

              {/* Inner Dark Metrics Dashboard */}
              <div className="inner-metrics-dark">
                {/* Left: Test Results Gauge */}
                <div className="metrics-sub-col">
                  <span className="metric-header-title">Test Results</span>

                  <div className="donut-wrap">
                    <div className="donut-circle">
                      <div className="donut-inner-text">
                        <span className="donut-num">75%</span>
                        <span className="donut-label">Passed</span>
                      </div>
                    </div>

                    <div className="donut-legend">
                      <div className="legend-item">
                        <span className="legend-sq purple"></span>
                        <span>Passed (6)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-sq pink"></span>
                        <span>Failed (1)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-sq gray"></span>
                        <span>Pending (1)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Execution Time Bars */}
                <div className="metrics-sub-col">
                  <span className="metric-header-title">Execution Time (ms)</span>

                  <div className="bars-chart-container">
                    <div className="y-axis">
                      <span>250</span>
                      <span>200</span>
                      <span>150</span>
                      <span>100</span>
                      <span>50</span>
                      <span>0</span>
                    </div>

                    <div className="bars-area">
                      <div className="bar-col" style={{ height: '52%' }}></div>
                      <div className="bar-col" style={{ height: '39%' }}></div>
                      <div className="bar-col" style={{ height: '41%' }}></div>
                      <div className="bar-col" style={{ height: '38%' }}></div>
                      <div className="bar-col" style={{ height: '82%' }}></div>
                      <div className="bar-col" style={{ height: '64%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Figure 1.1 Caption */}
              <div className="figure-caption">
                <strong>Figure 1.1:</strong> Evaluation dashboard showing test accuracy (75%) and
                execution time per test case.
              </div>
            </div>
          </div>

          {/* Architectural Explanation Deep Dive */}
          <div className="deep-dive-card card">
            <h3 className="dd-heading">Sandbox Isolation Mechanism</h3>
            <p className="dd-text">
              CodeDetective isolates student execution runs by utilizing Node.js <code>node:vm</code> context containers.
              Every submission is wrapped in a dedicated virtual context with strict CPU time allowances (3,000ms max timeout)
              preventing infinite while loops and memory exhaustion. Access to the host machine's <code>process</code>, <code>fs</code>,
              and socket layers is eliminated at the sandbox boundary.
            </p>

            <div className="dd-steps-grid">
              <div className="dd-step-box">
                <span className="dd-step-num">01</span>
                <h4>Virtual Module Resolution</h4>
                <p>Multi-file projects are linked into an in-memory module registry where relative <code>require()</code> calls resolve instantly without filesystem writes.</p>
              </div>

              <div className="dd-step-box">
                <span className="dd-step-num">02</span>
                <h4>Synchronous &amp; Async Assertions</h4>
                <p>Assertions execute via pure JavaScript harness functions that catch assertion errors, calculate execution duration, and format diff reports.</p>
              </div>

              <div className="dd-step-box">
                <span className="dd-step-num">03</span>
                <h4>Progressive Socratic Hints</h4>
                <p>The AI mentor inspects AST structures and assertion traces to generate pedagogical Level 1-4 clues without revealing complete answer payloads.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
