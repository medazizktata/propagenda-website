export const workHubHeading = 'OUR DESIGN MASTERPIECES';

export interface WorkHubEntry {
  title: string;
  teaser: string;
  href: string;
  accent?: string;
}

const accents = [
  'from-orange/40 to-black',
  'from-charcoal to-orange/30',
  'from-black to-charcoal',
  'from-orange/20 to-black',
  'from-black to-black',
  'from-charcoal to-orange/20',
  'from-orange/30 to-charcoal',
  'from-charcoal to-orange/10',
];

export const featuredWorkEntries: WorkHubEntry[] = [
  {
    title: 'Sanapex Interiors: Full Branding & Digital Presence',
    teaser:
      'Sanapex Interiors is a high-end interior design studio focused on residential and commercial spaces.',
    href: '/work/sanapex-interiors',
    accent: accents[0],
  },
  {
    title: 'P2P Motors: Full Branding & Visual Identity',
    teaser:
      'P2P Motors is a Dubai-based export company specializing in luxury, electric, and specialty vehicles.',
    href: '/work/p2p-motors',
    accent: accents[1],
  },
  {
    title: 'Dose Pharmacy: Branding & Fit-Out Design',
    teaser: 'Dose Pharmacy is a modern retail pharmacy based in Riyadh.',
    href: '/work/dose-pharmacy',
    accent: accents[2],
  },
  {
    title: 'Clemson Porter Properties: Full Rebranding',
    teaser:
      'Clemson Porter is a UAE-based property brokerage working with clients across the globe.',
    href: '/work/clemson-porter-properties',
    accent: accents[3],
  },
  {
    title: 'Sealand: Rebranding & Visual Identity',
    teaser: 'Sealand is a Dubai seafood restaurant that has been serving guests since 1982.',
    href: '/work/sealand',
    accent: accents[6],
  },
  {
    title: 'The BNK Group: Branding & Visual Identity',
    teaser: 'The BNK Group is a luxury interior design-build studio entering the UAE market.',
    href: '/work/bnk-group',
    accent: accents[7],
  },
];

export const moreWorkEntries: WorkHubEntry[] = [
  {
    title: 'Emirates Agro: Rebranding & Visual Identity',
    teaser:
      'Emirates Agro is a global supplier of agricultural products, fertilizers, and petrochemical raw materials, operating under the Madameek Group.',
    href: '/work/emirates-agro',
    accent: accents[4],
  },
  {
    title: 'Zealerz: Branding & Visual Identity',
    teaser:
      'Zealerz is a Dubai-based virtual marketplace aiming to transform the LPG supply chain.',
    href: '/work/zealerz',
    accent: accents[5],
  },
  {
    title: 'Arabian Business Academy: Roll-Up Banner Campaign',
    teaser:
      'Arabian Business Academy is a Dubai-based trading education brand with offices in Iraq and Turkey.',
    href: '/work/arabian-business-academy',
    accent: accents[6],
  },
  {
    title: '2K Shopping: Branding & Visual Identity',
    teaser: '2K Shopping is a UAE-based online grocery and essentials delivery platform.',
    href: '/work/2k-shopping',
    accent: accents[7],
  },
  {
    title: 'BIL Events: Branding & Visual Identity',
    teaser: 'BIL Events is a Dubai media-and-events company launching a reality show and a super app.',
    href: '/work/bil-events',
    accent: accents[4],
  },
];

export const logoGridBrands = [
  { name: '3L Events', imageSrc: '/images/clients/3l-events.png' },
  { name: 'Alla Doresu', imageSrc: '/images/clients/alla-doresu.png' },
  { name: 'Quick Car', imageSrc: '/images/clients/quick-car.png' },
  { name: 'Ghaf Tree', imageSrc: '/images/clients/ghaf-tree.png' },
  { name: 'Al Rowad International', imageSrc: '/images/clients/al-rowad-international.png' },
  { name: 'Lava Inc', imageSrc: '/images/clients/lava-inc.png' },
  { name: 'OU Optics', imageSrc: '/images/clients/ou-optics.png' },
  { name: 'MM Event Management', imageSrc: '/images/clients/mm-event-management.png' },
  { name: 'Sarrazar', imageSrc: '/images/clients/sarrazar.png' },
  { name: 'Phantom Protection', imageSrc: '/images/clients/phantom-protection.png' },
  { name: 'Global Space Finder', imageSrc: '/images/clients/global-space-finder.png' },
  { name: 'Chez Moda', imageSrc: '/images/clients/chez-moda.png' },
  { name: 'centralhub', imageSrc: '/images/clients/centralhub.webp' },
  { name: 'Dr. Shifa', imageSrc: '/images/clients/dr-shifa.png' },
  { name: 'Wing Car Q&C', imageSrc: '/images/clients/wing-car-qc.png' },
  { name: 'Sealand', imageSrc: '/images/clients/sealand.png' },
];
