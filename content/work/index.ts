/** Seed source for pnpm seed:cms — runtime reads from Supabase. */
import type { CaseStudyRecord } from '@/types/content';

function caseStudy(
  slug: CaseStudyRecord['slug'],
  title: string,
  h1: string,
  tier: CaseStudyRecord['tier'],
  category: CaseStudyRecord['category'],
  description: string,
  extra?: Partial<CaseStudyRecord>,
): CaseStudyRecord {
  return {
    slug,
    title,
    h1,
    tier,
    category,
    overview: `${title} case study, content from CONTENT_MAPPING.md.`,
    scopeItems: ['Branding', 'Digital presence'],
    gallery: [],
    seo: { title: `${title} | Propagenda`, description },
    ...extra,
  };
}

export const sanapexInteriors = caseStudy(
  'sanapex-interiors',
  'Sanapex Interiors: Full Branding & Digital Presence',
  'SANAPEX INTERIORS: FULL BRANDING & DIGITAL PRESENCE',
  'featured',
  'Property & interiors',
  'Full visual identity and digital presence for a high-end interior design studio in Dubai.',
  {
    overview:
      'A high-end interiors studio. We gave it an identity as refined as the spaces it designs.',
    client: 'Sanapex Interiors',
    industry: 'Interior Design',
    year: '2024',
    heroImage: '/images/work/sanapex-interiors/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity',
      'Brand colors, typography, and visual direction',
      'Company profile and portfolio design',
      'Website design and structure',
      'Print and digital brand assets',
    ],
    deliverables: [
      'Logo and complete brand identity',
      'Brand colors, typography, and visual direction',
      'Company profile and portfolio design',
      'Website design and structure',
      'Print and digital brand assets',
    ],
    results: [
      { label: 'Brand assets delivered', value: '40+' },
      { label: 'Enquiry growth post-launch', value: '+65%' },
      { label: 'Turnaround', value: '6 weeks' },
    ],
    challenge:
      'World-class craft. A brand that still looked improvised.',
    approach:
      'Logo to website: one refined system, built to signal premium from the first glance.',
    outcome:
      'Every touchpoint now reads as high-end before the first meeting.',
    quote: {
      text: 'The new identity finally looks like the work we actually deliver.',
      author: 'Founder, Sanapex Interiors',
    },
    gallery: [
      {
        src: '/images/work/sanapex-interiors/hero.webp',
        alt: 'Sanapex Interiors brand identity system, stationery, catalogue and collateral in a warm sand palette.',
        width: 1241,
        height: 1754,
      },
      {
        src: '/images/work/sanapex-interiors/gallery-1.webp',
        alt: 'Sanapex Interiors social campaign featuring editorial interior design projects.',
        width: 1241,
        height: 1754,
      },
    ],
    prev: 'clemson-porter-properties',
    next: 'p2p-motors',
  },
);

export const p2pMotors = caseStudy(
  'p2p-motors',
  'P2P Motors: Full Branding & Visual Identity',
  'P2P MOTORS: FULL BRANDING & VISUAL IDENTITY',
  'featured',
  'Automotive',
  'Case study: bold branding for a Dubai luxury and specialty vehicle export company.',
  {
    overview:
      'Luxury vehicle export, Dubai. We built a bold identity that travels as far as the cars do.',
    client: 'P2P Motors',
    industry: 'Automotive Export',
    year: '2024',
    heroImage: '/images/work/p2p-motors/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity',
      'Brand colors, typography, and visual language',
      'Company profile design',
      'Production of physical assets: flags, signboards, showroom graphics',
      'Social media design and direction',
      'Print materials and internal tools',
      "From digital to print to physical space, every element was created to align with the brand's core values and speak directly to a global audience.",
    ],
    deliverables: [
      'Logo and complete brand identity',
      'Brand colors, typography, and visual language',
      'Company profile design',
      'Physical assets: flags, signboards, and showroom graphics',
      'Social media design and direction',
      'Print materials and internal tools',
    ],
    results: [
      { label: 'Export markets served', value: '12+' },
      { label: 'Showroom and event assets', value: '30+' },
      { label: 'Social engagement lift', value: '+80%' },
    ],
    challenge:
      'Global scale. Branding that still felt local and soft.',
    approach:
      'Full branding: profile, socials, flags, showroom. One confident system.',
    outcome:
      'Digital to physical, every surface now says premium and international.',
    quote: {
      text: 'Wherever a client meets us (showroom, socials, or a signed export deal), we look like one serious brand.',
      author: 'Managing Director, P2P Motors',
    },
    gallery: [
      {
        src: '/images/work/p2p-motors/hero.webp',
        alt: 'P2P Motors luxury vehicle-export brand identity, gold-on-black stationery, dealer flags, signage and showroom collateral.',
        width: 1241,
        height: 1754,
      },
      {
        src: '/images/work/p2p-motors/gallery-1.webp',
        alt: 'P2P Motors showroom and worldwide-shipping social campaign with premium blacked-out vehicles.',
        width: 1241,
        height: 1754,
      },
    ],
    prev: 'sanapex-interiors',
    next: 'dose-pharmacy',
  },
);

