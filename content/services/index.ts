/**
 * Seed data, also the runtime fallback when D1 isn't reachable.
 *
 * `gallery` feeds each service page's "Selected work" grid and `relatedWork` its related-work
 * cards: real, watermarked client work (public/images/work, public/images/services, and film
 * frames in public/images/about). Kept in sync with d1/pending/2026-09-24-service-media.sql.
 */
import type { ServiceRecord } from '@/types/content';

function service(
  slug: ServiceRecord['slug'],
  title: string,
  h1: string,
  description: string,
  extra?: Partial<ServiceRecord>,
): ServiceRecord {
  return {
    slug,
    title,
    h1,
    overview: `${title} overview, content from CONTENT_MAPPING.md.`,
    scopeItems: ['Scope item placeholder'],
    gallery: [],
    seo: { title: `${title} | Propagenda`, description },
    ...extra,
  };
}

export const brandingVisualIdentity = service(
  'branding-visual-identity',
  'Branding',
  'BRANDING',
  'Strategy-first branding, logo, identity systems, stationery tiers, and brand guidelines.',
  {
    overview:
      'From logo design to visual identity development and uplifting, our team of branding experts is dedicated to helping you establish a credible and trustworthy brand that drives long-term success for your business.',
    scopeItems: [
      'Logo design',
      'Visual identity systems',
      'Brand colors & typography',
      'Company profiles',
      'Brand guidelines',
      'Stationery',
    ],
    tiers: [
      {
        name: 'Basic branding',
        items: [
          'Logo, color palette, font, pattern',
          'Bonus: basic stationery (business card, letterhead, envelopes)',
        ],
      },
      {
        name: 'Developed branding',
        items: [
          'All basic guidelines plus marketing materials, brand voice, messaging, and values',
        ],
      },
    ],
    gallery: [
      { src: '/images/work/chicky-fighter/gallery-2.webp', alt: 'Chicky Fighter takeaway meal boxes in red and yellow with the Chicky logo', width: 2000, height: 1500, caption: 'Chicky Fighter', href: '/work/chicky-fighter' },
      { src: '/images/work/2k-shopping/gallery-2.webp', alt: '2K Shopping insulated delivery bags and backpack in lime green with the logo', width: 1920, height: 1080, caption: '2K Shopping', href: '/work/2k-shopping' },
      { src: '/images/work/leoz/hero.webp', alt: 'Leoz Gents Salon storefront sign at night with the gold lion-head mark', width: 1920, height: 1080, caption: 'Leoz Gents Salon', href: '/work/leoz' },
      { src: '/images/work/dose-pharmacy/gallery-5.webp', alt: 'Dose Pharmacy branded bottles in charcoal and pink with the Dose mark', width: 1920, height: 1080, caption: 'Dose Pharmacy', href: '/work/dose-pharmacy' },
      { src: '/images/work/shawarma-asaj/hero.webp', alt: 'Shawerma A\'saj takeaway box in red and kraft with the brand wordmark', width: 1600, height: 1067, caption: 'Shawerma A\'saj', href: '/work/shawarma-asaj' },
      { src: '/images/work/laya-inc/gallery-5.webp', alt: 'Laya Inc black staff polo shirts with the logo and brand pattern', width: 1920, height: 1080, caption: 'Laya Inc', href: '/work/laya-inc' },
    ],
    relatedWork: [
      { label: 'Sanapex Interiors', href: '/work/sanapex-interiors' },
      { label: 'P2P Motors', href: '/work/p2p-motors' },
      { label: 'Clemson Porter Properties', href: '/work/clemson-porter-properties' },
    ],
  },
);

