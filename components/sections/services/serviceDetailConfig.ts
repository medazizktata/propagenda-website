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