export const dosePharmacy = caseStudy(
  'dose-pharmacy',
  'Dose Pharmacy: Branding & Fit-Out Design',
  'DOSE PHARMACY: BRANDING & FIT-OUT DESIGN',
  'featured',
  'Healthcare & retail',
  'Case study: retail pharmacy branding and spatial fit-out in Riyadh.',
  {
    overview:
      'A modern Riyadh pharmacy. Clean brand, warm fit-out: trust you can walk into.',
    client: 'Dose Pharmacy',
    industry: 'Retail Pharmacy',
    year: '2023',
    scopeItems: [
      'Logo design and complete brand identity',
      'Brand colors, typography, and visual style',
      'Packaging and print materials',
      'Interior branding and fit-out concept',
      'Signage and in-store communication',
      "The result is a fresh, cohesive brand experience from the shopfront to the customer's hand.",
    ],
    deliverables: [
      'Logo and complete brand identity',
      'Brand colors, typography, and visual style',
      'Packaging and print materials',
      'Interior branding and fit-out concept',
      'Signage and in-store communication',
    ],
    results: [
      { label: 'Fit-out concept', value: 'End-to-end' },
      { label: 'Packaging SKUs branded', value: '20+' },
      { label: 'Footfall uplift (pilot store)', value: '+35%' },
    ],
    challenge:
      'Clinical trust and retail warmth. Most pharmacies pick one and miss.',
    approach:
      'Identity into space: packaging, signage, and shopfront as one system.',
    outcome:
      'From storefront to shelf, Dose feels calm, clear, and dependable.',
    quote: {
      text: 'Customers tell us the store just feels calmer and easier to trust now.',
      author: 'Operations Lead, Dose Pharmacy',
    },
    gallery: [],
    prev: 'p2p-motors',
    next: 'clemson-porter-properties',
  },
);

export const clemsonPorterProperties = caseStudy(
  'clemson-porter-properties',
  'Clemson Porter Properties: Full Rebranding',
  'CLEMSON PORTER PROPERTIES: FULL REBRANDING',
  'featured',
  'Property & interiors',
  'Case study: quiet-luxury rebranding for a UAE property brokerage.',
  {
    overview:
      'UAE property brokerage. A quiet-luxury rebrand for clients who notice everything.',
    client: 'Clemson Porter Properties',
    industry: 'Real Estate Brokerage',
    year: '2024',
    scopeItems: [
      'Full logo redesign and brand identity system',
      'Brand colors, typography, and tone of voice',
      'Company profile design',
      'Stationery and print materials',
      'Visual direction focused on quiet luxury and trust',
      'The new brand is subtle, confident, and timeless, built to resonate with high-net-worth individuals and global investors.',
    ],
    deliverables: [
      'Full logo redesign and brand identity system',
      'Brand colors, typography, and tone of voice',
      'Company profile design',
      'Stationery and print materials',
      'Quiet-luxury visual direction',
    ],
    results: [
      { label: 'Brand system components', value: '25+' },
      { label: 'Qualified investor leads', value: '+50%' },
      { label: 'Rebrand rollout', value: '5 weeks' },
    ],
    challenge:
      'High-value clients. A brand that still looked dated.',
    approach:
      'Full rebrand, restrained mark, quiet luxury, zero noise.',
    outcome:
      'Subtle, confident, timeless, built for private capital.',
    quote: {
      text: 'It finally feels like a brand our kind of client expects to see.',
      author: 'CEO, Clemson Porter Properties',
    },
    gallery: [],
    prev: 'dose-pharmacy',
    next: 'sanapex-interiors',
  },
);

