import { NextResponse } from 'next/server';
import { MOCK_REPO_ANALYSIS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { repoUrl } = body;

    // Placeholder check - returns mock analysis structure
    return NextResponse.json({
      status: 'placeholder',
      message: 'API route under development. Returning placeholder analysis.',
      requestedRepoUrl: repoUrl || 'https://github.com/repomind-demo/task-craft-api',
      data: MOCK_REPO_ANALYSIS
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process repository analysis request.' },
      { status: 500 }
    );
  }
}
