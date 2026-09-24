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

import { PUBLIC_CONTACT_EMAIL } from '@/lib/site/contact';

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
  // Service collages (updated 2026-09-24, explicit user direction: "update assets in here, use
  // pics from web if needs to be"). Real work first: Branding / Marketing use the watermarked
  // case-study images in /images/work; Photo & Video (and Influencer marketing) are frames from the
  // films, watermarked; Website design, Landing pages and UX/UI are screenshots of this site.
  // Stock only where no genuine work exists — free under the Unsplash License
  // (unsplash.com/license): Performance optimization by Luke Chesser, Carlos Muza, Stephen Dawson;
  // Ongoing management by Christopher Gower, Nubelson Fernandes, Compagnons.
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
              "/images/work/alateeq-cafe/hero.webp",
              "/images/work/serr-el-oud/hero.webp",
              "/images/work/lets-ad/hero.webp",
            ],
          },
          {
            label: "Visual identity systems",
            images: [
              "/images/work/2k-shopping/gallery-4.webp",
              "/images/work/laya-inc/gallery-3.webp",
              "/images/work/jordanian-social-club/gallery-4.webp",
            ],
          },
          {
            label: "Brand colors & typography",
            images: [
              "/images/work/sealand/gallery-3.webp",
              "/images/work/leoz/gallery-2.webp",
              "/images/work/lets-ad/gallery-2.webp",
            ],
          },
          {
            label: "Company profiles",
            images: [
              "/images/work/ayoub-and-co/gallery-3.webp",
              "/images/work/dhc-luxury-real-estate/gallery-1.webp",
              "/images/work/vid/gallery-2.webp",
            ],
          },
          {
            label: "Brand guidelines",
            images: [
              "/images/work/al-manazel-al-haditha/gallery-1.webp",
              "/images/work/zealerz/gallery-1.webp",
              "/images/work/sterling-cars/gallery-2.webp",
            ],
          },
          {
            label: "Stationery",
            images: [
              "/images/work/clemson-porter-properties/hero.webp",
              "/images/work/bnk-group/gallery-2.webp",
              "/images/work/laya-inc/gallery-1.webp",
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
              "/images/about/web-design-1.webp",
              "/images/about/web-design-2.webp",
              "/images/about/web-design-3.webp",
            ],
          },
          {
            label: "Landing pages",
            images: [
              "/images/about/landing-1.webp",
              "/images/about/landing-2.webp",
              "/images/about/landing-3.webp",
            ],
          },
          {
            label: "UX/UI",
            images: [
              "/images/about/ux-ui-1.webp",
              "/images/about/ux-ui-2.webp",
              "/images/about/ux-ui-3.webp",
            ],
          },
          {
            label: "Performance optimization",
            images: [
              "/images/about/performance-1.webp",
              "/images/about/performance-2.webp",
              "/images/about/performance-3.webp",
            ],
          },
          {
            label: "Ongoing management",
            images: [
              "/images/about/management-1.webp",
              "/images/about/management-2.webp",
              "/images/about/management-3.webp",
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
              "/images/work/2k-shopping/gallery-1.webp",
              "/images/work/leoz/hero.webp",
              "/images/work/clemson-porter-properties/gallery-1.webp",
            ],
          },
          {
            label: "Digital campaigns",
            images: [
              "/images/work/dose-pharmacy/gallery-1.webp",
              "/images/work/cu-optics/gallery-1.webp",
              "/images/work/bil-events/gallery-5.webp",
            ],
          },
          {
            label: "Social media management",
            images: [
              "/images/work/vid/gallery-4.webp",
              "/images/work/zealerz/gallery-3.webp",
              "/images/work/leoz/gallery-5.webp",
            ],
          },
          {
            label: "Content marketing",
            images: [
              "/images/work/bnk-group/gallery-3.webp",
              "/images/work/sterling-cars/gallery-5.webp",
              "/images/work/alla-doresu/gallery-5.webp",
            ],
          },
          {
            label: "Influencer marketing",
            images: [
              "/images/about/influencer-1.webp",
              "/images/about/influencer-2.webp",
              "/images/about/influencer-3.webp",
            ],
          },
          {
            label: "Digital ads",
            images: [
              "/images/work/mm-event-management/gallery-4.webp",
              "/images/work/arabian-business-academy/gallery-1.webp",
              "/images/work/2k-shopping/hero.webp",
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
              "/images/about/product-1.webp",
              "/images/about/product-2.webp",
              "/images/about/product-3.webp",
            ],
          },
          {
            label: "Lifestyle & editorial",
            images: [
              "/images/about/lifestyle-1.webp",
              "/images/about/lifestyle-2.webp",
              "/images/about/lifestyle-3.webp",
            ],
          },
          {
            label: "Event coverage",
            images: [
              "/images/about/events-1.webp",
              "/images/about/events-2.webp",
              "/images/about/events-3.webp",
            ],
          },
          {
            label: "Cinematic video",
            images: [
              "/images/about/cinematic-1.webp",
              "/images/about/cinematic-2.webp",
              "/images/about/cinematic-3.webp",
            ],
          },
          {
            label: "Motion graphics",
            images: [
              "/images/about/motion-1.webp",
              "/images/about/motion-2.webp",
              "/images/about/motion-3.webp",
            ],
          },
          {
            label: "Live streaming",
            images: [
              "/images/about/live-1.webp",
              "/images/about/live-2.webp",
              "/images/about/live-3.webp",
            ],
          },
        ],
      },
    ],
  },

  /** OLD look — testimonial marquee. */
  // Only brands with a published case study on /work (explicit user direction, 2026-09-24): the
  // Ghaf Tree card was removed (no case study). `logo` must be a transparent file — the card
  // renders it as a silhouette, so an opaque logo becomes a solid block; omit it to hide the logo
  // (Quick Cars has no clean transparent logo). p2p-motors-mark.webp is the P2P logo cropped
  // clear of a stray fragment in the original file.
  testimonials: {
    label: "What clients say",
    items: [
      {
        quote:
          "Propagenda moved fast without losing the craft. They felt like an extension of our team, and the brand finally looks like the company we are.",
        name: "Omar Al Rashid",
        role: "Founder, Sanapex Interiors",
        logo: "/images/clients/sanapex-interiors.png",
      },
      {
        quote:
          "They don't do filler. Briefs get answered with work that performs, online and offline, without the agency theatre.",
        name: "Khalid Farouk",
        role: "Operations, Quick Cars",
      },
      {
        quote:
          "End-to-end partners. Brand, content, and launches handled with the same standard: honest, invested, and on time.",
        name: "Nour Haddad",
        role: "Brand Manager, P2P Motors",
        logo: "/images/clients/p2p-motors-mark.webp",
      },
      {
        quote:
          "From the first workshop to delivery, Propagenda stayed sharp. The identity and digital presence finally match the ambition.",
        name: "Lina Kassem",
        role: "Director, Zealerz",
        logo: "/images/clients/zealerz.png",
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
    email: PUBLIC_CONTACT_EMAIL,
  },
};
