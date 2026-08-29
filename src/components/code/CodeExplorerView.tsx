'use client';

import { useState } from 'react';
import { RepositoryAnalysis, FileTreeNode } from '@/types/repo';

interface CodeExplorerViewProps {
  analysis: RepositoryAnalysis;
  initialFilePath?: string | null;
  onSelectIssue?: (issueNumber: number) => void;
}

export default function CodeExplorerView({
  analysis,
  initialFilePath,
  onSelectIssue,
}: CodeExplorerViewProps) {
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(() => {
    if (initialFilePath) {
      return { path: initialFilePath, name: initialFilePath.split('/').pop() || initialFilePath, type: 'file' };
    }
    return null;
  });

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '': true,
    'src': true,
    'lib': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Find file content if available in importantFiles
  const currentImportantFile = analysis.importantFiles?.find(
    (f) => f.path === selectedFile?.path
  );

  // Find issues related to current file
  const relatedIssuesForFile = analysis.issues.filter(
    (issue) => issue.relatedPaths && issue.relatedPaths.includes(selectedFile?.path || '')
  );

  // Recursive tree renderer
  const renderTree = (nodes: FileTreeNode[]) => {
    return (
      <div className="space-y-0.5 font-mono text-xs pl-2">
        {nodes.map((node) => {
          const isDir = node.type === 'directory';
          const isExpanded = !!expandedFolders[node.path];
          const isSelected = selectedFile?.path === node.path;

          if (isDir) {
            return (
              <div key={node.path} className="space-y-0.5">
                <button
                  onClick={() => toggleFolder(node.path)}
                  className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#1B1B1D] text-[#C6C5D5] hover:text-[#E5E1E4] transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#908F9E]">
                    {isExpanded ? 'folder_open' : 'folder'}
                  </span>
                  <span className="font-medium">{node.name}</span>
                </button>

                {isExpanded && node.children && (
                  <div className="border-l border-[#2A2A2C] ml-2">
                    {renderTree(node.children)}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={node.path}
              onClick={() => setSelectedFile(node)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
                isSelected
                  ? 'bg-[#818CF8]/10 text-[#818CF8] font-semibold border-l-2 border-[#818CF8]'
                  : 'text-[#908F9E] hover:text-[#E5E1E4] hover:bg-[#1B1B1D]'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span className="truncate">{node.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#818CF8]/10 border border-[#818CF8]/30 text-[#818CF8] font-mono text-[11px] font-medium">
            Understand Code
          </span>
          <span className="text-xs text-[#908F9E] font-mono">{analysis.fullName}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#E5E1E4] tracking-tight font-headline">
          Repository File Explorer & Context
        </h1>
        <p className="text-xs text-[#C6C5D5]">
          Browse progressive directory structures and inspect source code relationships with active GitHub issues.
        </p>
      </div>

      {/* Main Split View: Tree + File Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Directory Tree Navigation */}
        <div className="p-4 rounded-xl bg-[#18181D] border border-[#2A2A2C] space-y-4 max-h-[700px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2C]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#908F9E] font-semibold">
              Files ({analysis.stats?.totalFiles || analysis.fileTree.length})
            </span>
          </div>

          {analysis.fileTree && analysis.fileTree.length > 0 ? (
            renderTree(analysis.fileTree)
          ) : (
            <div className="p-4 text-xs font-mono text-[#908F9E] text-center">
              No files found in directory tree
            </div>
          )}
        </div>

        {/* Right: File Source Viewer & Issue Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {selectedFile ? (
            <div className="rounded-xl bg-[#18181D] border border-[#2A2A2C] overflow-hidden space-y-4 shadow-xl">
              {/* File Header */}
              <div className="p-4 bg-[#1B1B1D] border-b border-[#2A2A2C] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#818CF8] text-[18px]">code</span>
                  <span className="text-[#E5E1E4] font-semibold">{selectedFile.path}</span>
                </div>

                <a
                  href={`${analysis.url}/blob/${analysis.defaultBranch}/${selectedFile.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-[#201F21] hover:bg-[#2A2A2C] text-[#C6C5D5] border border-[#353437] transition-colors flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>

              {/* Related Issues Section for Selected File */}
              {relatedIssuesForFile.length > 0 && (
                <div className="px-4 py-3 bg-[#131315] border-b border-[#2A2A2C] space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#DDB8FF] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error_outline</span>
                    <span>Related Open Issues ({relatedIssuesForFile.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {relatedIssuesForFile.map((issue) => (
                      <button
                        key={issue.number}
                        onClick={() => onSelectIssue && onSelectIssue(issue.number)}
                        className="px-2.5 py-1 rounded bg-[#201F21] hover:bg-[#2A2A2C] border border-[#353437] text-xs font-mono text-[#818CF8] transition-colors"
                      >
                        #{issue.number}: {issue.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Viewer Area */}
              <div className="p-4 bg-[#131315] overflow-x-auto">
                {currentImportantFile ? (
                  <pre className="font-mono text-xs text-[#C6C5D5] leading-relaxed whitespace-pre font-normal">
                    <code>{currentImportantFile.content}</code>
                  </pre>
                ) : (
                  <div className="p-8 text-center space-y-2 font-mono text-xs text-[#908F9E]">
                    <span className="material-symbols-outlined text-2xl text-[#908F9E]">visibility_off</span>
                    <p>Source preview not cached locally for this file.</p>
                    <a
                      href={`${analysis.url}/blob/${analysis.defaultBranch}/${selectedFile.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block pt-2 text-[#818CF8] hover:underline"
                    >
                      View full source code on GitHub →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-xl bg-[#18181D] border border-[#2A2A2C] space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#908F9E]">folder_open</span>
              <h3 className="text-sm font-semibold text-[#E5E1E4]">Select a file to inspect</h3>
              <p className="text-xs text-[#908F9E] max-w-sm mx-auto">
                Choose any file from the progressive repository tree on the left to view its details and related issue context.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}