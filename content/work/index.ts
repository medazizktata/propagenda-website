import type { CaseStudyRecord } from '@/types/content';

function caseStudy(
  slug: CaseStudyRecord['slug'],
  title: string,
  h1: string,
  tier: CaseStudyRecord['tier'],
  description: string,
  extra?: Partial<CaseStudyRecord>,
): CaseStudyRecord {
  return {
    slug,
    title,
    h1,
    tier,
    overview: `${title} case study — content from CONTENT_MAPPING.md.`,
    scopeItems: ['Branding', 'Digital presence'],
    gallery: [],
    seo: { title: `${title} | Propagenda`, description },
    ...extra,
  };
}

export const sanapexInteriors = caseStudy(
  'sanapex-interiors',
  'Sanapex Interiors — Full Branding & Digital Presence',
  'SANAPEX INTERIORS — FULL BRANDING & DIGITAL PRESENCE',
  'featured',
  'Full visual identity and digital presence for a high-end interior design studio in Dubai.',
  {
    overview:
      'Sanapex Interiors is a high-end interior design studio focused on residential and commercial spaces. We created a full visual identity that reflects their refined aesthetic and attention to detail.',
    scopeItems: [
      'Logo design and complete brand identity',
      'Brand colors, typography, and visual direction',
      'Company profile and portfolio design',
      'Website design and structure',
      'Print and digital brand assets',
    ],
    gallery: [
      {
        src: '/images/work/sanapex-interiors.png',
        alt: 'Sanapex Interiors branding',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/work/sanapex-business-card.jpg',
        alt: 'Sanapex business card design',
        width: 1600,
        height: 1200,
      },
    ],
    prev: 'clemson-porter-properties',
    next: 'p2p-motors',
  },
);

export const p2pMotors = caseStudy(
  'p2p-motors',
  'P2P Motors — Full Branding & Visual Identity',
  'P2P MOTORS — FULL BRANDING & VISUAL IDENTITY',
  'featured',
  'Case study: bold branding for a Dubai luxury and specialty vehicle export company.',
  {
    overview:
      'P2P Motors is a Dubai-based export company specializing in luxury, electric, and specialty vehicles. We handled the full branding scope — building a clear, bold identity that reflects their international scale and premium offering.',
    scopeItems: [
      'Logo design and complete brand identity',
      'Brand colors, typography, and visual language',
      'Company profile design',
      'Production of physical assets: flags, signboards, showroom graphics',
      'Social media design and direction',
      'Print materials and internal tools',
      "From digital to print to physical space, every element was created to align with the brand's core values and speak directly to a global audience.",
    ],
    gallery: [
      { src: '/images/work/p2p-motors.png', alt: 'P2P Motors branding', width: 1600, height: 1200 },
      { src: '/images/work/p2p-gold-logo.jpg', alt: 'P2P Motors gold logo', width: 1600, height: 1200 },
    ],
    prev: 'sanapex-interiors',
    next: 'dose-pharmacy',
  },
);

export const dosePharmacy = caseStudy(
  'dose-pharmacy',
  'Dose Pharmacy — Branding & Fit-Out Design',
  'DOSE PHARMACY — BRANDING & FIT-OUT DESIGN',
  'featured',
  'Case study: retail pharmacy branding and spatial fit-out in Riyadh.',
  {
    overview:
      'Dose Pharmacy is a modern retail pharmacy based in Riyadh. The goal was to create a clean, welcoming brand that balances medical trust with retail appeal. We delivered a full visual identity along with spatial branding that ties everything together.',
    scopeItems: [
      'Logo design and complete brand identity',
      'Brand colors, typography, and visual style',
      'Packaging and print materials',
      'Interior branding and fit-out concept',
      'Signage and in-store communication',
      "The result is a fresh, cohesive brand experience from the shopfront to the customer's hand.",
    ],
    gallery: [
      { src: '/images/work/dose-pharmacy.png', alt: 'Dose Pharmacy branding', width: 1600, height: 1200 },
    ],
    prev: 'p2p-motors',
    next: 'clemson-porter-properties',
  },
);

export const clemsonPorterProperties = caseStudy(
  'clemson-porter-properties',
  'Clemson Porter Properties — Full Rebranding',
  'CLEMSON PORTER PROPERTIES — FULL REBRANDING',
  'featured',
  'Case study: quiet-luxury rebranding for a UAE property brokerage.',
  {
    overview:
      'Clemson Porter is a UAE-based property brokerage working with clients across the globe. We led a complete rebranding to reflect their refined, discreet approach — positioning them as a quiet force in high-value real estate.',
    scopeItems: [
      'Full logo redesign and brand identity system',
      'Brand colors, typography, and tone of voice',
      'Company profile design',
      'Stationery and print materials',
      'Visual direction focused on quiet luxury and trust',
      'The new brand is subtle, confident, and timeless — built to resonate with high-net-worth individuals and global investors.',
    ],
    gallery: [
      {
        src: '/images/work/clemson-porter-1.png',
        alt: 'Clemson Porter Properties rebranding',
        width: 1600,
        height: 1200,
      },
    ],
    prev: 'dose-pharmacy',
    next: 'sanapex-interiors',
  },
);

export const emiratesAgro = caseStudy(
  'emirates-agro',
  'Emirates Agro — Rebranding & Visual Identity',
  'EMIRATES AGRO — REBRANDING & VISUAL IDENTITY',
  'more',
  'Case study: heritage-forward rebranding for a global agricultural supplier.',
  {
    overview:
      'Emirates Agro is a global supplier of agricultural products, fertilizers, and petrochemical raw materials, operating under the Madameek Group. With a legacy dating back to 1981, the company needed a brand that reflects both its heritage and its forward-looking global presence.',
    scopeItems: [
      'Logo redesign and full brand identity',
      'Visual direction rooted in agriculture and sustainability',
      'Company profile design',
      'Refined color palette: layered greens, almond, and dun tones',
      'Minimal, clean layout system with a focus on clarity and trust',
    ],
    gallery: [
      { src: '/images/work/emirates-agro.png', alt: 'Emirates Agro rebranding', width: 1600, height: 1200 },
    ],
    prev: 'zealerz',
    next: 'zealerz',
  },
);

export const zealerz = caseStudy(
  'zealerz',
  'Zealerz — Branding & Visual Identity',
  'ZEALERZ — BRANDING & VISUAL IDENTITY',
  'more',
  'Case study: brand identity and app design for an LPG marketplace.',
  {
    overview:
      'Zealerz is a Dubai-based virtual marketplace aiming to transform the LPG supply chain by making it simple, fast, and reliable for both businesses and consumers.',
    scopeItems: [
      'Logo design and complete brand identity',
      'Visual language reflecting technology, speed, and trust',
      'Full branding system for digital and physical use',
      'App design focused on user experience and clarity',
    ],
    gallery: [
      { src: '/images/work/zealerz.png', alt: 'Zealerz branding and app design', width: 1600, height: 1200 },
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
