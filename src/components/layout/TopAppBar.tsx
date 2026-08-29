'use client';

interface TopAppBarProps {
  repoName?: string;
  defaultBranch?: string;
  activeTabTitle?: string;
}

export default function TopAppBar({ 
  repoName = 'expressjs/express',
  defaultBranch = 'main',
  activeTabTitle = 'Start Contributing'
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-15rem)] z-40 bg-[#131315]/90 backdrop-blur-md border-b border-[#1F1F23] flex justify-between items-center px-8 h-14">
      {/* Current Navigation Context & Repo Identification */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-[#E5E1E4] tracking-tight">{activeTabTitle}</span>
        <span className="text-[#454653] font-mono text-xs">/</span>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#1B1B1D] border border-[#2A2A2C]">
          <span className="material-symbols-outlined text-[#908F9E] text-[16px]">folder_zip</span>
          <span className="font-mono text-xs text-[#E5E1E4] font-medium">{repoName}</span>
          <span className="text-[10px] font-mono text-[#908F9E] bg-[#201F21] px-1.5 py-0.5 rounded border border-[#353437]">
            {defaultBranch}
          </span>
        </div>
      </div>

      {/* External Links & System Badges */}
      <div className="flex items-center gap-4 text-xs text-[#908F9E]">
        <div className="flex items-center gap-1.5 text-[11px] font-mono bg-[#4DE082]/10 text-[#4DE082] px-2 py-0.5 rounded border border-[#4DE082]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4DE082] animate-pulse"></span>
          <span>Repository Live</span>
        </div>
        <a
          href={`https://github.com/${repoName}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#E5E1E4] transition-colors flex items-center gap-1 font-mono text-xs"
        >
          <span>GitHub</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>
    </header>
  );
}
