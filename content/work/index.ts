/** Seed data, also the runtime fallback when D1 isn't reachable. */
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
      'Logo design and complete bilingual (English/Arabic) brand identity, built on a mark combining the Latin "N" with the Arabic nūn (نَ)',
      'Full brand guidelines document: brand story, values, target audience, logo construction, clear-space and misuse rules, colors, typography, pattern, icons, social media and application templates',
      'Brand colors: black, white, beige and warm-grey tones',
      'Typography system: Viola for headings, Poppins for body text',
      'Company profile and portfolio design',
      'Website design and structure',
      'Print and digital brand assets',
    ],
    deliverables: [
      'Logo and complete brand identity: horizontal (primary), vertical and logo-mark-only lockups',
      'Full brand guidelines document with logo construction, clear-space and misuse rules',
      'Brand colors: black, white, beige (#BAA58D) and warm grey (#CEC5B6), with hex values',
      'Typography system: Viola headings paired with Poppins body text',
      'A repeating pattern built from the interlocking logo mark',
      'Icon set for contact points: Instagram, Facebook, phone, email and location, in solid-black and beige treatments',
      'Stationery and print collateral: business cards, envelopes, catalogue, quotation and invoice templates',
      'Social media templates and branded merchandise',
      'Company profile and portfolio design',
      'Website design and structure',
    ],
    challenge:
      'World-class craft. A brand that still looked improvised.',
    approach:
      'Logo to website: one refined system, built to signal premium from the first glance.',
    outcome:
      'Every touchpoint now reads as high-end before the first meeting.',
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
      {
        src: '/images/work/sanapex-interiors/gallery-2.webp',
        alt: 'Sanapex Interiors logo variations: horizontal and vertical lockups of the bilingual "N" and Arabic nūn mark, paired with the SANAPEX INTERIORS wordmark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sanapex-interiors/gallery-3.webp',
        alt: 'Sanapex Interiors typography system: Viola for headings and Poppins for body text.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sanapex-interiors/gallery-4.webp',
        alt: 'Sanapex Interiors repeating pattern built from the interlocking "N" and Arabic nūn logo mark.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'bnk-group',
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
      'Logo design built on a hidden-meaning monogram: mirrored "P"s forming a car-front silhouette, with the negative space between them reading as a "2" (for "P2P") and the extended arrow strokes doubling as a streamlined bumper and export/forward-motion cue',
      'Brand colors: black and a gold gradient (#594017 to #fdcb6b) as the primary pairing, with dark grey and white as a secondary palette',
      'Typography system: Good Times Rg for headings, Helvetica Neue for body text',
      'Two supporting repeating patterns built from the logo\'s arrow motif',
      'Custom icon style for Facebook, Messenger, Instagram, WhatsApp, TikTok and YouTube',
      'Company profile/brochure design',
      'Production of physical assets: dealer and feather flags, an outdoor billboard, showroom wall art and a branded vehicle-wrap pattern',
      'Social media style guide and Instagram highlight/story templates',
      'Print materials and internal tools: stationery, invoice and quotation templates, a bilingual (English/Arabic) company rubber stamp for P2P LLC, and staff ID/lanyard',
    ],
    deliverables: [
      'Logo and complete brand identity, with a documented logo-construction rationale',
      'Brand colors (black and gold gradient, plus a dark-grey-and-white secondary palette), typography and pattern system',
      'Company profile design',
      'Physical assets: dealer and feather flags, showroom wall art, branded vehicle wrap, car cover and sunshade',
      'Social media style guide, icon set and Instagram story/highlight templates',
      'Print materials and internal tools: stationery, presentation folder, invoice/quotation templates, bilingual (English/Arabic) company stamp for P2P LLC, staff lanyard and ID',
      'Corporate merchandise: branded mug, keychain, t-shirt and cap',
    ],
    challenge:
      'Global scale. Branding that still felt local and soft.',
    approach:
      'Full branding: profile, socials, flags, showroom. One confident system.',
    outcome:
      'Digital to physical, every surface now says premium and international.',
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
      {
        src: '/images/work/p2p-motors/gallery-2.webp',
        alt: 'P2P Motors brand colors: black and a gold gradient (#594017 to #fdcb6b) shown on a gold-liveried sports car.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/p2p-motors/gallery-3.webp',
        alt: 'P2P Motors logo construction: mirrored "P"s forming a car-front silhouette, a hidden "2" in the negative space, and arrow strokes forming a streamlined bumper.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/p2p-motors/gallery-4.webp',
        alt: 'P2P Motors typography system: Good Times Rg for headings and Helvetica Neue for body text.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'sanapex-interiors',
    next: 'dose-pharmacy',
  },
);

export const dosePharmacy = caseStudy(
  'dose-pharmacy',
  'Dose Pharmacy: Branding & Identity',
  'DOSE PHARMACY: BRANDING & IDENTITY',
  'featured',
  'Healthcare & retail',
  'Case study: bilingual (English/Arabic) brand identity for a Saudi pharmacy brand.',
  {
    overview:
      'A Saudi pharmacy brand built to reassure in two languages. One coral leaf-and-wing mark, carried from the business card to the billboard.',
    client: 'Dose Pharmacy',
    industry: 'Retail Pharmacy',
    year: '2023',
    heroImage: '/images/work/dose-pharmacy/hero.webp',
    scopeItems: [
      'Logo design and complete bilingual (English/Arabic) brand identity: a coral leaf-and-wing "D + P" monogram with English and Arabic wordmarks',
      'Bilingual brand tagline: "Your Daily Dose of Wellness" / "جرعتك اليومية من العافية"',
      'Brand colors and typography system',
      'Stationery: business cards, envelopes, letterhead and a presentation folder',
      'Spiral-bound, tab-divided branded notebook',
      'Staff identity: ID badge, lanyard and lab-coat branding',
      'Desk name plate',
      'Packaging color concepts for pill bottles',
      'Outdoor advertising: an Arabic-language billboard concept',
    ],
    deliverables: [
      'Logo and complete bilingual brand identity: coral leaf-and-wing "D + P" monogram with English and Arabic wordmarks',
      'Bilingual tagline: "Your Daily Dose of Wellness"',
      'Brand colors and typography system',
      'Stationery: business cards, envelopes, letterhead and presentation folder',
      'Branded notebook with tabbed dividers',
      'Staff badge, lanyard and lab-coat branding',
      'Desk name plate, pill-bottle packaging colorways and a billboard concept',
    ],
    challenge:
      'Clinical trust and everyday warmth, in two languages. Most pharmacy brands manage one.',
    approach:
      'A coral leaf-and-wing "D + P" mark built to run bilingual, carried through stationery, staff badges and lab coats, a tabbed notebook, packaging colorways and an Arabic billboard concept.',
    outcome:
      'One bilingual identity system, from business card to billboard, built around the line "Your Daily Dose of Wellness."',
    gallery: [
      {
        src: '/images/work/dose-pharmacy/hero.webp',
        alt: 'Dose Pharmacy brand kit cover: the coral leaf-and-wing "D + P" mark above the DOSE PHARMACY wordmark.',
        width: 1847,
        height: 1038,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-1.webp',
        alt: 'Dose Pharmacy outdoor billboard concept in coral and black, with an Arabic headline and a masked pharmacist holding medication.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-2.webp',
        alt: 'Dose Pharmacy business card mockup in cream and coral, with the leaf-and-wing "D + P" mark on the front and the Arabic wordmark on the reverse.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-3.webp',
        alt: 'Dose Pharmacy envelope and card mockup with the "Your Daily Dose of Wellness" tagline and a repeating leaf-and-wing pattern.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-4.webp',
        alt: 'Dose Pharmacy spiral-bound notebook mockup with coral tabbed dividers and the Arabic tagline "جرعتك اليومية من العافية" (Your Daily Dose of Wellness).',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-5.webp',
        alt: 'Dose Pharmacy pill-bottle packaging concept in charcoal and coral, each stamped with the leaf-and-wing "D + P" mark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-6.webp',
        alt: 'Dose Pharmacy staff ID badge and lanyard printed with a repeating leaf-and-wing pattern, beside a pharmacist in a branded lab coat holding a clipboard.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-7.webp',
        alt: 'Dose Pharmacy interior store-design concept render, with neon-lit product columns and "Your Daily Dose Of Happiness" wall signage above the checkout counter.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dose-pharmacy/gallery-8.webp',
        alt: 'Dose Pharmacy storefront signage concept on a street-level building facade, bilingual English/Arabic sign above glass display windows at sunset.',
        width: 1920,
        height: 1080,
      },
    ],
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
    client: 'Clemson Porter Properties Brokers',
    industry: 'Real Estate Brokerage',
    year: '2025',
    heroImage: '/images/work/clemson-porter-properties/hero.webp',
    scopeItems: [
      'Full visual identity guidelines: brand essence, values and personality',
      'Geometric logo system built from interlocking "C" and "P" marks, with primary, vertical, simplified and submark lockups',
      'Bilingual (English/Arabic) typography system',
      'A "quiet luxury" color palette and a vertical/horizontal pattern built from the logo shapes',
      'Stationery: business cards, letterhead and envelopes',
      'Presentation folder, spiral-bound notebook and desk name plate',
      'Staff lapel pin, ID badge and lanyard',
      'Feather flags, branded mugs and outdoor signage guidance',
    ],
    deliverables: [
      'Full visual identity guidelines document',
      'Logo system: primary, vertical, simplified and submark lockups',
      'Bilingual (English/Arabic) typography system',
      'Color palette and geometric pattern system',
      'Stationery: business cards, letterhead, envelopes and presentation folder',
      'Notebook, desk name plate, lapel pin, ID badge and lanyard',
      'Feather flags, mugs and outdoor signage application',
    ],
    challenge:
      'A premium property brokerage with no consistent visual identity to match its client base.',
    approach:
      'A geometric mark fusing "C" and "P" into a building-like form, carried through a quiet-luxury palette of black, dark olive, walnut brown and bone across every touchpoint.',
    outcome:
      'One documented system, from business card to billboard, under the line "Clarity. Control. Confidence."',
    gallery: [
      {
        src: '/images/work/clemson-porter-properties/hero.webp',
        alt: 'Clemson Porter Properties business card mockup in dark olive with the geometric C+P mark, front and back.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/clemson-porter-properties/gallery-1.webp',
        alt: 'Clemson Porter Properties rooftop billboard reading "Invest smart. Live fine." beside the logo lockup.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/clemson-porter-properties/gallery-2.webp',
        alt: 'Clemson Porter Properties presentation folder and property-document sheet with the logo and "Clarity. Control. Confidence." tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/clemson-porter-properties/gallery-3.webp',
        alt: 'Clemson Porter Properties brand color story: black, dark olive, walnut brown and bone with the geometric pattern.',
        width: 1080,
        height: 1350,
      },
    ],
    prev: 'dose-pharmacy',
    next: 'sealand',
  },
);

export const sealand = caseStudy(
  'sealand',
  'Sealand: Rebranding & Visual Identity',
  'SEALAND: REBRANDING & VISUAL IDENTITY',
  'featured',
  'Food & hospitality',
  'Case study: rebranding and a full bilingual visual identity system for a Dubai seafood restaurant serving since 1982.',
  {
    overview:
      'A Dubai seafood restaurant since 1982. We modernized its identity without spending down four decades of trust.',
    client: 'Sealand',
    industry: 'Seafood Restaurant',
    year: '2025',
    heroImage: '/images/work/sealand/hero.webp',
    scopeItems: [
      'Logo redesign and complete bilingual (English/Arabic) brand identity system',
      'Brand colors, typography, and visual language',
      'Packaging design: paper bags, takeaway bowls and containers',
      'Staff uniform design: chef jackets, aprons, captain and waiter jackets, housekeeping wear',
      'Front-of-house collateral: menus, guest checks, reserved-table signage, stationery',
      'Social media style guide and templates',
    ],
    deliverables: [
      'Full logo system: primary, horizontal, Arabic horizontal/vertical, combined and simplified marks',
      'Bilingual (English/Arabic) brand identity system',
      'Color palette, typography and icon set',
      'Packaging: paper bags and takeaway bowls',
      'Staff uniforms: chef jackets, aprons, captain/waiter jackets and housekeeping wear',
      'Stationery and print collateral: business cards, letterhead, envelopes, presentation folder',
      'Menu and guest-check design, reserved-table signage',
      'Social media style guide',
    ],
    challenge:
      'Four decades of trust in Dubai. A visual identity that needed to feel current without losing what made it familiar.',
    approach:
      "A bilingual system built on a navy-and-tangerine palette and a recurring sea-and-land wave motif, carried through packaging, uniforms and every guest-facing touchpoint.",
    outcome:
      'One consistent system now carries the Sealand name from the kitchen to the paper bag guests take home.',
    gallery: [
      {
        src: '/images/work/sealand/hero.webp',
        alt: 'Sealand seafood restaurant brand identity: navy waist apron with a gold-embroidered crest and a wave-pattern pocket.',
        width: 1200,
        height: 1800,
      },
      {
        src: '/images/work/sealand/gallery-1.webp',
        alt: 'Sealand captain and waiter jackets with a gold-embroidered crest, part of the bilingual restaurant identity.',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/work/sealand/gallery-2.webp',
        alt: 'Sealand branded paper bags in navy and cream, with the Arabic wordmark, gold crest and orange-and-navy wave motif.',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/work/sealand/gallery-3.webp',
        alt: 'Sealand brand guideline color palette: Navy Blue, Indigo Dye, Tangerine, Earth Yellow and Alabaster swatches with CMYK values.',
        width: 960,
        height: 540,
      },
    ],
    prev: 'clemson-porter-properties',
    next: 'bnk-group',
  },
);

