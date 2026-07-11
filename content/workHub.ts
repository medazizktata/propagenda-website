export const workHubHeading = 'OUR DESIGN MASTERPIECES';

export interface WorkHubEntry {
  title: string;
  teaser: string;
  href: string;
  accent?: string;
}

const accents = [
  'from-orange/40 to-navy',
  'from-charcoal to-orange/30',
  'from-navy to-charcoal',
  'from-orange/20 to-black',
  'from-black to-navy',
  'from-charcoal to-orange/20',
];

export const featuredWorkEntries: WorkHubEntry[] = [
  {
    title: 'Sanapex Interiors — Full Branding & Digital Presence',
    teaser:
      'Sanapex Interiors is a high-end interior design studio focused on residential and commercial spaces.',
    href: '/work/sanapex-interiors',
    accent: accents[0],
  },
  {
    title: 'P2P Motors — Full Branding & Visual Identity',
    teaser:
      'P2P Motors is a Dubai-based export company specializing in luxury, electric, and specialty vehicles.',
    href: '/work/p2p-motors',
    accent: accents[1],
  },
  {
    title: 'Dose Pharmacy — Branding & Fit-Out Design',
    teaser: 'Dose Pharmacy is a modern retail pharmacy based in Riyadh.',
    href: '/work/dose-pharmacy',
    accent: accents[2],
  },
  {
    title: 'Clemson Porter Properties — Full Rebranding',
    teaser:
      'Clemson Porter is a UAE-based property brokerage working with clients across the globe.',
    href: '/work/clemson-porter-properties',
    accent: accents[3],
  },
];

export const moreWorkEntries: WorkHubEntry[] = [
  {
    title: 'Emirates Agro — Rebranding & Visual Identity',
    teaser:
      'Emirates Agro is a global supplier of agricultural products, fertilizers, and petrochemical raw materials, operating under the Madameek Group.',
    href: '/work/emirates-agro',
    accent: accents[4],
  },
  {
    title: 'Zealerz — Branding & Visual Identity',
    teaser:
      'Zealerz is a Dubai-based virtual marketplace aiming to transform the LPG supply chain.',
    href: '/work/zealerz',
    accent: accents[5],
  },
];

export const logoGridBrands = [
  { name: '3L Events', imageSrc: '/images/clients/3l-events.png' },
  { name: 'Alla Doresu', imageSrc: '/images/clients/alla-doresu.png' },
  { name: 'Quick Car', imageSrc: '/images/clients/quick-car.png' },
  { name: 'Ghaf Tree', imageSrc: '/images/clients/ghaf-tree.png' },
  { name: 'BIL Events', imageSrc: '/images/clients/bil-events.png' },
  { name: 'Al Rowad International', imageSrc: '/images/clients/al-rowad.png' },
  { name: 'Lava Inc', imageSrc: '/images/clients/lava-inc.png' },
  { name: 'OU Optics', imageSrc: '/images/clients/ou-optics.png' },
  { name: 'MM Event Management', imageSrc: '/images/clients/mm-event-management.png' },
  { name: 'Sarrazar', imageSrc: '/images/clients/sarrazar.png' },
  { name: 'Phantom Protection', imageSrc: '/images/clients/phantom-protection.png' },
  { name: 'Global Space Finder', imageSrc: '/images/clients/global-space-finder.png' },
  { name: 'Chez Moda', imageSrc: '/images/clients/chez-moda.png' },
  { name: 'centralhub', imageSrc: '/images/clients/centralhub.png' },
  { name: 'Drive Zone', imageSrc: '/images/clients/drive-zone.png' },
  { name: 'Dr. Shifa', imageSrc: '/images/clients/dr-shifa.png' },
  { name: 'Wing Car Q&C', imageSrc: '/images/clients/wing-car.png' },
];