export const publicRelations = service(
  'public-relations',
  'Public Relations',
  'PUBLIC RELATIONS',
  'Influencer partnerships, media relations, and credibility-building PR for brands.',
  {
    overview:
      "Our team of experts will meticulously select and collaborate with influential individuals in various fields, including A-list celebrities, bloggers, gamers, and actors to expand your brand's reach, engagement, and credibility.",
    scopeItems: [
      'Influencer partnerships',
      'Media relations',
      'Celebrity collaborations',
      'Blogger outreach',
      'Credibility campaigns',
    ],
    gallery: [
      { src: '/images/work/cu-optics/gallery-1.webp', alt: 'C U Optics Instagram campaign grid with model close-ups and sunglasses product shots', width: 1600, height: 1600, caption: 'C U Optics', href: '/work/cu-optics' },
      { src: '/images/work/leoz/gallery-5.webp', alt: 'Leoz Gents Salon "Think Again" social ad templates showing a barber at work', width: 1920, height: 1080, caption: 'Leoz Gents Salon', href: '/work/leoz', position: '50% 100%' },
      { src: '/images/work/sterling-cars/gallery-5.webp', alt: 'Sterling Cars socials imagery style guide with cinematic luxury-car photography', width: 1920, height: 1080, caption: 'Sterling Cars', href: '/work/sterling-cars' },
      { src: '/images/work/cu-optics/gallery-2.webp', alt: 'C U Optics Instagram story: a model in aviator-style sunglasses in a cyan duotone', width: 1000, height: 1790, caption: 'C U Optics', href: '/work/cu-optics', position: '50% 15%' },
      { src: '/images/work/vid/gallery-4.webp', alt: 'VID Instagram post and story templates featuring interior projects', width: 1920, height: 1080, caption: 'VID', href: '/work/vid', position: '100% 50%' },
      { src: '/images/work/bnk-group/gallery-3.webp', alt: 'The BNK Group social posts presenting luxury interior designs', width: 1920, height: 1080, caption: 'The BNK Group', href: '/work/bnk-group' },
    ],
    relatedWork: [
      { label: 'The BNK Group', href: '/work/bnk-group' },
      { label: 'C U Optics', href: '/work/cu-optics' },
      { label: 'BIL Events', href: '/work/bil-events' },
    ],
  },
);

export const onlineOfflineMarketing = service(
  'online-offline-marketing',
  'Online & Offline Marketing',
  'ONLINE & OFFLINE MARKETING',
  'Digital campaigns, social media, content marketing, influencer marketing, and digital ads, online and offline.',
  {
    overview:
      'Campaigns that work online and offline: strategy, content, social, ads, and print, built to perform.',
    scopeItems: [
      'Brand strategy',
      'Digital marketing campaigns',
      'Video content',
      'Social media management',
      'Content marketing',
      'Influencer marketing',
      'Digital ads',
      'Print & production',
    ],
    extendedBullets: [
      'Social Media Management',
      'Content Marketing',
      'Influencer Marketing',
      'Digital Ads',
    ],
    gallery: [
      { src: '/images/work/dose-pharmacy/gallery-8.webp', alt: 'Dose Pharmacy storefront with illuminated signage on a two-storey building', width: 1920, height: 1080, caption: 'Dose Pharmacy', href: '/work/dose-pharmacy' },
      { src: '/images/work/clemson-porter-properties/gallery-1.webp', alt: 'Clemson Porter Properties rooftop billboard reading "Invest smart, live fine"', width: 1920, height: 1080, caption: 'Clemson Porter Properties', href: '/work/clemson-porter-properties' },
      { src: '/images/work/arabian-business-academy/gallery-3.webp', alt: 'Arabian Business Academy roll-up banner in navy and gold', width: 1911, height: 1911, caption: 'Arabian Business Academy', href: '/work/arabian-business-academy' },
      { src: '/images/work/zealerz/gallery-3.webp', alt: 'Zealerz social media style guide: Instagram post templates for LPG delivery', width: 3840, height: 2160, caption: 'Zealerz', href: '/work/zealerz' },
      { src: '/images/work/leoz/gallery-6.webp', alt: 'Leoz Gents Salon black feather banner flags with the lion-head logo', width: 1920, height: 1080, caption: 'Leoz Gents Salon', href: '/work/leoz' },
      { src: '/images/work/cu-optics/gallery-1.webp', alt: 'C U Optics Instagram grid campaign in a cyan palette', width: 1600, height: 1600, caption: 'C U Optics', href: '/work/cu-optics' },
    ],
    relatedWork: [
      { label: '2K Shopping', href: '/work/2k-shopping' },
      { label: 'Arabian Business Academy', href: '/work/arabian-business-academy' },
      { label: 'C U Optics', href: '/work/cu-optics' },
    ],
  },
);

