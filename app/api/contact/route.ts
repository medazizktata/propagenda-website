import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/forms/contactSchema';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid form data' },
      { status: 400 },
    );
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CONTACT_FORM_API_KEY
          ? { Authorization: `Bearer ${process.env.CONTACT_FORM_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Unable to send message. Please try again.' },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you — we will be in touch shortly.',
  });
}
