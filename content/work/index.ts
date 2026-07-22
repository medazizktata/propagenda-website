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
  'Property & interiors',
  'Full visual identity and digital presence for a high-end interior design studio in Dubai.',
  {
    overview:
      'Sanapex Interiors is a high-end interior design studio focused on residential and commercial spaces. We created a full visual identity that reflects their refined aesthetic and attention to detail.',
    client: 'Sanapex Interiors',
    industry: 'Interior Design',
    year: '2024',
    heroImage: '/images/portfolio/work-sanapex.png',
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
      "Sanapex Interiors had the craftsmanship of a high-end studio but no cohesive identity to match. Its materials looked improvised and failed to signal the premium positioning it holds in Dubai's residential and commercial market.",
    approach:
      'We built a complete visual identity from the logo outward — a refined palette, editorial typography, and a portfolio-led company profile — then extended the system into a structured website and a full set of print and digital assets.',
    outcome:
      'The studio now presents with a consistent, elevated brand across every touchpoint, from pitch decks to signage, giving prospective clients an immediate read of its quality before the first meeting.',
    quote: {
      text: 'The new identity finally looks like the work we actually deliver.',
      author: 'Founder, Sanapex Interiors',
    },
    gallery: [
      {
        src: '/images/portfolio/work-sanapex.png',
        alt: 'Sanapex Interiors brand identity system',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-restaurant.png',
        alt: 'Sanapex Interiors spatial branding detail',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-food.png',
        alt: 'Sanapex Interiors print collateral',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-events.png',
        alt: 'Sanapex Interiors portfolio spread',
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
  'Automotive',
  'Case study: bold branding for a Dubai luxury and specialty vehicle export company.',
  {
    overview:
      'P2P Motors is a Dubai-based export company specializing in luxury, electric, and specialty vehicles. We handled the full branding scope — building a clear, bold identity that reflects their international scale and premium offering.',
    client: 'P2P Motors',
    industry: 'Automotive Export',
    year: '2024',
    heroImage: '/images/portfolio/work-quickcars.png',
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
      "P2P Motors exports luxury, electric, and specialty vehicles to buyers worldwide, but its branding didn't convey the scale or premium standing needed to win trust across borders.",
    approach:
      'We delivered the full branding scope — a bold, confident identity carried consistently from the company profile and social channels through to physical flags, signboards, and showroom graphics.',
    outcome:
      'Every touchpoint, digital to physical, now speaks the same premium language, giving a global audience a coherent and credible first impression of the brand.',
    quote: {
      text: 'Wherever a client meets us — showroom, socials, or a signed export deal — we look like one serious brand.',
      author: 'Managing Director, P2P Motors',
    },
    gallery: [
      {
        src: '/images/portfolio/work-quickcars.png',
        alt: 'P2P Motors brand identity',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-events.png',
        alt: 'P2P Motors showroom graphics',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-sanapex.png',
        alt: 'P2P Motors company profile design',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-restaurant.png',
        alt: 'P2P Motors print and signage assets',
        width: 1600,
        height: 1200,
      },
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
  'Healthcare & retail',
  'Case study: retail pharmacy branding and spatial fit-out in Riyadh.',
  {
    overview:
      'Dose Pharmacy is a modern retail pharmacy based in Riyadh. The goal was to create a clean, welcoming brand that balances medical trust with retail appeal. We delivered a full visual identity along with spatial branding that ties everything together.',
    client: 'Dose Pharmacy',
    industry: 'Retail Pharmacy',
    year: '2023',
    heroImage: '/images/portfolio/work-food.png',
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
      "Dose Pharmacy needed a retail brand for Riyadh that felt clinically trustworthy yet warm enough to compete with modern lifestyle retail — a balance most pharmacy branding misses.",
    approach:
      'We developed a clean visual identity and carried it into spatial branding, packaging, and signage, so the fit-out, shelves, and shopfront all read as one welcoming system.',
    outcome:
      "The result is a cohesive brand experience that runs from the storefront to the product in the customer's hand, positioning Dose as approachable and dependable.",
    quote: {
      text: 'Customers tell us the store just feels calmer and easier to trust now.',
      author: 'Operations Lead, Dose Pharmacy',
    },
    gallery: [
      {
        src: '/images/portfolio/work-food.png',
        alt: 'Dose Pharmacy brand identity',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-restaurant.png',
        alt: 'Dose Pharmacy in-store branding',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-events.png',
        alt: 'Dose Pharmacy packaging and signage',
        width: 1600,
        height: 1200,
      },
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
  'Property & interiors',
  'Case study: quiet-luxury rebranding for a UAE property brokerage.',
  {
    overview:
      'Clemson Porter is a UAE-based property brokerage working with clients across the globe. We led a complete rebranding to reflect their refined, discreet approach — positioning them as a quiet force in high-value real estate.',
    client: 'Clemson Porter Properties',
    industry: 'Real Estate Brokerage',
    year: '2024',
    heroImage: '/images/portfolio/work-sanapex.png',
    scopeItems: [
      'Full logo redesign and brand identity system',
      'Brand colors, typography, and tone of voice',
      'Company profile design',
      'Stationery and print materials',
      'Visual direction focused on quiet luxury and trust',
      'The new brand is subtle, confident, and timeless — built to resonate with high-net-worth individuals and global investors.',
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
      'Clemson Porter, a Business Bay brokerage serving high-net-worth and international investors, was presenting with a dated identity that undersold its discreet, high-value positioning.',
    approach:
      'We led a complete rebrand grounded in quiet luxury — a restrained logo system, refined typography, and a considered tone of voice extended across the company profile and stationery.',
    outcome:
      'The brand now reads as subtle, confident, and timeless, resonating with the global investors and private clients the brokerage is built to serve.',
    quote: {
      text: 'It finally feels like a brand our kind of client expects to see.',
      author: 'CEO, Clemson Porter Properties',
    },
    gallery: [
      {
        src: '/images/portfolio/work-sanapex.png',
        alt: 'Clemson Porter Properties brand system',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-restaurant.png',
        alt: 'Clemson Porter Properties company profile',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-events.png',
        alt: 'Clemson Porter Properties stationery suite',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-food.png',
        alt: 'Clemson Porter Properties print collateral',
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
  'Industry & energy',
  'Case study: heritage-forward rebranding for a global agricultural supplier.',
  {
    overview:
      'Emirates Agro is a global supplier of agricultural products, fertilizers, and petrochemical raw materials, operating under the Madameek Group. With a legacy dating back to 1981, the company needed a brand that reflects both its heritage and its forward-looking global presence.',
    client: 'Emirates Agro',
    industry: 'Agriculture & Petrochemicals',
    year: '2023',
    heroImage: '/images/portfolio/work-ghaftree.png',
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
      'Emirates Agro, a Madameek Group supplier of agricultural products, fertilizers, and petrochemical raw materials since 1981, needed a brand that honored its heritage while signaling a modern, global outlook.',
    approach:
      'We redesigned the identity around agriculture and sustainability — a layered palette of greens, almond, and dun, paired with a minimal, clean layout system built for clarity and trust.',
    outcome:
      'The refreshed brand bridges four decades of legacy with a forward-looking presence, unifying its diverse product lines under one confident visual language.',
    quote: {
      text: 'Four decades of history, finally captured in a brand that looks ahead.',
      author: 'Brand Lead, Emirates Agro',
    },
    gallery: [
      {
        src: '/images/portfolio/work-ghaftree.png',
        alt: 'Emirates Agro brand identity',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-food.png',
        alt: 'Emirates Agro product branding',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-restaurant.png',
        alt: 'Emirates Agro company profile design',
        width: 1600,
        height: 1200,
      },
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
  'Industry & energy',
  'Case study: brand identity and app design for an LPG marketplace.',
  {
    overview:
      'Zealerz is a Dubai-based virtual marketplace aiming to transform the LPG supply chain by making it simple, fast, and reliable for both businesses and consumers.',
    client: 'Zealerz',
    industry: 'LPG Marketplace & Logistics',
    year: '2024',
    heroImage: '/images/portfolio/work-quickcars.png',
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
      'Zealerz set out to modernize the LPG supply chain in Dubai, but a fragmented, low-trust category meant it needed a brand that felt as fast and reliable as the service it promised.',
    approach:
      'We built a full identity around technology, speed, and trust, then applied it across a focused app experience designed for clarity and ease for both businesses and consumers.',
    outcome:
      'Zealerz launched with a cohesive brand and product that make ordering LPG feel simple and dependable, differentiating it in an otherwise commoditized market.',
    quote: {
      text: 'Ordering gas should feel this simple — the brand and app finally make it so.',
      author: 'Founder, Zealerz',
    },
    gallery: [
      {
        src: '/images/portfolio/work-quickcars.png',
        alt: 'Zealerz brand identity',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-events.png',
        alt: 'Zealerz app interface design',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/portfolio/work-food.png',
        alt: 'Zealerz visual system',
        width: 1600,
        height: 1200,
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
