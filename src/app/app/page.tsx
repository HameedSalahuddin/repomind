'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SideNavBar, { WorkspaceTab } from '@/components/layout/SideNavBar';
import TopAppBar from '@/components/layout/TopAppBar';

// Redesigned Views
import StartContributingView from '@/components/contributions/StartContributingView';
import ContributionPlanView from '@/components/contributions/ContributionPlanView';
import IssueDetailView from '@/components/issues/IssueDetailView';
import InvestigationView from '@/components/investigation/InvestigationView';
import CodeExplorerView from '@/components/code/CodeExplorerView';
import ArchitectureView from '@/components/architecture/ArchitectureView';

// Types and Mock Data
import { RepositoryAnalysis, RepositoryIssue } from '@/types/repo';
import { InvestigationResult } from '@/types/investigation';
import { MOCK_REPO_ANALYSIS } from '@/lib/mockData';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') as WorkspaceTab;
  const rawRepo = searchParams.get('repo');

  // Active Navigation Tab (Defaults to Start Contributing as primary destination)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('contribute');

  // Core Analysis State
  const [analysisData, setAnalysisData] = useState<RepositoryAnalysis>(MOCK_REPO_ANALYSIS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active Issue & Investigation State
  const [selectedIssue, setSelectedIssue] = useState<RepositoryIssue | null>(null);
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(null);
  const [investigationLoading, setInvestigationLoading] = useState<boolean>(false);
  const [investigationError, setInvestigationError] = useState<string | null>(null);

  // Selected Code Path
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  // Sync tab with URL search query param
  useEffect(() => {
    const validTabs: WorkspaceTab[] = [
      'contribute',
      'issues',
      'code',
      'investigations',
      'plan',
      'architecture',
    ];
    if (rawTab && validTabs.includes(rawTab)) {
      setActiveTab(rawTab);
    }
  }, [rawTab]);

  // Fetch real repository analysis when repo URL is provided
  useEffect(() => {
    if (!rawRepo) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl: rawRepo }),
        });

        const json = await res.json();
        if (json.success && json.repository) {
          setAnalysisData(json.repository);
        } else {
          setError(json.error || 'Failed to analyze repository');
        }
      } catch (err: any) {
        setError(err?.message || 'Error connecting to analysis service');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [rawRepo]);

  // Trigger AI Investigation for an issue
  const handleUnderstandIssue = async (issue: RepositoryIssue) => {
    setSelectedIssue(issue);
    setActiveTab('investigations');
    setInvestigationLoading(true);
    setInvestigationError(null);
    setInvestigationResult(null);

    try {
      const targetRepoUrl = rawRepo || analysisData.url || 'https://github.com/expressjs/express';
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: targetRepoUrl,
          issueNumber: issue.number,
        }),
      });

      const json = await res.json();
      if (json.success && json.result) {
        setInvestigationResult(json.result);
      } else {
        setInvestigationError(json.error || 'Investigation could not be completed.');
      }
    } catch (err: any) {
      setInvestigationError(err?.message || 'Failed to run AI investigation.');
    } finally {
      setInvestigationLoading(false);
    }
  };

  // Open Issue Detail
  const handleSelectIssueDetail = (issue: RepositoryIssue) => {
    setSelectedIssue(issue);
    setActiveTab('issues');
  };

  // Navigate directly to code file explorer
  const handleNavigateCode = (filePath?: string) => {
    if (filePath) {
      setSelectedFilePath(filePath);
    }
    setActiveTab('code');
  };

  const repoName = analysisData.fullName || (rawRepo ? decodeURIComponent(rawRepo) : MOCK_REPO_ANALYSIS.metadata.fullName);

  // Tab Title helper
  const tabTitles: Record<WorkspaceTab, string> = {
    contribute: 'Start Contributing',
    issues: selectedIssue ? `Issue #${selectedIssue.number}` : 'Issues',
    code: 'Understand Code',
    investigations: selectedIssue ? `Investigation #${selectedIssue.number}` : 'Investigations',
    plan: selectedIssue ? `Contribution Plan #${selectedIssue.number}` : 'Contribution Plan',
    architecture: 'Architecture',
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#E5E1E4] font-body-base flex">
      {/* Sidebar Navigation Rail */}
      <SideNavBar 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
        repoUrl={repoName}
        selectedIssueNumber={selectedIssue?.number}
      />

      {/* Top Application Bar Header */}
      <TopAppBar 
        repoName={repoName}
        defaultBranch={analysisData.defaultBranch || 'main'}
        activeTabTitle={tabTitles[activeTab]} 
      />

      {/* Main Workspace Canvas */}
      <main className="ml-60 pt-20 px-8 py-6 flex-1 min-h-[calc(100vh-5rem)]">
        {loading ? (
          /* Redesigned Loading State with Progressive Indicators */
          <div className="max-w-md mx-auto my-24 p-8 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#818CF8] border-t-transparent animate-spin shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-[#E5E1E4]">Analyzing Repository</h2>
                <p className="text-xs text-[#908F9E] font-mono">{repoName}</p>
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#4DE082]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Repository found</span>
              </div>
              <div className="flex items-center gap-2 text-[#4DE082]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>File structure loaded</span>
              </div>
              <div className="flex items-center gap-2 text-[#4DE082]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Technologies detected</span>
              </div>
              <div className="flex items-center gap-2 text-[#4DE082]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Issues discovered</span>
              </div>
              <div className="flex items-center gap-2 text-[#818CF8] animate-pulse">
                <span className="material-symbols-outlined text-[16px]">motion_photos_on</span>
                <span>Mapping contribution opportunities...</span>
              </div>
            </div>
          </div>
        ) : error ? (
          /* Redesigned Error Handling View */
          <div className="max-w-lg mx-auto my-16 p-8 rounded-xl bg-[#1B1B1D] border border-[#FFB4AB]/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFB4AB]/10 text-[#FFB4AB] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">error_outline</span>
            </div>
            <h3 className="text-base font-bold text-[#E5E1E4]">Repository Ingestion Error</h3>
            <p className="text-xs text-[#908F9E] leading-relaxed">{error}</p>
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#201F21] hover:bg-[#2A2A2C] text-xs font-mono text-[#E5E1E4] rounded-lg border border-[#353437] transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Start Contributing Page */}
            {activeTab === 'contribute' && (
              <StartContributingView
                analysis={analysisData}
                onSelectIssue={(issue) => handleSelectIssueDetail(issue)}
                onNavigateCode={handleNavigateCode}
              />
            )}

            {/* 2. Issues & Issue Detail Page */}
            {activeTab === 'issues' && (
              selectedIssue ? (
                <IssueDetailView
                  issue={selectedIssue}
                  onUnderstandIssue={handleUnderstandIssue}
                  onBack={() => setSelectedIssue(null)}
                  onNavigateCode={handleNavigateCode}
                />
              ) : (
                <StartContributingView
                  analysis={analysisData}
                  onSelectIssue={(issue) => handleSelectIssueDetail(issue)}
                  onNavigateCode={handleNavigateCode}
                />
              )
            )}

            {/* 3. Understand Code / File Explorer */}
            {activeTab === 'code' && (
              <CodeExplorerView
                analysis={analysisData}
                initialFilePath={selectedFilePath}
                onSelectIssue={(issueNum) => {
                  const found = analysisData.issues.find((i) => i.number === issueNum);
                  if (found) handleSelectIssueDetail(found);
                }}
              />
            )}

            {/* 4. Investigation Workspace */}
            {activeTab === 'investigations' && (
              <InvestigationView
                issue={selectedIssue}
                result={investigationResult}
                loading={investigationLoading}
                error={investigationError}
                onNavigateCode={handleNavigateCode}
                onStartContributionPlan={() => setActiveTab('plan')}
                onRetry={() => selectedIssue && handleUnderstandIssue(selectedIssue)}
                onBackToIssue={() => setActiveTab('issues')}
              />
            )}

            {/* 4b. Contribution Plan View */}
            {activeTab === 'plan' && selectedIssue && (
              <ContributionPlanView
                analysis={analysisData}
                issue={selectedIssue}
                investigation={investigationResult}
                onNavigateCode={handleNavigateCode}
                onNavigateArchitecture={() => setActiveTab('architecture')}
                onBackToWorkspace={() => setActiveTab('contribute')}
              />
            )}

            {/* 5. Architecture Graph */}
            {activeTab === 'architecture' && (
              <ArchitectureView data={analysisData.architecture} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131315] text-[#818CF8] flex items-center justify-center font-mono text-xs">
        Loading RepoMind Intelligence Platform...
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
