import { getContactEmail } from "@/lib/seo/site";

/** Kinetic bridge between grid and closer. */
export const contactBridge = ["NO FILLER", "JUST WORK", "REAL REPLIES"];

const contactEmail = getContactEmail();

/**
 * Post-grid closer — research-led manifesto (Humbleteam/Obys energy).
 * Big idea left, short form right.
 */
export const contactCloser = {
  kicker: "Start a project",
  lines: [
    [{ text: "HAVE AN IDEA?", accent: false }],
    [{ text: "LET'S MAKE IT", accent: false }],
    [{ text: "IMPOSSIBLE", accent: true, hero: true }],
    [
      { text: "TO ", accent: false },
      { text: "IGNORE.", accent: true },
    ],
  ],
  mailto: contactEmail,
  formTitle: "Let's start your project together",
  formEyebrow: "Brief",
  submitLabel: "Send the brief",
  // Labels do the asking; placeholders show an example or stay out of the way —
  // never a duplicate of the label (it reads as a glitch and doubles the noise).
  fields: {
    name: { label: "Your name", placeholder: "Aisha Rahman" },
    company: { label: "Your company", placeholder: "Company or brand" },
    email: { label: "Your email", placeholder: "you@company.com" },
    source: {
      label: "How did you hear?",
      placeholder: "Choose one",
      options: [
        "Google / Search",
        "Instagram",
        "LinkedIn",
        "Referral",
        "Event or word of mouth",
        "Other",
      ],
    },
    budget: {
      label: "Project budget",
      placeholder: "Choose a range",
      options: [
        "Under AED 10k",
        "AED 10k – 25k",
        "AED 25k – 50k",
        "AED 50k – 100k",
        "AED 100k+",
        "Not sure yet",
      ],
    },
    timeframe: {
      label: "Timeframe",
      placeholder: "Choose one",
      options: [
        "ASAP",
        "1–2 months",
        "3–6 months",
        "6+ months",
        "Flexible",
      ],
    },
    message: {
      label: "Tell us about the project",
      placeholder: "Scope, goals, links, anything that helps us reply usefully.",
    },
  },
};

/**
 * Scheduled intro call. The site renders its own styled buttons/links — never a
 * third-party widget or badge. The target is environment-driven so the scheduling
 * provider or event can be swapped without touching code: set NEXT_PUBLIC_BOOKING_URL
 * (see .env.example). Every surface (contact panel, form success, closer channels,
 * footer, home contact act) reads from this one object.
 */
export const bookCall = {
  url: process.env.NEXT_PUBLIC_BOOKING_URL ?? '',
  label: 'Book a call',
  successPrompt: 'Want to talk sooner? Book a 30-minute intro call',
  /**
   * Shown (as a toast) if a book-a-call CTA is activated while no scheduling URL
   * is configured, so the action explains itself instead of silently no-ops.
   */
  unavailableNotice:
    "Live scheduling isn't live yet. Drop your brief below and we'll set up the call within a day.",
};

export const contactRequests = [
  {
    rows: ["NEW BUSINESS", "BRANDS", "FOUNDERS"],
    cta: "START A PROJECT",
    button: "BOOK A CALL",
    // The panel promises a call — honor it with the scheduling link; without one
    // configured, degrade honestly to the brief form instead of a dead link.
    href: bookCall.url || "#contact-form",
    image: "/images/contact/new-business.jpg",
  },
  {
    rows: ["PARTNERS", "AGENCIES", "STUDIOS"],
    cta: "LET'S COLLABORATE",
    button: "GET IN TOUCH",
    href: `mailto:${contactEmail}`,
    image: "/images/contact/partners.jpg",
  },
  {
    rows: ["PRESS", "MEDIA", "PODCASTS"],
    cta: "TELL OUR STORY",
    button: "MEDIA INQUIRY",
    href: `mailto:${contactEmail}?subject=Media%20inquiry`,
    image: "/images/contact/press-media.jpg",
  },
  {
    rows: ["EVERYONE", "ELSE", "HELLO"],
    cta: "DROP US A LINE",
    button: "CONTACT US",
    href: "#contact-form",
    image: "/images/contact/everyone.jpg",
  },
] as const;

export const whatsapp = {
  label: "WhatsApp",
  href: "https://wa.me/971527533253?text=Hi%20Propagenda%2C%20I%27d%20like%20to%20start%20a%20conversation.",
  display: "Message us",
  number: "+971 52 753 3253",
};
