/**
 * /about content — ONE page whose OLD and NEW looks are interleaved:
 *
 *  1. AboutImmersive — the SMV-style click-to-advance statement journey. Its LAST
 *     milestone IS the manifesto's opening line ("WE MAKE BRANDS IMPOSSIBLE TO
 *     IGNORE.", `launch: true`); its button launches the manifesto (`statements`).
 *  2. AboutManifesto — the scroll-illuminated typographic manifesto (`hero`, `body`,
 *     `closer`), which plays its typing reveal + "Play it safe?" gate, then ties its
 *     "…refuse to be forgotten." closer into…
 *  3. The Plusdrie editorial body: studio intro + principles (`intro`, `principles`),
 *     the service rows (`services`) and the testimonial marquee (`testimonials`).
 *  4. One closing CTA (`cta`).
 *
 * Everything lives on a single `aboutContent` object so both looks share one import.
 * Legible-by-default: the manifesto tokens render bright; the dim→bright pass is a
 * GSAP enhancement (see AboutManifesto.tsx).
 */

/* ------------------------------------------------------------------ */
/* NEW look — manifesto types                                          */
/* ------------------------------------------------------------------ */

/** One word (or run of words) inside a manifesto line. */
export type ManifestoToken = {
  text: string;
  /** Paint this run orange (the brand's "one word in accent" device). */
  accent?: boolean;
  /** Draw a rough, hand-drawn annotation around/under this run. */
  annotate?: "circle" | "underline";
  /** Give this run an ambient (idle) orange glow pulse. */
  glow?: boolean;
};

export type ManifestoLine = ManifestoToken[];

/** One selectable answer in the interactive Q&A beat. */
export type QAOption = {
  label: string;
  /** The answer Propagenda would give; drives the playful reply's tone. */
  onBrand: boolean;
  /** Short, self-aware response shown when this option is picked. */
  reply: string;
};

/** A block of the illuminated body: either plain lines or an interactive Q&A. */
export type ManifestoBlock =
  | { kind: "lines"; lines: ManifestoLine[] }
  | {
      kind: "qa";
      /** The prompt. */
      question: string;
      /** The pickable answers; the hand-drawn circle animates to your choice. */
      options: QAOption[];
      /** Sensible default selection (must match one option label). */
      defaultLabel: string;
    };

/* ------------------------------------------------------------------ */
/* OLD look — immersive statement types                                */
/* ------------------------------------------------------------------ */

export type AboutSegment = {
  text: string;
  accent?: boolean;
  /** Draw a rough, hand-drawn annotation around/under this run (last milestone). */
  annotate?: "circle" | "underline";
};

export type AboutStatement = {
  segments: AboutSegment[];
  /** Advances to the next statement (or, on the last one, launches the manifesto). */
  pass: string;
  /** Optional "wrong" choice — triggers the fail marquee. */
  fail?: string;
  /** If set, pass navigates here instead of advancing. */
  passHref?: string;
  /** If set on last statement, scroll to this id instead of navigating. */
  passScrollId?: string;
  /** Last milestone: its button LAUNCHES the manifesto (typing reveal + gate). */
  launch?: boolean;
};

