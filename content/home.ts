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
  { name: 'P2P Motors', url: 'https://p2pmotors.com/', logo: 'p2p-motors.png' },
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
  { name: 'centralhub', url: 'https://centralhub.ae/', logo: 'centralhub.png' },
  { name: '3L Events', logo: '3l-events.png' },
  { name: 'Alla Doresu', logo: 'alla-doresu.png' },
  { name: 'Quick Car', url: 'https://www.instagram.com/quick_cars_dxb/', logo: 'quick-car.png' },
  { name: 'Drive Zone' },
  { name: 'BIL Events' },
  { name: 'Ghaf Tree', logo: 'ghaf-tree.png' },
  { name: 'Dr. Shifa', logo: 'dr-shifa.png' },
  { name: 'Wing Car Q&C', logo: 'wing-car-qc.png' },
];

export const blogTeasers = [
  {
    title: 'The Power of Visual Identity: Why Your Brand Needs More Than Just a Logo',
    date: 'January 2, 2025',
    excerpt:
      'Why visual identity matters beyond the logo — and how Propagenda builds memorable brands.',
    href: '/blog/the-power-of-visual-identity',
  },
  {
    title: "What's Destroying Your Brand?",
    date: 'January 2, 2025',
    excerpt: 'Seven brand pitfalls that erode trust — and how to protect your reputation.',
    href: '/blog/whats-destroying-your-brand',
  },
  {
    title: 'How Colors Influence Consumer Behavior',
    date: 'January 2, 2025',
    excerpt: 'Color psychology for marketing — emotional impact and brand color selection tips.',
    href: '/blog/how-colors-influence-consumer-behavior',
  },
] as const;
