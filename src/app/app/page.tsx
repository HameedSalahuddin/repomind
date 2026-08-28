'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Network, 
  FolderTree, 
  MessageSquareText, 
  GitCommit, 
  BookMarked,
  Sparkles,
  ExternalLink,
  Star,
  GitFork
} from 'lucide-react';
import { MOCK_REPO_ANALYSIS, MOCK_GITSTORY, MOCK_QNA_RESPONSE, MOCK_SKILLPATCH_RESPONSE } from '@/lib/mockData';

type TabType = 'overview' | 'architecture' | 'explorer' | 'qna' | 'gitstory' | 'skillpatch';

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: MOCK_QNA_RESPONSE.answer,
      citations: MOCK_QNA_RESPONSE.citations
    }
  ]);

  const repo = MOCK_REPO_ANALYSIS;

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: userQuestion, citations: [] },
      {
        role: 'assistant',
        content: `Analyzing '${userQuestion}' across repository files... [Placeholder Response]`,
        citations: [
          { type: 'file', path: 'src/lib/auth.ts', lines: [10, 25], description: 'Relevant authentication definition' }
        ]
      }
    ]);
    setUserQuestion('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-base text-white">
              R
            </div>
            <span className="font-bold text-lg text-white">RepoMind</span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          {/* Repo Header Badge */}
          <div className="flex items-center space-x-3 text-sm">
            <span className="font-semibold text-slate-200">{repo.metadata.fullName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              {repo.metadata.defaultBranch}
            </span>
            <a
              href={repo.metadata.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>{repo.metadata.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-slate-400" />
            <span>{repo.metadata.forks}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'explorer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Code Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('qna')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'qna'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Ask RepoMind AI</span>
          </button>

          <button
            onClick={() => setActiveTab('gitstory')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'gitstory'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>GitStory Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('skillpatch')}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'skillpatch'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>SkillPatch Wiki</span>
          </button>
        </aside>

        {/* Content Region */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="max-w-5xl space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{repo.metadata.fullName}</h1>
                <p className="text-slate-400 text-base leading-relaxed">{repo.summary}</p>
              </div>

              {/* Technologies Badge List */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detected Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {repo.metadata.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Entry Points List */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Key Entry Point Files</span>
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  {repo.entryPoints.map((file) => (
                    <div key={file} className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 text-indigo-300 flex items-center justify-between">
                      <span>{file}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Entry Point</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Architecture Visualization</h2>
                <p className="text-slate-400 text-sm">Extracted components and inter-module dependencies.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repo.architecture.nodes.map((node) => (
                  <div key={node.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-base">{node.label}</h4>
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[10px] uppercase font-bold">
                        {node.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{node.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FILE EXPLORER */}
          {activeTab === 'explorer' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Codebase Explorer</h2>
                <p className="text-slate-400 text-sm">Browse repository file tree and key entry modules.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-4 pb-2 border-b border-slate-800">root/</div>
                {repo.fileTree.map((item) => (
                  <div key={item.path} className="py-1.5 px-2 hover:bg-slate-800/50 rounded flex items-center justify-between">
                    <span className={item.type === 'directory' ? 'text-indigo-400 font-semibold' : 'text-slate-300'}>
                      {item.type === 'directory' ? `📁 ${item.name}` : `📄 ${item.name}`}
                    </span>
                    {item.size && <span className="text-slate-600 text-[10px]">{item.size} B</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QNA */}
          {activeTab === 'qna' && (
            <div className="max-w-4xl space-y-6 flex flex-col h-[calc(100vh-140px)]">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Ask RepoMind AI</h2>
                <p className="text-slate-400 text-sm">Natural language reasoning backed by real repo citations.</p>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white ml-auto max-w-xl'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed mb-3">{msg.content}</p>
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Citations & Evidence</span>
                        {msg.citations.map((cite, cIdx) => (
                          <div key={cIdx} className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                            {cite.path} {cite.lines && `(Lines ${cite.lines.join('-')})`} — {cite.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskQuestion} className="flex gap-3">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Ask anything (e.g. How does authentication work?)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                >
                  Ask AI
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: GITSTORY */}
          {activeTab === 'gitstory' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">GitStory Milestones</h2>
                <p className="text-slate-400 text-sm">Explaining how the codebase evolved over time.</p>
              </div>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-800">
                {MOCK_GITSTORY.milestones.map((m) => (
                  <div key={m.id} className="relative pl-10">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{m.category}</span>
                        <span className="text-xs text-slate-500">{m.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{m.title}</h3>
                      <p className="text-sm text-slate-300">{m.summary}</p>
                      <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                        "{m.explanation}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLPATCH */}
          {activeTab === 'skillpatch' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">SkillPatch Onboarding Wiki</h2>
                  <p className="text-slate-400 text-sm">Powered by SkillPatch <code className="text-indigo-400">wiki-architect</code> capability.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                  Generate Wiki Artifacts
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-white">Generated Contributor Guide Preview</h3>
                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs whitespace-pre-wrap overflow-x-auto border border-slate-800">
                  {MOCK_SKILLPATCH_RESPONSE.artifacts.contributorGuide}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