export const bnkGroup = caseStudy(
  'bnk-group',
  'The BNK Group: Branding & Visual Identity',
  'THE BNK GROUP: BRANDING & VISUAL IDENTITY',
  'featured',
  'Property & interiors',
  'Case study: full bilingual (English/Arabic) brand identity and stationery system for a UAE luxury interior design-build studio.',
  {
    overview:
      'A luxury design-build studio entering the UAE. We gave it one bilingual identity, from the logo to the letterhead.',
    client: 'The BNK Group',
    industry: 'Interior Design & Build',
    heroImage: '/images/work/bnk-group/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity: vertical, horizontal and mark-only lockups',
      'Bilingual (English/Arabic) typography and brand voice',
      'Brand colors and a supporting geometric pattern system',
      'Stationery: business cards, letterhead and envelopes',
      'Presentation folder and project-document templates',
      'Staff ID badge and lanyard design',
      'Social media application templates and video-thumbnail style',
    ],
    deliverables: [
      'Logo and complete brand identity system',
      'Bilingual (English/Arabic) typography and brand voice',
      'Brand colors and pattern system',
      'Stationery: business cards, letterhead and envelopes',
      'Presentation folder and project-document templates',
      'Staff ID badge and lanyard',
      'Social media templates and video-thumbnail style',
    ],
    challenge:
      'A boutique design-build studio expanding into the UAE. No consistent identity to match the ambition.',
    approach:
      'One bilingual system: mark, stationery, ID and social templates, built to travel from site visit to Instagram.',
    outcome:
      'Every touchpoint, in English or Arabic, now reads as one confident, camera-ready brand.',
    gallery: [
      {
        src: '/images/work/bnk-group/hero.webp',
        alt: 'The BNK Group business card mockup in navy with a red interlocking-K mark, on marble.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bnk-group/gallery-1.webp',
        alt: 'The BNK Group staff ID badge and lanyard in a navy-and-white geometric pattern.',
        width: 764,
        height: 1080,
      },
      {
        src: '/images/work/bnk-group/gallery-2.webp',
        alt: 'The BNK Group letterhead stationery mockup with the logo lockup and bilingual footer details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bnk-group/gallery-3.webp',
        alt: 'The BNK Group social media before-and-after interior design carousel, in English and Arabic.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'sealand',
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
    prev: 'mm-event-management',
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
      'A Dubai virtual marketplace built to fix a fragmented LPG supply chain. One mark, one app, one brand system across B2B and B2C.',
    client: 'Zealerz',
    industry: 'LPG Marketplace & Logistics',
    year: '2024',
    heroImage: '/images/work/zealerz/hero.webp',
    scopeItems: [
      'Logo design built on a mirrored double-"Z" monogram, in green and navy',
      'Brand colors: green (#76AA42) and navy (#000045), with documented CMYK values and tint scales',
      'Typography system: Montserrat for headings',
      'A repeating pattern built from the double-"Z" monogram, in light and dark treatments',
      'Custom icon set for the marketplace categories (fuel, LPG cylinders, solar panels, EV charging, oil) alongside social icons (TikTok, Instagram, LinkedIn, Facebook)',
      'Social media style guide: Instagram-grid templates covering delivery, propane-vs-butane education and app promotion',
      'App UI for the iOS/Android marketplace, spanning home, offers, categories and a mall-partner marketplace card',
      'Physical brand rollout: stationery, presentation folder, staff ID/lanyard, branded truck and delivery-scooter livery, a mobile billboard trailer, and merchandise (mug, cap, polo, phone case)',
    ],
    deliverables: [
      'Logo and complete brand identity, with documented construction and clear-space rules',
      'Brand colors (#76AA42 green, #000045 navy) and Montserrat typography system',
      'Repeating pattern and custom icon set for marketplace categories and social channels',
      'Stationery: business cards, letterhead, envelopes and a presentation folder',
      'Staff ID badge and lanyard',
      'Social media style guide and a set of Instagram post templates',
      'App UI: onboarding, home feed, category browse and a partner-marketplace card (e.g. a Cityland Mall offer)',
      'Vehicle livery: branded delivery truck, delivery scooter and a mobile roadside billboard trailer promoting the app',
      'Merchandise: mug, cap, polo shirt and phone case',
    ],
    challenge:
      'A fragmented, low-trust LPG supply chain. A brand and app that had to make ordering gas feel simple.',
    approach:
      'A double-"Z" monogram in green and navy, carried from the app UI through vehicle livery, stationery and social templates, built to connect suppliers and customers on one platform.',
    outcome:
      'One brand system spanning app, fleet and physical collateral, built to serve both B2B and B2C LPG ordering across the UAE.',
    gallery: [
      {
        src: '/images/work/zealerz/hero.webp',
        alt: 'Zealerz LPG delivery app and brand identity, delivery trucks, gas cylinders and solar in a green industrial palette.',
        width: 1241,
        height: 1754,
      },
      {
        src: '/images/work/zealerz/gallery-1.webp',
        alt: 'Zealerz brand colors: green (#76AA42) and navy (#000045) shown across the double-"Z" logo mark, with CMYK values and tint percentages.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/zealerz/gallery-2.webp',
        alt: 'Zealerz typography system: Montserrat used for headings on a navy background.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/zealerz/gallery-3.webp',
        alt: 'Zealerz social media style guide: Instagram post templates covering propane-vs-butane education, the delivery app, LPG cylinders and UAE-wide delivery.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/zealerz/gallery-4.webp',
        alt: 'Zealerz branded delivery truck livery in green and navy, reading "Transforming LPG delivery with technology."',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'mm-event-management',
    next: 'arabian-business-academy',
  },
);

export const arabianBusinessAcademy = caseStudy(
  'arabian-business-academy',
  'Arabian Business Academy: Roll-Up Banner Campaign',
  'ARABIAN BUSINESS ACADEMY: ROLL-UP BANNER CAMPAIGN',
  'more',
  'Finance',
  'Case study: a bilingual roll-up banner campaign for a Dubai-based trading education and financial-markets brand.',
  {
    overview:
      'A Dubai trading academy with offices across three countries. We gave its exhibition stands one consistent bilingual voice.',
    client: 'Arabian Business Academy (ABA)',
    industry: 'Financial Trading Education',
    heroImage: '/images/work/arabian-business-academy/hero.webp',
    scopeItems: [
      'Bilingual (Arabic/English) roll-up banner design across five distinct messages',
      'Consistent application of the existing navy-and-gold crest and color system',
      'Layout for platform sign-up, expert-led courses, an investment fund, and an economic-news portal',
      'Contact and social details for the UAE, Iraq and Turkey offices on every banner',
    ],
    deliverables: [
      'Five roll-up/pull-up banner designs, print-ready',
      'Consistent bilingual layout system across offers and audiences',
      'Office and social-contact footer applied across the set',
    ],
    challenge:
      'Five different messages, three offices, two languages. One stand had to carry all of it without looking improvised.',
    approach:
      'One recurring layout, the existing navy-and-gold crest, and a shared footer, applied consistently across trading, courses, the fund and the news portal.',
    outcome:
      'A consistent exhibition presence across sign-up, education, fund and media messaging, in Arabic and English.',
    gallery: [
      {
        src: '/images/work/arabian-business-academy/hero.webp',
        alt: 'Arabian Business Academy roll-up banner with the navy-and-gold shield crest and bilingual Arabic/English headline over a stock-chart background.',
        width: 1911,
        height: 1911,
      },
      {
        src: '/images/work/arabian-business-academy/gallery-1.webp',
        alt: 'Arabian Business Academy roll-up banner promoting round-the-clock trading access and a $35 deposit bonus, with UAE, Iraq and Turkey office details.',
        width: 1911,
        height: 1911,
      },
      {
        src: '/images/work/arabian-business-academy/gallery-2.webp',
        alt: 'Arabian Business Academy roll-up banner for its "Rotterdam Fund," listing projected annual and monthly returns and a minimum deposit.',
        width: 1911,
        height: 1911,
      },
      {
        src: '/images/work/arabian-business-academy/gallery-3.webp',
        alt: 'Arabian Business Academy roll-up banner promoting its Arabic economic-news and technical-analysis website, abacademyco.com.',
        width: 1911,
        height: 1911,
      },
      {
        src: '/images/work/arabian-business-academy/gallery-4.webp',
        alt: 'Arabian Business Academy roll-up banner featuring a financial analyst alongside the navy-and-gold shield crest.',
        width: 1911,
        height: 1911,
      },
    ],
    prev: 'zealerz',
    next: '2k-shopping',
  },
);

export const twoKShopping = caseStudy(
  '2k-shopping',
  '2K Shopping: Branding & Visual Identity',
  '2K SHOPPING: BRANDING & VISUAL IDENTITY',
  'more',
  'Healthcare & retail',
  'Case study: full bilingual (English/Arabic) brand identity and application system for a UAE-based online grocery delivery platform.',
  {
    overview:
      'A UAE online grocery platform. We gave it one bold identity, from the app splash screen to the delivery van.',
    client: '2K Shopping',
    industry: 'Online Grocery Delivery',
    heroImage: '/images/work/2k-shopping/hero.webp',
    scopeItems: [
      'Brand strategy: positioning, target audience, value proposition, core values and tone of voice',
      'Logo design and complete brand identity: construction, concept, and vertical/horizontal/simplified-mark variations',
      'Bilingual (English/Arabic) typography system, color palette and icon style',
      'Packaging and delivery collateral: shipping boxes, delivery bags/backpacks and branded tape',
      'Fleet livery, billboard and staff uniform design',
      'Stationery and office collateral: business cards, letterhead, presentation folder, staff ID badge and notebook',
    ],
    deliverables: [
      'Full logo system: construction, concept, vertical, horizontal and simplified-mark variations',
      'Brand strategy: positioning, value proposition, core values, personality and tone-of-voice guidelines',
      'Bilingual (English/Arabic) typography system and color palette',
      'Icon style, pattern and imagery guidelines',
      'Delivery van livery, delivery bags/backpack and shipping box with branded tape',
      'Billboard and social media style guide',
      'Stationery and staff collateral: business cards, letterhead, presentation folder, staff ID badge, uniforms and notebook',
    ],
    challenge:
      'A UAE grocery delivery app entering a crowded, low-differentiation category, with no visual system to carry it from the app icon to the delivery van.',
    approach:
      'A bilingual system built on a lime-and-teal palette and a shopping-cart-and-K mark, carried through the app, packaging, fleet and every application.',
    outcome:
      'One consistent identity now runs from the app splash screen to the delivery van and every piece of stationery.',
    gallery: [
      {
        src: '/images/work/2k-shopping/hero.webp',
        alt: '2K Shopping delivery van livery in teal, with the bilingual (English/Arabic) shopping-cart-and-K logo, app-store badges and a dotted wave pattern.',
        width: 1920,
        height: 1200,
      },
      {
        src: '/images/work/2k-shopping/gallery-1.webp',
        alt: '2K Shopping billboard mockup reading "Everyday things matter," with the wordmark, a QR code and app-store badges over a dark teal background.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/2k-shopping/gallery-2.webp',
        alt: '2K Shopping insulated delivery bags and backpack in neon lime green, with the logo and bilingual tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/2k-shopping/gallery-3.webp',
        alt: '2K Shopping brand guideline color palette: black, dark teal, off-white, white, lime green and teal swatches with a reserved orange highlight color, RGB and CMYK values.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/2k-shopping/gallery-4.webp',
        alt: '2K Shopping product and app mockups: a branded energy-drink can held in hand, a shopping-app phone screen in front of branded paper bags, and a "Click. Bag. Delivered." door-hanger bag mockup.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/2k-shopping/gallery-5.webp',
        alt: '2K Shopping letterhead stationery mockup, two sheets shown at an angle with the logo lockup and a dark teal footer bar with contact details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/2k-shopping/gallery-6.webp',
        alt: '2K Shopping branded notebook mockup in lime green with the logo on the cover, and the inside cover showing a QR code and app-store badges.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'arabian-business-academy',
    next: 'alla-doresu',
  },
);

export const allaDoresu = caseStudy(
  'alla-doresu',
  'Alla Doresu: Branding & Visual Identity',
  'ALLA DORESU: BRANDING & VISUAL IDENTITY',
  'more',
  'Fashion & apparel',
  "Case study: full brand identity and application system for a Dubai women's fashion label founded by designer Alaa Aldeeb.",
  {
    overview:
      "A Dubai fashion label built around a pink-and-black identity and its founder's eye for detail. We carried it from hang tag to storefront.",
    client: 'Alla Doresu',
    industry: 'Fashion & Apparel',
    heroImage: '/images/work/alla-doresu/hero.webp',
    scopeItems: [
      'Logo design and brand identity: monogram mark, wordmark and lockup construction',
      'Brand colors, typography and a repeating monogram pattern',
      'Packaging: branded paper bags in two colorways and a wax seal stamp',
      'Retail merchandise: branded phone cases',
      'Stationery: business cards, letterhead and envelopes',
      'Staff ID badge and lanyard design',
      'Product hang tags',
    ],
    deliverables: [
      'Logo system: monogram mark, wordmark and lockup construction guidelines',
      'Brand colors, typography and repeating monogram pattern',
      'Packaging: paper bags in two colorways and a wax seal stamp',
      'Branded phone cases',
      'Stationery: business cards, letterhead and envelopes',
      'Staff ID badge and lanyard',
      'Product hang tags',
    ],
    challenge:
      "A new Dubai fashion label needed one identity that could travel from a product hang tag to a shopping bag to the founder's own business card.",
    approach:
      'A pink-and-black system built on an interlocking U-and-N monogram, carried through packaging, stationery, staff ID and retail merchandise.',
    outcome:
      "One consistent brand mark now runs across the label's stationery, packaging and staff-facing collateral.",
    gallery: [
      {
        src: '/images/work/alla-doresu/hero.webp',
        alt: 'Alla Doresu business card mockup in black with the pink monogram and repeating logo pattern, beside a pink branding-guidelines book.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alla-doresu/gallery-1.webp',
        alt: 'Alla Doresu branded paper bags in pink and black, with the monogram mark and "Unique as you are" tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alla-doresu/gallery-2.webp',
        alt: 'Alla Doresu branded phone cases in black and pink, each with the interlocking monogram mark and wordmark.',
        width: 960,
        height: 1080,
      },
      {
        src: '/images/work/alla-doresu/gallery-3.webp',
        alt: 'Alla Doresu letterhead stationery mockup with the pink-and-black logo lockup and Dubai, UAE contact details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alla-doresu/gallery-4.webp',
        alt: 'Alla Doresu wax seal stamp mockup: a wooden-handled stamp bearing the monogram mark beside a pressed pink wax seal.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alla-doresu/gallery-5.webp',
        alt: 'Alla Doresu branded phone cases beside a staff ID badge and pink lanyard printed with the repeating monogram pattern, for founder Alaa Aldeeb.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alla-doresu/gallery-6.webp',
        alt: 'Alla Doresu product hang tag mockup, held against a pink garment, printed with the monogram mark and "Unique as you are" tagline.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: '2k-shopping',
    next: 'bil-events',
  },
);

export const bilEvents = caseStudy(
  'bil-events',
  'BIL Events: Branding & Visual Identity',
  'BIL EVENTS: BRANDING & VISUAL IDENTITY',
  'more',
  'Events',
  'Case study: full brand identity and merchandise system for a Dubai media-and-events company launching a reality show and a super app.',
  {
    overview:
      'A Dubai company built at the intersection of media and events. We gave it one identity built to run across a reality show, staff gear and a stationery suite.',
    client: 'BIL Events',
    industry: 'Media & Events',
    heroImage: '/images/work/bil-events/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity: primary "BIL / EVENTS" lockup and a secondary interlocking N monogram mark',
      'Brand colors, typography and a repeating monogram pattern',
      'Logo usage guidelines: construction, clear space, backgrounds and a secondary logo mark',
      'Stationery: business cards, letterhead, envelopes and a presentation folder',
      'Branded merchandise: caps, hoodies, T-shirts, silicone wristbands, phone cases and key chains',
      'Staff ID badge and lanyard design',
      'A wax-style rubber stamp',
      'Roll-up banner design for the "Spectacular Chaos" reality-show campaign',
      'Waiting-room / office signage application',
    ],
    deliverables: [
      'Logo system: primary lockup and secondary interlocking N monogram',
      'Brand colors, typography and repeating monogram pattern',
      'Logo usage guidelines: construction, clear space, backgrounds and secondary mark',
      'Stationery: business cards, letterhead, envelopes and presentation folder',
      'Branded merchandise: caps, hoodies, T-shirts, wristbands, phone cases and key chains',
      'Staff ID badge and lanyard',
      'Rubber stamp',
      'Roll-up banner for the "Spectacular Chaos" campaign',
      'Waiting-room signage application',
    ],
    challenge:
      'A new media-and-events company, founded on a background in event planning, PR and media, needed one identity that could carry a reality-show campaign, staff merchandise and a full stationery suite at once.',
    approach:
      'A grey-and-yellow system built on a stacked "BIL / EVENTS" wordmark and an interlocking N monogram, carried across stationery, staff gear, retail merchandise and campaign signage.',
    outcome:
      "One consistent brand mark now runs from the founder's business card to staff lanyards, merchandise and the roll-up banners for the company's reality-show campaign.",
    gallery: [
      {
        src: '/images/work/bil-events/hero.webp',
        alt: 'BIL Events grey-and-yellow "BIL / EVENTS" wordmark applied as wall signage in a waiting area with yellow armchairs.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-1.webp',
        alt: 'BIL Events roll-up banner mockup for the "Spectacular Chaos" reality-show campaign, listing the @bileventdxb social handle and bilevents.dxb website.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-2.webp',
        alt: 'BIL Events business card mockup for founder Layal Al Mais, in white with a yellow color-block and the interlocking N monogram.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-3.webp',
        alt: 'BIL Events staff ID badge and lanyard in yellow, grey and white with a repeating interlocking N monogram pattern.',
        width: 960,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-4.webp',
        alt: 'BIL Events branded T-shirts in white with a yellow interlocking N monogram on the front and the "BIL / EVENTS" wordmark on the back.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-5.webp',
        alt: 'BIL Events social media style grid: platform icon badges above a set of yellow-and-black Instagram post and reel templates for the "Spectacular Chaos" reality-show episodes.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-6.webp',
        alt: 'BIL Events envelope mockups, white with a yellow diagonal color-block and the "BIL / EVENTS" wordmark and interlocking N monogram.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/bil-events/gallery-7.webp',
        alt: 'BIL Events branded merchandise: a white hoodie and a white cap, both printed with the yellow interlocking N monogram, modeled on a light sage sweatshirt.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'alla-doresu',
    next: 'chicky-fighter',
  },
);

export const chickyFighter = caseStudy(
  'chicky-fighter',
  'Chicky Fighter: Packaging & Brand Identity',
  'CHICKY FIGHTER: PACKAGING & BRAND IDENTITY',
  'more',
  'Food & hospitality',
  'Case study: comic-book brand identity and a full packaging system for a Dubai fast-food chicken and burger restaurant.',
  {
    overview:
      'A Dubai fast-food menu of burgers, chicken and pizza. We gave it one fighting mascot and a packaging system to carry it.',
    client: 'Chicky Fighter',
    industry: 'Fast-Food Restaurant',
    heroImage: '/images/work/chicky-fighter/hero.webp',
    scopeItems: [
      'Logo design and brand mascot: a red script "Chicky" wordmark over a bold "FIGHTER" lockup, with a boxing-themed fighting-chick character',
      'Comic-book visual language: bold outline linework, halftone dot textures and speech-burst callouts ("BURGERS!", "CHICKYS!", "PIZZA!")',
      'Packaging design across the full menu: burger box, chicken-tender boxes, pizza box, sandwich pack, fries pouch and a drink bottle label',
      'Takeaway paper bag design',
      'Menu naming and tagline copywriting ("Luv Dat Burger," "Luv Dat Chicken," "Let the Battle Begin!")',
    ],
    deliverables: [
      'Logo and brand mascot system: wordmark plus fighting-chick character',
      'Packaging: burger box, two chicken-tender box designs, kraft pizza box, sandwich pillow pack, fries pouch and drink bottle label',
      'Takeaway paper bag',
      'Comic-style tone of voice and menu-item naming',
    ],
    challenge:
      'A fast-food menu spanning burgers, chicken, pizza and sides, with every box, bag and pouch needing to read as one brand.',
    approach:
      'A red-and-yellow comic-book system built around a fighting-chick mascot, carried across every box, bag, pouch and bottle in the menu.',
    outcome:
      'From the burger box to the fries pouch, every package now carries the same mascot, palette and battle-themed voice.',
    gallery: [
      {
        src: '/images/work/chicky-fighter/hero.webp',
        alt: 'Chicky Fighter burger box with a red-and-yellow "Luv Dat Burger" logo lockup and the boxing-themed fighting-chick mascot.',
        width: 1600,
        height: 2000,
      },
      {
        src: '/images/work/chicky-fighter/gallery-1.webp',
        alt: 'Chicky Fighter burger box wrapped in a repeating burger-outline pattern, with the "Luuv Dat Burger" wordmark and mascot.',
        width: 1920,
        height: 2400,
      },
      {
        src: '/images/work/chicky-fighter/gallery-2.webp',
        alt: 'Chicky Fighter chicken-tender boxes in red and yellow colorways, with a "Chickys!" comic burst, the mascot and a fried-chicken-bucket illustration.',
        width: 2000,
        height: 1500,
      },
      {
        src: '/images/work/chicky-fighter/gallery-3.webp',
        alt: 'Chicky Fighter kraft pizza boxes, open and closed, with a "Pizza!" comic burst and the fighting-chick mascot on a halftone-dot background.',
        width: 2000,
        height: 1500,
      },
      {
        src: '/images/work/chicky-fighter/gallery-4.webp',
        alt: 'Chicky Fighter chicken box printed with boxing-ring ropes and the "Let the Battle Begin!" tagline alongside "Luv Dat Chicken."',
        width: 1600,
        height: 1067,
      },
    ],
    prev: 'bil-events',
    next: 'al-rowad-international',
  },
);

export const alRowadInternational = caseStudy(
  'al-rowad-international',
  'Al Rowad International Intellectual Property: Branding & Visual Identity',
  'AL ROWAD INTERNATIONAL INTELLECTUAL PROPERTY: BRANDING & VISUAL IDENTITY',
  'more',
  'Legal & professional services',
  'Case study: full bilingual (Arabic/English) brand identity and stationery system for a Dubai intellectual-property registration and protection firm.',
  {
    overview:
      'A Dubai intellectual-property firm working across borders. We gave it one bilingual identity, from the official stamp to the email footer.',
    client: 'Al Rowad International Intellectual Property',
    industry: 'Intellectual Property Services',
    heroImage: '/images/work/al-rowad-international/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity: a three-bar "R" monogram in navy and orange, wordmark and "International Intellectual Property" tagline lockup',
      'Brand colors and typography system in navy blue and orange',
      'Stationery: letterhead, envelope and email signature',
      'A bilingual (Arabic/English) rubber stamp for official documents',
      'Invoice and quotation templates',
      'Branded merchandise: pen and phone case',
      'Staff ID badge and lanyard design',
    ],
    deliverables: [
      'Logo and complete brand identity: three-bar "R" monogram, wordmark and tagline lockup',
      'Brand colors and typography system',
      'Stationery: letterhead, envelope and email signature',
      'Bilingual (Arabic/English) rubber stamp',
      'Invoice and quotation templates',
      'Branded merchandise: pen and phone case',
      'Staff ID badge and lanyard',
    ],
    challenge:
      'A Dubai IP registration and protection firm needed one identity that could carry from a legal rubber stamp to a letterhead to an email footer, in both Arabic and English.',
    approach:
      'A navy-and-orange system built on a three-bar "R" monogram, carried across stationery, the official bilingual stamp, and staff and branded merchandise.',
    outcome:
      'One consistent mark now runs from the company stamp to the letterhead, the email signature and staff ID badges.',
    gallery: [
      {
        src: '/images/work/al-rowad-international/hero.webp',
        alt: 'Al Rowad International Intellectual Property rubber stamp and its bilingual Arabic/English impression, reading "Al Rowad International Intellectual Property" around the R monogram.',
        width: 1778,
        height: 2000,
      },
      {
        src: '/images/work/al-rowad-international/gallery-1.webp',
        alt: 'Al Rowad International Intellectual Property letterhead mockup with the navy-and-orange logo lockup and Dubai, UAE contact details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-rowad-international/gallery-2.webp',
        alt: 'Al Rowad International Intellectual Property invoice and quotation templates in navy and orange, with service and price tables.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-rowad-international/gallery-3.webp',
        alt: 'Al Rowad International Intellectual Property staff ID badge and lanyard in white and navy with a repeating monogram pattern.',
        width: 2666,
        height: 3000,
      },
      {
        src: '/images/work/al-rowad-international/gallery-4.webp',
        alt: 'Al Rowad International Intellectual Property branded phone cases in an orange-to-navy gradient with a repeating monogram pattern.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'chicky-fighter',
    next: 'cu-optics',
  },
);

export const cuOptics = caseStudy(
  'cu-optics',
  'C U Optics: Branding & Visual Identity',
  'C U OPTICS: BRANDING & VISUAL IDENTITY',
  'more',
  'Healthcare & retail',
  'Case study: full bilingual brand identity, stationery and Instagram campaign system for a Dubai eyewear retailer.',
  {
    overview:
      'A Dubai eyewear retailer selling glasses, sunglasses and colored contact lenses. We gave it one mark, a bilingual type system and a recurring Instagram campaign.',
    client: 'C U Optics',
    industry: 'Eyewear Retail',
    year: '2023',
    heroImage: '/images/work/cu-optics/hero.webp',
    scopeItems: [
      'Logo design: an interlocking "C" and "U" mark drawn as a pair of glasses, with an "OPTICS" wordmark lockup',
      'Logo usage guidelines: color and background variations, clear-space grid',
      'Brand colors and a repeating eyewear-icon pattern (aviator, round, cat-eye and rectangular frames)',
      'Bilingual typography system: Red Hat Display (English) and Almarai (Arabic)',
      'Stationery: business card, letterhead and DL/A5 envelopes',
      'Social media campaign system: Instagram grid and story templates for product, model and colored-contact-lens content',
    ],
    deliverables: [
      'Logo system: primary mark, color/background variations and clear-space grid',
      'Brand colors and repeating eyewear-icon pattern',
      'Bilingual (English/Arabic) typography system: Red Hat Display and Almarai',
      'Stationery: business card, letterhead and DL/A5 envelopes',
      'Instagram grid campaign templates (product shots, model close-ups and colored-contact-lens callouts)',
      'Instagram story templates for the brand’s "about us" series',
    ],
    challenge:
      'A Dubai optical retailer, selling third-party eyewear and contact-lens brands, needed one identity to hold a brand guideline, a stationery suite and a running Instagram campaign together.',
    approach:
      'A cyan-and-orange system built on an interlocking C-and-U mark shaped like a pair of glasses, carried through bilingual stationery and a recurring Instagram grid-and-story campaign.',
    outcome:
      'One mark and color system now runs from the business card to the Instagram grid and story campaigns.',
    gallery: [
      {
        src: '/images/work/cu-optics/hero.webp',
        alt: 'C U Optics Instagram grid campaign in an orange palette: sunglasses product shots, model close-ups and a "Find your CHOICE" post, with the interlocking C-and-U glasses mark.',
        width: 1600,
        height: 1600,
      },
      {
        src: '/images/work/cu-optics/gallery-1.webp',
        alt: 'C U Optics Instagram grid campaign in a cyan palette: sunglasses product shots, colored-contact-lens close-ups and a "Defend Your Vision" post, with the interlocking C-and-U glasses mark.',
        width: 1600,
        height: 1600,
      },
      {
        src: '/images/work/cu-optics/gallery-2.webp',
        alt: 'C U Optics Instagram story in a cyan duotone, with a model in aviator-style sunglasses and the white interlocking C-and-U glasses logo lockup.',
        width: 1000,
        height: 1790,
      },
      {
        src: '/images/work/cu-optics/gallery-3.webp',
        alt: 'C U Optics Instagram story in a pink duotone reading "Specialized in Eyewear," with a model wearing round sunglasses.',
        width: 1000,
        height: 1790,
      },
      {
        src: '/images/work/cu-optics/gallery-4.webp',
        alt: 'C U Optics Instagram story in an orange duotone reading "Personalized Service," with a model wearing round glasses.',
        width: 1000,
        height: 1790,
      },
      {
        src: '/images/work/cu-optics/gallery-5.webp',
        alt: 'C U Optics Instagram story in a green duotone reading "Wide Selection & Unique Styles," with a model wearing square-framed sunglasses.',
        width: 1000,
        height: 1790,
      },
    ],
    prev: 'al-rowad-international',
    next: 'al-manazel-al-haditha',
  },
);

export const alManazelAlHaditha = caseStudy(
  'al-manazel-al-haditha',
  'Al Manazel Al Haditha: Branding & Visual Identity',
  'AL MANAZEL AL HADITHA: BRANDING & VISUAL IDENTITY',
  'more',
  'Property & interiors',
  'Case study: full brand identity and guideline system for a Dubai real estate brokerage, from a wave-form monogram to a teal-and-gold stationery suite.',
  {
    overview:
      'A Dubai real estate brokerage in Business Bay. We built its identity from a wave-form monogram to a teal-and-gold stationery suite.',
    client: 'Al Manazel Al Haditha Real Estate LLC',
    industry: 'Real Estate Brokerage',
    heroImage: '/images/work/al-manazel-al-haditha/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity: primary vertical lockup, secondary horizontal lockup and a simplified logo mark',
      'Brand colors, typography and a repeating wave-form pattern built from the logo mark',
      'Logo usage guidelines: clear space, backgrounds and misuse examples',
      'Stationery: business cards, letterhead, envelopes and a presentation folder',
      'Branded pens and other small collateral',
      'Full brand guidelines document: brand story, values and target audience',
    ],
    deliverables: [
      'Logo system: vertical, horizontal and simplified-mark lockups',
      'Brand colors, typography and repeating wave-form pattern',
      'Logo usage guidelines: clear space, background and misuse rules',
      'Stationery: business cards, letterhead, envelopes and presentation folder',
      'Branded pens',
      'Brand guidelines document covering story, values and target audience',
    ],
    challenge:
      'A new Dubai real estate brokerage, offering sales, leasing, investment advisory and property management, needed one documented identity to launch on.',
    approach:
      'A gold wave-form "M/H" monogram on deep teal, paired with a Cinzel display face and Abhaya Libre body text, carried through a full guidelines document and stationery suite under the line "Guiding You Home."',
    outcome:
      'One documented brand system, from the vertical logo mark to the business card and letterhead, ready for the agency to launch and apply consistently.',
    gallery: [
      {
        src: '/images/work/al-manazel-al-haditha/hero.webp',
        alt: 'Al Manazel Al Haditha Real Estate business card and envelope mockup in deep teal with a gold wave-form monogram, on marble.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-1.webp',
        alt: 'Al Manazel Al Haditha Real Estate logo lockup variations: the vertical primary logo and the horizontal secondary logo, in gold on teal.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-2.webp',
        alt: 'Al Manazel Al Haditha Real Estate letterhead mockup with the logo lockup and a bilingual English/Arabic contact footer.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-3.webp',
        alt: 'Al Manazel Al Haditha Real Estate brand color palette: white, gold, deep teal, near-black teal and black swatches with hex codes.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-4.webp',
        alt: 'Al Manazel Al Haditha Real Estate simplified logo mark, a gold wave-form monogram, shown bare and set on a solid teal card.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-5.webp',
        alt: 'Al Manazel Al Haditha Real Estate presentation folder mockup in teal with a property photograph, the "Guiding You Home" tagline, gold logo lockup and a back cover with contact details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-6.webp',
        alt: 'Al Manazel Al Haditha Real Estate envelope and presentation-folder-box mockup in deep teal to black, each with the gold logo lockup and "Guiding You Home" tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/al-manazel-al-haditha/gallery-7.webp',
        alt: 'Al Manazel Al Haditha Real Estate feather flag mockups: one with the gold wave-form monogram on teal, the other with a repeating gold monogram pattern on black.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'cu-optics',
    next: 'ayoub-and-co',
  },
);

export const ayoubAndCo = caseStudy(
  'ayoub-and-co',
  'Ayoub & Co.: Branding & Company Profile Design',
  'AYOUB & CO.: BRANDING & COMPANY PROFILE DESIGN',
  'more',
  'Property & interiors',
  'Case study: brand identity and company profile design for a Dubai real estate agency founded by two engineer brothers.',
  {
    overview:
      'A Dubai real estate agency founded by two engineer brothers in 2024. We gave it one identity, from the wordmark to the company profile clients see first.',
    client: 'Ayoub & Co.',
    industry: 'Real Estate Agency',
    year: '2024',
    heroImage: '/images/work/ayoub-and-co/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity: an "AYOUB & CO." wordmark with a "Real Estate" subline and a secondary ampersand monogram mark',
      'Brand colors and typography system: black, white and maroon, paired with an Abhaya Libre display serif and Poppins for headlines and body copy',
      'Logo usage guidelines: clear space, solid and photographic backgrounds, and logo-misuse rules',
      'A repeating pattern built from the ampersand monogram',
      'Company profile document design: about us, story, mission and vision, six service lines and a partners page',
    ],
    deliverables: [
      'Logo and complete brand identity: wordmark with "Real Estate" subline and secondary ampersand monogram',
      'Brand colors and typography system: black, white and maroon with Abhaya Libre and Poppins',
      'Logo usage guidelines: clear space, background and misuse rules',
      'Repeating ampersand-monogram pattern',
      'Company profile document: about, story, mission and vision, service lines and partners',
    ],
    challenge:
      'A brand-new Dubai real estate agency, founded by two engineer brothers, needed one documented identity and company profile to launch on.',
    approach:
      'A black, white and maroon system built on an ampersand monogram, carried through the logo guidelines and a company profile document that lays out the founders’ story, six service lines and key partners.',
    outcome:
      'One consistent identity now runs from the logo mark to the company profile clients see first.',
    gallery: [
      {
        src: '/images/work/ayoub-and-co/hero.webp',
        alt: 'Ayoub & Co. Real Estate company profile cover and back-cover mockup, with the black ampersand-monogram logo, maroon architectural photography, the "A Partnership You Can Trust" tagline and Dubai contact details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-1.webp',
        alt: 'Ayoub & Co. Real Estate brand guideline page with a large white ampersand-and-"CO." monogram and a maroon accent dot on black.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-2.webp',
        alt: 'Ayoub & Co. Real Estate mission and vision spread, black and maroon-duotone architectural photography with serif headline type.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-3.webp',
        alt: 'Ayoub & Co. Real Estate company profile spread on residential and commercial sales and leasing, maroon-duotone architectural photography.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-4.webp',
        alt: 'Ayoub & Co. Real Estate company profile spread on furnishing and styling services, maroon-duotone interior photography.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-5.webp',
        alt: 'Ayoub & Co. Real Estate business card mockup for Eng. Mohamed Ayoub, Managing Director, black on black with an embossed ampersand monogram and a QR code.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-6.webp',
        alt: 'Ayoub & Co. Real Estate presentation folder mockup, white outer folder beside maroon-to-black covers with the ampersand monogram and "A Partnership You Can Trust" tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-7.webp',
        alt: 'Ayoub & Co. Real Estate branded tissue box and napkins, white packaging printed with a repeating ampersand-and-wordmark pattern.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/ayoub-and-co/gallery-8.webp',
        alt: 'Ayoub & Co. Real Estate branded gift box mockup, black with a maroon interior lining, shown open and closed with the ampersand monogram and "A Partnership You Can Trust" tagline.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'al-manazel-al-haditha',
    next: 'shawarma-asaj',
  },
);

export const shawarmaAsaj = caseStudy(
  'shawarma-asaj',
  "Shawerma A'saj: Packaging & Brand Identity",
  "SHAWERMA A'SAJ: PACKAGING & BRAND IDENTITY",
  'more',
  'Food & hospitality',
  "Case study: crimson-and-navy brand identity and a full packaging system for a Dubai shawarma and wraps restaurant.",
  {
    overview:
      "A Dubai shawarma and wraps restaurant. We gave it one packaging system to carry a menu of darahem boxes, platters, wraps and a takeaway bag.",
    client: "Shawerma A'saj",
    industry: 'Fast-Food Restaurant',
    heroImage: '/images/work/shawarma-asaj/hero.webp',
    scopeItems: [
      'Logo design and brand mark: a skewer-and-wrap icon built into the "A\'SAJ" wordmark under a "SHAWERMA" header, in red-on-kraft and navy-on-red colorways',
      'Two-color brand system in crimson red and navy blue, printed on kraft-brown and cream stock, with a repeating flame graphic and a line-art shawarma-wrap illustration',
      'Packaging design across the full menu: a Darahem Box and Darahem Bliss box, a platters box, a wraps box, a pillow-style sandwich wrap pack, and a kraft takeaway paper bag',
      'Gift-style Spicy/Regular variant boxes',
      'QR-code integration on the wraps box, pillow pack and variant boxes for menu and ordering links',
      'Menu naming and tagline copywriting across product lines ("Made to Satisfy," "Taste the Difference," "Wrap It Up, Level It Up," "The Best in Town")',
    ],
    deliverables: [
      'Logo and brand mark: skewer-and-wrap icon built into the "A\'SAJ" wordmark, in red and navy colorways',
      'Two-color brand system (crimson red, navy blue) on kraft-brown and cream stock, with a flame motif and line-art shawarma illustration',
      'Packaging: Darahem Box, Darahem Bliss box, platters box, wraps box, pillow-style sandwich wrap pack and kraft paper bag',
      'Gift-style Spicy/Regular variant boxes with QR-code panels',
      'Menu naming and tagline copy for each packaging line',
    ],
    challenge:
      'A Dubai shawarma and wraps restaurant needed one packaging system to carry a menu spanning darahem boxes, platters, wraps and a takeaway bag, each with its own item list.',
    approach:
      'A crimson-and-navy system built around a skewer-and-wrap icon, carried across every box, bag and pillow-pack in the menu, each stamped with its own tagline and item list.',
    outcome:
      'From the Darahem Box to the takeaway bag, every package now carries the same mark, palette and flame motif.',
    gallery: [
      {
        src: '/images/work/shawarma-asaj/hero.webp',
        alt: "Shawerma A'saj Darahem Box, closed with the red-and-kraft skewer logo and open showing the \"Made to Satisfy\" tagline and Darahem Box menu list.",
        width: 1600,
        height: 1067,
      },
      {
        src: '/images/work/shawarma-asaj/gallery-1.webp',
        alt: "Shawerma A'saj kraft takeaway paper bag with a red line-art shawarma-wrap illustration behind the red-and-navy wordmark.",
        width: 1600,
        height: 1067,
      },
      {
        src: '/images/work/shawarma-asaj/gallery-2.webp',
        alt: "Shawerma A'saj platters box, closed with a kraft-outlined \"A'SAJ\" pattern and open reading \"Taste the Difference\" with the platters menu list.",
        width: 1600,
        height: 1067,
      },
      {
        src: '/images/work/shawarma-asaj/gallery-3.webp',
        alt: "Shawerma A'saj wraps box in red and kraft tones, reading \"Wrap It Up, Level It Up\" beside the full wraps menu list.",
        width: 1600,
        height: 1051,
      },
      {
        src: '/images/work/shawarma-asaj/gallery-4.webp',
        alt: "Shawerma A'saj pillow-style sandwich wrap packs, a red pack with a line-art wrap illustration and menu list, and a navy pack with the skewer wordmark and Dubai, UAE contact QR panel.",
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/work/shawarma-asaj/gallery-5.webp',
        alt: "Shawerma A'saj gift-style Spicy and Regular variant boxes in navy and red, each with the skewer wordmark on the lid and a QR-code panel.",
        width: 1600,
        height: 1600,
      },
    ],
    prev: 'ayoub-and-co',
    next: 'dhc-luxury-real-estate',
  },
);

export const dhcLuxuryRealEstate = caseStudy(
  'dhc-luxury-real-estate',
  'DHC Luxury Real Estate: Brand Identity & Company Profile',
  'DHC LUXURY REAL ESTATE: BRAND IDENTITY & COMPANY PROFILE',
  'more',
  'Property & interiors',
  'Case study: brand identity and Arabic/English company profile design for a Palm Jumeirah luxury real estate brokerage.',
  {
    overview:
      'A luxury real estate brokerage on Palm Jumeirah. We gave it a wordmark, a navy-and-gold palette and the bilingual company profile it hands to investors.',
    client: 'DHC Luxury Real Estate',
    industry: 'Real Estate Brokerage',
    heroImage: '/images/work/dhc-luxury-real-estate/hero.webp',
    scopeItems: [
      'Logo design: an interlocking "DHC" monogram paired with a "Luxury Real Estate" wordmark',
      'Brand colors and typography: navy blue and gold on a warm beige ground',
      'Bilingual (Arabic/English) company profile document design, "الملف التعريفي"',
      'Content structure: who we are, vision, values, services, experience, target sectors, team, partners, competitive advantages',
    ],
    deliverables: [
      'Logo and interlocking "DHC" monogram with "Luxury Real Estate" wordmark',
      'Navy-and-gold brand palette on a warm beige ground',
      'Bilingual (Arabic/English) company profile document',
    ],
    challenge:
      'A Palm Jumeirah luxury real estate brokerage needed one documented identity and an investor-facing company profile written in Arabic and English.',
    approach:
      'A navy-and-gold system built around an interlocking "DHC" monogram, carried through a bilingual company profile that lays out the vision, six service lines, the team and named developer partners.',
    outcome:
      'One navy-and-gold identity now runs from the logo mark to the bilingual company profile clients see first.',
    gallery: [
      {
        src: '/images/work/dhc-luxury-real-estate/hero.webp',
        alt: 'DHC Luxury Real Estate company profile cover mockup, navy monogram logo and gold "Company Profile" Arabic and English lockup on a beige brochure.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dhc-luxury-real-estate/gallery-1.webp',
        alt: 'DHC Luxury Real Estate values spread with a gold "V" award icon over a 3D building render, navy Arabic value labels.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dhc-luxury-real-estate/gallery-2.webp',
        alt: 'DHC Luxury Real Estate partners and team spread listing Emaar, Sobha Realty, Binghatti, Aldar, Nakheel and Meraas, with three team headshots.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dhc-luxury-real-estate/gallery-3.webp',
        alt: 'DHC Luxury Real Estate competitive advantages spread listing Golden Visa and financial services, with a UAE Golden Visa card mockup.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dhc-luxury-real-estate/gallery-4.webp',
        alt: 'DHC Luxury Real Estate closing page with the Arabic tagline "For luxury, for quality, for trust" beside the navy DHC monogram logo.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'shawarma-asaj',
    next: 'laya-inc',
  },
);

export const layaInc = caseStudy(
  'laya-inc',
  'Laya Inc: Corporate Identity & Stationery System',
  'LAYA INC: CORPORATE IDENTITY & STATIONERY SYSTEM',
  'more',
  'Professional services',
  'Case study: gold-and-black corporate identity and stationery system for a UAE professional services company, from logo guidelines to staff uniform.',
  {
    overview:
      'A UAE professional services company. We gave it one documented identity, from the logo clear-space rules to the stationery and staff uniform.',
    client: 'Laya Inc',
    industry: 'Professional Services',
    year: '2024',
    heroImage: '/images/work/laya-inc/hero.webp',
    scopeItems: [
      'Logo design and complete brand identity: an interlocking chevron "A" and "V" mark paired with a "LAYA INC" wordmark, in a vertical and a horizontal lockup',
      'Brand colors and typography system: gold (#B08D68), beige (#E9DCCF) and cream (#FCF5EF) on black, set in Lato',
      'Logo usage guidelines: construction, clear space, solid and photographic backgrounds, and logo-misuse rules',
      'A repeating chevron pattern built from the logo mark',
      'Stationery: business card, letterhead, envelope and a presentation folder',
      'Branded merchandise: desk flags, a notebook and a polo shirt',
    ],
    deliverables: [
      'Logo and complete brand identity: interlocking chevron mark with vertical and horizontal wordmark lockups',
      'Brand colors and typography system: gold, beige and cream on black, set in Lato',
      'Logo usage guidelines: construction, clear space, background and misuse rules',
      'Repeating chevron-pattern graphic',
      'Stationery: business card, letterhead, envelope and presentation folder',
      'Branded merchandise: desk flags, notebook and polo shirt',
    ],
    challenge:
      'A UAE professional services company needed one documented identity system, from the logo’s clear-space rules to a full stationery and merchandise suite.',
    approach:
      'A gold, beige and black system built on an interlocking chevron mark, carried across the guidelines, stationery, desk flags and staff polo shirt.',
    outcome:
      'One consistent identity now runs from the logo usage guidelines to the business card, letterhead and staff uniform.',
    gallery: [
      {
        src: '/images/work/laya-inc/hero.webp',
        alt: 'Laya Inc logo mark and wordmark in gold on a warm beige textured wall, showing the interlocking chevron "A" and "V" mark above the LAYA INC lockup.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-1.webp',
        alt: 'Laya Inc business card mockup, gold logo mark on a cream front and the back card for Layal Al Mais with a repeating chevron pattern.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-2.webp',
        alt: 'Laya Inc letterhead mockup with the gold logo lockup, a repeating chevron watermark and UAE contact details in the footer.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-3.webp',
        alt: 'Laya Inc presentation folder mockup in gold and cream, with the logo lockup on the front flap and a "Get in Touch" contact panel on the back cover.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-4.webp',
        alt: 'Laya Inc desk flags in gold and cream, one showing the repeating chevron pattern and the other the full LAYA INC logo lockup.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-5.webp',
        alt: 'Laya Inc black polo shirt mockup with a gold chevron-pattern band on the front and the logo lockup and contact details printed on the back.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-6.webp',
        alt: 'Laya Inc envelope mockups in cream, one with a gold chevron-pattern watermark and the other with the logo lockup, both showing UAE contact details.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/laya-inc/gallery-7.webp',
        alt: 'Laya Inc spiral-bound notebook mockup, closed cover with a gold chevron-pattern watermark and logo, and an open lined interior stamped with the logo mark.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'dhc-luxury-real-estate',
    next: 'vid',
  },
);

export const vid = caseStudy(
  'vid',
  'VID: Branding & Visual Identity',
  'VID: BRANDING & VISUAL IDENTITY',
  'more',
  'Property & interiors',
  'Case study: full brand identity and guideline system for an interior design firm, from a hand-sketched wordmark to a catalog and Instagram template suite.',
  {
    overview:
      'An interior design firm shaping homes, offices and commercial spaces. We gave it one documented identity, from the logo clear-space rules to the catalog and Instagram templates.',
    client: 'VID',
    industry: 'Interior Design',
    heroImage: '/images/work/vid/hero.webp',
    scopeItems: [
      'Full brand guidelines document: mission statement and three core values (Creativity, Functionality, Sustainability)',
      'Logo design: a hand-sketched serif "VID" wordmark paired with a fragmented triangle mark, plus the line "We think a little different"',
      'Logo usage guidelines: clear-space measurements and color/background variations across navy, copper, black and light-gray',
      'Brand colors: Navy (#354151) and Copper (#8A674B), plus black and light gray',
      'A repeating fragmented-triangle pattern system',
      'Typography system built on a single display serif, AustinCyr Roman',
      'Stationery: business card, letterhead and envelopes',
      'Catalog booklet design and a sketch-presentation format',
      'Social media template set: Instagram post and story layouts for project features',
    ],
    deliverables: [
      'Brand guidelines document: mission statement and core values',
      'Logo and wordmark system: hand-sketched "VID" mark, fragmented triangle icon and tagline lockup',
      'Logo usage guidelines: clear space and color/background variations',
      'Brand colors: Navy and Copper, plus black and light-gray neutrals',
      'Repeating fragmented-triangle pattern',
      'Typography system: AustinCyr Roman',
      'Stationery: business card, letterhead and envelopes',
      'Catalog booklet and sketch-presentation layout',
      'Instagram post and story templates',
    ],
    challenge:
      'An interior design firm working across homes, offices and commercial spaces, with no documented visual system to carry that range of work.',
    approach:
      'A hand-sketched serif wordmark and a fragmented navy-and-copper triangle mark, carried through a full guidelines document, stationery suite, catalog and Instagram templates under the line "We think a little different."',
    outcome:
      'One documented system now runs from the logo clear-space rules to the business card, catalog and Instagram templates.',
    gallery: [
      {
        src: '/images/work/vid/hero.webp',
        alt: 'VID interior design brand identity: navy and white business card mockup with the hand-sketched "VID" wordmark and "We think a little different" tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/vid/gallery-1.webp',
        alt: 'VID brand color palette: Navy #354151 and Copper #8A674B swatches with CMYK values, alongside the logo shown on navy, copper, black and light-gray backgrounds.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/vid/gallery-2.webp',
        alt: 'VID catalog booklet mockup, open to interior renders of a reception and lounge space beside a black cover reading "VID CATALOG."',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/vid/gallery-3.webp',
        alt: 'VID letterhead mockup with the sketched wordmark, a fragmented triangle pattern band and a copper triangle mark in the footer.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/vid/gallery-4.webp',
        alt: 'VID Instagram templates: a "5 Simple Ways to Create the Illusion of Space" story and a living-room post captioned "Functional Aesthetics for Every Setting."',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'laya-inc',
    next: 'alateeq-cafe',
  },
);

export const alateeqCafe = caseStudy(
  'alateeq-cafe',
  'Alateeq Cafe: Branding & Visual Identity',
  'ALATEEQ CAFE: BRANDING & VISUAL IDENTITY',
  'more',
  'Food & hospitality',
  'Case study: bilingual Arabic-calligraphy brand identity and a print-to-tableware guideline system for a UAE cafe.',
  {
    overview:
      'A UAE cafe named for its Arabic calligraphic mark. We gave it one documented identity, from the logo clear-space grid to the coffee cup on the table.',
    client: 'Alateeq Cafe',
    industry: 'Cafe',
    heroImage: '/images/work/alateeq-cafe/hero.webp',
    scopeItems: [
      'Logo design: a gold Arabic calligraphic wordmark (العتيق) paired with an "Alateeq cafe" English script lockup',
      'Logo usage guidelines: clear-space and construction grid, color and background variations across black, white, tan and teal',
      'Brand colors: white, pale cream-green, tan/gold, teal and black',
      'A repeating geometric pattern built from the logo’s curved letterforms',
      'Typography system: Poppins for Latin type, paired with a bold Arabic display face',
      'Stationery: business card and envelope',
      'Tableware and table settings: napkin ring, branded plate, patterned placemat and an embossed coffee cup',
    ],
    deliverables: [
      'Logo and calligraphic wordmark system: Arabic mark with English script lockup',
      'Logo usage guidelines: clear-space and construction grid, color and background variations',
      'Brand colors: white, pale cream-green, tan/gold, teal and black',
      'Repeating geometric pattern built from the logo letterforms',
      'Bilingual typography system: Poppins and a bold Arabic display face',
      'Stationery: business card and envelope',
      'Tableware: napkin ring, branded plate, placemat and embossed coffee cup',
    ],
    challenge:
      'A cafe built around a hand-drawn Arabic calligraphic name, needing one mark that could carry from a coffee cup to a business card.',
    approach:
      'A gold-and-teal calligraphic wordmark paired with a Latin script lockup, carried through a repeating geometric pattern built from the letterforms across stationery and tableware.',
    outcome:
      'One documented system now runs from the embossed coffee cup to the envelope flap and staff business card.',
    gallery: [
      {
        src: '/images/work/alateeq-cafe/hero.webp',
        alt: 'Alateeq Cafe gold-foil calligraphic wordmark embossed on a blue paper stock, branding guidelines cover.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alateeq-cafe/gallery-1.webp',
        alt: 'Alateeq Cafe logo lockup shown in white on black and in gold-and-teal on white, with the "Alateeq cafe" script wordmark beneath each mark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alateeq-cafe/gallery-2.webp',
        alt: 'Alateeq Cafe brand color palette: white, pale cream-green, tan/gold, teal and black swatches, beside the repeating geometric pattern built from the logo letterforms.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alateeq-cafe/gallery-3.webp',
        alt: 'Alateeq Cafe business card and envelope mockup with the gold calligraphic wordmark and a patterned edge band.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alateeq-cafe/gallery-4.webp',
        alt: 'Alateeq Cafe branded placemat in a tan, teal and black geometric pattern, set with cutlery and drinks on a wooden table.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alateeq-cafe/gallery-5.webp',
        alt: 'Alateeq Cafe cork napkin ring stamped with the calligraphic mark, beside a branded plate in the geometric pattern.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/alateeq-cafe/gallery-6.webp',
        alt: 'Alateeq Cafe coffee cup embossed with the calligraphic wordmark, set on a table with a matching saucer.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'vid',
    next: 'jordanian-social-club',
  },
);

export const jordanianSocialClub = caseStudy(
  'jordanian-social-club',
  'Jordanian Social Club: Brand Identity Guidelines',
  'JORDANIAN SOCIAL CLUB: BRAND IDENTITY GUIDELINES',
  'more',
  'Community & culture',
  'Case study: full bilingual brand identity guidelines for the Jordanian Social Club, the cultural hub for Jordanians living in the UAE.',
  {
    overview:
      'The cultural hub for Jordanians in the UAE. We documented one identity, from its story and values to a logo, color and type system.',
    client: 'Jordanian Social Club',
    industry: 'Community & Cultural Organization',
    heroImage: '/images/work/jordanian-social-club/hero.webp',
    scopeItems: [
      'Full brand identity guidelines document: foundation (story, core values, target audience), visual identity (logo system, colors, typography) and brand assets (elements, iconography, patterns)',
      'Logo system: a crown-and-shield mark carrying the Jordanian flag\'s seven-pointed star and green, red and black colors, topped by the Hashemite royal crown, in a vertical (primary) and horizontal (secondary) lockup',
      'An independent crown-only brand mark for limited space, social media profile pictures and website favicon use',
      'Bilingual (Arabic/English) wordmark and logo usage guidelines: clear space, background and misuse rules',
      'Brand color palette: National Black, National White, National Green, National Red and Crown Grey, with hex codes',
      'Bilingual typography system: Tharwat Emara Ruqaa and Gulf Light for Arabic, Bebas Neue and Novecento Sans Wide for English',
      'A social media icon system carrying the national colors',
      'Repeating horizontal and vertical geometric pattern built from the shield\'s flag motif',
    ],
    deliverables: [
      'Full brand identity guidelines document: foundation, visual identity and brand assets sections',
      'Logo system: vertical (primary) and horizontal (secondary) lockups plus an independent crown brand mark',
      'Bilingual (Arabic/English) wordmark and logo usage guidelines: clear space, background and misuse rules',
      'Brand color palette: National Black, White, Green, Red and Crown Grey with hex codes',
      'Bilingual typography system: Arabic (Tharwat Emara Ruqaa, Gulf Light) and English (Bebas Neue, Novecento Sans Wide)',
      'Social media icon system in the national colors',
      'Repeating horizontal and vertical geometric pattern',
    ],
    challenge:
      "A Jordanian community club in Dubai needed one documented identity, from its foundation and values to a logo, color and type system, to represent Jordanians across the UAE.",
    approach:
      "A green-and-national-colors system built around a crown-and-shield mark carrying the Jordanian flag's star and colors, documented across logo lockups, typography, color and a repeating geometric pattern.",
    outcome:
      "One brand guidelines document now carries the club's identity from its foundation and values through the logo system, color palette and social media icons.",
    gallery: [
      {
        src: '/images/work/jordanian-social-club/hero.webp',
        alt: 'Jordanian Social Club crown-and-shield logo embossed on a dark green textured cover, with the Arabic and English "Jordanian Social Club" wordmark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/jordanian-social-club/gallery-1.webp',
        alt: 'Jordanian Social Club official logo lockups: vertical (primary) and horizontal (secondary) versions of the crown-and-shield mark with the bilingual wordmark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/jordanian-social-club/gallery-2.webp',
        alt: 'Jordanian Social Club logo shown on light and dark background usage, in full color and in reversed white.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/jordanian-social-club/gallery-3.webp',
        alt: 'Jordanian Social Club brand color palette: National Black, National White, National Green, National Red and Crown Grey swatches with hex codes.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/jordanian-social-club/gallery-4.webp',
        alt: 'Jordanian Social Club repeating horizontal geometric pattern built from the shield\'s flag motif, in black on white.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'alateeq-cafe',
    next: 'dot-and-dash',
  },
);

export const dotAndDash = caseStudy(
  'dot-and-dash',
  'Dot & Dash: Branding & Visual Identity',
  'DOT & DASH: BRANDING & VISUAL IDENTITY',
  'more',
  'Professional services',
  'Case study: a full brand guideline system for a Dubai marketing agency, built around a black ampersand punctuated by a coral dot and dash.',
  {
    overview:
      'A Dubai marketing agency named for two punctuation marks. We gave it one documented identity, from the ampersand mark’s clear-space grid to the business card and envelope.',
    client: 'Dot & Dash',
    industry: 'Marketing Agency',
    heroImage: '/images/work/dot-and-dash/hero.webp',
    scopeItems: [
      'Logo design: a black ampersand ("&") punctuated by a coral dash and dot, with stacked (vertical) and inline (horizontal) "DOT & DASH" wordmark lockups and a standalone simplified logo mark',
      'Logo usage guidelines: clear-space measurements, solid-background chips (dark, coral, light gray) and photographic-background rules, plus a logo misuse reference sheet',
      'Brand colors: Black, dark gray, coral (#FF3D57), light gray and white, each documented with hex and CMYK values and a set of brand associations',
      'A repeating dot-and-dash pattern in coral, dark and light-gray tones',
      'Typography system built on a single sans-serif family, Lato',
      'Social media icon set: Facebook, Messenger, Instagram, WhatsApp, TikTok and YouTube, each in coral, dark and light-gray treatments',
      'Stationery: business card, letterhead and envelope',
    ],
    deliverables: [
      'Logo and wordmark system: ampersand-and-dot mark, vertical and horizontal lockups, and a simplified logo mark',
      'Logo usage guidelines: clear-space rules, background variations and a misuse reference sheet',
      'Brand colors: Black, dark gray, coral, light gray and white with hex/CMYK values',
      'Repeating dot-and-dash pattern',
      'Typography system: Lato',
      'Social media icon set across six platforms in three color treatments',
      'Stationery: business card, letterhead and envelope',
    ],
    challenge:
      'A marketing agency named for two punctuation marks, needing one mark that could carry that wordplay from a business card to a wall sign.',
    approach:
      'A black ampersand punctuated by a coral dash and dot, carried through clear-space and misuse guidelines, a repeating dot-and-dash pattern, and a Lato-based type system across stationery and social icons.',
    outcome:
      'One documented system now runs from the ampersand mark’s clear-space grid to the business card and envelope.',
    gallery: [
      {
        src: '/images/work/dot-and-dash/hero.webp',
        alt: 'Dot & Dash logo close-up: a black ampersand with a coral dash-and-dot accent, embossed on a white paper corner.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-1.webp',
        alt: 'Dot & Dash logo variations: stacked vertical lockup, inline horizontal lockup, and the standalone ampersand logo mark in a rounded-square chip.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-2.webp',
        alt: 'Dot & Dash brand color palette: Black, dark gray, coral #FF3D57, light gray and white swatches with CMYK values and brand associations.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-3.webp',
        alt: 'Dot & Dash business card mockup, front with the ampersand logo and back with a staff name and title.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-4.webp',
        alt: 'Dot & Dash letterhead mockup with the logo lockup and a coral-and-black bar band above the letter body.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-5.webp',
        alt: 'Dot & Dash 3D wall-signage mockup, the "DOT & DASH" wordmark and coral ampersand accent rendered in white on a dark tiled wall.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-6.webp',
        alt: 'Dot & Dash repeating dot-and-dash pattern swatches in coral, dark gray and light gray beside an outlined ampersand mark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/dot-and-dash/gallery-7.webp',
        alt: 'Dot & Dash envelope and business card mockup, the envelope flap lined with a coral dot-and-dash pattern and the card printed with the logo and Dubai, UAE contact details.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'jordanian-social-club',
    next: 'leoz',
  },
);

export const leoz = caseStudy(
  'leoz',
  'Leoz Gents Salon: Branding & Visual Identity',
  'LEOZ GENTS SALON: BRANDING & VISUAL IDENTITY',
  'more',
  'Beauty & grooming',
  'Case study: a full brand identity guidelines system for Leoz Gents Salon, a Dubai men’s grooming salon, built around a gold-gradient lion-head mark.',
  {
    overview:
      'A Dubai men’s grooming salon. We gave it one gold-and-black identity, from the lion mark’s clear-space grid to the storefront sign.',
    client: 'Leoz Gents Salon',
    industry: 'Men’s Grooming & Barbershop',
    heroImage: '/images/work/leoz/hero.webp',
    scopeItems: [
      'Logo design: a gold-gradient lion-head mark paired with a lowercase "Leoz" logotype and a serif "GENTS SALON" subtitle, in vertical (primary) and horizontal (secondary) lockups plus a standalone logo mark for small applications',
      'Logo usage guidelines: clear-space measurement, solid- and photographic-background rules, and a logo misuse reference sheet',
      'Brand colors: black, a bronze-to-gold gradient (#5a431c to #fcca6d) and a solid bronze-gold (#886703), each documented with hex and CMYK values',
      'Typography system built on Poppins for headings and body copy',
      'Icon set for Instagram, Facebook, phone, email and location, in gold-bracket and solid-black treatments',
      'Social media ad templates for a grooming campaign ("Think Again")',
      'Stationery and print collateral: business card, letterhead, feather banners, shopping bags and branded price-list stands',
      'Staff uniform application: polo shirts and tunics',
    ],
    deliverables: [
      'Logo and wordmark system: lion-head mark, vertical and horizontal lockups, and a standalone logo mark',
      'Logo usage guidelines: clear-space rules, background variations and a misuse reference sheet',
      'Brand colors: black, bronze-to-gold gradient and solid bronze-gold with hex/CMYK values',
      'Typography system: Poppins',
      'Icon set across five contact points in two color treatments',
      'Social media campaign ad templates',
      'Stationery and print collateral: business card, letterhead, banners, bags and price-list stands',
      'Staff uniform application',
    ],
    challenge:
      'A Dubai men’s grooming salon needing one gold-and-black identity that could carry from a business card to a storefront sign across two locations.',
    approach:
      'A gold-gradient lion-head mark paired with a lowercase "Leoz" logotype, carried through clear-space and misuse guidelines, a Poppins-based type system, and gold-bracket icons across stationery, uniforms and signage.',
    outcome:
      'One documented system now runs from the lion mark’s clear-space grid to the Palm Jumeirah and DIFC storefronts.',
    gallery: [
      {
        src: '/images/work/leoz/hero.webp',
        alt: 'Leoz Gents Salon storefront signage at night: a script "LeoZ Gents Salon" sign and gold lion-head mark above the entrance, with "Sharp Style, Strong Confidence" overlaid.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-1.webp',
        alt: 'Leoz Gents Salon logo variations: vertical (primary) and horizontal (secondary) lockups of the gold lion-head mark and "Leoz Gents Salon" wordmark, plus a standalone logo mark in gold-on-white and gold-on-black.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-2.webp',
        alt: 'Leoz Gents Salon brand color palette: black, a bronze-to-gold gradient (#5a431c to #fcca6d) and solid bronze-gold #886703 swatches with CMYK values.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-3.webp',
        alt: 'Leoz Gents Salon business card and letterhead mockups showing the lion-head logo, Palm Jumeirah address and "Precision in Every Cut" tagline.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-4.webp',
        alt: 'Leoz Gents Salon staff uniform application: a black polo shirt with the lion-head logo, and two staff tunics with the logo on the chest.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-5.webp',
        alt: 'Leoz Gents Salon "Think Again" social media ad templates: three square Instagram posts of a barber shaving a client, styled in sepia-toned black-and-white with gold "THINK AGAIN" type and a booking phone number.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-6.webp',
        alt: 'Leoz Gents Salon feather banner flags in black: one with the lion-head logo and both salon locations\' contact details, one reading "Sharp Style, Strong Confidence" over the logo.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-7.webp',
        alt: 'Leoz Gents Salon branded price-list stands on a tabletop, listing manicure/pedicure, facial, body treatment and massage prices on one card and haircut/shaving prices on the other.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/leoz/gallery-8.webp',
        alt: 'Leoz Gents Salon branded shopping bags in white: one with the gold lion-head logo, one reading "Sharp Style, Strong Confidence."',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'dot-and-dash',
    next: 'lets-ad',
  },
);

export const letsAd = caseStudy(
  'lets-ad',
  "Let's Ad Advertising: Brand Identity & Visual Guidelines",
  "LET'S AD ADVERTISING: BRAND IDENTITY & VISUAL GUIDELINES",
  'more',
  'Advertising & Media',
  "Case study: a full brand identity and visual guidelines system for Let's Ad Advertising, a Dubai out-of-home (OOH/DOOH) advertising company, built around a cyan-to-mint gradient mark.",
  {
    overview:
      'A Dubai out-of-home advertising company. We gave it a cyan-to-mint identity built to read from a billboard and hold up on a business card.',
    client: "Let's Ad Advertising",
    industry: 'Out-of-Home (OOH/DOOH) Advertising',
    heroImage: '/images/work/lets-ad/hero.webp',
    scopeItems: [
      'Logo design and brand identity: Primary, Secondary, Icon/Favicon/Socials and Logotype-only lockups',
      'Logo construction, clear-space measurement and background-usage guidelines',
      'Brand colors: a cyan-to-mint (#16b8e9 to #04fdd5) gradient system on black, white and light-gray (#e8e8e8) neutrals, documented with hex, RGB and CMYK values',
      'Typography system built on Montserrat (Bold for headings, Medium and Light for body copy)',
      'Icon set and a repeating brand pattern',
      'Voice and tone guidelines, and a social media imagery style guide for an OOH/DOOH advertising brand',
      'Applications: office stationery, marketing materials, and branded packaging and merchandise',
    ],
    deliverables: [
      'Logo and lockup system: Primary, Secondary, Icon/Favicon/Socials and Logotype-only variations',
      'Logo usage guidelines: clear-space measurement and background rules',
      'Brand colors: cyan-to-mint gradient plus black, white and light-gray neutrals with hex/RGB/CMYK values',
      'Typography system: Montserrat',
      'Icon set and repeating brand pattern',
      'Voice and tone guidelines, and a social imagery style guide',
      'Stationery, marketing material and packaging/merchandise applications',
    ],
    challenge:
      'A Dubai out-of-home advertising company needing one identity that could read as confidently on a billboard as it does on a business card.',
    approach:
      'A cyan-to-mint gradient mark and a Montserrat-based type system, documented across logo construction, color, typography, voice and social-imagery guidelines, and carried through stationery, marketing materials and packaging.',
    outcome:
      "One documented system now runs from the logo's clear-space grid to the business card and letterhead.",
    gallery: [
      {
        src: '/images/work/lets-ad/hero.webp',
        alt: "Let's Ad Advertising brand cover: a cyan-to-mint gradient logomark and \"LETS AD ADVERTISING\" wordmark embossed on a dark textured wall, with \"Visual Identity\" below.",
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/lets-ad/gallery-1.webp',
        alt: "Let's Ad Advertising logo variations: Primary and Secondary lockups of the cyan-to-mint gradient mark with the \"LETS AD ADVERTISING\" wordmark, plus a standalone Icon/Favicon/Socials mark and a Logotype-only lockup.",
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/lets-ad/gallery-2.webp',
        alt: "Let's Ad Advertising brand color palette: black, white, light gray #e8e8e8, cyan #16b8e9 and mint #04fdd5 swatches with RGB and CMYK values.",
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/lets-ad/gallery-3.webp',
        alt: "Let's Ad Advertising typography specimen: a display Heading 1 face over Montserrat Bold headings and Montserrat Medium/Light body copy.",
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/lets-ad/gallery-4.webp',
        alt: "Let's Ad Advertising business card mockup in black, with the cyan-to-mint logo on the front and a repeating icon pattern along the edge.",
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'leoz',
    next: 'quick-cars',
  },
);

export const quickCars = caseStudy(
  'quick-cars',
  'Quick Cars: Branding & Visual Identity',
  'QUICK CARS: BRANDING & VISUAL IDENTITY',
  'more',
  'Automotive',
  'Case study: a full brand identity guidelines system for Quick Cars, a Dubai pre-owned car dealership, built around a red wing-and-monogram logo mark.',
  {
    overview:
      'A Dubai pre-owned car dealership. We gave it a red, auburn and black identity built around a wing-shaped "QC" mark, from the logo’s clear-space grid to the branded key chain.',
    client: 'Quick Cars',
    industry: 'Pre-Owned Car Dealership',
    heroImage: '/images/work/quick-cars/hero.webp',
    scopeItems: [
      'Logo design: a red wing-shaped mark combined with a "Q&C" monogram, in vertical (primary) and horizontal (secondary) lockups plus a standalone logo mark',
      'Logo usage guidelines: construction grid, clear-space measurement, and solid- and photographic-background rules',
      'Brand colors: White, Red (#FF0000), Auburn (#B21F2B), Grey (#515151) and Black, each documented with hex, CMYK and RGB values',
      'Typography system built on Montserrat',
      'A repeating chevron pattern and icon set',
      'Stationery and print collateral: business card, letterhead, envelope, receipt, invoice/quotation, stamp, presentation folder',
      'Merchandise and application design: flags, mugs, car key chains, car number plate holder and thermos, phone cases, cap, bomber jacket, T-shirt',
    ],
    deliverables: [
      'Logo and lockup system: vertical (primary) and horizontal (secondary) lockups, plus a standalone logo mark',
      'Logo usage guidelines: construction grid, clear-space rules and background variations',
      'Brand colors: White, Red, Auburn and Grey neutrals plus Black, with hex/CMYK/RGB values',
      'Typography system: Montserrat',
      'Repeating chevron pattern and icon set',
      'Stationery: business card, letterhead, envelope, receipt, invoice/quotation, stamp and presentation folder',
      'Merchandise applications: flags, mugs, car key chains, car number plate holder and thermos, phone cases, cap, bomber jacket and T-shirt',
    ],
    challenge:
      'A Dubai pre-owned car dealership needing one identity that could carry from a business card to a set of branded car key chains.',
    approach:
      'A red wing-shaped mark combined with a "Q&C" monogram, carried through construction and clear-space guidelines, a Montserrat-based type system, and a repeating chevron pattern across stationery and merchandise.',
    outcome:
      'One documented system now runs from the logo’s clear-space grid to the key chain drivers take home.',
    gallery: [
      {
        src: '/images/work/quick-cars/hero.webp',
        alt: 'Quick Cars brand cover: a white "QUICK CARS" wordmark and red wing-shaped "QC" logo mark over a red sports car with a matching white QC decal on the door, with "Your Trusted Journey in Pre-Owned Cars" below.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/quick-cars/gallery-1.webp',
        alt: 'Quick Cars logo variations: vertical and horizontal lockups of the red wing-shaped "QC" mark with the "QUICK CARS" wordmark, plus a standalone logo mark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/quick-cars/gallery-2.webp',
        alt: 'Quick Cars brand color palette: Auburn #B21F2B swatch with CMYK and RGB values, over a red car with a white QC side decal.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/quick-cars/gallery-3.webp',
        alt: 'Quick Cars typography specimen: Montserrat uppercase and lowercase alphabet on black, beside a red chevron pattern.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/quick-cars/gallery-4.webp',
        alt: 'Quick Cars branded car key chains in black and red with a repeating chevron pattern and gold hardware.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'lets-ad',
    next: 'serr-el-oud',
  },
);

export const serrElOud = caseStudy(
  'serr-el-oud',
  'Serr El Oud: Brand Identity Guidelines',
  'SERR EL OUD: BRAND IDENTITY GUIDELINES',
  'more',
  'Beauty & fragrance',
  'Case study: a bilingual (English/Arabic) brand identity system for Serr El Oud, a Tunisian oud perfume house, built around a monogram "S" mark in a signature gold gradient.',
  {
    overview:
      'A Tunisian oud perfume house. We gave it a bilingual identity in black, cream and a signature gold gradient, built around a monogrammed "S".',
    client: 'Serr El Oud',
    industry: 'Perfume',
    heroImage: '/images/work/serr-el-oud/hero.webp',
    scopeItems: [
      'Full brand guidelines document: brand elements, concept, story, values and target audience',
      'Logo design and construction: a circular "S" monogram combining the initial with a perfume-bottle silhouette, plus a stacked Arabic/English wordmark lockup',
      'Logo usage guidelines: clear-space grid, minimum print/digital sizing, background rules and a "please do not" misuse page',
      'Brand colors: a six-step gold gradient (Primary) and a cream neutral (Secondary), each documented with hex and CMYK values',
      'Bilingual typography system: AustinCyr and Noto Serif for Latin type, Layla Pro for Arabic type',
      'A repeating wave-line pattern and a companion paper texture',
      'Icon style direction',
      'Stationery: business card and letterhead',
    ],
    deliverables: [
      'Full brand guidelines document',
      'Logo and construction system: circular "S" monogram, clear-space grid and sizing rules',
      'Logo misuse guidelines and background usage rules',
      'Brand colors: gold gradient primary palette and cream secondary, with hex/CMYK values',
      'Bilingual typography system: AustinCyr and Noto Serif (Latin), Layla Pro (Arabic)',
      'Repeating wave-line pattern and paper texture',
      'Icon style direction',
      'Stationery: business card and letterhead',
    ],
    challenge:
      'A Tunisian oud perfume house with a rich founding story and no documented visual system to carry it consistently across languages and materials.',
    approach:
      'A circular monogram fusing "S" and a perfume-bottle silhouette, rendered in a six-step gold gradient against black and cream, with a bilingual English/Arabic type system and a wave-line pattern echoing oud smoke.',
    outcome:
      'One documented guidelines system now carries the Serr El Oud mark, in English and Arabic, from letterhead to business card.',
    gallery: [
      {
        src: '/images/work/serr-el-oud/hero.webp',
        alt: 'Serr El Oud gold-foil circular "S" monogram and stacked Arabic/English wordmark embossed on black leather beside white marble.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/serr-el-oud/gallery-1.webp',
        alt: 'Serr El Oud logo concept: the gold circular "S" monogram and Arabic/English wordmark embossed on white plaster under dappled leaf shadow.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/serr-el-oud/gallery-2.webp',
        alt: 'Serr El Oud primary color palette: a six-step gold gradient from deep bronze to pale champagne, bookended by white and black, each with hex and CMYK values.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/serr-el-oud/gallery-3.webp',
        alt: 'Serr El Oud repeating wave-line pattern in gold, shown on white paper and on a textured grey ground.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/serr-el-oud/gallery-4.webp',
        alt: 'Serr El Oud business card mockup in matte black with gold foil founder details and the wave-line pattern embossed on the reverse.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'quick-cars',
    next: 'sterling-cars',
  },
);

export const sterlingCars = caseStudy(
  'sterling-cars',
  'Sterling Cars: Brand Guidelines',
  'STERLING CARS: BRAND GUIDELINES',
  'more',
  'Automotive',
  'Case study: a full brand identity guidelines system for Sterling Cars, an Antwerp, Belgium luxury car dealership, built around an infinity-and-handshake logo mark under the tagline "Infinite Trade".',
  {
    overview:
      'An Antwerp luxury car dealership. We gave it a blue, black, white and grey identity built around an infinity-and-handshake mark, under the tagline "Infinite Trade".',
    client: 'Sterling Cars',
    industry: 'Luxury Car Dealership',
    heroImage: '/images/work/sterling-cars/hero.webp',
    scopeItems: [
      'Full brand guidelines document: brand overview, target audience, core values, logo system, color palette, typography, icons, pattern, voice & tone, slogan structure and imagery style',
      'Logo design and construction: an infinity-symbol mark with an integrated handshake, plus a "Sterling Cars / Infinite Trade" wordmark lockup',
      'Logo usage guidelines: construction grid, clear-space rule (2x the icon-to-text gap) and background variations (black, blue, grey, white)',
      'Logo variations: primary lockup, icon/favicon/socials mark, secondary lockup and logotype-only version',
      'Brand colors: Primary blue, white and black, and a Secondary grey, each documented with hex, RGB and CMYK values',
      'Typography system: Copperplate Gothic Std for headings (paired with Edwardian Script ITC for a decorative overlay), Nexa for body copy, and Cairo for Arabic type',
      'Slogan structure guideline: a bold Copperplate Gothic Std line overlapping an Edwardian Script ITC line, centered with tight baseline alignment',
      'Socials imagery style guide: cinematic, low-vibrancy car photography, with the brand blue used more vividly to highlight accents',
      'Stationery, marketing materials, branded packaging & merchandise, and car accessories application mockups',
    ],
    deliverables: [
      'Full brand guidelines document',
      'Logo and construction system: infinity-and-handshake mark with clear-space grid and background rules',
      'Logo variations: primary, icon/favicon/socials, secondary and logotype-only lockups',
      'Brand colors: Primary blue, white and black, plus Secondary grey, with hex/RGB/CMYK values',
      'Typography system: Copperplate Gothic Std and Edwardian Script ITC (headings), Nexa (body), Cairo (Arabic)',
      'Slogan structure guideline and socials imagery style guide',
      'Stationery, marketing materials, branded packaging & merchandise and car accessories application mockups',
    ],
    challenge:
      'An Antwerp luxury dealership selling BMW, Ferrari, Mercedes-Benz, Rolls-Royce and Lamborghini needing one documented system to carry a premium, international tone across every touchpoint.',
    approach:
      'An infinity symbol fused with a handshake, paired with the "Infinite Trade" tagline, carried through a blue/black/white/grey palette and a Copperplate Gothic Std plus Edwardian Script ITC type pairing for headings.',
    outcome:
      'One documented guidelines system now carries the Sterling Cars mark, from the logo’s clear-space grid to car accessories and merchandise.',
    gallery: [
      {
        src: '/images/work/sterling-cars/hero.webp',
        alt: 'Sterling Cars metallic infinity-and-handshake logo mark above the "Sterling Cars / Infinite Trade" wordmark on a smoky grey gradient background.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sterling-cars/gallery-1.webp',
        alt: 'Sterling Cars brand guidelines cover: the "Sterling Cars / Infinite Trade" wordmark between two sports cars in a dark showroom.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sterling-cars/gallery-2.webp',
        alt: 'Sterling Cars logo variations: primary lockup, icon/favicon/socials mark, secondary lockup and logotype-only version of the infinity-and-handshake mark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sterling-cars/gallery-3.webp',
        alt: 'Sterling Cars color palette: Primary blue, white and black swatches with hex/RGB/CMYK values, beside a Secondary grey gradient swatch.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sterling-cars/gallery-4.webp',
        alt: 'Sterling Cars slogan structure guideline: bold Copperplate Gothic Std headlines overlapping script Edwardian Script ITC taglines, e.g. "Exquisite Cars / Infinite Trade".',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/sterling-cars/gallery-5.webp',
        alt: 'Sterling Cars socials imagery style guide: cinematic, low-vibrancy luxury car photography with the brand blue used to highlight accents.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'serr-el-oud',
    next: 'mm-event-management',
  },
);

export const mmEventManagement = caseStudy(
  'mm-event-management',
  'MM Event Management: Branding & Visual Identity',
  'MM EVENT MANAGEMENT: BRANDING & VISUAL IDENTITY',
  'more',
  'Events',
  'Case study: a full brand guideline system for MM Event Management, a Dubai-based event production company trading as Magic Music Event Management L.L.C., built around a teal ribbon "M" mark under the tagline "Spotlighting Good Times".',
  {
    overview:
      'A Dubai event production company, legally Magic Music Event Management L.L.C. We gave it one documented identity, from the ribbon "M" mark to the festival banner.',
    client: 'MM Event Management',
    industry: 'Event Production & Management',
    heroImage: '/images/work/mm-event-management/hero.webp',
    scopeItems: [
      'Full brand guidelines document: brand story, values, target audience, logo system, colors, typography, pattern, icons and applications',
      'Logo design and construction: a black circle badge holding a teal-to-white ribbon "M" mark, with vertical, horizontal and logo-mark lockups',
      'Logo usage guidelines: clear-space rule (one-third the logo mark on all sides), solid and photographic-background variations, and a logo misuse reference sheet',
      'Brand colors: black, teal (#00CECB) and off-white (#F3F4F4), each documented with hex and CMYK values and a set of brand associations',
      'Typography system built on a single sans-serif family, Montserrat',
      'A repeating chevron pattern built from the logo mark, in teal-on-black and outline-on-white variations',
      'A circular icon set for contact points and social platforms (phone, email, web, location, Instagram, Facebook, X, YouTube, TikTok) in outline and filled treatments',
      'Stationery: business card, letterhead and envelope, plus an email signature',
      'A bilingual (English/Arabic) rubber stamp for "Magic Music Event Management L.L.C."',
      'Marketing and event applications: branded flags carrying the "Spotlighting Good Times" tagline, festival fence banners, a phone case and a staff ID badge and lanyard',
    ],
    deliverables: [
      'Full brand guidelines document',
      'Logo and construction system: ribbon "M" mark in a circle badge, with vertical, horizontal and logo-mark lockups',
      'Logo usage guidelines: clear-space rule, background variations and a misuse reference sheet',
      'Brand colors: black, teal and off-white, with hex/CMYK values',
      'Typography system: Montserrat',
      'Repeating chevron pattern built from the logo mark',
      'Circular icon set across contact points and social platforms',
      'Stationery: business card, letterhead, envelope and email signature',
      'Bilingual (English/Arabic) rubber stamp',
      'Flags, festival banners, phone case and staff ID badge and lanyard',
    ],
    challenge:
      'A UAE event producer running weddings, festivals, corporate and educational events, needing one documented system to carry the same mark from a business card to a festival fence banner.',
    approach:
      'A teal ribbon "M" mark in a black circle badge, carried through a chevron pattern, a Montserrat-based type system, and a black/teal/off-white palette across stationery, a bilingual stamp, flags and event signage.',
    outcome:
      'One documented guidelines system now carries the MM Event Management mark, from the logo’s clear-space rule to the festival banner and staff lanyard.',
    gallery: [
      {
        src: '/images/work/mm-event-management/hero.webp',
        alt: 'MM Event Management branded flags on poles against a blue sky: a chevron-pattern flag, a white flag reading "Spotlighting Good Times" with the logo mark, and a teal chevron-pattern flag.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/mm-event-management/gallery-1.webp',
        alt: 'MM Event Management logo variations: vertical lockup, horizontal lockup and standalone logo mark, each a teal ribbon "M" in a black circle badge.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/mm-event-management/gallery-2.webp',
        alt: 'MM Event Management brand color palette: black, teal #00cecb and off-white #F3F4F4 circles with CMYK values and brand associations.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/mm-event-management/gallery-3.webp',
        alt: 'MM Event Management bilingual rubber stamp reading "Magic Music Event Management L.L.C." in English and Arabic around the ribbon "M" mark.',
        width: 1920,
        height: 1080,
      },
      {
        src: '/images/work/mm-event-management/gallery-4.webp',
        alt: 'MM Event Management "Open Air Festival" fence banner in teal with the logo mark, set against a blurred festival stage.',
        width: 1920,
        height: 1080,
      },
    ],
    prev: 'sterling-cars',
    next: 'zealerz',
  },
);

// emiratesAgro is deliberately NOT listed below (2026-09-15, explicit user direction:
// "remove emirate agro as a client, keep content, hide entry in website") — the case
// study definition above stays intact, it's just excluded from what the site shows or
// looks up by slug. Mirrored in D1 via status='draft' for the production/D1-backed path.
export const allCaseStudies: CaseStudyRecord[] = [
  sanapexInteriors,
  p2pMotors,
  dosePharmacy,
  clemsonPorterProperties,
  sealand,
  bnkGroup,
  zealerz,
  arabianBusinessAcademy,
  twoKShopping,
  allaDoresu,
  bilEvents,
  chickyFighter,
  alRowadInternational,
  cuOptics,
  alManazelAlHaditha,
  ayoubAndCo,
  shawarmaAsaj,
  dhcLuxuryRealEstate,
  layaInc,
  vid,
  alateeqCafe,
  jordanianSocialClub,
  dotAndDash,
  leoz,
  letsAd,
  quickCars,
  serrElOud,
  sterlingCars,
  mmEventManagement,
];

export const caseStudiesBySlug = Object.fromEntries(
  allCaseStudies.map((c) => [c.slug, c]),
) as Record<CaseStudyRecord['slug'], CaseStudyRecord>;
