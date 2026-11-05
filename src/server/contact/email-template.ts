import { escapeHtml as e } from './escape-html';
import type { ContactInput } from './contact.schema';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/** Builds the notification email. Every user-provided value is escaped. */
export function renderContactEmail(input: ContactInput): RenderedEmail {
  const subject = input.subject ? `Portfolio · ${input.subject}` : `Portfolio · message from ${input.name}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
      <h2 style="margin:0 0 16px">New message from your portfolio</h2>
      <p><strong>Name:</strong> ${e(input.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${e(input.email)}">${e(input.email)}</a></p>
      ${input.subject ? `<p><strong>Subject:</strong> ${e(input.subject)}</p>` : ''}
      <blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #45c0f0;background:#f8fafc;white-space:pre-wrap">${e(input.message)}</blockquote>
    </div>`;
  const text = `From: ${input.name} <${input.email}>\n${input.subject ? `Subject: ${input.subject}\n` : ''}\n${input.message}`;
  return { subject, html, text };
}