export const websites = service(
  'websites',
  'Websites',
  'WEBSITES',
  'High-performing websites and landing pages from concept to launch and beyond.',
  {
    overview:
      'From concept to launch and beyond. High-performing, user-friendly websites that drive business growth and achieve your digital goals. Comprehensive website development and management. Expert landing page creators.',
    scopeItems: [
      'Website design & development',
      'Landing pages',
      'UX/UI',
      'Performance optimization',
      'Ongoing management',
    ],
    gallery: [
      { src: '/images/about/landing-3.webp', alt: 'Propagenda website: the work page hero reading "We make it move"', width: 1200, height: 900, caption: 'Propagenda.com', href: '/' },
      { src: '/images/about/web-design-3.webp', alt: 'Propagenda website: the Sealand case study page', width: 1200, height: 900, caption: 'Propagenda.com', href: '/', position: '50% 15%' },
      { src: '/images/about/web-design-1.webp', alt: 'Propagenda website: the home page hero', width: 1600, height: 1000, caption: 'Propagenda.com', href: '/' },
      { src: '/images/about/ux-ui-3.webp', alt: 'Propagenda website mobile layout: the contact page', width: 1200, height: 900, caption: 'Propagenda.com', href: '/' },
      { src: '/images/about/landing-1.webp', alt: 'Propagenda website: the services hero reading "The whole brand, one studio"', width: 1600, height: 1000, caption: 'Propagenda.com', href: '/' },
      { src: '/images/about/ux-ui-2.webp', alt: 'Propagenda website on phones: the work grid and a case study', width: 1200, height: 900, caption: 'Propagenda.com', href: '/' },
    ],
    relatedWork: [
      { label: 'Sanapex Interiors', href: '/work/sanapex-interiors' },
      { label: 'Zealerz', href: '/work/zealerz' },
    ],
  },
);

export const mobileApplications = service(
  'mobile-applications',
  'Mobile Applications',
  'MOBILE APPLICATIONS',
  'User-friendly mobile apps that enhance your brand and delight users.',
  {
    overview:
      'From first sketch to store launch: apps that strengthen your brand and delight users.',
    scopeItems: [
      'iOS & Android apps',
      'Cross-platform development',
      'Mobile UX/UI design',
      'API & backend integration',
      'App Store & Play Store launch',
      'Maintenance & updates',
    ],
    gallery: [
      { src: '/images/work/zealerz/hero.webp', alt: 'Zealerz brand board with the LPG delivery app screens on two phones', width: 1241, height: 1754, caption: 'Zealerz', href: '/work/zealerz', position: '50% 100%' },
      { src: '/images/services/mobile-applications/zealerz-app-launch-trailer.webp', alt: 'Zealerz mobile billboard trailer promoting the LPG delivery app with App Store and Google Play badges', width: 1600, height: 1000, caption: 'Zealerz', href: '/work/zealerz' },
      { src: '/images/work/zealerz/gallery-3.webp', alt: 'Zealerz Instagram templates promoting the delivery app', width: 3840, height: 2160, caption: 'Zealerz', href: '/work/zealerz' },
      { src: '/images/work/2k-shopping/gallery-4.webp', alt: '2K Shopping app screen on a phone beside branded paper bags', width: 1920, height: 1080, caption: '2K Shopping', href: '/work/2k-shopping' },
    ],
    relatedWork: [
      { label: 'Zealerz', href: '/work/zealerz', image: '/images/work/zealerz/gallery-4.webp' },
      { label: '2K Shopping', href: '/work/2k-shopping' },
    ],
  },
);

