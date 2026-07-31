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
  submitLabel: "Send it",
  fields: {
    name: "Your name",
    email: "Email",
    phone: "Phone",
    message: "What's the project?",
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
