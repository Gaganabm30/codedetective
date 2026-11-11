import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Play,
  CheckCircle2,
  Send,
  RotateCcw,
  Folder,
  FolderOpen,
  FileCode,
  File,
  Terminal as TerminalIcon,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  Maximize2,
  Minimize2,
  Bug,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { CHALLENGES } from '../data/challengesData';
import { runClientCode, runClientTests } from '../services/codeRunner';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/api';
import '../styles/playground.css';

export default function PlaygroundPage() {
  const { id } = useParams();
  const { user, addSolvedChallenge } = useAuth();

  // Find target challenge by id or default to the first one
  const challenge = CHALLENGES.find(c => c.id === id) || CHALLENGES[0];

  // Files state (cloned from challenge initialFiles)
  const [files, setFiles] = useState(() =>
    challenge.initialFiles.map(f => ({ ...f }))
  );
  const [activeFilePath, setActiveFilePath] = useState(() =>
    challenge.initialFiles[0]?.path || ''
  );
  const [openTabs, setOpenTabs] = useState(() =>
    challenge.initialFiles.map(f => f.path)
  );

  // Bottom panel state
  const [bottomTab, setBottomTab] = useState('tests'); // 'terminal' | 'tests'
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'info', text: 'Debugging workspace initialized.' },
    { type: 'info', text: `Loaded ${challenge.filesCount} project files. Ready to run tests.` }
  ]);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  // Right panel state
  const [rightTab, setRightTab] = useState('instructions'); // 'instructions' | 'hints' | 'mentor'
  const [unlockedHints, setUnlockedHints] = useState([1]); // Level 1 unlocked by default

  // AI Mentor chat state
  const [mentorMessages, setMentorMessages] = useState([
    {
      sender: 'mentor',
      text: `Hello! I'm your AI Debugging Mentor. I won't just spoil the solution for you — I'll guide you step by step to identify the root cause in "${challenge.title}". Click a quick prompt below or type your question!`
    }
  ]);
  const [mentorInput, setMentorInput] = useState('');
  const [isMentorTyping, setIsMentorTyping] = useState(false);

  // Re-sync when challenge changes
  useEffect(() => {
    setFiles(challenge.initialFiles.map(f => ({ ...f })));
    setActiveFilePath(challenge.initialFiles[0]?.path || '');
    setOpenTabs(challenge.initialFiles.map(f => f.path));
    setTestResults(null);
    setUnlockedHints([1]);
    setTerminalLogs([
      { type: 'info', text: `Loaded workspace: ${challenge.title}` }
    ]);
    setMentorMessages([
      {
        sender: 'mentor',
        text: `Investigating "${challenge.title}". Inspect the files, reproduce the failure with "Run Tests", and ask me whenever you need a clue!`
      }
    ]);
  }, [challenge.id]);

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  const handleCodeChange = (newCode) => {
    setFiles(prev =>
      prev.map(f => f.path === activeFilePath ? { ...f, code: newCode } : f)
    );
  };

  const handleResetCode = () => {
    if (window.confirm('Reset all files back to their initial buggy state?')) {
      setFiles(challenge.initialFiles.map(f => ({ ...f })));
      setTestResults(null);
      setTerminalLogs([{ type: 'warn', text: 'Workspace reset to initial buggy state.' }]);
    }
  };

  const handleCloseTab = (path, e) => {
    e.stopPropagation();
    const remaining = openTabs.filter(p => p !== path);
    setOpenTabs(remaining);
    if (activeFilePath === path && remaining.length > 0) {
      setActiveFilePath(remaining[0]);
    }
  };

  const handleOpenFile = (path) => {
    if (!openTabs.includes(path)) {
      setOpenTabs([...openTabs, path]);
    }
    setActiveFilePath(path);
  };

  // Run Code
  const handleRunCode = () => {
    setIsRunning(true);
    setBottomTab('terminal');
    setIsBottomCollapsed(false);

    setTimeout(() => {
      const execResult = runClientCode(files, activeFilePath);
      const newLogs = [
        { type: 'info', text: `[${new Date().toLocaleTimeString()}] Executing ${activeFilePath}...` },
        ...(execResult.logs || [])
      ];

      if (execResult.error) {
        newLogs.push({ type: 'error', text: `Failed: ${execResult.error}` });
      } else {
        newLogs.push({ type: 'info', text: `Execution completed in ${execResult.executionTime}` });
      }

      setTerminalLogs(newLogs);
      setIsRunning(false);
    }, 250);
  };

  // Run Tests
  const handleRunTests = async () => {
    setIsTesting(true);
    setBottomTab('tests');
    setIsBottomCollapsed(false);

    const testOutput = await runClientTests(files, challenge.testCases);
    setTestResults(testOutput);
    setIsTesting(false);

    // Also append to terminal log
    setTerminalLogs(prev => [
      ...prev,
      {
        type: testOutput.allPassed ? 'info' : 'warn',
        text: `[Tests] ${testOutput.passedCount}/${testOutput.totalCount} passed.`
      }
    ]);
  };

  // Submit Solution
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setBottomTab('tests');
    setIsBottomCollapsed(false);

    const testOutput = await runClientTests(files, challenge.testCases);
    setTestResults(testOutput);
    setIsSubmitting(false);

    if (testOutput.allPassed) {
      addSolvedChallenge(challenge.id, challenge.xp);
      setSubmissionFeedback({
        status: 'SUCCESS',
        title: '🎉 Outstanding Detective Work!',
        message: `All ${challenge.testCases.length} assertions passed! You earned +${challenge.xp} XP and leveled up your debugging accuracy.`
      });
    } else {
      setSubmissionFeedback({
        status: 'FAILED',
        title: 'Bugs Still Detected',
        message: `${testOutput.passedCount} of ${testOutput.totalCount} assertions passed. Review the failing tests and consult the AI Mentor.`
      });
    }
  };

  // Unlock progressive hint
  const handleUnlockHint = (level) => {
    if (!unlockedHints.includes(level)) {
      setUnlockedHints([...unlockedHints, level]);
    }
  };

  // Send AI Mentor prompt
  const handleSendMentor = async (queryText) => {
    const textToSend = queryText || mentorInput;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMentorMessages(prev => [...prev, userMsg]);
    setMentorInput('');
    setIsMentorTyping(true);

    try {
      // First attempt backend AI endpoint
      try {
        const res = await aiService.askMentor(
          challenge.id,
          textToSend,
          activeFile.code,
          { currentFile: activeFile.path }
        );
        if (res.data && res.data.reply) {
          setMentorMessages(prev => [...prev, { sender: 'mentor', text: res.data.reply }]);
          setIsMentorTyping(false);
          return;
        }
      } catch (e) {
        // Fallback to rich heuristic pedagogical AI mentor
      }

      setTimeout(() => {
        const reply = generateMentorResponse(textToSend, challenge, activeFile);
        setMentorMessages(prev => [...prev, { sender: 'mentor', text: reply }]);
        setIsMentorTyping(false);
      }, 750);
    } catch (err) {
      setIsMentorTyping(false);
      setMentorMessages(prev => [
        ...prev,
        { sender: 'mentor', text: 'I encountered an issue analyzing that snippet. Try running the tests to see the current stack trace!' }
      ]);
    }
  };

  return (
    <div className="playground-workspace ide-theme">
      {/* Top Workspace Toolbar */}
      <header className="workspace-toolbar">
        <div className="toolbar-left">
          <Link to="/challenges" className="btn-back" title="Back to Challenges">
            ←
          </Link>
          <div className="project-badge-wrap">
            <h2 className="project-title">{challenge.title}</h2>
            <div className="project-pills">
              <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>
                {challenge.difficulty}
              </span>
              <span className="badge badge-purple">{challenge.category}</span>
              <span className="xp-pill-mini">+{challenge.xp} XP</span>
            </div>
          </div>
        </div>

        <div className="toolbar-right">
          <button
            onClick={handleResetCode}
            className="btn btn-sm btn-outline toolbar-btn"
            title="Reset code to initial buggy state"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="btn btn-sm btn-secondary toolbar-btn"
            title="Execute active file and view console output"
          >
            <Play size={14} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleRunTests}
            disabled={isTesting}
            className="btn btn-sm btn-outline toolbar-btn"
            title="Run test assertions against current code"
          >
            <CheckCircle2 size={14} />
            <span>{isTesting ? 'Testing...' : 'Run Tests'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-sm btn-primary toolbar-btn"
            title="Submit verified fix and claim XP"
          >
            <Send size={14} />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column IDE Body */}
      <div className="workspace-body">
        {/* Left Panel: File Explorer */}
        <aside className="explorer-panel">
          <div className="panel-header">
            <span className="panel-title">EXPLORER</span>
            <span className="file-count-badge">{files.length} files</span>
          </div>

          <div className="explorer-tree">
            <div className="tree-folder">
              <div className="folder-label">
                <FolderOpen size={16} className="folder-icon" />
                <span className="folder-name">project</span>
              </div>

              <div className="folder-children">
                {files.map((file) => {
                  const isActive = file.path === activeFilePath;
                  return (
                    <button
                      key={file.path}
                      onClick={() => handleOpenFile(file.path)}
                      className={`tree-file-item ${isActive ? 'active' : ''}`}
                    >
                      <FileCode size={15} className="file-icon" />
                      <span className="file-path-text">{file.name || file.path}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel: Editor + Bottom Console/Tests Drawer */}
        <section className="editor-center-panel">
          {/* File Tabs */}
          <div className="editor-tabs-bar">
            {openTabs.map((path) => {
              const fileObj = files.find(f => f.path === path);
              const isActive = path === activeFilePath;
              return (
                <div
                  key={path}
                  onClick={() => setActiveFilePath(path)}
                  className={`editor-tab ${isActive ? 'active' : ''}`}
                >
                  <FileCode size={14} className="tab-icon" />
                  <span className="tab-name">{fileObj?.name || path}</span>
                  {openTabs.length > 1 && (
                    <button
                      onClick={(e) => handleCloseTab(path, e)}
                      className="tab-close-btn"
                      title="Close Tab"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Monaco Editor Container */}
          <div className="monaco-wrapper">
            <Editor
              height="100%"
              language={activeFile.language || 'javascript'}
              value={activeFile.code}
              theme="vs-dark"
              onChange={handleCodeChange}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Bottom Panel Drawer: Terminal & Test Results */}
          <div className={`bottom-panel ${isBottomCollapsed ? 'collapsed' : ''}`}>
            <div className="bottom-panel-header">
              <div className="bottom-tabs">
                <button
                  onClick={() => { setBottomTab('tests'); setIsBottomCollapsed(false); }}
                  className={`bottom-tab ${bottomTab === 'tests' ? 'active' : ''}`}
                >
                  <CheckCircle2 size={14} />
                  <span>Test Results</span>
                  {testResults && (
                    <span className={`pill-status-dot ${testResults.allPassed ? 'green' : 'red'}`}></span>
                  )}
                </button>
                <button
                  onClick={() => { setBottomTab('terminal'); setIsBottomCollapsed(false); }}
                  className={`bottom-tab ${bottomTab === 'terminal' ? 'active' : ''}`}
                >
                  <TerminalIcon size={14} />
                  <span>Console / Output</span>
                  <span className="badge-count">{terminalLogs.length}</span>
                </button>
              </div>

              <div className="bottom-actions">
                <button
                  onClick={() => setIsBottomCollapsed(!isBottomCollapsed)}
                  className="bottom-toggle-btn"
                  title={isBottomCollapsed ? 'Expand Panel' : 'Collapse Panel'}
                >
                  {isBottomCollapsed ? <ChevronDown size={16} /> : <Minimize2 size={14} />}
                </button>
              </div>
            </div>

            {!isBottomCollapsed && (
              <div className="bottom-panel-content">
                {bottomTab === 'tests' ? (
                  <div className="test-results-view">
                    {testResults ? (
                      <div className="test-results-container">
                        <div className="test-summary-header">
                          <span className={`summary-status ${testResults.allPassed ? 'pass' : 'fail'}`}>
                            {testResults.allPassed ? '✅ All Tests Passed' : '❌ Tests Failing'}
                          </span>
                          <span className="summary-counts">
                            Passed: {testResults.passedCount} / {testResults.totalCount}
                          </span>
                        </div>

                        <div className="test-items-list">
                          {testResults.results.map((r, i) => (
                            <div key={r.id || i} className={`test-item-card ${r.passed ? 'passed' : 'failed'}`}>
                              <div className="test-item-header">
                                <span className="test-status-pill">
                                  {r.passed ? 'PASSED' : 'FAILED'}
                                </span>
                                <span className="test-title">{r.name}</span>
                                <span className="test-time">{r.executionTime}</span>
                              </div>
                              <p className="test-desc">{r.description}</p>
                              {!r.passed && r.error && (
                                <div className="test-error-box">
                                  <code>Error: {r.error}</code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="test-empty-state">
                        <p>No tests executed yet.</p>
                        <button onClick={handleRunTests} className="btn btn-sm btn-primary">
                          Run Test Suite
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="terminal-view">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className={`terminal-line ${log.type}`}>
                        <span className="log-prefix">&gt;</span>
                        <span className="log-body">{log.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Challenge Instructions & AI Mentor */}
        <aside className="instructions-panel">
          <div className="panel-header-tabs">
            <button
              onClick={() => setRightTab('instructions')}
              className={`panel-tab ${rightTab === 'instructions' ? 'active' : ''}`}
            >
              <Info size={14} />
              <span>Details</span>
            </button>
            <button
              onClick={() => setRightTab('hints')}
              className={`panel-tab ${rightTab === 'hints' ? 'active' : ''}`}
            >
              <Lightbulb size={14} />
              <span>Hints ({unlockedHints.length}/4)</span>
            </button>
            <button
              onClick={() => setRightTab('mentor')}
              className={`panel-tab ${rightTab === 'mentor' ? 'active' : ''}`}
            >
              <Sparkles size={14} />
              <span>AI Mentor</span>
            </button>
          </div>

          <div className="instructions-body">
            {rightTab === 'instructions' && (
              <div className="tab-instructions-content">
                <div className="instructions-section">
                  <h3 className="section-label">PROBLEM SUMMARY</h3>
                  <p className="problem-desc">{challenge.shortDescription}</p>
                </div>

                <div className="instructions-section">
                  <h3 className="section-label">INSPECTION GUIDE</h3>
                  <div className="markdown-preview">
                    <pre className="instructions-pre">{challenge.instructions}</pre>
                  </div>
                </div>

                <div className="instructions-section">
                  <h3 className="section-label">EXPECTED TEST BEHAVIOR</h3>
                  <ul className="spec-list">
                    {challenge.testCases.map((tc, idx) => (
                      <li key={tc.id || idx}>
                        <strong>{tc.name}</strong>
                        <p>{tc.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {rightTab === 'hints' && (
              <div className="tab-hints-content">
                <p className="hints-intro">
                  Progressive hints give you targeted clues without giving away the full solution.
                </p>

                <div className="hints-accordion">
                  {challenge.hints.map((hint) => {
                    const isUnlocked = unlockedHints.includes(hint.level);
                    return (
                      <div key={hint.level} className={`hint-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                        <div className="hint-header flex-between">
                          <span className="hint-tier-tag">LEVEL {hint.level}</span>
                          <span className="hint-title">{hint.title}</span>
                          {!isUnlocked && (
                            <button
                              onClick={() => handleUnlockHint(hint.level)}
                              className="btn btn-sm btn-secondary unlock-btn"
                            >
                              Unlock Clue
                            </button>
                          )}
                        </div>

                        {isUnlocked ? (
                          <div className="hint-text">{hint.text}</div>
                        ) : (
                          <div className="hint-locked-placeholder">
                            Click "Unlock Clue" to reveal Level {hint.level} guidance.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {rightTab === 'mentor' && (
              <div className="tab-mentor-content">
                {/* Chat Stream */}
                <div className="mentor-chat-stream">
                  {mentorMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                      {msg.sender === 'mentor' && (
                        <div className="mentor-avatar-badge">
                          <Sparkles size={14} />
                        </div>
                      )}
                      <div className="message-bubble">{msg.text}</div>
                    </div>
                  ))}
                  {isMentorTyping && (
                    <div className="chat-message mentor typing">
                      <div className="mentor-avatar-badge">
                        <Sparkles size={14} />
                      </div>
                      <div className="message-bubble typing-dots">Analyzing codebase...</div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="quick-prompts-bar">
                  <button
                    onClick={() => handleSendMentor("Explain why the test assertions are failing in my current code.")}
                    className="quick-chip"
                  >
                    Explain Error
                  </button>
                  <button
                    onClick={() => handleSendMentor("Which specific file and line contains the defect?")}
                    className="quick-chip"
                  >
                    Point to Bug
                  </button>
                  <button
                    onClick={() => handleSendMentor("Review my current code and let me know if my fix works.")}
                    className="quick-chip"
                  >
                    Review Fix
                  </button>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMentor(); }}
                  className="mentor-input-form"
                >
                  <input
                    type="text"
                    placeholder="Ask the AI debugging mentor..."
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    className="mentor-input"
                  />
                  <button type="submit" className="btn-send-mentor" disabled={!mentorInput.trim()}>
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Submission Success / Feedback Modal */}
      {submissionFeedback && (
        <div className="modal-overlay" onClick={() => setSubmissionFeedback(null)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{submissionFeedback.title}</h3>
              <button onClick={() => setSubmissionFeedback(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>{submissionFeedback.message}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSubmissionFeedback(null)} className="btn btn-outline">
                Keep Investigating
              </button>
              {submissionFeedback.status === 'SUCCESS' && (
                <Link to="/challenges" className="btn btn-primary">
                  Next Challenge →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Intelligent Pedagogical Response Generator
 * Provides helpful diagnostic questions and hints without direct spoilers
 */
function generateMentorResponse(query, challenge, activeFile) {
  const q = query.toLowerCase();

  if (q.includes('error') || q.includes('fail') || q.includes('test')) {
    return `In ${challenge.title}, notice how data flows through ${activeFile.name}. Check whether variable types or promises match what the caller expects. When an assertion fails, log the exact evaluated variable right before returning!`;
  }
  if (q.includes('line') || q.includes('where') || q.includes('point')) {
    return `Look closely at ${activeFile.name}. Notice the comment markers or where values are extracted from objects or headers. Are all asynchronous operations awaited before use?`;
  }
  if (q.includes('review') || q.includes('works') || q.includes('check')) {
    return `Click "Run Tests" in the top toolbar! Automated assertion suites will test edge cases like duplicate elements, unhandled promise rejections, and missing headers. If all tests turn green, you're ready to Submit!`;
  }
  return `Great question! When debugging this issue, consider: What assumptions does the consumer make about the return value or parameters? Try adding a console.log in ${activeFile.name} and click "Run Code" to observe the console output in the bottom panel.`;
}

