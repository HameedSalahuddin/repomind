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

    // 4. Generate Structured JSON Completion via Real Gemini API
    const rawResult = await generateJSONCompletion<InvestigationResult>(messages, {
      temperature: 0.1,
      maxTokens: 8192,
      jsonMode: true,
    });

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
    const errorMessage = error?.message || 'An error occurred during issue investigation.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
