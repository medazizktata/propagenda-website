import type { ServiceSlug } from '@/types/content';

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ServiceDetailConfig {
  /** Full-bleed hero image (real portfolio render). Omit → monogram/pattern hero. */
  heroImage?: string;
  /** Service-specific CTA headline for the closing orange band. */
  ctaHeading: string;
  /** Authored process steps (websites, mobile) — the signature module when the record has none. */
  process?: ProcessStep[];
  /** Interactive "how we work" stepper — an extra section (currently branding). */
  approach?: ProcessStep[];
  /** FAQ accordion — an extra section (currently branding). */
  faqs?: { q: string; a: string }[];
  /** Authored "who we connect you with" list (PR). */
  influence?: string[];
  /** Authored two-discipline split (photography). */
  disciplines?: { label: string; items: string[] }[];
}

/**
 * Per-service presentation for the detail pages. Content (copy, scope, tiers, etc.) lives in
 * `content/services`; this is only art-direction + the authored signature data for services
 * whose record carries no built-in module. Hero images are TEMPORARY portfolio maps until
 * real /images/services assets land.
 */
export const serviceDetailConfig: Record<ServiceSlug, ServiceDetailConfig> = {
  'branding-visual-identity': {
    heroImage: '/images/portfolio/work-sanapex.png',
    ctaHeading: 'Ready to build your identity?',
    approach: [
      { title: 'Discovery', body: 'We dig into your business, audience, and market — the brief behind the brief — so the brand is built on insight, not guesswork.' },
      { title: 'Strategy', body: 'Positioning, personality, and the story your brand needs to tell. This is the thinking every visual decision is anchored to.' },
      { title: 'Identity', body: 'Logo, colour, type, and pattern come together into a distinctive visual system — designed to work everywhere your brand shows up.' },
      { title: 'Guidelines', body: 'Every rule documented — usage, spacing, do’s and don’ts — so the brand stays consistent no matter who’s using it.' },
      { title: 'Rollout', body: 'Stationery, collateral, and templates produced and applied — your new identity, launched and ready to run.' },
    ],
    faqs: [
      {
        q: 'How long does a branding project take?',
        a: 'Most identities take three to six weeks, depending on scope. A full developed system — with strategy, guidelines, and collateral — runs a little longer. You’ll get a clear timeline before we start.',
      },
      {
        q: 'What’s the difference between Basic and Developed branding?',
        a: 'Basic covers the visual essentials: logo, colours, type, pattern, and stationery. Developed adds the full system — brand strategy, voice and messaging, a complete guidelines book, and marketing collateral.',
      },
      {
        q: 'Do we own our logo and brand files?',
        a: 'Yes. Once the project is complete, full ownership of your final logo and brand assets is yours — delivered in every format you’ll need.',
      },
      {
        q: 'Can you refresh our existing brand instead of starting over?',
        a: 'Absolutely. If your brand has equity worth keeping, we’ll evolve it — sharpening the identity while retaining what your audience already recognises.',
      },
      {
        q: 'What do you need from us to get started?',
        a: 'A short brief and a conversation. We dig into your business, audience, and goals during Discovery — you don’t need anything prepared beyond a sense of where you want to go.',
      },
      {
        q: 'What files will we receive?',
        a: 'Print and digital formats for every asset — vector logos (SVG, EPS, PDF), raster versions (PNG, JPG), your colour and type specifications, and a guidelines document.',
      },
    ],
  },
  'public-relations': {
    ctaHeading: 'Ready to get noticed?',
    influence: [
      'A-list celebrities',
      'Bloggers & creators',
      'Gamers & streamers',
      'Actors & artists',
      'Press & media',
    ],
    faqs: [
      {
        q: 'How do you choose the right influencers for our brand?',
        a: 'We match on audience, not just follower count — who their community actually is, how engaged it is, and whether their values fit yours. Relevance and authenticity beat raw reach every time, so every partner is vetted before we recommend them.',
      },
      {
        q: 'How do you measure reach and ROI?',
        a: 'We track the metrics tied to your goals — reach and impressions, engagement rate, click-throughs, referral traffic, and earned-media value — and report against clear benchmarks set before the campaign goes live.',
      },
      {
        q: 'Can you help if we are facing a reputation or crisis situation?',
        a: 'Yes. We handle reputation management and crisis communications — from a rapid holding statement to a full response plan — protecting your credibility while keeping messaging consistent across every channel.',
      },
      {
        q: 'Do partnerships include category exclusivity?',
        a: 'They can. Where it matters, we negotiate exclusivity so your chosen faces are not promoting a competitor during — or shortly after — your campaign. The terms are agreed up front and written into every collaboration.',
      },
      {
        q: 'How long before we start to see results?',
        a: 'Influencer and social activations can drive visibility within days of going live. Earned press coverage and lasting credibility build over weeks — most campaigns run across one to three months for meaningful, measurable impact.',
      },
      {
        q: 'Is sponsored content clearly disclosed?',
        a: 'Always. Every paid partnership follows advertising-disclosure standards and platform rules — clear labelling protects both your brand and the creator, and audiences trust transparent partnerships more.',
      },
    ],
  },
  'online-offline-marketing': {
    heroImage: '/images/portfolio/work-ghaftree.png',
    ctaHeading: 'Ready to grow?',
    faqs: [
      {
        q: 'How do you decide the mix between online and offline?',
        a: 'It follows your audience and goals, not a fixed formula. We map where your customers actually spend attention across the funnel, then weight the budget toward the channels — digital, physical, or both — that move them from awareness to loyalty most efficiently.',
      },
      {
        q: 'What budget do we need, and can we start small and scale?',
        a: 'Yes. We can start lean on a few high-intent channels, prove what works, then reinvest the winners and scale spend as returns come in. You set the monthly budget and we allocate it across the funnel — no long lock-ins to get going.',
      },
      {
        q: 'Which channels are right for my business?',
        a: 'That depends on what you sell and who buys it. A local service leans on search, social, and offline reach; an online store leans on paid social, influencers, and retargeting. After a short discovery, we recommend a specific channel plan rather than a generic package.',
      },
      {
        q: 'How do you report on performance and attribution?',
        a: 'You get a clear dashboard tied to the metrics that matter — reach, engagement, leads, cost per acquisition, and return on ad spend — reviewed on a regular cadence. For offline activity we use trackable codes, landing pages, and lift analysis so every channel earns its place.',
      },
      {
        q: 'How long before we see results?',
        a: 'Paid channels can drive traffic and leads within the first weeks, while content, SEO, and brand-building compound over months. We set realistic milestones up front so early wins and longer-term growth are both accounted for.',
      },
      {
        q: 'Do we own the content and ad accounts you create?',
        a: 'Yes. Ad accounts, campaign data, and the content we produce are yours — set up under your ownership from the start, so nothing is held hostage if we ever part ways.',
      },
    ],
  },
  'graphics-production': {
    heroImage: '/images/portfolio/work-restaurant.png',
    ctaHeading: 'Ready to produce?',
    faqs: [
      {
        q: 'How long does production take?',
        a: 'It depends on the piece. Business cards and digital print are usually ready in two to four days; large-format banners in three to five; signage and vehicle wraps run longer because they are fabricated and fitted. We confirm a firm timeline once the artwork and finish are locked, and we can rush urgent jobs where the schedule allows.',
      },
      {
        q: 'Is there a minimum order quantity?',
        a: 'For digital and offset print we typically start from around 100 pieces, and branded merchandise from 25 to 50, since setup and unit costs level out at volume. Signage, banners, and vehicle graphics can be produced as a single unit. Tell us the quantity you have in mind and we will advise the most cost-effective run.',
      },
      {
        q: 'What materials and substrates can you print on?',
        a: 'A wide range — coated and uncoated paper stocks, recycled board, PVC and mesh banner, backlit film, Foamex, Dibond, acrylic, brushed aluminium, cast wrap vinyl, and apparel fabrics for embroidery and print. If you are not sure which substrate suits your job or environment, we will recommend the right one for durability, budget, and finish.',
      },
      {
        q: 'Do you install what you produce?',
        a: 'Yes. Our team handles installation for signage, vehicle wraps, window graphics, and large-format displays — on site, fitted to spec. For flat print and merchandise we arrange pick-up or delivery. Design, print, and install are handled end to end, so there is no need to coordinate separate suppliers.',
      },
      {
        q: 'What file formats and artwork do you need?',
        a: 'Print-ready vector artwork (PDF, AI, or EPS) is ideal, set in CMYK with fonts outlined and a 3mm bleed. High-resolution raster files work for photographic pieces. If your artwork is not production-ready, our designers can set it up, adjust it for the substrate, or create it from scratch.',
      },
      {
        q: 'How do you handle proofing and colour accuracy?',
        a: 'Every job is proofed and signed off before it runs. You receive a digital proof to approve, and a physical or press proof on request for critical colour. We print to your brand colours and can match Pantone references, so the produced piece stays true to your identity across every material.',
      },
    ],
  },
  websites: {
    heroImage: '/images/portfolio/work-quickcars.png',
    ctaHeading: 'Ready to launch?',
    process: [
      { title: 'Concept', body: 'Goals, audience, and structure mapped before a pixel moves.' },
      { title: 'Design', body: 'Interfaces that carry your brand and guide the visitor.' },
      { title: 'Build', body: 'Fast, responsive, accessible front-ends built to last.' },
      { title: 'Launch', body: 'Tested, optimised, and shipped with confidence.' },
      { title: 'Manage', body: 'Ongoing care, updates, and performance tuning.' },
    ],
  },
  'mobile-applications': {
    ctaHeading: 'Ready to ship your app?',
    process: [
      { title: 'Discover', body: 'Scope, platforms, and the flows that matter most.' },
      { title: 'Design', body: 'Native-feeling UX/UI for iOS and Android.' },
      { title: 'Build', body: 'Cross-platform apps wired to solid back-ends.' },
      { title: 'Ship', body: 'App Store and Play Store launch, handled end to end.' },
      { title: 'Support', body: 'Maintenance, updates, and steady iteration.' },
    ],
  },
  events: {
    heroImage: '/images/portfolio/work-events.png',
    ctaHeading: 'Planning an event?',
  },
  'photography-videography': {
    heroImage: '/images/portfolio/work-food.png',
    ctaHeading: 'Ready to shoot?',
    disciplines: [
      {
        label: 'Photography',
        items: ['Products', 'Lifestyle & editorial', 'Events', 'Food', 'Real estate', 'Portraits', 'Drone'],
      },
      {
        label: 'Videography',
        items: [
          'Explainer videos',
          'Product films',
          'Testimonials',
          'Brand videos',
          'Motion graphics',
          'Live streaming',
        ],
      },
    ],
  },
};
