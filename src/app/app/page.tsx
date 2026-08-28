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

  useEffect(() => {
    if (rawTab && ['overview', 'architecture', 'gitstory', 'qna', 'skillpatch'].includes(rawTab)) {
      setActiveTab(rawTab);
    }
  }, [rawTab]);

  const repoName = rawRepo ? decodeURIComponent(rawRepo) : MOCK_REPO_ANALYSIS.metadata.fullName;

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
      <main className="ml-64 pt-20 p-margin flex-1 min-h-[calc(100vh-5rem)]">
        {activeTab === 'overview' && (
          <OverviewView 
            data={MOCK_REPO_ANALYSIS} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView data={MOCK_REPO_ANALYSIS.architecture} />
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
      </main>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-mono-data text-xs text-primary">
        Loading RepoMind Intelligence Platform...
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
