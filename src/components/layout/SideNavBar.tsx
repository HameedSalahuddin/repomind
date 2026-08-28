'use client';

import Link from 'next/link';

export type WorkspaceTab = 'overview' | 'architecture' | 'gitstory' | 'qna' | 'skillpatch';

interface SideNavBarProps {
  activeTab: WorkspaceTab;
  onTabChange?: (tab: WorkspaceTab) => void;
  repoUrl?: string;
}

export default function SideNavBar({ activeTab, onTabChange, repoUrl }: SideNavBarProps) {
  const handleNav = (tab: WorkspaceTab, e: React.MouseEvent) => {
    if (onTabChange) {
      e.preventDefault();
      onTabChange(tab);
    }
  };

  const currentRepoParam = repoUrl ? `?repo=${encodeURIComponent(repoUrl)}` : '';

  return (
    <nav className="w-60 h-screen fixed left-0 top-0 bg-[#08090B] border-r border-[#1E222A] flex flex-col py-6 px-4 z-50 select-none">
      {/* Brand Header */}
      <div className="mb-8 px-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <span className="font-semibold text-base tracking-tight text-[#E6E8EC]">RepoMind</span>
        </Link>
      </div>

      {/* Primary Destinations */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A606C] px-2 mb-1">Navigation</span>

        <Link
          href={`/app${currentRepoParam}&tab=overview`}
          onClick={(e) => handleNav('overview', e)}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
            activeTab === 'overview'
              ? 'text-[#E6E8EC] bg-[#14171D] font-medium border-l-2 border-[#8B5CF6]'
              : 'text-[#8B929E] hover:text-[#E6E8EC] hover:bg-[#0E1014]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>Overview</span>
        </Link>

        <Link
          href={`/app${currentRepoParam}&tab=architecture`}
          onClick={(e) => handleNav('architecture', e)}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
            activeTab === 'architecture'
              ? 'text-[#E6E8EC] bg-[#14171D] font-medium border-l-2 border-[#8B5CF6]'
              : 'text-[#8B929E] hover:text-[#E6E8EC] hover:bg-[#0E1014]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">schema</span>
          <span>Architecture</span>
        </Link>

        <Link
          href={`/app${currentRepoParam}&tab=gitstory`}
          onClick={(e) => handleNav('gitstory', e)}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
            activeTab === 'gitstory'
              ? 'text-[#E6E8EC] bg-[#14171D] font-medium border-l-2 border-[#8B5CF6]'
              : 'text-[#8B929E] hover:text-[#E6E8EC] hover:bg-[#0E1014]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>GitStory</span>
        </Link>

        <Link
          href={`/app${currentRepoParam}&tab=qna`}
          onClick={(e) => handleNav('qna', e)}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
            activeTab === 'qna'
              ? 'text-[#E6E8EC] bg-[#14171D] font-medium border-l-2 border-[#8B5CF6]'
              : 'text-[#8B929E] hover:text-[#E6E8EC] hover:bg-[#0E1014]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>Ask AI</span>
        </Link>
      </div>

      {/* Secondary Action */}
      <div className="pt-4 border-t border-[#1E222A] flex flex-col gap-2">
        <Link
          href={`/app${currentRepoParam}&tab=skillpatch`}
          onClick={(e) => handleNav('skillpatch', e)}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
            activeTab === 'skillpatch'
              ? 'text-[#06B6D4] bg-[#06B6D4]/10 font-medium'
              : 'text-[#8B929E] hover:text-[#06B6D4] hover:bg-[#0E1014]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span>Onboarding Wiki</span>
        </Link>

        <Link
          href="/"
          className="text-xs text-[#8B929E] hover:text-[#E6E8EC] px-2.5 py-1.5 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>Change Repo</span>
        </Link>
      </div>
    </nav>
  );
}
