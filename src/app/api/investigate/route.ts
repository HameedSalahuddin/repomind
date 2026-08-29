import { NextResponse } from 'next/server';
import { fetchRepositoryAnalysis } from '@/lib/github/ingestion';
import { buildIssueInvestigationContext } from '@/lib/ai/investigationContext';
import { buildInvestigationMessages } from '@/lib/ai/investigationPrompt';
import { generateJSONCompletion } from '@/lib/ai/llmClient';
import { validateAndCleanCitations } from '@/lib/ai/citationValidator';
import { InvestigationResult } from '@/types/investigation';

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
    const rawResult = await generateJSONCompletion<InvestigationResult>(messages, {
      temperature: 0.1,
      maxTokens: 2048,
      timeoutMs: 20000,
    });
    console.log(`[investigate] Gemini response received (${Date.now() - tGemini}ms)`);

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

    // Format specific user-friendly error messages
    let userFacingError = rawMsg;
    if (rawMsg.includes('GEMINI_API_KEY is missing')) {
      userFacingError = 'Gemini authentication failed: GEMINI_API_KEY is missing in .env.local.';
    } else if (rawMsg.includes('rate limit')) {
      userFacingError = 'GitHub rate limit reached. Please set GITHUB_TOKEN in .env.local.';
    } else if (rawMsg.includes('timed out') || rawMsg.includes('aborted')) {
      userFacingError = 'AI request timed out while processing evidence packet. Please retry.';
    } else if (rawMsg.includes('Failed to parse JSON')) {
      userFacingError = 'AI returned an invalid JSON response format. Please retry.';
    }

    return NextResponse.json(
      { success: false, error: userFacingError },
      { status: 500 }
    );
  }
}
