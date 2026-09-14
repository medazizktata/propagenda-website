/** Seed for pnpm seed:cms; also SSG fallback when Supabase env is missing. */
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
    prev: 'bil-events',
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
    ],
    prev: 'alla-doresu',
    next: 'emirates-agro',
  },
);

export const allCaseStudies: CaseStudyRecord[] = [
  sanapexInteriors,
  p2pMotors,
  dosePharmacy,
  clemsonPorterProperties,
  sealand,
  bnkGroup,
  emiratesAgro,
  zealerz,
  arabianBusinessAcademy,
  twoKShopping,
  allaDoresu,
  bilEvents,
];

export const caseStudiesBySlug = Object.fromEntries(
  allCaseStudies.map((c) => [c.slug, c]),
) as Record<CaseStudyRecord['slug'], CaseStudyRecord>;
