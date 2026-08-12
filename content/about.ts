export type AboutSegment = {
  text: string;
  accent?: boolean;
};

export type AboutStatement = {
  segments: AboutSegment[];
  /** Advances to the next statement (or scrolls to studio on the last one). */
  pass: string;
  /** Optional "wrong" choice — triggers the fail marquee. */
  fail?: string;
  /** If set, pass navigates here instead of advancing. */
  passHref?: string;
  /** If set on last statement, scroll to this id instead of navigating. */
  passScrollId?: string;
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
      pass: "MEET THE STUDIO",
      passScrollId: "about-studio",
    },
  ] satisfies AboutStatement[],

  intro: {
    label: "About us",
    statement:
      "A Dubai marketing studio. We craft brands, campaigns, and digital experiences that get noticed.",
  },

  principles: [
    {
      title: "We keep things sharp",
      body: "No fluff process decks. We go straight to the heart of the brief and build from clarity — so what we make is something people actually feel.",
    },
    {
      title: "We don't compromise on craft",
      body: "Every brand touchpoint should earn attention. Strategy, design, and execution stay in one room — that's how the work stays coherent.",
    },
    {
      title: "We act as partners",
      body: "We're not a vendor that disappears after delivery. We show up like an extension of your team — honest, fast, and invested in the outcome.",
    },
  ],

  services: {
    label: "Our services",
    items: [
      {
        slug: "branding-visual-identity",
        title: "Branding",
        body: "Identity systems that make your brand credible, memorable, and ready to scale — from first mark to full guidelines.",
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
        body: "High-performing sites and landing pages — designed, built, and tuned to drive growth from day one.",
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
        body: "Campaigns that work online and offline — strategy, content, social, and ads built to perform.",
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
        body: "Product, lifestyle, events, and cinematic production — your brand story, captured properly.",
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

  team: {
    label: "Meet the team",
    statement:
      "A focused studio of specialists that act as an extension of your brand.",
    members: [
      { name: "Laith Al Aqqad", role: "Manager" },
      { name: "Jihen Jerbi", role: "Art Director" },
      { name: "Mohamed Aziz Ktata", role: "Video Editor" },
      { name: "Shahin Nahdi", role: "Video Editor" },
      { name: "Ayhem Nahdi", role: "Video Editor × Web Developer" },
      { name: "Khawla Ghribi", role: "Graphic Designer" },
      { name: "Ryma Farhani", role: "Graphic Designer" },
    ],
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Propagenda team together",
  },

  testimonials: {
    label: "What clients say",
    items: [
      {
        quote:
          "Propagenda moved fast without losing the craft. They felt like an extension of our team — and the brand finally looks like the company we are.",
        name: "Omar Al Rashid",
        role: "Founder, Sanapex Interiors",
        logo: "/images/clients/sanapex-interiors.png",
        accent: "orange",
      },
      {
        quote:
          "Clear strategy, sharp execution. From identity to campaigns, everything stayed coherent — and people actually noticed.",
        name: "Sara Mansoor",
        role: "Marketing Lead, Ghaf Tree",
        logo: "/images/clients/ghaf-tree.png",
        accent: "white",
        featured: true,
      },
      {
        quote:
          "They don't do filler. Briefs get answered with work that performs — online and offline — without the agency theatre.",
        name: "Khalid Farouk",
        role: "Operations, Quick Car",
        logo: "/images/clients/quick-car.png",
        accent: "muted",
      },
      {
        quote:
          "End-to-end partners. Brand, content, and launches handled with the same standard — honest, invested, and on time.",
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

  closer: {
    line1: "Let's work together to",
    line2: "grow your brand.",
    support:
      "We're always looking for brands who care about their product — and the people who use it.",
    email: "info@thepropagenda.com",
  },

  cta: {
    heading: "Let's build what's next.",
  },
};
