'use client';

import { useState, useMemo } from 'react';
import { RepositoryAnalysis, RepositoryIssue } from '@/types/repo';

interface StartContributingViewProps {
  analysis: RepositoryAnalysis;
  onSelectIssue: (issue: RepositoryIssue) => void;
  onNavigateCode?: (filePath?: string) => void;
}

type FilterCategory = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'good-first-issue' | 'help-wanted' | 'bug' | 'enhancement' | 'documentation';

export default function StartContributingView({
  analysis,
  onSelectIssue,
  onNavigateCode,
}: StartContributingViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const issues = analysis.issues || [];

  // Categorize & filter issues dynamically from real repository data
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesNum = issue.number.toString().includes(q);
        const matchesBody = (issue.body || '').toLowerCase().includes(q);
        const matchesLabels = issue.labels.some((l) => l.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesNum && !matchesBody && !matchesLabels) return false;
      }

      // Category filter matching
      if (activeFilter === 'all') return true;
      if (activeFilter === 'beginner') return issue.difficulty === 'beginner';
      if (activeFilter === 'intermediate') return issue.difficulty === 'intermediate';
      if (activeFilter === 'advanced') return issue.difficulty === 'advanced';
      if (activeFilter === 'good-first-issue') {
        return issue.contributionSignal === 'good-first-issue' || issue.labels.some((l) => l.name.toLowerCase().includes('good first issue'));
      }
      if (activeFilter === 'help-wanted') {
        return issue.contributionSignal === 'help-wanted' || issue.labels.some((l) => l.name.toLowerCase().includes('help wanted'));
      }
      if (activeFilter === 'bug') {
        return issue.contributionSignal === 'bug' || issue.labels.some((l) => l.name.toLowerCase().includes('bug'));
      }
      if (activeFilter === 'enhancement') {
        return issue.contributionSignal === 'enhancement' || issue.labels.some((l) => l.name.toLowerCase().includes('enhancement') || l.name.toLowerCase().includes('feature'));
      }
      if (activeFilter === 'documentation') {
        return issue.contributionSignal === 'documentation' || issue.labels.some((l) => l.name.toLowerCase().includes('doc'));
      }
      return true;
    });
  }, [issues, activeFilter, searchQuery]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: issues.length,
      beginner: issues.filter((i) => i.difficulty === 'beginner').length,
      intermediate: issues.filter((i) => i.difficulty === 'intermediate').length,
      advanced: issues.filter((i) => i.difficulty === 'advanced').length,
      goodFirst: issues.filter((i) => i.contributionSignal === 'good-first-issue' || i.labels.some((l) => l.name.toLowerCase().includes('good first issue'))).length,
    };
  }, [issues]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#4DE082]/10 border border-[#4DE082]/30 text-[#4DE082] font-mono text-[11px] font-medium">
              Start Contributing
            </span>
            <span className="text-xs text-[#908F9E] font-mono">
              {analysis.fullName}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#E5E1E4] tracking-tight font-headline">
            Suggested starting points for contributors
          </h1>
          <p className="text-xs text-[#C6C5D5] max-w-2xl leading-relaxed">
            RepoMind mapped <span className="text-[#818CF8] font-mono font-medium">{issues.length} open issues</span> against the codebase file structure and architecture graph to help you make your first contribution.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-[#201F21] border border-[#353437] text-center">
            <div className="text-xs font-mono text-[#908F9E]">Beginner Friendly</div>
            <div className="text-lg font-bold text-[#4DE082] font-mono">{counts.beginner}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#201F21] border border-[#353437] text-center">
            <div className="text-xs font-mono text-[#908F9E]">Total Open</div>
            <div className="text-lg font-bold text-[#818CF8] font-mono">{counts.all}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#131315] p-2 rounded-lg border border-[#1F1F23]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#818CF8] text-[#101B8A] font-semibold'
                : 'text-[#C6C5D5] hover:bg-[#1B1B1D] hover:text-[#E5E1E4]'
            }`}
          >
            <span>All Issues</span>
            <span className="text-[10px] font-mono opacity-80 px-1 rounded bg-black/20">{counts.all}</span>
          </button>

          <button
            onClick={() => setActiveFilter('beginner')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'beginner'
                ? 'bg-[#4DE082] text-[#003617] font-semibold'
                : 'text-[#C6C5D5] hover:bg-[#1B1B1D] hover:text-[#E5E1E4]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4DE082]"></span>
            <span>Beginner</span>
            <span className="text-[10px] font-mono opacity-80 px-1 rounded bg-black/20">{counts.beginner}</span>
          </button>

          <button
            onClick={() => setActiveFilter('good-first-issue')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === 'good-first-issue'
                ? 'bg-[#4DE082] text-[#003617] font-semibold'
                : 'text-[#C6C5D5] hover:bg-[#1B1B1D] hover:text-[#E5E1E4]'
            }`}
          >
            <span>Good First Issue</span>
            <span className="text-[10px] font-mono opacity-80 px-1 rounded bg-black/20">{counts.goodFirst}</span>
          </button>

          <button
            onClick={() => setActiveFilter('intermediate')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 ${
              activeFilter === 'intermediate'
                ? 'bg-[#DDB8FF] text-[#490081] font-semibold'
                : 'text-[#C6C5D5] hover:bg-[#1B1B1D] hover:text-[#E5E1E4]'
            }`}
          >
            Intermediate
          </button>

          <button
            onClick={() => setActiveFilter('bug')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 ${
              activeFilter === 'bug'
                ? 'bg-[#FFB4AB] text-[#690005] font-semibold'
                : 'text-[#C6C5D5] hover:bg-[#1B1B1D] hover:text-[#E5E1E4]'
            }`}
          >
            Bugs
          </button>

          <button
            onClick={() => setActiveFilter('enhancement')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 ${
              activeFilter === 'enhancement'
                ? 'bg-[#818CF8] text-[#101B8A] font-semibold'
                : 'text-[#C6C5D5] hover:bg-[#1B1B1D] hover:text-[#E5E1E4]'
            }`}
          >
            Enhancements
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#908F9E] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search issues or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1B1B1D] border border-[#2A2A2C] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#E5E1E4] placeholder-[#908F9E] focus:outline-none focus:border-[#818CF8]"
          />
        </div>
      </div>

      {/* Issue Grid / Cards */}
      {filteredIssues.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
          <span className="material-symbols-outlined text-[#908F9E] text-4xl">check_circle_outline</span>
          <h3 className="text-sm font-semibold text-[#E5E1E4]">No matching contribution opportunities found</h3>
          <p className="text-xs text-[#908F9E] max-w-md mx-auto">
            Try adjusting your search query or select another difficulty category above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id || issue.number}
              className="group p-5 rounded-xl bg-[#1B1B1D] hover:bg-[#201F21] border border-[#2A2A2C] hover:border-[#818CF8]/50 transition-all flex flex-col justify-between shadow-lg relative"
            >
              <div className="space-y-3">
                {/* Header Metadata */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#818CF8] font-semibold">
                    #{issue.number}
                  </span>
                  
                  {/* Difficulty Badge */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      issue.difficulty === 'beginner'
                        ? 'bg-[#4DE082]/10 text-[#4DE082] border border-[#4DE082]/30'
                        : issue.difficulty === 'intermediate'
                        ? 'bg-[#DDB8FF]/10 text-[#DDB8FF] border border-[#DDB8FF]/30'
                        : 'bg-[#FFB4AB]/10 text-[#FFB4AB] border border-[#FFB4AB]/30'
                    }`}
                  >
                    {issue.difficulty || 'intermediate'}
                  </span>
                </div>

                {/* Issue Title */}
                <h3 className="text-sm font-semibold text-[#E5E1E4] group-hover:text-[#818CF8] transition-colors line-clamp-2 leading-snug">
                  {issue.title}
                </h3>

                {/* Body Snippet */}
                {issue.body && (
                  <p className="text-xs text-[#908F9E] line-clamp-2 leading-relaxed">
                    {issue.body}
                  </p>
                )}

                {/* Labels */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {issue.labels.slice(0, 3).map((label, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#201F21] text-[#C6C5D5] border border-[#353437]"
                    >
                      {label.name}
                    </span>
                  ))}
                  {issue.labels.length > 3 && (
                    <span className="text-[10px] font-mono text-[#908F9E] px-1 pt-0.5">
                      +{issue.labels.length - 3}
                    </span>
                  )}
                </div>

                {/* Affected Code Locations if present */}
                {issue.relatedPaths && issue.relatedPaths.length > 0 && (
                  <div className="p-2 rounded bg-[#131315] border border-[#2A2A2C] flex items-center gap-2 text-[11px] font-mono text-[#908F9E]">
                    <span className="material-symbols-outlined text-[14px] text-[#818CF8]">code</span>
                    <span className="truncate">{issue.relatedPaths[0]}</span>
                    {issue.relatedPaths.length > 1 && (
                      <span className="text-[10px] text-[#818CF8] shrink-0">+{issue.relatedPaths.length - 1}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Actions Footer */}
              <div className="pt-4 mt-4 border-t border-[#2A2A2C] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#908F9E]">
                  <span className="material-symbols-outlined text-[14px]">chat_bubble_outline</span>
                  <span>{issue.comments}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={issue.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-[#2A2A2C] text-[#908F9E] hover:text-[#E5E1E4] transition-colors"
                    title="Open on GitHub"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>

                  <button
                    onClick={() => onSelectIssue(issue)}
                    className="px-3 py-1.5 rounded bg-[#818CF8] hover:bg-[#A5B4FC] text-[#101B8A] font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Understand this issue</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}