export const aboutContent = {
  /* ============================================================ */
  /* OLD look — the SMV immersive statement journey (top of page)  */
  /* ============================================================ */
  statements: [
    {
      segments: [
        { text: "PROPAGENDA IS A " },
        { text: "MARKETING STUDIO", accent: true },
        { text: " FOR BRANDS THAT WANT TO GROW." },
      ],
      pass: "LET'S GO",
      fail: "NOT INTERESTED",
    },
    {
      segments: [
        { text: "WE BUILD " },
        { text: "HOLISTIC STRATEGIES", accent: true },
        { text: " TAILORED TO YOUR GOALS." },
      ],
      pass: "GOOD.",
    },
    {
      segments: [
        { text: "WE CREATE. WE " },
        { text: "NEVER COPY.", accent: true },
      ],
      pass: "RIGHT.",
      fail: "TEMPLATES ARE FINE",
    },
    {
      segments: [
        { text: "CONFIDENCE. SUPPORT. " },
        { text: "SPECIALIZED SERVICES.", accent: true },
      ],
      pass: "THAT'S US.",
    },
    {
      // The LAST milestone IS the manifesto's opening line. Its button launches the
      // manifesto (typing reveal + "Play it safe?" gate) instead of advancing.
      segments: [
        { text: "WE MAKE BRANDS " },
        { text: "IMPOSSIBLE", accent: true, annotate: "circle" },
        { text: " TO IGNORE." },
      ],
      pass: "SHOW ME",
      launch: true,
    },
  ] satisfies AboutStatement[],

  /** OLD look — Plusdrie editorial intro + principles accordion. */
  intro: {
    label: "About us",
    statement:
      "A marketing studio. We craft brands, campaigns, and digital experiences that get noticed.",
  },

  principles: [
    {
      title: "We keep things sharp",
      body: "No fluff process decks. We go straight to the heart of the brief and build from clarity, so what we make is something people actually feel.",
    },
    {
      title: "We don't compromise on craft",
      body: "Every brand touchpoint should earn attention. Strategy, design, and execution stay in one room. That's how the work stays coherent.",
    },
    {
      title: "We act as partners",
      body: "We're not a vendor that disappears after delivery. We show up like an extension of your team. Honest, fast, and invested in the outcome.",
    },
  ],

  /** OLD look — service rows with swappable image collages. */
  services: {
    label: "Our services",
    items: [
      {
        slug: "branding-visual-identity",
        title: "Branding",
        body: "Identity systems that make your brand credible, memorable, and ready to scale, from first mark to full guidelines.",
        cta: "More about branding",
        options: [
          {
            label: "Logo design",
            images: [
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-restaurant.webp",
            ],
          },
          {
            label: "Visual identity systems",
            images: [
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-quickcars.webp",
            ],
          },
          {
            label: "Brand colors & typography",
            images: [
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-sanapex.webp",
            ],
          },
          {
            label: "Company profiles",
            images: [
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-ghaftree.webp",
            ],
          },
          {
            label: "Brand guidelines",
            images: [
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-food.webp",
            ],
          },
          {
            label: "Stationery",
            images: [
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-events.webp",
            ],
          },
        ],
      },
      {
        slug: "websites",
        title: "Websites",
        body: "High-performing sites and landing pages, designed, built, and tuned to drive growth from day one.",
        cta: "More about websites",
        options: [
          {
            label: "Website design & development",
            images: [
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-ghaftree.webp",
            ],
          },
          {
            label: "Landing pages",
            images: [
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-food.webp",
            ],
          },
          {
            label: "UX/UI",
            images: [
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-restaurant.webp",
            ],
          },
          {
            label: "Performance optimization",
            images: [
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-sanapex.webp",
            ],
          },
          {
            label: "Ongoing management",
            images: [
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-quickcars.webp",
            ],
          },
        ],
      },
      {
        slug: "online-offline-marketing",
        title: "Marketing",
        body: "Campaigns that work online and offline. Strategy, content, social, and ads built to perform.",
        cta: "More about marketing",
        options: [
          {
            label: "Brand strategy",
            images: [
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-events.webp",
            ],
          },
          {
            label: "Digital campaigns",
            images: [
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-quickcars.webp",
            ],
          },
          {
            label: "Social media management",
            images: [
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-sanapex.webp",
            ],
          },
          {
            label: "Content marketing",
            images: [
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-food.webp",
            ],
          },
          {
            label: "Influencer marketing",
            images: [
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-restaurant.webp",
            ],
          },
          {
            label: "Digital ads",
            images: [
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-events.webp",
            ],
          },
        ],
      },
      {
        slug: "photography-videography",
        title: "Photo & Video",
        body: "Product, lifestyle, events, and cinematic production. Your brand story, captured properly.",
        cta: "More about photo & video",
        options: [
          {
            label: "Product photography",
            images: [
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-ghaftree.webp",
            ],
          },
          {
            label: "Lifestyle & editorial",
            images: [
              "/images/portfolio/work-sanapex.webp",
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-food.webp",
            ],
          },
          {
            label: "Event coverage",
            images: [
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-restaurant.webp",
              "/images/portfolio/work-sanapex.webp",
            ],
          },
          {
            label: "Cinematic video",
            images: [
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-food.webp",
            ],
          },
          {
            label: "Motion graphics",
            images: [
              "/images/portfolio/work-ghaftree.webp",
              "/images/portfolio/work-quickcars.webp",
              "/images/portfolio/work-sanapex.webp",
            ],
          },
          {
            label: "Live streaming",
            images: [
              "/images/portfolio/work-events.webp",
              "/images/portfolio/work-food.webp",
              "/images/portfolio/work-quickcars.webp",
            ],
          },
        ],
      },
    ],
  },

  /** OLD look — testimonial marquee. */
  testimonials: {
    label: "What clients say",
    items: [
      {
        quote:
          "Propagenda moved fast without losing the craft. They felt like an extension of our team, and the brand finally looks like the company we are.",
        name: "Omar Al Rashid",
        role: "Founder, Sanapex Interiors",
        logo: "/images/clients/sanapex-interiors.png",
        accent: "orange",
      },
      {
        quote:
          "Clear strategy, sharp execution. From identity to campaigns, everything stayed coherent, and people actually noticed.",
        name: "Sara Mansoor",
        role: "Marketing Lead, Ghaf Tree",
        logo: "/images/clients/ghaf-tree.png",
        accent: "white",
        featured: true,
      },
      {
        quote:
          "They don't do filler. Briefs get answered with work that performs, online and offline, without the agency theatre.",
        name: "Khalid Farouk",
        role: "Operations, Quick Car",
        logo: "/images/clients/quick-car.png",
        accent: "muted",
      },
      {
        quote:
          "End-to-end partners. Brand, content, and launches handled with the same standard: honest, invested, and on time.",
        name: "Nour Haddad",
        role: "Brand Manager, P2P Motors",
        logo: "/images/clients/p2p-motors.webp",
        accent: "orange",
      },
      {
        quote:
          "From the first workshop to delivery, Propagenda stayed sharp. The identity and digital presence finally match the ambition.",
        name: "Lina Kassem",
        role: "Director, Zealerz",
        logo: "/images/clients/zealerz.png",
        accent: "white",
      },
    ],
  },

  /* ============================================================ */
  /* NEW look — the scroll-illuminated manifesto                   */
  /* ============================================================ */
  /* Opens DIRECTLY on the first body paragraph (no restated hero — the
     immersive's last milestone already showed "WE MAKE BRANDS IMPOSSIBLE TO
     IGNORE."). Body paragraphs type in document order as the launch auto-scroll
     glides through them; the LAST block is the "Play it safe?" gate, which appears
     after the final paragraph, pauses the auto-scroll, and (on NO) bridges into the
     old content below. */
  body: [
    {
      kind: "lines",
      lines: [
        [{ text: "Most marketing asks to be liked." }],
        [{ text: "We'd rather be " }, { text: "remembered.", accent: true }],
      ],
    },
    {
      kind: "lines",
      lines: [
        [{ text: "Design. Branding. Film. Digital." }],
        [
          { text: "One studio, " },
          { text: "cut to move", accent: true, annotate: "underline" },
          { text: "." },
        ],
      ],
    },
    {
      kind: "lines",
      lines: [
        [{ text: "No templates. No filler. No noise." }],
        [{ text: "Every frame " }, { text: "earns its place.", accent: true }],
      ],
    },
    {
      // The final typed paragraph. The gate appears right after this lands.
      kind: "lines",
      lines: [
        [{ text: "Brands that move people," }],
        [
          { text: "and refuse to be " },
          { text: "forgotten", accent: true, annotate: "underline" },
          { text: "." },
        ],
      ],
    },
    {
      // The END gate: pauses the auto-scroll after the last paragraph. NO resumes
      // and glides into the old content; YES holds with "Ha, no.".
      kind: "qa",
      question: "Play it safe?",
      options: [
        { label: "YES", onBrand: false, reply: "Ha, no." },
        { label: "NO", onBrand: true, reply: "Correct." },
      ],
      defaultLabel: "NO",
    },
  ] satisfies ManifestoBlock[],

  /**
   * Impact stats band — proof figures shown above the closing CTA.
   *
   * PLACEHOLDER VALUES: every `value` below is a believable placeholder, NOT a real
   * figure. Replace all four with real, verified numbers before launch (and adjust
   * `decimals`/`suffix` to match). Labels are intentional for a Dubai 360° studio.
   */
  stats: {
    eyebrow: "By the numbers",
    items: [
      // PLACEHOLDER — replace with the real figure before launch
      { value: 120, decimals: 0, suffix: "+", label: "Projects delivered" },
      // PLACEHOLDER — replace with the real figure before launch
      { value: 3.2, decimals: 1, suffix: "×", label: "Avg client growth" },
      // PLACEHOLDER — replace with the real figure before launch
      { value: 40, decimals: 0, suffix: "M+", label: "Audience reached" },
      // PLACEHOLDER — replace with the real figure before launch
      { value: 7, decimals: 0, suffix: "+", label: "Years active" },
    ],
  },

  cta: {
    heading: "Let's make some noise.",
    line1: "Let's make",
    line2: "some noise.",
  },

  // Canonical subpage closer — consumed site-wide by PageCTA / ServicesCTA / CTA bands.
  closer: {
    line1: "Let's work together to",
    line2: "grow your brand.",
    support:
      "We're always looking for brands who care about their product, and the people who use it.",
    email: "info@thepropagenda.com",
  },
};
