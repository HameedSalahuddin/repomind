import { NextResponse } from 'next/server';
import { MOCK_QNA_RESPONSE } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { question } = body;

    return NextResponse.json({
      status: 'placeholder',
      message: 'API route under development. Returning placeholder Q&A answer.',
      data: {
        ...MOCK_QNA_RESPONSE,
        question: question || MOCK_QNA_RESPONSE.question
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI question.' },
      { status: 500 }
    );
  }
}
