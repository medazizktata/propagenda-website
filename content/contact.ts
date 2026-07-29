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

/** Kinetic bridge between grid and invite — short punches, not a disclaimer. */
export const contactBridge = ["NO FILLER", "JUST WORK", "REAL REPLIES"];

/** SMV-style invite — headline caps, email in normal case with hand-drawn underline. */
export const contactInvite = {
  lines: [
    { text: "WE LIVE AND WORK IN ", accent: false },
    { text: "DUBAI", accent: true },
    { text: " — AND WE LOVE MEETING NEW FACES.", accent: false },
  ],
  subline:
    "If you've got a brief, a collab, or a half-formed idea, drop us a line.",
  mailto: "info@thepropagenda.com",
};

export const contactFormSection = {
  heading: "Let's talk.",
  subheading: "Tell us what you're building — we'll get back within one business day.",
  submitLabel: "Send message",
};

export const whatsapp = {
  label: "WhatsApp",
  href: "https://wa.me/971527533253?text=Hi%20Propagenda%2C%20I%27d%20like%20to%20start%20a%20conversation.",
  display: "Message us",
  number: "+971 52 753 3253",
};
