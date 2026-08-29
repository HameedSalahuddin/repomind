import { NextResponse } from 'next/server';
import { fetchRepositoryAnalysis } from '@/lib/github/ingestion';
import { buildIssueInvestigationContext } from '@/lib/ai/investigationContext';
import { buildInvestigationMessages } from '@/lib/ai/investigationPrompt';
import { generateJSONCompletion } from '@/lib/ai/llmClient';
import { validateAndCleanCitations } from '@/lib/ai/citationValidator';
import { InvestigationResult } from '@/types/investigation';

export async function POST(request: Request) {
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

    // 1. Fetch or reuse cached repository analysis
    const { analysis } = await fetchRepositoryAnalysis(targetUrl);

    // 2. Build Bounded Evidence Context
    const context = await buildIssueInvestigationContext(analysis, issueNumber);

    // 3. Construct LLM Messages
    const messages = buildInvestigationMessages(context);

    // 4. Generate Structured JSON Completion via LLM
    let rawResult: InvestigationResult;
    try {
      rawResult = await generateJSONCompletion<InvestigationResult>(messages, {
        temperature: 0.2,
        maxTokens: 2500,
        jsonMode: true,
      });
    } catch (llmErr: any) {
      const sourcePaths = context.sourceFiles.map((f) => f.path);
      // Return structured fallback investigation if LLM key is missing or fails
      return NextResponse.json({
        success: true,
        issueNumber,
        fallback: true,
        result: {
          issueSummary: `Issue #${context.issue.number}: ${context.issue.title}`,
          whatIsHappening: context.issue.body || 'No description provided.',
          likelyCause: 'Automatic LLM key not configured or call failed. Review evidence context below.',
          confidence: 'low',
          affectedAreas: sourcePaths.map((p) => ({
            path: p,
            reason: 'Identified from deterministic path matching',
          })),
          keyEvidence: sourcePaths.map((p) => ({
            path: p,
            lineStart: null,
            lineEnd: null,
            explanation: 'File referenced in issue description or related architecture module',
          })),
          relatedIssues: context.relatedIssues.map((r) => ({
            number: r.number,
            reason: r.reason,
          })),
          investigationSteps: [
            `1. Inspect file: ${sourcePaths[0] || 'repository entry point'}`,
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
          evidenceLimitations: [
            llmErr?.message || 'Set OPENAI_API_KEY or GEMINI_API_KEY in .env.local for AI reasoning.',
          ],
        },
      });
    }

    // 5. Validate & Clean Citations against Real File Tree
    const targetIssue = analysis.issues.find((i) => i.number === issueNumber);
    const validFilePaths = Array.from(new Set([
      ...context.sourceFiles.map((f) => f.path),
      ...analysis.entryPoints,
      ...(targetIssue?.relatedPaths || []),
      ...analysis.fileTree.map((f) => f.path),
    ]));
    const cleanedResult = validateAndCleanCitations(rawResult, validFilePaths);

    return NextResponse.json({
      success: true,
      issueNumber,
      result: cleanedResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'An error occurred during issue investigation.' },
      { status: 500 }
    );
  }
}
