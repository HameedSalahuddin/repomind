'use client';

import { useState } from 'react';
import { SkillPatchResponse } from '@/types';

interface SkillPatchViewProps {
  data: SkillPatchResponse;
}

export default function SkillPatchView({ data }: SkillPatchViewProps) {
  const [activeTab, setActiveTab] = useState<'contributor' | 'staff' | 'executive' | 'product'>('contributor');

  const docs = {
    contributor: {
      title: 'Contributor Guide',
      subtitle: 'Progressive setup instructions, request lifecycle, first PR guidelines.',
      content: data.artifacts.contributorGuide,
    },
    staff: {
      title: 'Staff Engineer Guide',
      subtitle: 'Deep architectural insights, state tradeoffs, class/ER diagrams, and tech debt analysis.',
      content: data.artifacts.staffEngineerGuide,
    },
    executive: {
      title: 'Executive Guide',
      subtitle: 'Zero-code capability map, risk assessment matrices, and team topologies.',
      content: data.artifacts.executiveGuide,
    },
    product: {
      title: 'Product Manager Guide',
      subtitle: 'Zero-jargon user journey maps, feature flags, and product FAQs.',
      content: data.artifacts.productManagerGuide,
    },
  };

  const activeDoc = docs[activeTab];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Primary Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">Onboarding Wiki</h1>
          <p className="text-xs text-[#8B929E] font-mono">
            Powered by SkillPatch <code className="text-[#06B6D4]">wiki-architect v1.0</code>
          </p>
        </div>

        <button className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-4 py-2 rounded text-xs font-semibold transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Generate Wiki</span>
        </button>
      </div>

      {/* Document Selection Tabs */}
      <div className="flex border-b border-[#1E222A] gap-6 text-xs">
        <button
          onClick={() => setActiveTab('contributor')}
          className={`pb-2 transition-colors border-b-2 font-medium ${
            activeTab === 'contributor'
              ? 'border-[#06B6D4] text-[#E6E8EC]'
              : 'border-transparent text-[#8B929E] hover:text-[#E6E8EC]'
          }`}
        >
          Contributor
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-2 transition-colors border-b-2 font-medium ${
            activeTab === 'staff'
              ? 'border-[#06B6D4] text-[#E6E8EC]'
              : 'border-transparent text-[#8B929E] hover:text-[#E6E8EC]'
          }`}
        >
          Staff Engineer
        </button>
        <button
          onClick={() => setActiveTab('executive')}
          className={`pb-2 transition-colors border-b-2 font-medium ${
            activeTab === 'executive'
              ? 'border-[#06B6D4] text-[#E6E8EC]'
              : 'border-transparent text-[#8B929E] hover:text-[#E6E8EC]'
          }`}
        >
          Executive
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`pb-2 transition-colors border-b-2 font-medium ${
            activeTab === 'product'
              ? 'border-[#06B6D4] text-[#E6E8EC]'
              : 'border-transparent text-[#8B929E] hover:text-[#E6E8EC]'
          }`}
        >
          Product Manager
        </button>
      </div>

      {/* Selected Document Content Box */}
      <div className="p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] space-y-4">
        <div className="space-y-1 pb-3 border-b border-[#1E222A]">
          <h2 className="text-sm font-bold text-[#E6E8EC]">{activeDoc.title}</h2>
          <p className="text-xs text-[#8B929E]">{activeDoc.subtitle}</p>
        </div>

        <pre className="p-4 rounded bg-[#14171D] text-[#E6E8EC] font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto border border-[#1E222A]">
          {activeDoc.content || 'No document content generated yet. Click "Generate Wiki" to run wiki-architect.'}
        </pre>
      </div>
    </div>
  );
}
