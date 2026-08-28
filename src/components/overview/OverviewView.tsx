'use client';

import { RepositoryAnalysis } from '@/types';

interface OverviewViewProps {
  data: RepositoryAnalysis;
  onNavigateTab?: (tab: 'overview' | 'architecture' | 'gitstory' | 'qna' | 'skillpatch') => void;
}

export default function OverviewView({ data, onNavigateTab }: OverviewViewProps) {
  const meta = data.metadata;

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
                  <span className="text-[10px] font-mono text-[#8B929E] uppercase">{node.type}</span>
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

      {/* 3. Secondary Metadata: Tech Stack & Entry Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#1E222A]">
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
