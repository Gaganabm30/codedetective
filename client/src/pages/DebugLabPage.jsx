import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  Send,
  RotateCcw,
  Lightbulb,
  Sparkles,
  HelpCircle,
  FileCode,
  Layers,
  Clock,
  Zap,
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { CHALLENGES } from '../data/challengesData';
import { runClientCode, runClientTests } from '../services/codeRunner';
import { useAuth } from '../context/AuthContext';
import '../styles/debug-lab.css';

export default function DebugLabPage() {
  const { addSolvedChallenge } = useAuth();

  // Filter for snippet-oriented challenges or default to snippet challenges
  const snippetChallenges = CHALLENGES.filter(c => c.type === 'Code Snippet' || c.filesCount === 1);
  const [selectedChallengeId, setSelectedChallengeId] = useState(snippetChallenges[0]?.id || CHALLENGES[2].id);
  const [language, setLanguage] = useState('javascript');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const challenge = CHALLENGES.find(c => c.id === selectedChallengeId) || snippetChallenges[0];

  const [code, setCode] = useState(() => challenge.initialFiles[0]?.code || '');
  const [testResults, setTestResults] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'info', text: 'Debug Lab initialized. Select or edit code to begin test validation.' }
  ]);
  const [unlockedHints, setUnlockedHints] = useState([1]);
  const [activeTab, setActiveTab] = useState('tests'); // 'tests' | 'console' | 'explanation'
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Switch challenge
  const handleSelectChallenge = (id) => {
    setSelectedChallengeId(id);
    const target = CHALLENGES.find(c => c.id === id);
    if (target) {
      setCode(target.initialFiles[0]?.code || '');
      setTestResults(null);
      setUnlockedHints([1]);
      setTerminalLogs([
        { type: 'info', text: `Loaded snippet: ${target.title}` }
      ]);
    }
  };

  const handleReset = () => {
    setCode(challenge.initialFiles[0]?.code || '');
    setTestResults(null);
    setTerminalLogs([{ type: 'warn', text: 'Snippet reset to initial buggy state.' }]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveTab('console');

    setTimeout(() => {
      const virtualFiles = [{ path: 'solution.js', code }];
      const res = runClientCode(virtualFiles, 'solution.js');
      const newLogs = [
        { type: 'info', text: `[${new Date().toLocaleTimeString()}] Running solution.js...` },
        ...(res.logs || [])
      ];
      if (res.error) {
        newLogs.push({ type: 'error', text: `Error: ${res.error}` });
      } else {
        newLogs.push({ type: 'info', text: `Returned without uncaught exceptions.` });
      }
      setTerminalLogs(newLogs);
      setIsRunning(false);
    }, 200);
  };

  const handleRunTests = async () => {
    setIsTesting(true);
    setActiveTab('tests');

    const virtualFiles = [{ path: 'solution.js', code }];
    const output = await runClientTests(virtualFiles, challenge.testCases);
    setTestResults(output);
    setIsTesting(false);

    if (output.allPassed) {
      addSolvedChallenge(challenge.id, challenge.xp);
      setTerminalLogs(prev => [
        ...prev,
        { type: 'info', text: `🎉 All ${output.totalCount} tests passed! You mastered this snippet.` }
      ]);
    }
  };

  const handleUnlockHint = (level) => {
    if (!unlockedHints.includes(level)) {
      setUnlockedHints([...unlockedHints, level]);
    }
  };

  return (
    <div className="debug-lab-page">
      {/* Header Bar */}
      <div className="lab-header card">
        <div className="lab-header-left">
          <div className="lab-badge">
            <FlaskConical size={16} />
            <span>Interactive Code Snippet Lab</span>
          </div>
          <h1 className="lab-title">{challenge.title}</h1>
          <p className="lab-desc">{challenge.shortDescription}</p>
        </div>

        <div className="lab-selectors">
          <div className="selector-group">
            <label>Snippet Track:</label>
            <select
              value={selectedChallengeId}
              onChange={(e) => handleSelectChallenge(e.target.value)}
              className="lab-select"
            >
              {CHALLENGES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label>Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lab-select"
            >
              <option value="javascript">JavaScript (ES6+)</option>
              <option value="node">Node.js CommonJS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Editor & Console | Right Problem & Hints */}
      <div className="lab-main-grid">
        {/* Left Column: Monaco Editor + Bottom Output */}
        <div className="lab-left-col">
          <div className="lab-editor-card card ide-theme">
            <div className="lab-editor-toolbar">
              <div className="editor-file-badge">
                <FileCode size={14} />
                <span>solution.js (Buggy Implementation)</span>
              </div>

              <div className="editor-actions">
                <button onClick={handleReset} className="btn btn-sm btn-outline" title="Reset snippet">
                  <RotateCcw size={14} /> Reset
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="btn btn-sm btn-secondary"
                >
                  <Play size={14} /> {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button
                  onClick={handleRunTests}
                  disabled={isTesting}
                  className="btn btn-sm btn-primary"
                >
                  <CheckCircle2 size={14} /> {isTesting ? 'Verifying...' : 'Run Tests & Submit'}
                </button>
              </div>
            </div>

            <div className="lab-monaco-container">
              <Editor
                height="420px"
                language="javascript"
                value={code}
                theme="vs-dark"
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  tabSize: 2
                }}
              />
            </div>

            {/* Bottom Output Drawer */}
            <div className="lab-output-drawer">
              <div className="drawer-tabs">
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`drawer-tab ${activeTab === 'tests' ? 'active' : ''}`}
                >
                  <CheckCircle2 size={14} />
                  <span>Test Results</span>
                  {testResults && (
                    <span className={`dot-indicator ${testResults.allPassed ? 'green' : 'red'}`}></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`drawer-tab ${activeTab === 'console' ? 'active' : ''}`}
                >
                  <FileCode size={14} />
                  <span>Console Logs ({terminalLogs.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('explanation')}
                  className={`drawer-tab ${activeTab === 'explanation' ? 'active' : ''}`}
                >
                  <Info size={14} />
                  <span>Deep Dive Explanation</span>
                </button>
              </div>

              <div className="drawer-body">
                {activeTab === 'tests' && (
                  <div className="drawer-tests-list">
                    {testResults ? (
                      <div className="test-results-wrap">
                        <div className="test-top-bar">
                          <span className={testResults.allPassed ? 'text-success' : 'text-error'}>
                            {testResults.allPassed
                              ? `All ${testResults.totalCount} tests passed! (+${challenge.xp} XP)`
                              : `${testResults.passedCount} of ${testResults.totalCount} tests passed`}
                          </span>
                        </div>
                        {testResults.results.map((r, i) => (
                          <div key={i} className={`lab-test-row ${r.passed ? 'pass' : 'fail'}`}>
                            <span className="badge-pass-fail">{r.passed ? 'PASS' : 'FAIL'}</span>
                            <div className="test-row-details">
                              <span className="row-title">{r.name}</span>
                              <span className="row-desc">{r.description}</span>
                              {r.error && <code className="row-error">{r.error}</code>}
                            </div>
                            <span className="row-time">{r.executionTime}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-tests-prompt">
                        <p>Click <strong>"Run Tests & Submit"</strong> to evaluate the code against assertion suites.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'console' && (
                  <div className="drawer-console-view">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className={`console-line ${log.type}`}>
                        <span>&gt; {log.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'explanation' && (
                  <div className="drawer-explanation-view">
                    <h4>Why this defect occurs:</h4>
                    <p className="exp-text">
                      JavaScript engines execute synchronous code immediately while queueing microtasks
                      and timers. When objects or arrays are manipulated without immutable copies or when
                      callbacks fail to await promises, race conditions and silent state corruption manifest.
                    </p>
                    <div className="exp-pro-tip">
                      <strong>Pro Debugging Pattern:</strong> Always test edge conditions with duplicate elements,
                      zero values, and empty arrays!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Problem Specs & Progressive Hints */}
        <div className="lab-right-col">
          {/* Problem Spec */}
          <div className="card lab-spec-card">
            <h3 className="spec-card-title">Problem Description</h3>
            <div className="spec-markdown">
              <pre className="spec-pre">{challenge.instructions}</pre>
            </div>
          </div>

          {/* Hints System */}
          <div className="card lab-hints-card">
            <div className="flex-between">
              <h3 className="spec-card-title">Progressive Clues</h3>
              <span className="badge badge-purple">
                <Lightbulb size={12} /> {unlockedHints.length}/4 Revealed
              </span>
            </div>

            <div className="lab-hints-list">
              {challenge.hints.map((hint) => {
                const isUnlocked = unlockedHints.includes(hint.level);
                return (
                  <div key={hint.level} className={`lab-hint-box ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="hint-top flex-between">
                      <span className="hint-pill">Level {hint.level}: {hint.title}</span>
                      {!isUnlocked && (
                        <button
                          onClick={() => handleUnlockHint(hint.level)}
                          className="btn btn-sm btn-outline unlock-btn-mini"
                        >
                          Reveal
                        </button>
                      )}
                    </div>
                    {isUnlocked ? (
                      <p className="hint-body">{hint.text}</p>
                    ) : (
                      <p className="hint-hidden-msg">Click "Reveal" to unlock this progressive clue.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

