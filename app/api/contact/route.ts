import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/forms/contactSchema';
import { sendContactEmail } from '@/lib/forms/sendContactEmail';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid form data' },
      { status: 400 },
    );
  }

  const sent = await sendContactEmail(parsed.data);
  if (!sent.ok) {
    return NextResponse.json(
      { success: false, message: sent.message },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you, we will be in touch shortly.',
  });
}
