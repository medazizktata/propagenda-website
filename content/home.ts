import type { WorkSlug } from '@/types/content';
export const manifestoQuote =
  "If you don't give the market the story to talk about, they'll define your brand's story for you.";
export const manifestoAttribution = 'Seth Godin';

export const designPrintInstall = {
  headline: 'DESIGN · PRINT · INSTALL',
  subline: 'Complete branding from concept to execution',
};

export const methodologySteps = [
  {
    step: '01',
    label: 'Discovery & Strategy',
    body: 'Understand brand, audience, and objectives.',
  },
  {
    step: '02',
    label: 'Concept Development',
    body: 'Creative concepts aligned to strategy.',
  },
  {
    step: '03',
    label: 'Design & Iteration',
    body: 'Refine visuals, messaging, and systems.',
  },
  {
    step: '04',
    label: 'Development & Execution',
    body: 'Deliver across digital, print, and install.',
  },
];

// Growth staircase (home) — an ascending journey from a credible start to category
// leadership. An ordered sequence, so the step numbers earn their place.
export const servicesBanner = {
  label: 'Services',
  headingLead: 'The whole brand,',
  headingAccent: 'one studio.',
  body: 'Seven capabilities — from logo to launch.',
  cta: { label: 'Explore capabilities', href: '/services' },
};

export const growthStaircase = {
  label: 'Growth mindset',
  headingLead: 'Built to',
  headingAccent: 'grow',
  intro:
    'Every brand we build is a step up, from a credible start to the reference your whole category chases.',
  steps: [
    {
      step: '01',
      label: 'Establish',
      body: 'A credible, unmistakable foundation: identity, voice, and the system behind it.',
    },
    {
      step: '02',
      label: 'Gain momentum',
      body: 'Consistent presence across every channel turns first impressions into recognition.',
    },
    {
      step: '03',
      label: 'Scale',
      body: 'Campaigns, content, and product that reach further and convert harder as you grow.',
    },
    {
      step: '04',
      label: 'Lead',
      body: 'Become the reference your category measures itself against.',
    },
  ],
};

export const featuredWork = [
  {
    title: 'Sanapex Interiors',
    teaser:
      'Sanapex Interiors is a high-end interior design studio focused on residential and commercial spaces.',
    href: '/work/sanapex-interiors',
    accent: 'from-orange/40 to-navy',
  },
  {
    title: 'P2P Motors',
    teaser:
      'P2P Motors is a Dubai-based export company specializing in luxury, electric, and specialty vehicles.',
    href: '/work/p2p-motors',
    accent: 'from-charcoal to-orange/30',
  },
] as const;

export const moreWork = [
  {
    title: 'Dose Pharmacy',
    teaser: 'Dose Pharmacy is a modern retail pharmacy based in Riyadh.',
    href: '/work/dose-pharmacy',
    accent: 'from-navy to-charcoal',
  },
  {
    title: 'Clemson Porter Properties',
    teaser:
      'Clemson Porter is a UAE-based property brokerage working with clients across the globe.',
    href: '/work/clemson-porter-properties',
    accent: 'from-orange/20 to-black',
  },
] as const;

