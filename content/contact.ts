/** Kinetic bridge between grid and closer. */
export const contactBridge = ["NO FILLER", "JUST WORK", "REAL REPLIES"];

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
  mailto: "info@thepropagenda.com",
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
      placeholder: "Scope, goals, links — anything that helps us reply usefully.",
    },
  },
};

export const contactRequests = [
  {
    rows: ["NEW BUSINESS", "BRANDS", "FOUNDERS"],
    cta: "START A PROJECT",
    button: "BOOK A CALL",
    href: "#contact-form",
    image:
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    rows: ["PARTNERS", "AGENCIES", "STUDIOS"],
    cta: "LET'S COLLABORATE",
    button: "GET IN TOUCH",
    href: "mailto:info@thepropagenda.com",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    rows: ["PRESS", "MEDIA", "PODCASTS"],
    cta: "TELL OUR STORY",
    button: "MEDIA INQUIRY",
    href: "mailto:info@thepropagenda.com?subject=Media%20inquiry",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  },
  {
    rows: ["EVERYONE", "ELSE", "HELLO"],
    cta: "DROP US A LINE",
    button: "CONTACT US",
    href: "#contact-form",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

export const whatsapp = {
  label: "WhatsApp",
  href: "https://wa.me/971527533253?text=Hi%20Propagenda%2C%20I%27d%20like%20to%20start%20a%20conversation.",
  display: "Message us",
  number: "+971 52 753 3253",
};
