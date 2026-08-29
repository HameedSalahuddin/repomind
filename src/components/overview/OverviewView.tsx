'use client';

import { useState } from 'react';
import { RepositoryAnalysis } from '@/types';

interface OverviewViewProps {
  data: RepositoryAnalysis;
  onNavigateTab?: (tab: 'overview' | 'architecture' | 'gitstory' | 'qna' | 'skillpatch') => void;
}

export default function OverviewView({ data, onNavigateTab }: OverviewViewProps) {
  const meta = data.metadata;
  const issues = data.issues || [];
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredIssues = issues.filter((iss) => {
    if (filterDifficulty === 'all') return true;
    return iss.difficulty === filterDifficulty;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2">
      {/* 1. Primary Purpose: Repository Identity */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#E6E8EC] tracking-tight">{meta.fullName}</h1>
          <span className="text-[11px] font-mono text-[#8B929E] bg-[#0E1014] px-2.5 py-0.5 rounded border border-[#1E222A]">
            {meta.defaultBranch}
          </span>
        </div>
        <p className="text-sm text-[#8B929E] leading-relaxed max-w-3xl">
          {meta.description}
        </p>
      </div>

      {/* 2. Primary Visual Element: Architecture Graph Preview (Dominates Page) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A606C]">
            Extracted Component Architecture
          </span>
          <button
            onClick={() => onNavigateTab?.('architecture')}
            className="text-[#8B5CF6] hover:underline flex items-center gap-1"
          >
            <span>Open Interactive Architecture</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Minimal Dominant Architecture Preview Canvas */}
        <div 
          onClick={() => onNavigateTab?.('architecture')}
          className="p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] hover:border-[#8B5CF6]/50 cursor-pointer transition-all relative group"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.architecture.nodes.slice(0, 3).map((node) => (
              <div key={node.id} className="p-4 rounded bg-[#14171D] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#E6E8EC]">{node.label}</span>
                  <div className="flex items-center gap-2">
                    {node.issueCount && node.issueCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                        {node.issueCount} {node.issueCount === 1 ? 'issue' : 'issues'}
                      </span>
                    ) : null}
                    <span className="text-[10px] font-mono text-[#8B929E] uppercase">{node.type}</span>
                  </div>
                </div>
                <p className="text-xs text-[#8B929E] line-clamp-2">{node.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#1E222A] flex justify-between items-center text-xs text-[#5A606C] font-mono">
            <span>{data.architecture.nodes.length} Components • {data.architecture.edges.length} Data Connections</span>
            <span className="text-[#8B5CF6] group-hover:translate-x-1 transition-transform">Inspect Full Graph &rarr;</span>
          </div>
        </div>
      </div>

      {/* 3. Contributor Opportunities / Open Issues */}
      <div className="space-y-4 pt-6 border-t border-[#1E222A]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#E6E8EC] tracking-tight">Open Contribution Opportunities</h2>
            <p className="text-xs text-[#8B929E]">Discovered open issues mapped to repository codebase paths.</p>
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex gap-1.5 text-xs font-mono">
            <button
              onClick={() => setFilterDifficulty('all')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filterDifficulty === 'all'
                  ? 'bg-[#14171D] text-[#E6E8EC] border-[#8B5CF6]'
                  : 'bg-[#0E1014] text-[#8B929E] border-[#1E222A] hover:text-[#E6E8EC]'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilterDifficulty('beginner')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filterDifficulty === 'beginner'
                  ? 'bg-[#14171D] text-[#06B6D4] border-[#06B6D4]'
                  : 'bg-[#0E1014] text-[#8B929E] border-[#1E222A] hover:text-[#06B6D4]'
              }`}
            >
              Good First Issue ({issues.filter((i) => i.difficulty === 'beginner').length})
            </button>
            <button
              onClick={() => setFilterDifficulty('intermediate')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filterDifficulty === 'intermediate'
                  ? 'bg-[#14171D] text-[#8B5CF6] border-[#8B5CF6]'
                  : 'bg-[#0E1014] text-[#8B929E] border-[#1E222A] hover:text-[#8B5CF6]'
              }`}
            >
              Intermediate ({issues.filter((i) => i.difficulty === 'intermediate').length})
            </button>
          </div>
        </div>

        {/* Issues List */}
        {filteredIssues.length > 0 ? (
          <div className="space-y-3">
            {filteredIssues.slice(0, 10).map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-lg bg-[#0E1014] border border-[#1E222A] hover:border-[#1E222A]/80 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={issue.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-xs text-[#E6E8EC] hover:text-[#8B5CF6] transition-colors"
                      >
                        #{issue.number} {issue.title}
                      </a>
                    </div>
                    <div className="text-[11px] font-mono text-[#5A606C] flex items-center gap-3">
                      <span>opened by @{issue.author}</span>
                      <span>•</span>
                      <span>{issue.comments} comments</span>
                    </div>
                  </div>

                  {/* Difficulty Tag */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 ${
                      issue.difficulty === 'beginner'
                        ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                        : issue.difficulty === 'advanced'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30'
                    }`}
                  >
                    {issue.difficulty === 'beginner' ? 'Good First Issue' : issue.difficulty}
                  </span>
                </div>

                {/* Mapped Related Paths */}
                {issue.relatedPaths && issue.relatedPaths.length > 0 && (
                  <div className="pt-2 border-t border-[#1E222A]/60 flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-[#5A606C]">Mapped Paths:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {issue.relatedPaths.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded bg-[#14171D] border border-[#1E222A] text-[#E6E8EC]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] text-center font-mono text-xs text-[#5A606C]">
            No open issues matching filter '{filterDifficulty}'.
          </div>
        )}
      </div>

      {/* 4. Secondary Metadata: Tech Stack & Entry Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#1E222A]">
        {/* Detected Tech Stack */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A606C] block">
            Tech Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {meta.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded bg-[#0E1014] border border-[#1E222A] text-xs font-mono text-[#E6E8EC]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Entry Points */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A606C] block">
            Entry Point Files
          </span>
          <div className="space-y-1.5 font-mono text-xs text-[#8B929E]">
            {data.entryPoints.map((file) => (
              <div key={file} className="flex items-center justify-between py-1 border-b border-[#1E222A]/40">
                <span className="text-[#E6E8EC]">{file}</span>
                <span className="text-[10px] text-[#5A606C] uppercase">Entry</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
