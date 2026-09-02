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

// Client brands. `url` links the name out to the brand's site/social where we could confirm
// it (see content/clients-research.md); brands still awaiting a confirmed link have no `url`
// and render as plain (non-clickable) names. `logo` is the extracted PNG in
// public/images/clients/ (omitted where extraction hasn't produced one yet).
export type ClientBrand = { name: string; url?: string; logo?: string };
export const clientLogos: ClientBrand[] = [
  { name: 'Sanapex Interiors', url: 'https://sanapexinteriors.com/', logo: 'sanapex-interiors.png' },
  { name: 'P2P Motors', url: 'https://p2pmotors.com/', logo: 'p2p-motors.webp' },
  { name: 'Dose Pharmacy' },
  { name: 'Clemson Porter Properties', url: 'https://clemsonporter.com/' },
  { name: 'Emirates Agro', url: 'https://emiratesagro.ae/' },
  { name: 'Zealerz', logo: 'zealerz.png' },
  { name: 'Al Rowad International', logo: 'al-rowad-international.png' },
  { name: 'Lava Inc', logo: 'lava-inc.png' },
  { name: 'OU Optics', logo: 'ou-optics.png' },
  { name: 'MM Event Management', url: 'https://magicmusicevents.com/', logo: 'mm-event-management.png' },
  { name: 'Sarrazar', logo: 'sarrazar.png' },
  { name: 'Phantom Protection', url: 'https://www.ppfphantom.com/', logo: 'phantom-protection.png' },
  { name: 'Global Space Finder', logo: 'global-space-finder.png' },
  { name: 'Chez Moda', logo: 'chez-moda.png' },
  { name: 'centralhub', url: 'https://centralhub.ae/', logo: 'centralhub.webp' },
  { name: '3L Events', logo: '3l-events.png' },
  { name: 'Alla Doresu', logo: 'alla-doresu.png' },
  { name: 'Quick Car', url: 'https://www.instagram.com/quick_cars_dxb/', logo: 'quick-car.png' },
  { name: 'Drive Zone' },
  { name: 'BIL Events' },
  { name: 'Ghaf Tree', logo: 'ghaf-tree.png' },
  { name: 'Dr. Shifa', logo: 'dr-shifa.png' },
  { name: 'Wing Car Q&C', logo: 'wing-car-qc.png' },
];
