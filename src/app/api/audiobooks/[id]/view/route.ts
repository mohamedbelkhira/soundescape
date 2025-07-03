import { NextRequest, NextResponse } from 'next/server';
import { AudiobookService } from '@/services/audiobook.service';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await AudiobookService.incrementView(params.id);
    return NextResponse.json({ message: 'View recorded' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
