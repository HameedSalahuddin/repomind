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
  // Track completed checklist items for Learning Path files, Investigation steps, & Questions
  const [understoodFiles, setUnderstoodFiles] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Record<number, boolean>>({});

  const toggleFileUnderstood = (path: string) => {
    setUnderstoodFiles((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleQuestion = (index: number) => {
    setCompletedQuestions((prev) => ({
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
              <p className="text-xs text-[#908F9E]">Assembling bounded context & building learning path...</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 font-mono text-xs">
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
              <span>Building step-by-step beginner learning path...</span>
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
        <h3 className="text-base font-bold text-[#E5E1E4]">AI guidance temporarily unavailable</h3>
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

  const learningPath = result.learningPath;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Progress Lifecycle Bar */}
      <div className="p-4 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-2.5">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[#E5E1E4] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4DE082]">route</span>
            <span>Contributor Workflow Journey</span>
          </span>
          <span className="text-[#908F9E]">
            Issue #{issue?.number}
          </span>
        </div>

        {/* 6 Lifecycle Steps Bar */}
        <div className="grid grid-cols-6 gap-1 font-mono text-[10px] text-center">
          <div className="py-1 rounded bg-[#4DE082]/20 text-[#4DE082] font-semibold flex items-center justify-center gap-1">
            <span>① Understand</span>
            <span className="material-symbols-outlined text-[12px]">check</span>
          </div>
          <div className="py-1 rounded bg-[#818CF8] text-[#101B8A] font-semibold border-b-2 border-[#E5E1E4]">
            ② Learn Code
          </div>
          <div className="py-1 rounded bg-[#201F21] text-[#908F9E]">
            ③ Investigate
          </div>
          <div className="py-1 rounded bg-[#201F21] text-[#908F9E]">
            ④ Reproduce
          </div>
          <div className="py-1 rounded bg-[#201F21] text-[#908F9E]">
            ⑤ Plan
          </div>
          <div className="py-1 rounded bg-[#201F21] text-[#908F9E]">
            ⑥ Contribute
          </div>
        </div>
      </div>

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
              <span>AI Investigation & Beginner Learning Path</span>
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
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>Build Contribution Plan →</span>
            </button>
          )}
        </div>
      </div>

      {/* 🧭 SECTION 1: WHAT SHOULD I UNDERSTAND FIRST? (LEARNING PATH) */}
      {learningPath && learningPath.files && learningPath.files.length > 0 && (
        <section className="p-6 rounded-xl bg-[#18181D] border border-[#818CF8]/30 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-bold mb-1">
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <h2>🧭 What should I understand first?</h2>
            </div>
            <p className="text-xs text-[#908F9E]">
              You don&apos;t need to understand the whole repository. We&apos;ll guide you through the smallest useful part of the codebase.
            </p>
            {learningPath.goal && (
              <p className="mt-2 text-xs text-[#DDB8FF] font-mono bg-[#62259B]/20 px-3 py-1.5 rounded border border-[#62259B]/40 inline-block">
                Goal: {learningPath.goal}
              </p>
            )}
          </div>

          {/* Ordered File Sequence Steps */}
          <div className="space-y-4">
            {learningPath.files.map((file, idx) => {
              const isUnderstood = !!understoodFiles[file.path];
              return (
                <div
                  key={file.path}
                  className={`p-5 rounded-lg border transition-all space-y-3 ${
                    isUnderstood
                      ? 'bg-[#4DE082]/5 border-[#4DE082]/30 opacity-80'
                      : 'bg-[#131315] border-[#2A2A2C] hover:border-[#818CF8]/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2C] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#818CF8] bg-[#818CF8]/10 px-2 py-0.5 rounded border border-[#818CF8]/30">
                        STEP {idx + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#E5E1E4]">{file.path}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          file.relevance === 'primary'
                            ? 'bg-[#4DE082]/15 text-[#4DE082] border border-[#4DE082]/30'
                            : file.relevance === 'supporting'
                            ? 'bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30'
                            : 'bg-[#908F9E]/15 text-[#908F9E] border border-[#908F9E]/30'
                        }`}
                      >
                        {file.relevance}
                      </span>

                      {file.estimatedMinutes && (
                        <span className="text-[10px] font-mono text-[#908F9E] bg-[#201F21] px-2 py-0.5 rounded border border-[#353437]">
                          ~{file.estimatedMinutes} min
                        </span>
                      )}

                      {onNavigateCode && (
                        <button
                          onClick={() => onNavigateCode(file.path)}
                          className="px-3 py-1 rounded bg-[#818CF8]/10 hover:bg-[#818CF8]/20 text-[#818CF8] font-mono text-xs border border-[#818CF8]/30 transition-colors flex items-center gap-1"
                        >
                          <span>Open file</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="text-[#C6C5D5] leading-relaxed">
                      <span className="font-semibold text-[#E5E1E4]">
                        {idx === 0 ? 'Why start here? ' : 'Why next? '}
                      </span>
                      {file.reason}
                    </div>

                    {file.symbols && file.symbols.length > 0 && (
                      <div className="font-mono text-[11px] text-[#908F9E] flex items-center gap-2">
                        <span className="text-[#818CF8]">Look for:</span>
                        <div className="flex flex-wrap gap-1">
                          {file.symbols.map((sym) => (
                            <span key={sym} className="px-1.5 py-0.5 rounded bg-[#201F21] text-[#E5E1E4] border border-[#353437]">
                              {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {file.lineStart && (
                      <div className="font-mono text-[11px] text-[#908F9E]">
                        Target line range: Lines {file.lineStart} - {file.lineEnd || file.lineStart}
                      </div>
                    )}

                    {/* Local Toggle Mark Understood */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleFileUnderstood(file.path)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                          isUnderstood
                            ? 'bg-[#4DE082] text-[#003617] font-bold'
                            : 'bg-[#201F21] hover:bg-[#2A2A2C] text-[#C6C5D5] border border-[#353437]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isUnderstood ? 'check' : 'radio_button_unchecked'}
                        </span>
                        <span>{isUnderstood ? 'Understood' : 'Mark understood'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🧠 Concepts Section */}
          {learningPath.concepts && learningPath.concepts.length > 0 && (
            <div className="pt-4 border-t border-[#2A2A2C] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DDB8FF] font-semibold">
                <h2>🧠 Concepts you'll encounter</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {learningPath.concepts.map((concept, cIdx) => (
                  <div key={cIdx} className="p-3.5 rounded-lg bg-[#131315] border border-[#2A2A2C] text-xs space-y-1">
                    <p className="text-[#C6C5D5] leading-relaxed">{concept}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🔬 Research Questions Section */}
          {learningPath.questions && learningPath.questions.length > 0 && (
            <div className="pt-4 border-t border-[#2A2A2C] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-semibold">
                  <h2>❓ Research Prompts to Answer</h2>
                </div>
                <span className="text-[11px] font-mono text-[#908F9E]">
                  {Object.values(completedQuestions).filter(Boolean).length} / {learningPath.questions.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {learningPath.questions.map((q, qIdx) => {
                  const isChecked = !!completedQuestions[qIdx];
                  return (
                    <label
                      key={qIdx}
                      onClick={() => toggleQuestion(qIdx)}
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
                        {q}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Progressive Disclosure Sections */}
      <div className="space-y-6">
        {/* 🧩 WHAT WE KNOW vs 🔎 WHAT WE'RE TRYING TO FIND OUT */}
        <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4DE082] font-semibold">
              <h2>🧩 What we know (Facts)</h2>
            </div>
            <p className="text-xs text-[#E5E1E4] leading-relaxed font-sans bg-[#131315] p-4 rounded-lg border border-[#2A2A2C]">
              {result.whatIsHappening}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#2A2A2C]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
              <h2>🔎 What we're trying to find out (Hypothesis)</h2>
            </div>
            <p className="text-xs text-[#C6C5D5] leading-relaxed font-sans bg-[#131315] p-4 rounded-lg border border-[#2A2A2C]">
              {result.likelyCause || 'Trace execution boundaries to determine where actual behavior diverges from expectations.'}
            </p>
          </div>
        </section>

        {/* 🔬 YOUR INVESTIGATION CHECKLIST */}
        <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4DE082] font-semibold">
              <h2>🔬 Your investigation checklist</h2>
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

        {/* 💡 POSSIBLE INVESTIGATION DIRECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DDB8FF] font-semibold">
                <h2>💡 Possible investigation directions</h2>
              </div>
              <p className="text-[11px] text-[#908F9E]">These are hypotheses to investigate — not confirmed solutions.</p>
            </div>
            <p className="text-xs text-[#C6C5D5] leading-relaxed font-sans bg-[#131315] p-3.5 rounded-lg border border-[#2A2A2C]">
              {result.suggestedFixDirection}
            </p>
          </section>

          <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-semibold">
              <h2>🧪 How to verify locally</h2>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[#C6C5D5] bg-[#131315] p-3.5 rounded-lg border border-[#2A2A2C]">
              {result.testingStrategy.map((test, idx) => (
                <li key={idx}>{test}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* 🏗 WHERE DOES THIS ISSUE LIVE? */}
        <section className="p-6 rounded-xl bg-[#1B1B1D] border border-[#2A2A2C] space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold">
              <h2>🏗 Where does this issue live?</h2>
            </div>
            <p className="text-[11px] text-[#908F9E]">
              This shows where the relevant files sit in the repository architecture.
            </p>
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

        {/* Limitations */}
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
