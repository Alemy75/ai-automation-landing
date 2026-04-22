// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateContactForm } from '../../lib/contact-validator';

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Некорректный формат запроса' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validation = validateContactForm(body);
  if (!validation.valid) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { name, email, message } = body as { name: string; email: string; message: string };
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'AI Boost <noreply@yourdomain.com>',
      to: import.meta.env.CONTACT_EMAIL,
      subject: `Новая заявка с сайта — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #6366f1;">Новая заявка с сайта AI Boost</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <h3>Сообщение:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      replyTo: email,
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[contact API] Resend error:', err);
    return new Response(
      JSON.stringify({ error: 'Ошибка отправки. Напишите напрямую в Telegram.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
