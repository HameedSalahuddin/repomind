'use client';

import { useState, useEffect, useMemo } from 'react';
import { RepositoryAnalysis, RepositoryIssue } from '@/types/repo';
import { InvestigationResult } from '@/types/investigation';

interface ContributionPlanViewProps {
  analysis: RepositoryAnalysis;
  issue: RepositoryIssue;
  investigation: InvestigationResult | null;
  onNavigateCode?: (filePath?: string) => void;
  onNavigateArchitecture?: () => void;
  onBackToWorkspace?: () => void;
}

export default function ContributionPlanView({
  analysis,
  issue,
  investigation,
  onNavigateCode,
  onNavigateArchitecture,
  onBackToWorkspace,
}: ContributionPlanViewProps) {
  const storageKey = `repomind_plan_progress_${analysis.fullName}_${issue.number}`;

  // Persisted Checklist State
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Save checklist state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(completedItems));
      } catch (e) {
        // localStorage write fallback
      }
    }
  }, [completedItems, storageKey]);

  const toggleItem = (key: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Section 1: Understand items
  const relatedNodeObj = useMemo(() => {
    if (!analysis.architecture?.nodes) return null;
    return analysis.architecture.nodes.find(
      (node) =>
        node.issueIds?.includes(issue.number) ||
        (issue.relatedPaths && node.filePaths?.some((p) => issue.relatedPaths.includes(p)))
    );
  }, [analysis, issue]);

  // Section 2: Investigation steps checklist
  const investigationSteps = investigation?.investigationSteps || [
    `Inspect file tree & entry points`,
    `Trace execution path for #${issue.number}`,
    `Run local test suites`,
  ];

  // Section 3: Affected files
  const affectedAreas = investigation?.affectedAreas || (issue.relatedPaths || []).map((p) => ({
    path: p,
    reason: 'Identified from repository file path matching',
  }));

  const keyEvidence = investigation?.keyEvidence || [];

  // Section 5: Test plan
  const testingStrategy = investigation?.testingStrategy || [
    'Run existing unit test suite for affected module.',
    'Add regression test reproducing the issue condition.',
  ];

  // Section 6: Final Contribution Checklist
  const finalChecklist = [
    { key: 'reproduced', label: 'Issue reproduced locally' },
    { key: 'understood', label: 'Relevant code & execution flow understood' },
    { key: 'implemented', label: 'Implementation changes completed' },
    { key: 'regression', label: 'Regression test added' },
    { key: 'tests_pass', label: 'All existing tests passing' },
    { key: 'no_unrelated', label: 'No unrelated changes included' },
    { key: 'requirements', label: 'Issue requirements verified' },
    { key: 'ready_pr', label: 'Ready to open Pull Request on GitHub' },
  ];

  // Overall Progress calculation
  const totalStepsCount =
    investigationSteps.length + testingStrategy.length + finalChecklist.length;

  const completedStepsCount = useMemo(() => {
    let count = 0;
    investigationSteps.forEach((_, idx) => {
      if (completedItems[`inv_${idx}`]) count++;
    });
    testingStrategy.forEach((_, idx) => {
      if (completedItems[`test_${idx}`]) count++;
    });
    finalChecklist.forEach((item) => {
      if (completedItems[`final_${item.key}`]) count++;
    });
    return count;
  }, [completedItems, investigationSteps, testingStrategy, finalChecklist]);

  const progressPercentage = Math.round((completedStepsCount / (totalStepsCount || 1)) * 100);

  // Active Progress Stage indicator
  const activeStage = useMemo(() => {
    if (completedStepsCount === 0) return 'UNDERSTAND';
    if (completedStepsCount < investigationSteps.length) return 'INVESTIGATE';
    if (completedStepsCount < investigationSteps.length + testingStrategy.length) return 'IMPLEMENT';
    if (completedStepsCount < totalStepsCount) return 'TEST';
    return 'SUBMIT';
  }, [completedStepsCount, investigationSteps.length, testingStrategy.length, totalStepsCount]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBackToWorkspace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1B1D] hover:bg-[#201F21] text-xs font-mono text-[#C6C5D5] border border-[#2A2A2C] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Workspace</span>
          </button>

          <a
            href={issue.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1B1D] hover:bg-[#201F21] text-xs font-mono text-[#C6C5D5] border border-[#2A2A2C] transition-colors"
          >
            <span>View Issue on GitHub</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>

        {/* Issue Banner */}
        <div className="p-6 rounded-xl bg-[#18181D] border border-[#2A2A2C] shadow-xl space-y-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-[#818CF8] font-bold">#{issue.number}</span>
            <span className="text-[#908F9E]">•</span>
            <span className="text-[#908F9E]">{analysis.fullName}</span>
            <span className="text-[#908F9E]">•</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                issue.difficulty === 'beginner'
                  ? 'bg-[#4DE082]/10 text-[#4DE082] border border-[#4DE082]/30'
                  : 'bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/30'
              }`}
            >
              {issue.difficulty || 'intermediate'}
            </span>
            {issue.contributionSignal && issue.contributionSignal !== 'unknown' && (
              <span className="bg-[#DDB8FF]/10 text-[#DDB8FF] border border-[#DDB8FF]/30 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                {issue.contributionSignal}
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#E5E1E4] tracking-tight font-headline">
            {issue.title}
          </h1>

          <p className="text-xs text-[#908F9E]">
            Turn this issue into an actionable contribution plan with verified repository evidence.
          </p>
        </div>
      </div>

      {/* Progress Lifecycle Pipeline Bar */}
      <div className="p-4 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[#E5E1E4] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4DE082]">task_alt</span>
            <span>Contribution Progress ({progressPercentage}%)</span>
          </span>
          <span className="text-[#908F9E]">
            {completedStepsCount} of {totalStepsCount} tasks completed
          </span>
        </div>

        {/* Lifecycle Steps Bar */}
        <div className="grid grid-cols-5 gap-1 pt-1 font-mono text-[10px] text-center">
          {['UNDERSTAND', 'INVESTIGATE', 'IMPLEMENT', 'TEST', 'SUBMIT'].map((stage) => {
            const isCurrent = activeStage === stage;
            return (
              <div
                key={stage}
                className={`py-1.5 rounded transition-all font-semibold ${
                  isCurrent
                    ? 'bg-[#818CF8] text-[#101B8A]'
                    : 'bg-[#201F21] text-[#908F9E] border border-[#353437]'
                }`}
              >
                {stage}
              </div>
            );
          })}
        </div>

        {/* Progress Fill Bar */}
        <div className="w-full h-1.5 bg-[#201F21] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#818CF8] to-[#4DE082] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* SECTION 1 — UNDERSTAND */}
      <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <h2>Section 1 — What should I understand first?</h2>
        </div>

        <div className="p-4 rounded-lg bg-[#131315] border border-[#2A2A2C] space-y-2 font-sans text-xs">
          <span className="font-mono text-[#DDB8FF] text-[11px] uppercase font-semibold block">
            Relevant Code Architecture Area
          </span>
          {relatedNodeObj ? (
            <div className="space-y-1">
              <div className="font-semibold text-[#E5E1E4]">{relatedNodeObj.label}</div>
              <p className="text-[#908F9E] line-clamp-2">
                {relatedNodeObj.description || 'Verified package module boundary.'}
              </p>
              {onNavigateArchitecture && (
                <button
                  onClick={onNavigateArchitecture}
                  className="pt-1 text-[#818CF8] hover:underline font-mono text-[11px] flex items-center gap-1"
                >
                  <span>Inspect in Architecture Graph</span>
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-[#908F9E]">
              Mapped across repository core entry points: {analysis.entryPoints?.slice(0, 2).join(', ') || 'root package'}.
            </p>
          )}
        </div>
      </section>

      {/* SECTION 2 — INVESTIGATE (Checklist) */}
      <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4DE082] font-semibold">
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            <h2>Section 2 — Investigation Checklist</h2>
          </div>
        </div>

        <div className="space-y-2">
          {investigationSteps.map((step, idx) => {
            const key = `inv_${idx}`;
            const isChecked = !!completedItems[key];
            return (
              <label
                key={key}
                onClick={() => toggleItem(key)}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[#4DE082]/10 border-[#4DE082]/40 text-[#908F9E]'
                    : 'bg-[#131315] border-[#2A2A2C] text-[#E5E1E4] hover:bg-[#201F21]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked
                      ? 'bg-[#4DE082] border-[#4DE082] text-[#003617]'
                      : 'border-[#353437] bg-[#201F21]'
                  }`}
                >
                  {isChecked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                </div>
                <span className={`text-xs leading-relaxed ${isChecked ? 'line-through opacity-70' : ''}`}>
                  {step}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 — AFFECTED CODE */}
      <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
          <span className="material-symbols-outlined text-[18px]">folder_open</span>
          <h2>Section 3 — Where should I look? (Affected Code)</h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {affectedAreas.length > 0 ? (
            affectedAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#131315] border border-[#2A2A2C] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-[#818CF8] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">description</span>
                    <span>{area.path}</span>
                  </div>
                  <p className="text-[#908F9E] text-[11px] font-sans">{area.reason}</p>
                </div>

                {onNavigateCode && (
                  <button
                    onClick={() => onNavigateCode(area.path)}
                    className="px-3 py-1.5 rounded bg-[#201F21] hover:bg-[#2A2A2C] text-[#E5E1E4] text-xs font-mono border border-[#353437] transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span>Explore file</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-[#908F9E] italic">
              Insufficient repository evidence to isolate specific files. Review core package entry points.
            </p>
          )}
        </div>

        {/* Key Evidence Snippets */}
        {keyEvidence.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-mono text-[#DDB8FF] uppercase font-semibold block">
              Verified Source Evidence
            </span>
            {keyEvidence.map((ev, idx) => (
              <div key={idx} className="p-3 rounded bg-[#131315] border border-[#2A2A2C] text-xs font-mono space-y-1">
                <div className="text-[#818CF8] font-semibold">{ev.path}</div>
                <p className="text-[#C6C5D5] font-sans text-[11px]">{ev.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4 — POSSIBLE APPROACH */}
      <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DDB8FF] font-semibold">
            <span className="material-symbols-outlined text-[18px]">build</span>
            <h2>Section 4 — Possible approach</h2>
          </div>
          <span className="text-[10px] font-mono bg-[#DDB8FF]/10 text-[#DDB8FF] px-2 py-0.5 rounded border border-[#DDB8FF]/30">
            AI Suggestion (Verify against repo)
          </span>
        </div>

        <p className="text-xs text-[#C6C5D5] leading-relaxed font-sans bg-[#131315] p-4 rounded-lg border border-[#2A2A2C]">
          {investigation?.suggestedFixDirection ||
            'Inspect affected execution flows, create local test cases, and make minimal targeted adjustments.'}
        </p>
      </section>

      {/* SECTION 5 — TEST PLAN */}
      <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-semibold">
          <span className="material-symbols-outlined text-[18px]">science</span>
          <h2>Section 5 — How do I verify it? (Test Plan)</h2>
        </div>

        <div className="space-y-2">
          {testingStrategy.map((testItem, idx) => {
            const key = `test_${idx}`;
            const isChecked = !!completedItems[key];
            return (
              <label
                key={key}
                onClick={() => toggleItem(key)}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[#38BDF8]/10 border-[#38BDF8]/40 text-[#908F9E]'
                    : 'bg-[#131315] border-[#2A2A2C] text-[#E5E1E4] hover:bg-[#201F21]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked
                      ? 'bg-[#38BDF8] border-[#38BDF8] text-[#00210C]'
                      : 'border-[#353437] bg-[#201F21]'
                  }`}
                >
                  {isChecked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                </div>
                <span className={`text-xs leading-relaxed ${isChecked ? 'line-through opacity-70' : ''}`}>
                  {testItem}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* SECTION 6 — FINAL CONTRIBUTION CHECKLIST */}
      <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4DE082] font-semibold">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <h2>Section 6 — Final Contribution Checklist</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {finalChecklist.map((item) => {
            const key = `final_${item.key}`;
            const isChecked = !!completedItems[key];
            return (
              <label
                key={key}
                onClick={() => toggleItem(key)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[#4DE082]/10 border-[#4DE082]/40 text-[#908F9E]'
                    : 'bg-[#131315] border-[#2A2A2C] text-[#E5E1E4] hover:bg-[#201F21]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked
                      ? 'bg-[#4DE082] border-[#4DE082] text-[#003617]'
                      : 'border-[#353437] bg-[#201F21]'
                  }`}
                >
                  {isChecked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                </div>
                <span className={`text-xs font-medium ${isChecked ? 'line-through opacity-70' : ''}`}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
