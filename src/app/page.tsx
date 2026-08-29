'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NeuralNetworkHero from '@/components/neural/NeuralNetworkHero';

export default function LandingPage() {
  const [repoInput, setRepoInput] = useState('github.com/facebook/react');
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    const cleanRepo = repoInput.replace(/^https?:\/\//, '');
    router.push(`/app?repo=${encodeURIComponent(cleanRepo)}&tab=contribute`);
  };

  return (
    <div className="bg-[#08090B] text-[#E6E8EC] font-sans min-h-screen flex flex-col relative overflow-hidden selection:bg-[#7C3AED]/30 selection:text-white">
      {/* Background Technical Grid */}
      <div className="fixed inset-0 z-0 bg-grid-tech opacity-40 pointer-events-none" />

      {/* Atmospheric Radial Ambient Lights */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Interactive Abstract Repository Neural Network Overlay */}
      <NeuralNetworkHero />

      {/* Persistent Top Navigation Bar */}
      <header className="relative z-20 w-full flex justify-between items-center px-8 sm:px-12 h-20 bg-[#08090B]/80 backdrop-blur-md border-b border-[#1E222A]/60 select-none">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-[#7C3AED]/15 border border-[#7C3AED]/40 flex items-center justify-center text-[#8B5CF6] group-hover:border-[#7C3AED] transition-colors">
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-[#E6E8EC]">RepoMind</span>
        </Link>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#8B929E] hover:text-[#E6E8EC] transition-colors tracking-wide"
          >
            Documentation
          </a>
          <Link
            href="/app"
            className="text-xs font-semibold text-[#8B929E] hover:text-[#E6E8EC] bg-[#0E1014] hover:bg-[#14171D] px-4 py-2 rounded transition-all border border-[#1E222A]"
          >
            Open App
          </Link>
        </div>
      </header>

      {/* Central Hero Interface */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto w-full">
        {/* Repository Intelligence Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#8B5CF6] text-[11px] font-mono tracking-widest uppercase mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          <span>OPEN SOURCE CONTRIBUTOR WORKSPACE</span>
        </div>

        {/* Hero Title & Purpose */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#E6E8EC] tracking-tight leading-tight mb-4">
          Make your first contribution.
        </h1>
        <p className="text-base sm:text-lg text-[#8B929E] font-normal tracking-wide mb-12">
          Discover opportunities. Trace the codebase. Build a contribution plan.
        </p>

        {/* Repository Input — Primary Focal Point */}
        <form onSubmit={handleAnalyze} className="w-full max-w-2xl mb-10 relative">
          <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl bg-[#0E1014] border border-[#1E222A] focus-within:border-[#7C3AED] focus-within:ring-1 focus-within:ring-[#7C3AED]/40 transition-all shadow-2xl">
            <div className="flex items-center flex-1 w-full px-3 py-2">
              <span className="material-symbols-outlined text-[#8B929E] text-[20px] mr-3 shrink-0">link</span>
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="github.com/facebook/react"
                required
                className="w-full bg-transparent text-[#E6E8EC] font-mono text-sm placeholder-[#5A606C] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs px-6 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-[#7C3AED]/25 uppercase tracking-wider"
            >
              <span>Start Contributing</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Subtle Capabilities Metaphor Line */}
        <div className="text-xs text-[#8B929E] font-mono tracking-wider uppercase flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          <span>Issue Discovery</span>
          <span className="text-[#5A606C]">•</span>
          <span>Architecture Mapping</span>
          <span className="text-[#5A606C]">•</span>
          <span>AI Investigation</span>
          <span className="text-[#5A606C]">•</span>
          <span>Contribution Plan</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-[11px] font-mono text-[#5A606C] border-t border-[#1E222A]/40">
        RepoMind · Open-Source Contributor Intelligence Workspace
      </footer>
    </div>
  );
}
