import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const revalidateSchema = z.object({
  paths: z.array(z.string().min(1)).min(1),
});

/**
 * On-demand ISR bust after CMS publish.
 * Protected by REVALIDATE_SECRET (Worker secret in prod).
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ revalidated: false, message: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ revalidated: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = revalidateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { revalidated: false, message: 'paths array required' },
      { status: 400 },
    );
  }

  for (const path of parsed.data.paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths: parsed.data.paths });
}
