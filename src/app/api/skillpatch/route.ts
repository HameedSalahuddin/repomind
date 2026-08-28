import { NextResponse } from 'next/server';
import { MOCK_SKILLPATCH_RESPONSE } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { skillId, repoUrl } = body;

    return NextResponse.json({
      status: 'placeholder',
      message: 'API route under development. Returning placeholder SkillPatch wiki artifacts.',
      skillId: skillId || 'wiki-architect',
      requestedRepoUrl: repoUrl || 'https://github.com/repomind-demo/task-craft-api',
      data: MOCK_SKILLPATCH_RESPONSE
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process SkillPatch capability request.' },
      { status: 500 }
    );
  }
}
