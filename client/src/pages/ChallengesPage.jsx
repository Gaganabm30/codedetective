import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  FileCode,
  Layers,
  Clock,
  CheckCircle,
  Zap,
  ArrowRight,
  PlusCircle,
  Atom,
  Cpu,
  Database,
  Binary,
  Globe,
  Sparkles
} from 'lucide-react';
import {
  CHALLENGES,
  CATEGORIES,
  DIFFICULTIES,
  CHALLENGE_TYPES
} from '../data/challengesData';
import { useAuth } from '../context/AuthContext';
import '../styles/challenges.css';

export default function ChallengesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Filters state initialized from URL query params
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sync category state if URL param changes
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
  }, [searchParams]);

  // Update URL param when category changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
  };

  const completedIds = user?.completedChallenges || [];

  // Filter and sort challenges
  const filteredChallenges = useMemo(() => {
    return CHALLENGES.filter((ch) => {
      // Category filter
      if (selectedCategory !== 'All' && ch.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && ch.difficulty !== selectedDifficulty) {
        return false;
      }
      // Type filter
      if (selectedType !== 'All' && ch.type !== selectedType) {
        return false;
      }
      // Status filter
      if (selectedStatus === 'Solved' && !completedIds.includes(ch.id)) {
        return false;
      }
      if (selectedStatus === 'Unsolved' && completedIds.includes(ch.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ch.title.toLowerCase().includes(q);
        const matchesDesc = ch.shortDescription.toLowerCase().includes(q);
        const matchesTags = ch.tags.some(t => t.toLowerCase().includes(q));
        const matchesTech = ch.technology.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesTech) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'xp-high') return b.xp - a.xp;
      if (sortBy === 'xp-low') return a.xp - b.xp;
      if (sortBy === 'time-short') return parseInt(a.timeEstimate) - parseInt(b.timeEstimate);
      return 0; // Default order
    });
  }, [selectedCategory, selectedDifficulty, selectedType, selectedStatus, searchQuery, sortBy, completedIds]);

  const getTechIcon = (category) => {
    switch (category) {
      case 'React': return <Atom size={18} className="text-blue" />;
      case 'Node.js':
      case 'Backend': return <Cpu size={18} className="text-green" />;
      case 'Database': return <Database size={18} className="text-amber" />;
      case 'DSA': return <Binary size={18} className="text-indigo" />;
      case 'Frontend': return <Globe size={18} className="text-cyan" />;
      default: return <Layers size={18} className="text-purple" />;
    }
  };

  return (
    <div className="challenges-page">
      {/* Top Banner Header */}
      <div className="challenges-header-banner">
        <div className="ch-banner-content">
          <div className="ch-badge">
            <Sparkles size={14} />
            <span>Interactive Bug Assessment Catalog</span>
          </div>
          <h1 className="ch-heading">Explore Debugging Challenges</h1>
          <p className="ch-subtitle">
            Real code. Real bugs. Fix, learn, and level up your software engineering skills.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
          <span>Create Challenge</span>
        </button>
      </div>

      {/* Main Marketplace Layout */}
      <div className="challenges-layout">
        {/* Left Filter Sidebar */}
        <aside className="filters-sidebar card">
          <div className="filters-header">
            <div className="flex-center flex-gap-sm">
              <Filter size={16} className="text-purple" />
              <h3 className="filters-title">Filters</h3>
            </div>
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Category</h4>
            <div className="filter-options-list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  <span>{cat}</span>
                  <span className="chip-count">
                    {cat === 'All'
                      ? CHALLENGES.length
                      : CHALLENGES.filter(c => c.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Difficulty</h4>
            <div className="filter-options-list">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  className={`filter-chip ${selectedDifficulty === diff ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  <span>{diff}</span>
                  {diff !== 'All' && (
                    <span className={`chip-dot dot-${diff.toLowerCase()}`}></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Challenge Type Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Challenge Type</h4>
            <div className="filter-options-list">
              {CHALLENGE_TYPES.map((type) => (
                <button
                  key={type}
                  className={`filter-chip ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Completion Status Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Status</h4>
            <div className="filter-options-list">
              {['All', 'Solved', 'Unsolved'].map((st) => (
                <button
                  key={st}
                  className={`filter-chip ${selectedStatus === st ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(st)}
                >
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="challenges-main-content">
          {/* Search & Sort Controls Bar */}
          <div className="controls-bar card">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by bug name, technology, or tag (e.g., JWT, CORS, Closures)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="sort-wrap">
              <SlidersHorizontal size={16} className="text-secondary" />
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="xp-high">Highest XP</option>
                <option value="xp-low">Lowest XP</option>
                <option value="time-short">Shortest Time</option>
              </select>
            </div>
          </div>

          {/* Results Info Bar */}
          <div className="results-count-bar">
            <span>
              Showing <strong>{filteredChallenges.length}</strong> debugging challenges
              {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
            </span>
            {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
              <button onClick={handleClearFilters} className="btn-link-reset">
                Reset filters
              </button>
            )}
          </div>

          {/* Challenges Grid */}
          {filteredChallenges.length > 0 ? (
            <div className="challenges-grid">
              {filteredChallenges.map((ch) => {
                const isSolved = completedIds.includes(ch.id);
                return (
                  <div key={ch.id} className="challenge-card card">
                    <div className="ch-card-header">
                      <div className="tech-badge-icon">
                        {getTechIcon(ch.category)}
                        <span className="tech-name">{ch.technology}</span>
                      </div>
                      <div className="ch-header-right">
                        {isSolved && (
                          <span className="badge badge-easy">
                            <CheckCircle size={12} /> Solved
                          </span>
                        )}
                        <span className={`badge badge-${ch.difficulty.toLowerCase()}`}>
                          {ch.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="ch-card-title">
                      <Link to={`/challenges/${ch.id}`}>{ch.title}</Link>
                    </h3>

                    <p className="ch-card-desc">{ch.shortDescription}</p>

                    <div className="ch-tags-row">
                      {ch.tags.map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>

                    <div className="ch-card-meta">
                      <span className="meta-item" title="Files in project">
                        <FileCode size={14} />
                        {ch.filesCount} {ch.filesCount === 1 ? 'file' : 'files'}
                      </span>
                      <span className="meta-item" title="Automated test cases">
                        <CheckCircle size={14} />
                        {ch.testCasesCount} tests
                      </span>
                      <span className="meta-item" title="Estimated time to fix">
                        <Clock size={14} />
                        {ch.timeEstimate}
                      </span>
                      <span className="meta-xp" title="Experience Points">
                        <Zap size={14} />
                        +{ch.xp} XP
                      </span>
                    </div>

                    <div className="ch-card-footer">
                      <span className="ch-type-label">{ch.type}</span>
                      <Link
                        to={`/challenges/${ch.id}`}
                        className="btn btn-primary btn-sm ch-solve-btn"
                      >
                        <span>Solve Challenge</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results-box card">
              <FileCode size={48} className="no-results-icon" />
              <h3>No Debugging Challenges Found</h3>
              <p>Try adjusting your search query, difficulty, or category filters.</p>
              <button onClick={handleClearFilters} className="btn btn-secondary btn-sm">
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contribute a Debugging Challenge</h3>
              <button onClick={() => setShowCreateModal(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                CodeDetective supports community submissions! Submit real bugs you encountered in
                production with reproduction steps, intentional defects, and verification test cases.
              </p>
              <div className="submission-checklist">
                <div className="check-item">
                  <CheckCircle size={16} className="text-success" />
                  <span>Must include multi-file or code snippet with reproducible defect</span>
                </div>
                <div className="check-item">
                  <CheckCircle size={16} className="text-success" />
                  <span>Requires at least 2 automated Jest/Mocha assertions</span>
                </div>
                <div className="check-item">
                  <CheckCircle size={16} className="text-success" />
                  <span>Provides 4-tier progressive hints for the AI mentor</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Submission guidelines downloaded! Send your challenge JSON to contribute@codedetective.dev');
                  setShowCreateModal(false);
                }}
                className="btn btn-primary"
              >
                Download Challenge Spec Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

