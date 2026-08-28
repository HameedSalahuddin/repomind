'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Code2, GitBranch, Cpu, Sparkles, BookOpen } from 'lucide-react';

export default function LandingPage() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/repomind-demo/task-craft-api');
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    router.push(`/app?repo=${encodeURIComponent(repoUrl)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20">
              R
            </div>
            <span className="font-bold text-xl tracking-tight text-white">RepoMind</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <button
              onClick={() => router.push('/app')}
              className="text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors border border-slate-700"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI-Powered Developer Intelligence</span>
        </div>

        <h1 className="max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight mb-6">
          Understand what the code does, <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            and understand how it got there.
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          RepoMind analyzes any unfamiliar public GitHub repository to deliver instant architecture maps, 
          evidence-grounded AI Q&A, GitStory evolutionary timelines, and SkillPatch onboarding wikis.
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleAnalyze} className="w-full max-w-2xl mb-16">
          <div className="relative flex items-center p-2 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-2xl">
            <Code2 className="w-6 h-6 text-slate-500 ml-4 mr-2 shrink-0" />
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Paste public GitHub repository URL (e.g., https://github.com/owner/repo)"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none px-2 py-3"
            />
            <button
              type="submit"
              className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Analyze Repo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Key Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-2">Architecture Mapping</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Extracts dependencies, modules, and API boundaries into interactive visual component graphs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-2">Evidence-Based Q&A</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ask natural-language questions with inline file paths, line citations, and zero AI hallucinations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-800/50 flex items-center justify-center text-pink-400 mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-2">GitStory Evolutionary Timeline</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Synthesizes raw git commits into high-level architectural milestones and feature evolutions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-2">SkillPatch Onboarding Wiki</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generates role-specific onboarding documentation tailored for contributors, staff engineers, and PMs.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>RepoMind — AI-Powered Developer Tooling. Built for 48-Hour Hackathon MVP.</p>
      </footer>
    </div>
  );
}