export const events = service(
  'events',
  'Events',
  'EVENTS',
  'Full event branding, organization, photo/video, and social, from planning to flawless execution.',
  {
    overview:
      'From start to finish. From planning to evaluation. No matter what type of event you are planning, we can help you make it a success. We have the experience and expertise to handle every aspect of event organization and management.',
    scopeItems: [
      'Event branding & identity',
      'Marketing materials',
      'Full organisation & logistics',
      'Photography & videography',
      'Social media coverage',
      'Post-event evaluation',
    ],
    eventChecklist: [
      'Re-branding',
      'Marketing materials production',
      'Full organization',
      'Photography & videography',
      'Social media marketing',
    ],
    gallery: [
      { src: '/images/services/events/farij-marsa-oud.webp', alt: 'An oud player performing on stage at the Farij Marsa event, Marsa Ajman', width: 1080, height: 675, caption: 'Marsa Ajman', href: '/work/video' },
      { src: '/images/work/bil-events/gallery-4.webp', alt: 'BIL Events staff T-shirts with the yellow monogram and wordmark', width: 1920, height: 1080, caption: 'BIL Events', href: '/work/bil-events' },
      { src: '/images/work/bil-events/gallery-7.webp', alt: 'BIL Events hoodie and cap printed with the yellow monogram', width: 1920, height: 1080, caption: 'BIL Events', href: '/work/bil-events' },
      { src: '/images/services/events/farij-marsa-hospitality.webp', alt: 'Arabic coffee being served to guests at the Farij Marsa event', width: 1080, height: 675, caption: 'Marsa Ajman', href: '/work/video' },
      { src: '/images/services/events/marsa-eid-stage.webp', alt: 'Brass performers on stage for the Eid celebration at Marsa Ajman', width: 1080, height: 608, caption: 'Marsa Ajman', href: '/work/video' },
      { src: '/images/services/events/farij-marsa-teaser-sign.webp', alt: 'The Marsa Ajman sign at sunset, from the Farij Marsa teaser', width: 1080, height: 720, caption: 'Marsa Ajman', href: '/work/video', position: '50% 0%' },
    ],
    relatedWork: [
      { label: 'BIL Events', href: '/work/bil-events', image: '/images/work/bil-events/gallery-6.webp' },
      { label: 'MM Event Management', href: '/work/mm-event-management', image: '/images/work/mm-event-management/gallery-3.webp' },
    ],
  },
);

export const photographyVideography = service(
  'photography-videography',
  'Photography & Videography',
  'PHOTOGRAPHY & VIDEOGRAPHY',
  'Brand, product, lifestyle, and real-estate photography that makes your identity look as considered as it is, with supporting video when a story needs motion.',
  {
    overview:
      'Design-led visual content, led by photography: product, brand, lifestyle, editorial, food, real estate, portraits, events, and drone. Every frame art-directed to match your identity. Video is a supporting layer for when motion tells the story better: short brand films, product and testimonial clips, and motion graphics.',
    scopeItems: [
      'Product & brand photography',
      'Lifestyle & editorial',
      'Real estate & interiors',
      'Event coverage',
      'Supporting brand video',
      'Motion graphics',
    ],
    gallery: [
      { src: '/images/services/photography-videography/food-shot-print.webp', alt: 'A finished food shot from a Propagenda photoshoot: kebab over rice, styled on white', width: 1080, height: 675, caption: 'Food photoshoot', href: '/work/video' },
      { src: '/images/services/photography-videography/kitchen-the-view.webp', alt: 'Sauce poured over mushrooms in a pan, from The View restaurant reel', width: 1080, height: 675, caption: 'The View', href: '/work/video' },
      { src: '/images/about/lifestyle-1.webp', alt: 'Woven pendant lamps glowing over the dining room, from the Sultan Saray reel', width: 1080, height: 674, caption: 'Sultan Saray', href: '/work/video' },
      { src: '/images/about/live-3.webp', alt: 'The illuminated Marsa Ajman sign at night', width: 1080, height: 810, caption: 'Marsa Ajman', href: '/work/video', position: '80% 50%' },
      { src: '/images/about/motion-3.webp', alt: 'Clemson Porter Properties logo animation', width: 1200, height: 900, caption: 'Clemson Porter Properties', href: '/work/video' },
      { src: '/images/about/influencer-3.webp', alt: 'Behind the scenes on a Propagenda photoshoot: lighting a set with a large softbox', width: 1080, height: 810, caption: 'Propagenda photoshoot', href: '/work/video' },
    ],
    relatedWork: [
      { label: 'Clemson Porter Properties', href: '/work/clemson-porter-properties' },
      { label: 'P2P Motors', href: '/work/p2p-motors' },
      { label: 'The BNK Group', href: '/work/bnk-group' },
    ],
    tertiaryCta: { label: 'Book your shoot today', href: '/contact' },
  },
);

export const allServices: ServiceRecord[] = [
  brandingVisualIdentity,
  publicRelations,
  onlineOfflineMarketing,
  websites,
  mobileApplications,
  events,
  photographyVideography,
];

export const servicesBySlug = Object.fromEntries(
  allServices.map((s) => [s.slug, s]),
) as Record<ServiceRecord['slug'], ServiceRecord>;
