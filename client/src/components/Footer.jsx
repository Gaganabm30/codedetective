import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ShieldCheck, Cpu, Terminal } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="logo-icon-wrap sm">
                <Code2 size={18} />
              </div>
              <span className="brand-text">
                Code<span className="brand-accent">Detective</span>
              </span>
            </Link>
            <p className="footer-bio">
              The premier interactive developer debugging platform. Master the art of code
              investigation, bug reproduction, root-cause diagnosis, and automated testing.
            </p>
            <div className="platform-status-badge">
              <span className="status-dot pulsing"></span>
              <span>Execution Engine & Sandbox: <strong>Operational</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-nav">
              <li><Link to="/challenges">Debugging Challenges</Link></li>
              <li><Link to="/debug-lab">Debug Lab</Link></li>
              <li><Link to="/playground">Multi-file Playground</Link></li>
              <li><Link to="/leaderboard">Global Leaderboard</Link></li>
              <li><Link to="/docs">Documentation & Guide</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-nav">
              <li><Link to="/challenges?category=Full Stack">Full Stack Systems</Link></li>
              <li><Link to="/challenges?category=React">React & State Glitches</Link></li>
              <li><Link to="/challenges?category=Node.js">Node.js & Express APIs</Link></li>
              <li><Link to="/challenges?category=Database">MongoDB & Aggregation</Link></li>
              <li><Link to="/challenges?category=DSA">DSA & Algorithmic Bugs</Link></li>
            </ul>
          </div>

          {/* Tech & AI */}
          <div className="footer-col">
            <h4 className="footer-heading">Architecture</h4>
            <ul className="footer-nav">
              <li><span className="footer-text-item">Monaco IDE Integration</span></li>
              <li><span className="footer-text-item">Node.js VM Isolation</span></li>
              <li><span className="footer-text-item">Gemini AI Mentor</span></li>
              <li><span className="footer-text-item">Automated Test Assertions</span></li>
              <li><span className="footer-text-item">Progressive 4-Tier Hints</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} CodeDetective Inc. Built for developers who think before they patch.
          </p>
          <div className="footer-badges">
            <span className="tech-badge">Strictly JS</span>
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Node VM Sandbox</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
