import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Bug,
  Terminal,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import '../styles/docs.css';

export default function DocumentationPage() {
  return (
    <div className="docs-page container">
      {/* Header */}
      <div className="docs-header card">
        <div className="docs-badge">
          <BookOpen size={15} />
          <span>Platform Manual & Engineering Guide</span>
        </div>
        <h1 className="docs-title">The Detective's Debugging Handbook</h1>
        <p className="docs-desc">
          Professional software engineering is 70% reading, diagnosing, and fixing code.
          Learn how to approach real-world defect assessments systematically.
        </p>
      </div>

      <div className="docs-content-grid">
        {/* Main Content */}
        <div className="docs-main-col">
          {/* Section 1 */}
          <section className="docs-section card">
            <h2 className="docs-section-heading">
              <span className="section-num">01</span> The 4-Stage Debugging Methodology
            </h2>
            <p>
              When presented with a failing system in CodeDetective or in production, avoid making random edits.
              Follow this battle-tested engineering procedure:
            </p>

            <div className="method-steps">
              <div className="m-step">
                <h4>Stage 1: Reproduce Defect</h4>
                <p>Click "Run Tests" or "Run Code" in the Playground to examine the exact error message and stack trace.</p>
              </div>
              <div className="m-step">
                <h4>Stage 2: Trace the Call Chain</h4>
                <p>Follow the request from router → controller → service → database or component → hook → reducer.</p>
              </div>
              <div className="m-step">
                <h4>Stage 3: Formulate a Minimal Hypothesis</h4>
                <p>Pinpoint the exact variable, async operation, or condition responsible. Verify if it mutates state or misparses tokens.</p>
              </div>
              <div className="m-step">
                <h4>Stage 4: Patch & Verify</h4>
                <p>Apply the surgical fix, run the test assertion suite, and confirm all edge cases turn green.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="docs-section card">
            <h2 className="docs-section-heading">
              <span className="section-num">02</span> The Progressive 4-Tier Hint System
            </h2>
            <p>
              CodeDetective features an AI mentor powered by Gemini that adopts a Socratic methodology.
              Hints are tiered to help you think independently:
            </p>

            <div className="tiers-list">
              <div className="tier-box t1">
                <span className="tier-badge">Level 1</span>
                <div>
                  <strong>Conceptual Guidance</strong>
                  <p>Reminds you of language fundamentals (e.g. state immutability, closure capturing, or header formatting).</p>
                </div>
              </div>

              <div className="tier-box t2">
                <span className="tier-badge">Level 2</span>
                <div>
                  <strong>Target File & Section</strong>
                  <p>Points your attention toward the specific file or function holding the defect.</p>
                </div>
              </div>

              <div className="tier-box t3">
                <span className="tier-badge">Level 3</span>
                <div>
                  <strong>Underlying Root Cause</strong>
                  <p>Explains why the current logic causes runtime exceptions or failing assertions.</p>
                </div>
              </div>

              <div className="tier-box t4">
                <span className="tier-badge">Level 4</span>
                <div>
                  <strong>Surgical Solution Pattern</strong>
                  <p>Shows the correct idiomatic implementation to pass all test cases.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="docs-section card">
            <h2 className="docs-section-heading">
              <span className="section-num">03</span> Safe Sandboxed Execution Architecture
            </h2>
            <p>
              Submitted code runs in isolated memory contexts. Arbitrary malicious payloads
              (such as file system access or socket hijacking) are strictly prohibited by Node.js VM context guards.
              Console outputs (logs, warnings, errors) are intercepted in real-time and piped directly to your bottom terminal drawer.
            </p>
          </section>

          {/* Section 4 */}
          <section className="docs-section card">
            <h2 className="docs-section-heading">
              <span className="section-num">04</span> Frequently Asked Questions
            </h2>
            <div className="faq-list">
              <div className="faq-item">
                <h4>Can I create my own debugging challenges?</h4>
                <p>Yes! On the Challenges catalog page, click "Create Challenge" to view the schema and contribute your own multi-file bug assessments.</p>
              </div>
              <div className="faq-item">
                <h4>How is XP and Leaderboard ranking calculated?</h4>
                <p>XP is awarded when your code passes 100% of assertion test cases. Solving challenges with fewer hints yields maximum XP bonuses.</p>
              </div>
              <div className="faq-item">
                <h4>What technologies are covered?</h4>
                <p>CodeDetective currently tests Full Stack, React, Node.js, Express, MongoDB, JavaScript runtime nuances, and DSA algorithms.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Nav */}
        <aside className="docs-sidebar card">
          <h3 className="docs-sb-title">Quick Navigation</h3>
          <ul className="docs-sb-list">
            <li><a href="#01">01. 4-Stage Methodology</a></li>
            <li><a href="#02">02. Progressive Hints</a></li>
            <li><a href="#03">03. Sandbox Architecture</a></li>
            <li><a href="#04">04. Frequently Asked Questions</a></li>
          </ul>

          <div className="sb-cta-card">
            <h4>Ready to test your skills?</h4>
            <p>Pick a real-world multi-file challenge and start investigating.</p>
            <Link to="/challenges" className="btn btn-primary btn-sm">
              Explore Challenges <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

