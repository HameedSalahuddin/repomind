import { NextResponse } from 'next/server';
import { fetchRepositoryAnalysis } from '@/lib/github/ingestion';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid "repoUrl" parameter in request body.',
        },
        { status: 400 }
      );
    }

    const { analysis, diagnostics, cached } = await fetchRepositoryAnalysis(repoUrl);

    return NextResponse.json({
      success: true,
      repository: analysis,
      cached,
      diagnostics,
      // Backward compatibility field
      data: analysis,
    });
  } catch (error: any) {
    const errorMessage = error?.message || 'An unknown error occurred during repository analysis.';
    
    let status = 500;
    if (errorMessage.includes('Invalid GitHub repository URL format')) {
      status = 400;
    } else if (errorMessage.includes('not found or is private')) {
      status = 404;
    } else if (errorMessage.includes('rate limit exceeded')) {
      status = 429;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status }
    );
  }
}
