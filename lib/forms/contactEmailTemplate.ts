import type { ContactSchema } from './contactSchema';

const ORANGE = '#f58b27';
const CHARCOAL = '#252525';
const INK = '#111111';
const MUTED = '#6b6b6b';
const RULE = '#ebebeb';
const CARD = '#ffffff';
const PAGE = '#f4f4f4';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** One field: label stacked over value — consistent alignment in every client. */
function field(label: string, valueHtml: string, last = false) {
  const border = last ? '' : `border-bottom:1px solid ${RULE};`;
  return `
    <tr>
      <td style="padding:16px 0;${border}">
        <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">
          ${escapeHtml(label)}
        </p>
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.45;font-weight:500;color:${INK};">
          ${valueHtml}
        </p>
      </td>
    </tr>`;
}

function mailtoLink(email: string) {
  const safe = escapeHtml(email);
  return `<a href="mailto:${safe}" style="color:${ORANGE};text-decoration:none;font-weight:600;">${safe}</a>`;
}

/** Plain-text + branded HTML bodies for a contact brief. */
export function buildContactEmailBodies(data: ContactSchema): {
  text: string;
  html: string;
  subject: string;
} {
  const subject = `New brief — ${data.name} / ${data.company}`;

  const text = [
    'NEW BRIEF — PROPAGENDA',
    '────────────────────',
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Source: ${data.source}`,
    `Budget: ${data.budget}`,
    `Timeframe: ${data.timeframe}`,
    '',
    'Message:',
    data.message,
    '',
    '────────────────────',
    'Reply to this email to reach the sender.',
  ].join('\n');

  const messageHtml = escapeHtml(data.message).replace(/\r\n|\r|\n/g, '<br />');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border-radius:16px;overflow:hidden;border:1px solid #ebebeb;">
          <tr>
            <td style="background:${CHARCOAL};padding:28px 32px;">
              <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${ORANGE};">
                Propagenda
              </p>
              <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.25;font-weight:800;color:#ffffff;">
                New project brief
              </h1>
              <p style="margin:10px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.4;color:rgba(255,255,255,0.65);">
                ${escapeHtml(data.name)} · ${escapeHtml(data.company)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${field('Name', escapeHtml(data.name))}
                ${field('Company', escapeHtml(data.company))}
                ${field('Email', mailtoLink(data.email))}
                ${field('Source', escapeHtml(data.source))}
                ${field('Budget', escapeHtml(data.budget))}
                ${field('Timeframe', escapeHtml(data.timeframe))}
                ${field('Message', messageHtml, true)}
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 28px;">
                <tr>
                  <td align="center" style="padding-top:24px;border-top:1px solid ${RULE};">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:999px;background:${ORANGE};">
                          <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block;padding:14px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;color:${CHARCOAL};">
                            Reply to sender
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px 24px;border-top:1px solid ${RULE};background:#fafafa;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.45;color:${MUTED};">
                Sent from thepropagenda.com contact form. Reply goes to the submitter.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { text, html, subject };
}
