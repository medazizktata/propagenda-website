export type AboutSegment = {
  text: string;
  accent?: boolean;
};

export type AboutStatement = {
  segments: AboutSegment[];
  /** Advances to the next statement (or href on the last one). */
  pass: string;
  /** Optional "wrong" choice — triggers the fail marquee. */
  fail?: string;
  /** If set on the last statement, pass navigates here instead of advancing. */
  passHref?: string;
};

export const aboutContent = {
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
      segments: [
        { text: "YOUR BRAND " },
        { text: "DESERVES MORE.", accent: true },
        { text: " LET'S PROVE IT." },
      ],
      pass: "START A PROJECT",
      passHref: "/contact",
    },
  ] satisfies AboutStatement[],
  marquee: "YOUR BRAND DESERVES MORE",
  cta: {
    heading: "Let's build what's next.",
  },
};
