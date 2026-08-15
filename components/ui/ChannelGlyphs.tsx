/**
 * Shared contact-channel glyphs (em-sized, inherit color) used wherever the
 * WhatsApp / Book-a-call links appear — contact closer, footer, info block.
 */

/** WhatsApp brand glyph. */
export function WhatsAppGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-[1.05em] w-[1.05em] shrink-0">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.03.53 3.97 1.55 5.7L2 22l4.53-1.63a9.9 9.9 0 0 0 5.5 1.66h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.02A9.82 9.82 0 0 0 12.04 2Zm0 1.8a8.05 8.05 0 0 1 8.06 8.1c0 4.46-3.6 8.1-8.06 8.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-2.5.9.86-2.44-.2-.32a8.06 8.06 0 0 1-1.24-4.31c0-4.46 3.63-8.1 8.08-8.1Zm-3.4 4.3c-.15 0-.4.06-.6.28-.21.24-.8.79-.8 1.92 0 1.13.82 2.22.94 2.38.12.16 1.62 2.47 3.93 3.46.55.24.98.38 1.31.49.55.17 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.09.19-.53.19-.98.13-1.08-.05-.09-.2-.15-.43-.27-.23-.11-1.35-.66-1.56-.74-.21-.08-.36-.11-.51.12-.15.23-.58.73-.72.88-.13.16-.26.18-.49.06-.23-.12-.96-.35-1.83-1.13-.68-.6-1.13-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.26.34-.4.12-.13.15-.23.23-.38.08-.16.04-.29-.02-.4-.06-.12-.5-1.24-.7-1.7-.18-.44-.37-.38-.51-.39h-.44Z" />
    </svg>
  );
}

/** Calendar glyph for the scheduled-call link. */
export function CalendarGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[1.05em] w-[1.05em] shrink-0"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
