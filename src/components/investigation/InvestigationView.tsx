'use client';

import { useState } from 'react';
import { InvestigationResult } from '@/types/investigation';
import { RepositoryIssue } from '@/types/repo';

interface InvestigationViewProps {
  issue: RepositoryIssue | null;
  result: InvestigationResult | null;
  loading: boolean;
  error: string | null;
  onNavigateCode?: (filePath?: string) => void;
  onStartContributionPlan?: () => void;
  onRetry?: () => void;
  onBackToIssue?: () => void;
}

export default function InvestigationView({
  issue,
  result,
  loading,
  error,
  onNavigateCode,
  onStartContributionPlan,
  onRetry,
  onBackToIssue,
}: InvestigationViewProps) {
  // Track completed checklist items for "What should I investigate?"
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 space-y-8">
        <div className="p-8 rounded-xl bg-[#18181D] border border-[#2A2A2C] space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#818CF8] border-t-transparent animate-spin shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-[#E5E1E4]">
                Analyzing Repository & Investigating Issue #{issue?.number || ''}
              </h2>
              <p className="text-xs text-[#908F9E]">Assembling bounded context & running AI reasoning...</p>
            </div>
          </div>

          {/* Redesigned Animated Step Progress */}
          <div className="space-y-3 pt-2 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-[#4DE082]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Issue loaded and validated</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#4DE082]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Relevant source files located in file tree</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#4DE082]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Repository architecture graph context assembled</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#818CF8] animate-pulse">
              <span className="material-symbols-outlined text-[18px]">motion_photos_on</span>
              <span>Understanding the issue and formulating fix steps...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 rounded-xl bg-[#1B1B1D] border border-[#FFB4AB]/40 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FFB4AB]/10 text-[#FFB4AB] flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl">error_outline</span>
        </div>
        <h3 className="text-base font-bold text-[#E5E1E4]">Investigation Failed</h3>
        <p className="text-xs text-[#908F9E]">{error}</p>
        <div className="flex justify-center gap-3 pt-2">
          {onBackToIssue && (
            <button
              onClick={onBackToIssue}
              className="px-4 py-2 rounded-lg bg-[#201F21] text-[#E5E1E4] text-xs font-mono border border-[#353437] hover:bg-[#2A2A2C]"
            >
              Back to Issue
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-[#818CF8] text-[#101B8A] font-bold text-xs"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
        <span className="material-symbols-outlined text-4xl text-[#908F9E]">psychology</span>
        <h3 className="text-base font-semibold text-[#E5E1E4]">No Active Investigation</h3>
        <p className="text-xs text-[#908F9E]">
          Select an issue from &quot;Start Contributing&quot; or &quot;Issues&quot; and click &quot;Understand this issue&quot; to launch an AI investigation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Context Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {onBackToIssue && (
            <button
              onClick={onBackToIssue}
              className="px-3 py-1.5 rounded-lg bg-[#1B1B1D] hover:bg-[#201F21] text-xs font-mono text-[#C6C5D5] border border-[#2A2A2C] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Issue #{issue?.number}</span>
            </button>
          )}
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#908F9E]">Confidence Level:</span>
          <span
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
              result.confidence === 'high'
                ? 'bg-[#4DE082]/10 text-[#4DE082] border border-[#4DE082]/30'
                : result.confidence === 'medium'
                ? 'bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/30'
                : 'bg-[#FFB4AB]/10 text-[#FFB4AB] border border-[#FFB4AB]/30'
            }`}
          >
            {result.confidence}
          </span>
        </div>
      </div>

      {/* Investigation Summary Banner */}
      <div className="p-6 rounded-xl bg-[#18181D] border border-[#2A2A2C] shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#DDB8FF]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>AI Investigation Result</span>
            </div>
            <h1 className="text-xl font-bold text-[#E5E1E4] tracking-tight font-headline">
              {result.issueSummary || `Issue #${issue?.number}: ${issue?.title}`}
            </h1>
          </div>

          {onStartContributionPlan && (
            <button
              onClick={onStartContributionPlan}
              className="px-5 py-2.5 rounded-xl bg-[#4DE082] hover:bg-[#6DFE9C] text-[#003617] font-bold text-xs shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Start Contribution</span>
            </button>
          )}
        </div>
      </div>

      {/* Progressive Disclosure Sections */}
      <div className="space-y-6">
        {/* 1. What is happening? */}
        <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
            <h2>What is happening?</h2>
          </div>
          <p className="text-xs text-[#E5E1E4] leading-relaxed font-sans">
            {result.whatIsHappening}
          </p>
          {result.likelyCause && (
            <div className="mt-3 p-3 rounded-lg bg-[#201F21] border border-[#353437] text-xs space-y-1">
              <span className="font-mono text-[#DDB8FF] font-semibold">Likely Cause:</span>
              <p className="text-[#C6C5D5] leading-relaxed">{result.likelyCause}</p>
            </div>
          )}
        </section>

        {/* 2. Where should I look? (Affected Areas) */}
        <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            <h2>Where does this issue live?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.affectedAreas.map((area, idx) => (
              <button
                key={idx}
                onClick={() => onNavigateCode && onNavigateCode(area.path)}
                className="p-3 rounded-lg bg-[#131315] hover:bg-[#201F21] border border-[#2A2A2C] hover:border-[#818CF8]/50 text-left transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#818CF8]">
                  <span className="truncate font-semibold">{area.path}</span>
                  <span className="material-symbols-outlined text-[14px] text-[#908F9E] group-hover:text-[#818CF8]">
                    open_in_new
                  </span>
                </div>
                <p className="text-[11px] text-[#908F9E] line-clamp-2">{area.reason}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Evidence (Key Evidence) */}
        {result.keyEvidence && result.keyEvidence.length > 0 && (
          <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
              <span className="material-symbols-outlined text-[18px]">find_in_page</span>
              <h2>Source Code Evidence</h2>
            </div>
            <div className="space-y-3">
              {result.keyEvidence.map((evidence, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#131315] border border-[#2A2A2C] space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#818CF8] font-semibold">{evidence.path}</span>
                    {evidence.lineStart && (
                      <span className="text-[#908F9E]">
                        Lines {evidence.lineStart} - {evidence.lineEnd || evidence.lineStart}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#C6C5D5] font-sans leading-relaxed">
                    {evidence.explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. What should I investigate? (Actionable Checklist) */}
        <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4DE082] font-semibold">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              <h2>What should I investigate? (Checklist)</h2>
            </div>
            <span className="text-[11px] font-mono text-[#908F9E]">
              {Object.values(completedSteps).filter(Boolean).length} / {result.investigationSteps.length} completed
            </span>
          </div>

          <div className="space-y-2">
            {result.investigationSteps.map((step, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleStep(idx)}
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

        {/* 5. Suggested Fix Direction & Testing Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DDB8FF] font-semibold">
              <span className="material-symbols-outlined text-[18px]">build</span>
              <h2>Suggested Fix Direction</h2>
            </div>
            <p className="text-xs text-[#C6C5D5] leading-relaxed font-sans">
              {result.suggestedFixDirection}
            </p>
          </section>

          <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-semibold">
              <span className="material-symbols-outlined text-[18px]">science</span>
              <h2>Testing Strategy</h2>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[#C6C5D5]">
              {result.testingStrategy.map((test, idx) => (
                <li key={idx}>{test}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* 6. Limitations */}
        {result.evidenceLimitations && result.evidenceLimitations.length > 0 && (
          <section className="p-4 rounded-lg bg-[#131315] border border-[#2A2A2C] text-xs text-[#908F9E] space-y-1">
            <span className="font-mono text-[#FFB4AB]">Note / Evidence Limitations:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {result.evidenceLimitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}