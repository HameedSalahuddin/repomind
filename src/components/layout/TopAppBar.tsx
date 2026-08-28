'use client';

interface TopAppBarProps {
  repoName?: string;
}

export default function TopAppBar({ repoName = 'repomind-demo/task-craft-api' }: TopAppBarProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-15rem)] z-40 bg-[#08090B]/90 backdrop-blur-md border-b border-[#1E222A] flex justify-between items-center px-8 h-14">
      {/* Current Repository Identification */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#8B929E] text-[18px]">folder</span>
        <span className="font-mono text-xs text-[#E6E8EC] font-medium">{repoName}</span>
        <span className="text-[10px] font-mono text-[#5A606C] bg-[#0E1014] px-2 py-0.5 rounded border border-[#1E222A]">
          main
        </span>
      </div>

      {/* Understated Status & Documentation Links */}
      <div className="flex items-center gap-4 text-xs text-[#8B929E]">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#E6E8EC] transition-colors"
        >
          GitHub
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#E6E8EC] transition-colors"
        >
          Docs
        </a>
      </div>
    </header>
  );
}
