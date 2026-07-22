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
  },
  'online-offline-marketing': {
    heroImage: '/images/portfolio/work-ghaftree.png',
    ctaHeading: 'Ready to grow?',
  },
  'graphics-production': {
    heroImage: '/images/portfolio/work-restaurant.png',
    ctaHeading: 'Ready to produce?',
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
