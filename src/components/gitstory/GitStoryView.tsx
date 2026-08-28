'use client';

import { useState } from 'react';
import { GitStoryResponse, GitStoryMilestone } from '@/types';

interface GitStoryViewProps {
  data: GitStoryResponse;
}

export default function GitStoryView({ data }: GitStoryViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<GitStoryMilestone>(
    data.milestones[0] || null
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Page Purpose */}
      <div>
        <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">GitStory</h1>
        <p className="text-xs text-[#8B929E]">Chronological evolution and key architectural milestones.</p>
      </div>

      {/* Clean Timeline Axis */}
      <div className="p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] space-y-6">
        <div className="text-[10px] font-mono text-[#5A606C] uppercase tracking-wider">
          Milestone Timeline (Click to inspect story)
        </div>

        {/* Horizontal Visual Axis */}
        <div className="relative py-4 flex items-center justify-between border-b border-[#1E222A]">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#1E222A] -translate-y-1/2 z-0" />

          {data.milestones.map((m) => {
            const isSelected = selectedMilestone?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMilestone(m)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all border-2 ${
                    isSelected
                      ? 'bg-[#8B5CF6] border-[#E6E8EC] scale-125'
                      : 'bg-[#08090B] border-[#8B929E] group-hover:border-[#E6E8EC]'
                  }`}
                />
                <span className={`text-[11px] font-mono mt-2 transition-colors ${isSelected ? 'text-[#E6E8EC] font-semibold' : 'text-[#8B929E]'}`}>
                  {m.date.substring(0, 7)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Story Detail */}
        {selectedMilestone && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase tracking-wider">
                {selectedMilestone.category} • {selectedMilestone.date}
              </span>
              <span className="text-xs font-mono text-[#5A606C]">ID: {selectedMilestone.id}</span>
            </div>

            <h3 className="text-lg font-bold text-[#E6E8EC]">{selectedMilestone.title}</h3>

            <p className="text-sm text-[#8B929E] leading-relaxed">
              {selectedMilestone.summary}
            </p>

            <blockquote className="text-xs text-[#8B929E] italic border-l-2 border-[#8B5CF6] pl-3 py-1 bg-[#14171D]">
              "{selectedMilestone.explanation}"
            </blockquote>

            {/* Affected Files & Secondary Commits */}
            <div className="pt-4 border-t border-[#1E222A] space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-mono text-[#5A606C] block mb-1.5 uppercase">Affected Modules</span>
                <div className="flex flex-wrap gap-2">
                  {selectedMilestone.affectedFiles.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded bg-[#14171D] border border-[#1E222A] font-mono text-[11px] text-[#E6E8EC]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#5A606C] block mb-1.5 uppercase">Related Commits</span>
                <div className="flex flex-wrap gap-2 font-mono text-[11px] text-[#8B929E]">
                  {selectedMilestone.relatedCommits.map((c) => (
                    <a
                      key={c.sha}
                      href={c.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#8B5CF6] underline"
                    >
                      {c.sha.substring(0, 7)}: {c.message}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
