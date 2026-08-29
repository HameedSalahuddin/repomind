import { NextResponse } from 'next/server';
import { fetchRepositoryAnalysis } from '@/lib/github/ingestion';
import { buildIssueInvestigationContext } from '@/lib/ai/investigationContext';
import { buildInvestigationMessages } from '@/lib/ai/investigationPrompt';
import { generateJSONCompletion } from '@/lib/ai/llmClient';
import { validateAndCleanCitations } from '@/lib/ai/citationValidator';
import { InvestigationResult, RelevantFile } from '@/types/investigation';

export async function POST(request: Request) {
  const tStart = Date.now();
  try {
    const body = await request.json().catch(() => ({}));
    const { owner, repo, issueNumber, repoUrl } = body;

    let targetUrl = repoUrl;
    if (!targetUrl && owner && repo) {
      targetUrl = `https://github.com/${owner}/${repo}`;
    }

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing repository URL or owner/repo.' },
        { status: 400 }
      );
    }

    if (!issueNumber || typeof issueNumber !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid "issueNumber" parameter.' },
        { status: 400 }
      );
    }

    console.log(`[investigate] start for issue #${issueNumber} (${targetUrl})`);

    // 1. Fetch or reuse cached repository analysis
    const tIngest = Date.now();
    const { analysis } = await fetchRepositoryAnalysis(targetUrl);
    console.log(`[investigate] repository analysis retrieved (${Date.now() - tIngest}ms)`);

    // 2. Build Bounded Evidence Context
    const tContext = Date.now();
    const context = await buildIssueInvestigationContext(analysis, issueNumber);
    console.log(
      `[investigate] context ready (${Date.now() - tContext}ms | sourceFiles=${context.sourceFiles.length})`
    );

    // 3. Construct LLM Messages
    const messages = buildInvestigationMessages(context);

    // 4. Generate Structured JSON Completion via Real Gemini API
    const tGemini = Date.now();
    console.log(`[investigate] calling Gemini API...`);

    let rawResult: InvestigationResult;
    try {
      rawResult = await generateJSONCompletion<InvestigationResult>(messages, {
        temperature: 0.1,
        maxTokens: 2048,
        timeoutMs: 20000,
      });
      console.log(`[investigate] Gemini response received (${Date.now() - tGemini}ms)`);
    } catch (llmErr: any) {
      console.warn(`[investigate] Gemini call failed (${llmErr?.message}). Constructing fallback learning path from deterministic evidence.`);

      const sourcePaths = context.sourceFiles.map((f) => f.path);
      const fallbackFiles: RelevantFile[] = sourcePaths.map((p: string, idx: number) => ({
        path: p,
        reason: 'Identified from deterministic repository path matching.',
        relevance: (idx === 0 ? 'primary' : 'supporting') as 'primary' | 'supporting',
        estimatedMinutes: 5,
      }));

      rawResult = {
        issueSummary: `Issue #${context.issue.number}: ${context.issue.title}`,
        whatIsHappening: context.issue.body || 'Review issue description and related repository files.',
        likelyCause: 'AI guidance temporarily unavailable. Review evidence context below.',
        confidence: 'low',
        learningPath: {
          goal: 'Understand the primary affected files in this repository.',
          files: fallbackFiles,
          concepts: ['Module Boundaries: Understand how request data flows through the subsystem.'],
          questions: ['Where does execution enter this component?', 'How are responses handled?'],
        },
        affectedAreas: fallbackFiles.map((f: RelevantFile) => ({ path: f.path, reason: f.reason })),
        keyEvidence: fallbackFiles.map((f: RelevantFile) => ({ path: f.path, lineStart: null, lineEnd: null, explanation: f.reason })),
        relatedIssues: context.relatedIssues.map((r) => ({ number: r.number, reason: r.reason })),
        investigationSteps: [
          `1. Inspect file: ${fallbackFiles[0]?.path || 'repository entry point'}`,
          `2. Read issue description for reproduction steps`,
          `3. Run local unit tests`,
        ],
        suggestedFixDirection: 'Review related files and trace function execution paths.',
        testingStrategy: ['Run existing unit tests for the affected module.'],
        difficultyAssessment: {
          level: (['beginner', 'intermediate', 'advanced'].includes(context.issue.difficulty)
            ? context.issue.difficulty
            : 'intermediate') as 'beginner' | 'intermediate' | 'advanced',
          reason: 'Determined from GitHub labels and repository structure',
        },
        evidenceLimitations: [llmErr?.message || 'AI guidance temporarily unavailable.'],
      };
    }

    // 5. Validate & Clean Citations against Real File Tree
    const tValidate = Date.now();
    const targetIssue = analysis.issues.find((i) => i.number === issueNumber);
    const validFilePaths = Array.from(new Set([
      ...context.sourceFiles.map((f) => f.path),
      ...analysis.entryPoints,
      ...(targetIssue?.relatedPaths || []),
      ...analysis.fileTree.map((f) => f.path),
    ]));

    const cleanedResult = validateAndCleanCitations(rawResult, validFilePaths);
    console.log(`[investigate] citation validation complete (${Date.now() - tValidate}ms)`);
    console.log(`[investigate] complete (${Date.now() - tStart}ms total)`);

    return NextResponse.json({
      success: true,
      issueNumber,
      result: cleanedResult,
    });
  } catch (error: any) {
    const rawMsg = error?.message || 'An error occurred during issue investigation.';
    console.error(`[investigate] failed (${Date.now() - tStart}ms):`, rawMsg);

    return NextResponse.json(
      { success: false, error: rawMsg },
      { status: 500 }
    );
  }
}
