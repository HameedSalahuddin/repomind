import { NextResponse } from 'next/server';
import { MOCK_GITSTORY } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { repoUrl } = body;

    return NextResponse.json({
      status: 'placeholder',
      message: 'API route under development. Returning placeholder GitStory milestones.',
      requestedRepoUrl: repoUrl || MOCK_GITSTORY.repository,
      data: MOCK_GITSTORY
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process GitStory request.' },
      { status: 500 }
    );
  }
}
