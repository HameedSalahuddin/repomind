'use client';

import Link from 'next/link';

export type WorkspaceTab = 
  | 'contribute' 
  | 'issues' 
  | 'code' 
  | 'investigations' 
  | 'plan'
<<<<<<< HEAD
  | 'architecture' 
  | 'qna';
=======
  | 'architecture';
>>>>>>> d7bf407 (refactor: remove GitStory, SkillPatch, QnA legacy product features and clean codebase)

interface SideNavBarProps {
  activeTab: WorkspaceTab;
  onTabChange?: (tab: WorkspaceTab) => void;
  repoUrl?: string;
  selectedIssueNumber?: number | null;
}

export default function SideNavBar({ activeTab, onTabChange, repoUrl, selectedIssueNumber }: SideNavBarProps) {
  const handleNav = (tab: WorkspaceTab, e: React.MouseEvent) => {
    if (onTabChange) {
      e.preventDefault();
      onTabChange(tab);
    }
  };

  const currentRepoParam = repoUrl ? `?repo=${encodeURIComponent(repoUrl)}` : '';

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 bg-[#131315] border-r border-[#1F1F23] flex flex-col z-50 select-none">
      {/* Brand Header & Repository Title */}
      <div className="p-4 border-b border-[#1F1F23] flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-[#818CF8]/10 border border-[#818CF8]/30 flex items-center justify-center text-[#818CF8] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <span className="font-semibold text-base tracking-tight text-[#E5E1E4]">RepoMind</span>
        </Link>
        {repoUrl && (
          <div className="mt-1 flex items-center gap-2 px-2 py-1.5 rounded bg-[#1B1B1D] border border-[#2A2A2C] text-xs">
            <span className="material-symbols-outlined text-[#908F9E] text-[16px]">folder_zip</span>
            <span className="font-mono text-[#E5E1E4] truncate font-medium">{repoUrl}</span>
          </div>
        )}
      </div>

      {/* Primary Navigation Pillars */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#908F9E] px-2 mb-1">
          Contributor Workspace
        </span>

        {/* 1. Start Contributing (Primary Destination) */}
        <Link
          href={`/app${currentRepoParam}&tab=contribute`}
          onClick={(e) => handleNav('contribute', e)}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-xs transition-all ${
            activeTab === 'contribute'
              ? 'text-[#4DE082] bg-[#4DE082]/10 font-semibold border-l-2 border-[#4DE082]'
              : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          <span>Start Contributing</span>
        </Link>

        {/* 2. Issues */}
        <Link
          href={`/app${currentRepoParam}&tab=issues`}
          onClick={(e) => handleNav('issues', e)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
            activeTab === 'issues'
              ? 'text-[#818CF8] bg-[#818CF8]/10 font-medium border-l-2 border-[#818CF8]'
              : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">error_outline</span>
          <span>Issues</span>
        </Link>

        {/* 3. Understand Code */}
        <Link
          href={`/app${currentRepoParam}&tab=code`}
          onClick={(e) => handleNav('code', e)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
            activeTab === 'code'
              ? 'text-[#818CF8] bg-[#818CF8]/10 font-medium border-l-2 border-[#818CF8]'
              : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">code_blocks</span>
          <span>Understand Code</span>
        </Link>

        {/* 4. Investigations */}
        <Link
          href={`/app${currentRepoParam}&tab=investigations`}
          onClick={(e) => handleNav('investigations', e)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
            activeTab === 'investigations'
              ? 'text-[#DDB8FF] bg-[#62259B]/30 font-medium border-l-2 border-[#DDB8FF]'
              : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>Investigations</span>
          {selectedIssueNumber && (
            <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#62259B]/50 text-[#DDB8FF]">
              #{selectedIssueNumber}
            </span>
          )}
        </Link>

        {/* 4b. Contribution Plan (Active when selected) */}
        {selectedIssueNumber && (
          <Link
            href={`/app${currentRepoParam}&tab=plan`}
            onClick={(e) => handleNav('plan', e)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
              activeTab === 'plan'
                ? 'text-[#4DE082] bg-[#4DE082]/10 font-medium border-l-2 border-[#4DE082]'
                : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">task_alt</span>
            <span>Contribution Plan</span>
          </Link>
        )}

        {/* 5. Architecture */}
        <Link
          href={`/app${currentRepoParam}&tab=architecture`}
          onClick={(e) => handleNav('architecture', e)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
            activeTab === 'architecture'
              ? 'text-[#818CF8] bg-[#818CF8]/10 font-medium border-l-2 border-[#818CF8]'
              : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span>Architecture</span>
        </Link>
<<<<<<< HEAD

        {/* 6. Ask AI Q&A */}
        <Link
          href={`/app${currentRepoParam}&tab=qna`}
          onClick={(e) => handleNav('qna', e)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-all ${
            activeTab === 'qna'
              ? 'text-[#818CF8] bg-[#818CF8]/10 font-medium border-l-2 border-[#818CF8]'
              : 'text-[#C6C5D5] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>Ask AI</span>
        </Link>
=======
>>>>>>> d7bf407 (refactor: remove GitStory, SkillPatch, QnA legacy product features and clean codebase)
      </div>

      {/* Footer Navigation Switcher */}
      <div className="p-3 border-t border-[#1F1F23] flex flex-col gap-1">
        <Link
          href="/"
          className="text-xs text-[#908F9E] hover:text-[#E5E1E4] px-3 py-2 rounded hover:bg-[#1B1B1D] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>Switch Repository</span>
        </Link>
      </div>
    </aside>
  );
}
