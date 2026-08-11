import type { VideoProject } from '@/types/content';

// The hero showreel — a real Propagenda cut (dark, black + orange, kinetic).
export const showreel: VideoProject = {
  slug: 'showreel',
  title: 'Propagenda in motion',
  category: 'Showreel',
  src: '/videos/showreel-marketing.mp4',
  poster: '/images/video-posters/showreel-marketing.jpg',
  orientation: 'landscape',
  width: 1280,
  height: 720,
  duration: '0:27',
  description: 'Strategy, content, design, production — cut to move.',
};

// ── Filterable archive ──────────────────────────────────────────────────────
// The full body of work, browsable by category and by client. The first cut is a
// real Propagenda reel; the rest are poster-first swap-in slots (drop a real MP4
// in `src` + a poster to activate — the "Soon" chip disappears automatically).
//
// Ordered taxonomies drive the filter chips (only values present in the data show).
export const videoCategories = [
  'Brand Films',
  'Social Reels',
  'Real Estate',
  'Automotive',
  'Food & Hospitality',
  'Product & Motion',
  'Events',
] as const;

export const videoClients = [
  'Propagenda',
  'Sanapex Interiors',
  'P2P Motors',
  'Dose Pharmacy',
  'Clemson Porter Properties',
  'Emirates Agro',
  'Zealerz',
  'Quick Cars',
  'Ghaf Tree',
] as const;

export type VideoCategory = (typeof videoCategories)[number];
export type VideoClient = (typeof videoClients)[number];

const P = { orientation: 'portrait', width: 1241, height: 1754, placeholder: true } as const;

export const videoProjects: VideoProject[] = [
  {
    slug: 'propagenda-brand-reel',
    title: 'Brand identity, in motion',
    client: 'Propagenda',
    category: 'Brand Films',
    description: 'Our own identity, cut to move.',
    src: '/videos/reel-branding.mp4',
    poster: '/images/video-posters/reel-branding.jpg',
    orientation: 'portrait',
    width: 720,
    height: 1280,
    duration: '0:24',
  },
  {
    slug: 'sanapex-brand-film',
    title: 'Interiors, brought to life',
    client: 'Sanapex Interiors',
    category: 'Brand Films',
    description: 'A fit-out studio, on screen.',
    src: '',
    poster: '/images/work/sanapex-interiors/hero.png',
    ...P,
  },
  {
    slug: 'sanapex-fitout-reel',
    title: 'Fit-out, reel-cut',
    client: 'Sanapex Interiors',
    category: 'Social Reels',
    description: 'Before-and-after, made for the feed.',
    src: '',
    poster: '/images/work/sanapex-interiors/gallery-1.png',
    ...P,
  },
  {
    slug: 'p2p-export-film',
    title: 'Export, in motion',
    client: 'P2P Motors',
    category: 'Automotive',
    description: 'Cars, ports, and paperwork — shot with intent.',
    src: '',
    poster: '/images/work/p2p-motors/hero.png',
    ...P,
  },
  {
    slug: 'p2p-showroom-reel',
    title: 'Showroom walkthrough',
    client: 'P2P Motors',
    category: 'Social Reels',
    description: 'A walk across the forecourt.',
    src: '',
    poster: '/images/work/p2p-motors/gallery-1.png',
    ...P,
  },
  {
    slug: 'dose-launch-film',
    title: 'Retail launch film',
    client: 'Dose Pharmacy',
    category: 'Product & Motion',
    description: 'A calmer, cleaner store — on film.',
    src: '',
    poster: '/images/work/dose-pharmacy/hero.png',
    ...P,
  },
  {
    slug: 'clemson-property-tour',
    title: 'Property tour',
    client: 'Clemson Porter Properties',
    category: 'Real Estate',
    description: 'A property, room by room.',
    src: '',
    poster: '/images/work/clemson-porter-properties/hero.png',
    ...P,
  },
  {
    slug: 'clemson-listing-reel',
    title: 'Listing reel',
    client: 'Clemson Porter Properties',
    category: 'Social Reels',
    description: 'Listings that move fast.',
    src: '',
    poster: '/images/work/clemson-porter-properties/gallery-1.png',
    ...P,
  },
  {
    slug: 'emirates-agro-corporate',
    title: 'Corporate film',
    client: 'Emirates Agro',
    category: 'Brand Films',
    description: 'Four decades of heritage, on film.',
    src: '',
    poster: '/images/work/emirates-agro/hero.png',
    ...P,
  },
  {
    slug: 'emirates-agro-product',
    title: 'Field to market',
    client: 'Emirates Agro',
    category: 'Product & Motion',
    description: 'From the field to the shelf.',
    src: '',
    poster: '/images/work/emirates-agro/gallery-1.png',
    ...P,
  },
  {
    slug: 'zealerz-marketplace-reel',
    title: 'Marketplace reel',
    client: 'Zealerz',
    category: 'Social Reels',
    description: 'Ordering gas, made simple.',
    src: '',
    poster: '/images/work/zealerz/hero.png',
    ...P,
  },
  {
    slug: 'quickcars-dealer-spot',
    title: 'Dealer spot',
    client: 'Quick Cars',
    category: 'Automotive',
    description: 'The forecourt, in thirty seconds.',
    src: '',
    poster: '/images/portfolio/work-quickcars.png',
    ...P,
  },
  {
    slug: 'ghaftree-garden-film',
    title: 'Garden-to-table',
    client: 'Ghaf Tree',
    category: 'Food & Hospitality',
    description: 'Garden to table, in motion.',
    src: '',
    poster: '/images/portfolio/work-ghaftree.png',
    ...P,
  },
  {
    slug: 'ghaftree-menu-reel',
    title: 'Menu reel',
    client: 'Ghaf Tree',
    category: 'Social Reels',
    description: 'The menu, plated for the feed.',
    src: '',
    poster: '/images/portfolio/work-food.png',
    ...P,
  },
  {
    slug: 'restaurant-table-film',
    title: 'Table stories',
    category: 'Food & Hospitality',
    description: 'Hospitality with the lights on.',
    src: '',
    poster: '/images/portfolio/work-restaurant.png',
    ...P,
  },
  {
    slug: 'events-aftermovie',
    title: 'Launch aftermovie',
    category: 'Events',
    description: 'The night, cut to relive.',
    src: '',
    poster: '/images/portfolio/work-events.png',
    ...P,
  },
];

// What Propagenda shoots — the capabilities strip.
export const videoCapabilities: { label: string; blurb: string }[] = [
  { label: 'Brand films', blurb: 'Cinematic brand stories, cut to move.' },
  { label: 'Social reels', blurb: 'Short-form vertical, made for the feed.' },
  { label: 'Product & motion', blurb: 'Product films and animated graphics.' },
  { label: 'Events & live', blurb: 'Coverage, aftermovies, multi-cam streams.' },
];

// A real client voice (from the case studies) — surfaced as a pull-quote.
export const videoTestimonial: { text: string; author: string } = {
  text: 'Wherever a client meets us — showroom, socials, or a signed export deal — we look like one serious brand.',
  author: 'Managing Director, P2P Motors',
};
