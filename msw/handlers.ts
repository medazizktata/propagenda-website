import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Thank you — we will be in touch shortly.',
      data: body,
    });
  }),
];
