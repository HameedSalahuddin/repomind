'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SideNavBar, { WorkspaceTab } from '@/components/layout/SideNavBar';
import TopAppBar from '@/components/layout/TopAppBar';
import OverviewView from '@/components/overview/OverviewView';
import ArchitectureView from '@/components/architecture/ArchitectureView';
import GitStoryView from '@/components/gitstory/GitStoryView';
import QnaView from '@/components/qna/QnaView';
import SkillPatchView from '@/components/skillpatch/SkillPatchView';

import { RepositoryAnalysis } from '@/types/repo';
import { 
  MOCK_REPO_ANALYSIS, 
  MOCK_GITSTORY, 
  MOCK_QNA_RESPONSE, 
  MOCK_SKILLPATCH_RESPONSE 
} from '@/lib/mockData';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') as WorkspaceTab;
  const rawRepo = searchParams.get('repo');

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [analysisData, setAnalysisData] = useState<RepositoryAnalysis>(MOCK_REPO_ANALYSIS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rawTab && ['overview', 'architecture', 'gitstory', 'qna', 'skillpatch'].includes(rawTab)) {
      setActiveTab(rawTab);
    }
  }, [rawTab]);

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

  const repoName = analysisData.fullName || (rawRepo ? decodeURIComponent(rawRepo) : MOCK_REPO_ANALYSIS.metadata.fullName);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md flex">
      {/* Sidebar Navigation */}
      <SideNavBar 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
        repoUrl={repoName}
      />

      {/* Top App Bar Header */}
      <TopAppBar repoName={repoName} />

      {/* Main Workspace Content Canvas */}
      <main className="ml-60 pt-16 px-8 py-6 flex-1 min-h-[calc(100vh-4rem)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 font-mono text-xs text-[#8B929E]">
            <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
            <div>Ingesting and analyzing repository <span className="text-[#E6E8EC] font-semibold">{repoName}</span>...</div>
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-lg bg-[#0E1014] border border-red-500/40 text-center space-y-3">
            <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
            <h3 className="text-sm font-bold text-[#E6E8EC]">Analysis Error</h3>
            <p className="text-xs text-[#8B929E]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#14171D] hover:bg-[#1E222A] text-xs font-mono text-[#E6E8EC] rounded border border-[#1E222A] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewView 
                data={analysisData} 
                onNavigateTab={(tab) => setActiveTab(tab)} 
              />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureView data={analysisData.architecture} />
            )}

            {activeTab === 'gitstory' && (
              <GitStoryView data={MOCK_GITSTORY} />
            )}

            {activeTab === 'qna' && (
              <QnaView initialData={MOCK_QNA_RESPONSE} />
            )}

            {activeTab === 'skillpatch' && (
              <SkillPatchView data={MOCK_SKILLPATCH_RESPONSE} />
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
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-mono text-xs text-[#8B5CF6]">
        Loading RepoMind Intelligence Platform...
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