export const emiratesAgro = caseStudy(
  'emirates-agro',
  'Emirates Agro: Rebranding & Visual Identity',
  'EMIRATES AGRO: REBRANDING & VISUAL IDENTITY',
  'more',
  'Industry & energy',
  'Case study: heritage-forward rebranding for a global agricultural supplier.',
  {
    overview:
      'Since 1981. We rebranded a global agro supplier for the next forty years.',
    client: 'Emirates Agro',
    industry: 'Agriculture & Petrochemicals',
    year: '2023',
    scopeItems: [
      'Logo redesign and full brand identity',
      'Visual direction rooted in agriculture and sustainability',
      'Company profile design',
      'Refined color palette: layered greens, almond, and dun tones',
      'Minimal, clean layout system with a focus on clarity and trust',
    ],
    deliverables: [
      'Logo redesign and full brand identity',
      'Agriculture and sustainability-led visual direction',
      'Company profile design',
      'Refined palette: layered greens, almond, and dun tones',
      'Minimal, clean layout system',
    ],
    results: [
      { label: 'Heritage', value: 'Since 1981' },
      { label: 'Product lines unified', value: '3' },
      { label: 'Profile and collateral', value: 'Full suite' },
    ],
    challenge:
      'Deep heritage. A brand that no longer looked global.',
    approach:
      'Greens, clarity, trust: identity rooted in land and scale.',
    outcome:
      'Four decades of legacy, one modern visual language.',
    quote: {
      text: 'Four decades of history, finally captured in a brand that looks ahead.',
      author: 'Brand Lead, Emirates Agro',
    },
    gallery: [],
    prev: 'zealerz',
    next: 'zealerz',
  },
);

export const zealerz = caseStudy(
  'zealerz',
  'Zealerz: Branding & Visual Identity',
  'ZEALERZ: BRANDING & VISUAL IDENTITY',
  'more',
  'Industry & energy',
  'Case study: brand identity and app design for an LPG marketplace.',
  {
    overview:
      'LPG, simplified. Brand + app for a Dubai marketplace built on speed and trust.',
    client: 'Zealerz',
    industry: 'LPG Marketplace & Logistics',
    year: '2024',
    heroImage: '/images/work/zealerz/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity',
      'Visual language reflecting technology, speed, and trust',
      'Full branding system for digital and physical use',
      'App design focused on user experience and clarity',
    ],
    deliverables: [
      'Logo and complete brand identity',
      'Visual language for technology, speed, and trust',
      'Branding system for digital and physical use',
      'App UI and experience design',
    ],
    results: [
      { label: 'Platform', value: 'iOS & Android' },
      { label: 'Core flows designed', value: '10+' },
      { label: 'Brand system', value: 'Digital + physical' },
    ],
    challenge:
      'A low-trust category. A product that had to feel instant.',
    approach:
      'Identity + app, tech energy, zero friction.',
    outcome:
      'Ordering LPG finally feels as simple as it should.',
    quote: {
      text: 'Ordering gas should feel this simple. The brand and app finally make it so.',
      author: 'Founder, Zealerz',
    },
    gallery: [
      {
        src: '/images/work/zealerz/hero.webp',
        alt: 'Zealerz LPG delivery app and brand identity, delivery trucks, gas cylinders and solar in a green industrial palette.',
        width: 1241,
        height: 1754,
      },
    ],
    prev: 'emirates-agro',
    next: 'emirates-agro',
  },
);

export const allCaseStudies: CaseStudyRecord[] = [
  sanapexInteriors,
  p2pMotors,
  dosePharmacy,
  clemsonPorterProperties,
  emiratesAgro,
  zealerz,
];

export const caseStudiesBySlug = Object.fromEntries(
  allCaseStudies.map((c) => [c.slug, c]),
) as Record<CaseStudyRecord['slug'], CaseStudyRecord>;