// Client brands, listed by name on the home page (ClientList). `url` links the name out to the
// brand's site/social where we could confirm it (see content/clients-research.md); brands without
// a confirmed link render as plain names. Names follow each published case study's own client
// name (content/work/index.ts), shortened only by legal/descriptor tails (LLC, "Intellectual
// Property", "Brokers", "(ABA)"). `logo` is the extracted file in public/images/clients/ — kept
// as data but NOT rendered: the hover-to-reveal-logo swap was switched off (explicit user
// direction, 2026-09-24: "remove the hover to reveal logo behavior... disable it").
//
// 2026-09-24 corrections, each checked against the logo file itself: "Lava Inc" was the Laya Inc
// logo misread; "3L Events" was BIL Events' logo (duplicate, merged); "Wing Car Q&C" was Quick
// Cars' winged QC mark (duplicate, merged); "Ghaf Tree" is "Ghaf Lounge" per its own logo (the
// portfolio poster explains the name comes from the Ghaf tree) — confirm with the client.
// Emirates Agro removed: hidden from the site at explicit user direction (2026-09-15).
// `slug`: the client's published case study — the name links there (takes priority over `url`).
export type ClientBrand = { name: string; slug?: WorkSlug; url?: string; logo?: string };
export const clients: ClientBrand[] = [
  { name: 'Sanapex Interiors', slug: 'sanapex-interiors', url: 'https://sanapexinteriors.com/', logo: 'sanapex-interiors.png' },
  { name: 'P2P Motors', slug: 'p2p-motors', url: 'https://p2pmotors.com/', logo: 'p2p-motors.webp' },
  { name: 'Dose Pharmacy', slug: 'dose-pharmacy' },
  { name: 'Clemson Porter Properties', slug: 'clemson-porter-properties', url: 'https://clemsonporter.com/' },
  { name: 'Zealerz', slug: 'zealerz', logo: 'zealerz.png' },
  { name: 'Al Rowad International', slug: 'al-rowad-international', logo: 'al-rowad-international.png' },
  { name: 'Laya Inc', slug: 'laya-inc', logo: 'lava-inc.png' },
  { name: 'C U Optics', slug: 'cu-optics', logo: 'ou-optics.png' },
  { name: 'MM Event Management', slug: 'mm-event-management', url: 'https://magicmusicevents.com/', logo: 'mm-event-management.png' },
  { name: 'Sarrazar', logo: 'sarrazar.png' },
  { name: 'Phantom Protection', url: 'https://www.ppfphantom.com/', logo: 'phantom-protection.png' },
  { name: 'Global Space Finder', logo: 'global-space-finder.png' },
  { name: 'Chez Moda', logo: 'chez-moda.png' },
  { name: 'centralhub', url: 'https://centralhub.ae/', logo: 'centralhub.webp' },
  { name: 'Alla Doresu', slug: 'alla-doresu', logo: 'alla-doresu.png' },
  { name: 'Quick Cars', slug: 'quick-cars', url: 'https://www.instagram.com/quick_cars_dxb/', logo: 'quick-car.png' },
  { name: 'Drive Zone' },
  { name: 'BIL Events', slug: 'bil-events', logo: '3l-events.png' },
  { name: 'Ghaf Lounge', logo: 'ghaf-tree.png' },
  { name: 'Dr. Shifa', logo: 'dr-shifa.png' },
  { name: 'Sealand', slug: 'sealand', logo: 'sealand.png' },
  { name: 'The BNK Group', slug: 'bnk-group' },
  { name: 'Arabian Business Academy', slug: 'arabian-business-academy' },
  { name: '2K Shopping', slug: '2k-shopping' },
  { name: 'Chicky Fighter', slug: 'chicky-fighter' },
  { name: 'Ayoub & Co', slug: 'ayoub-and-co' },
  { name: 'Al Manazel Al Haditha', slug: 'al-manazel-al-haditha' },
  { name: 'DHC Luxury Real Estate', slug: 'dhc-luxury-real-estate' },
  { name: 'VID', slug: 'vid' },
  { name: 'Alateeq Cafe', slug: 'alateeq-cafe' },
  { name: 'Jordanian Social Club', slug: 'jordanian-social-club', logo: 'jsc.png' },
  { name: 'Dot & Dash', slug: 'dot-and-dash' },
  { name: 'Leoz', slug: 'leoz' },
  { name: "Let's Ad", slug: 'lets-ad' },
  { name: 'Serr El Oud', slug: 'serr-el-oud' },
  { name: 'Sterling Cars', slug: 'sterling-cars' },
  { name: "Shawerma A'saj", slug: 'shawarma-asaj' },
];
