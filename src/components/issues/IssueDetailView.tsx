'use client';

import { RepositoryIssue } from '@/types/repo';

interface IssueDetailViewProps {
  issue: RepositoryIssue;
  onUnderstandIssue: (issue: RepositoryIssue) => void;
  onBack: () => void;
  onNavigateCode?: (filePath?: string) => void;
}

export default function IssueDetailView({
  issue,
  onUnderstandIssue,
  onBack,
  onNavigateCode,
}: IssueDetailViewProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Back & Quick Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1B1D] hover:bg-[#201F21] text-xs font-mono text-[#C6C5D5] border border-[#2A2A2C] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Issues</span>
        </button>

        <div className="flex items-center gap-3">
          <a
            href={issue.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1B1D] hover:bg-[#201F21] text-xs font-mono text-[#C6C5D5] border border-[#2A2A2C] transition-colors"
          >
            <span>Open on GitHub</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>

          <button
            onClick={() => onUnderstandIssue(issue)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#818CF8] hover:bg-[#A5B4FC] text-[#101B8A] font-semibold text-xs shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Understand this issue</span>
          </button>
        </div>
      </div>

      {/* Main Issue Card Container */}
      <div className="rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] overflow-hidden shadow-xl">
        {/* Issue Header Banner */}
        <div className="p-6 border-b border-[#2A2A2C] space-y-3 bg-[#18181D]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[#818CF8] font-bold text-sm">#{issue.number}</span>
            <span className="text-[#908F9E]">•</span>
            <span className="text-[#4DE082] bg-[#4DE082]/10 border border-[#4DE082]/30 px-2 py-0.5 rounded uppercase text-[10px] font-semibold">
              {issue.state}
            </span>
            <span className="text-[#908F9E]">•</span>
            <span className="text-[#C6C5D5]">Opened by <strong className="text-[#E5E1E4]">{issue.author}</strong></span>
            <span className="text-[#908F9E]">•</span>
            <span className="text-[#908F9E]">
              Created {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#E5E1E4] tracking-tight font-headline">
            {issue.title}
          </h1>

          {/* Issue Badges & Difficulty */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                issue.difficulty === 'beginner'
                  ? 'bg-[#4DE082]/10 text-[#4DE082] border border-[#4DE082]/30'
                  : issue.difficulty === 'intermediate'
                  ? 'bg-[#DDB8FF]/10 text-[#DDB8FF] border border-[#DDB8FF]/30'
                  : 'bg-[#FFB4AB]/10 text-[#FFB4AB] border border-[#FFB4AB]/30'
              }`}
            >
              Difficulty: {issue.difficulty || 'intermediate'}
            </span>

            {issue.labels.map((label, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded text-xs font-mono bg-[#201F21] text-[#C6C5D5] border border-[#353437]"
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>

        {/* Issue Body & Meta Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#2A2A2C]">
          {/* Main Description (2 cols) */}
          <div className="p-6 lg:col-span-2 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#908F9E] font-semibold">
              Original Issue Description
            </h2>

            <div className="prose prose-invert max-w-none text-xs text-[#C6C5D5] leading-relaxed whitespace-pre-wrap font-sans bg-[#131315] p-4 rounded-lg border border-[#2A2A2C]">
              {issue.body || 'No description provided for this GitHub issue.'}
            </div>
          </div>

          {/* Related Code Areas & Context Sidebar (1 col) */}
          <div className="p-6 space-y-6 bg-[#18181D]">
            {/* Primary Call to Action Box */}
            <div className="p-4 rounded-xl bg-[#201F21] border border-[#818CF8]/40 space-y-3">
              <div className="flex items-center gap-2 text-[#818CF8]">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span className="text-xs font-semibold">AI Investigation Ready</span>
              </div>
              <p className="text-xs text-[#C6C5D5] leading-relaxed">
                RepoMind can trace code paths, identify key evidence files, and give you an actionable step-by-step checklist to resolve this issue.
              </p>
              <button
                onClick={() => onUnderstandIssue(issue)}
                className="w-full py-2 px-3 rounded-lg bg-[#818CF8] hover:bg-[#A5B4FC] text-[#101B8A] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Understand this issue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Related Code Locations */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#908F9E] font-semibold">
                Where does this issue live?
              </h3>

              {issue.relatedPaths && issue.relatedPaths.length > 0 ? (
                <div className="space-y-1.5">
                  {issue.relatedPaths.map((path, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateCode && onNavigateCode(path)}
                      className="w-full p-2 rounded bg-[#131315] hover:bg-[#201F21] border border-[#2A2A2C] hover:border-[#818CF8]/50 text-left text-xs font-mono text-[#818CF8] transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{path}</span>
                      <span className="material-symbols-outlined text-[14px] text-[#908F9E] group-hover:text-[#818CF8]">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#908F9E] italic">
                  No explicit file paths matched yet. Trigger AI investigation to uncover relevant code files.
                </p>
              )}
            </div>

            {/* Issue Metadata List */}
            <div className="space-y-2 pt-2 border-t border-[#2A2A2C] text-xs font-mono text-[#908F9E]">
              <div className="flex justify-between">
                <span>Comments:</span>
                <span className="text-[#E5E1E4]">{issue.comments}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span className="text-[#E5E1E4]">{new Date(issue.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}