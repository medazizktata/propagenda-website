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
    overview: `${title} overview — content from CONTENT_MAPPING.md.`,
    scopeItems: ['Scope item placeholder'],
    gallery: [],
    seo: { title: `${title} | Propagenda`, description },
    ...extra,
  };
}

export const brandingVisualIdentity = service(
  'branding-visual-identity',
  'Branding & Visual Identity',
  'BRANDING & VISUAL IDENTITY',
  'Strategy-first branding — logo, identity systems, stationery tiers, and brand guidelines for Dubai businesses.',
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
      { src: '/images/services/branding/gallery-01.jpg', alt: 'Brand identity showcase', width: 1600, height: 1200 },
      { src: '/images/services/branding/gallery-02.jpg', alt: 'Business card design', width: 1600, height: 1200 },
      { src: '/images/services/branding/gallery-03.jpg', alt: 'Letterhead stationery', width: 1600, height: 1200 },
      { src: '/images/services/branding/gallery-04.jpg', alt: 'Brand guidelines document', width: 1600, height: 1200 },
      { src: '/images/services/branding/gallery-05.jpg', alt: 'Logo applications', width: 1600, height: 1200 },
      { src: '/images/services/branding/gallery-06.jpg', alt: 'Visual identity system', width: 1600, height: 1200 },
    ],
    relatedWork: [
      { label: 'Sanapex Interiors', href: '/work/sanapex-interiors' },
      { label: 'P2P Motors', href: '/work/p2p-motors' },
    ],
  },
);

export const publicRelations = service(
  'public-relations',
  'Public Relations',
  'PUBLIC RELATIONS',
  'Influencer partnerships, media relations, and credibility-building PR for brands in the UAE.',
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
      { src: '/images/services/pr/gallery-01.jpg', alt: 'Influencer collaboration', width: 1600, height: 1200 },
      { src: '/images/services/pr/gallery-02.jpg', alt: 'Celebrity brand partnership', width: 1600, height: 1200 },
      { src: '/images/services/pr/gallery-03.jpg', alt: 'Blogger outreach campaign', width: 1600, height: 1200 },
      { src: '/images/services/pr/gallery-04.jpg', alt: 'Social media PR samples', width: 1600, height: 1200 },
      { src: '/images/services/pr/gallery-05.jpg', alt: 'BIL Events PR coverage', width: 1600, height: 1200 },
      { src: '/images/services/pr/gallery-06.jpg', alt: 'Dr. Shifa media campaign', width: 1600, height: 1200 },
    ],
  },
);

export const onlineOfflineMarketing = service(
  'online-offline-marketing',
  'Online & Offline Marketing',
  'ONLINE & OFFLINE MARKETING',
  'Digital campaigns, social media, content marketing, influencer marketing, and digital ads — online and offline.',
  {
    overview:
      "High-quality and effective marketing solutions. Whether it's developing a brand strategy, creating a digital marketing campaign, producing video content, or managing social media accounts, we have the skills and experience to deliver exceptional results.",
    scopeItems: [
      'Brand strategy',
      'Digital marketing campaigns',
      'Video content',
      'Social media management',
      'Content marketing',
      'Influencer marketing',
      'Digital ads',
    ],
    extendedBullets: [
      'Social Media Management',
      'Content Marketing',
      'Influencer Marketing',
      'Digital Ads',
    ],
    gallery: [
      { src: '/images/services/marketing/gallery-01.jpg', alt: 'Social media campaign', width: 1600, height: 1200 },
      { src: '/images/services/marketing/gallery-02.jpg', alt: 'Digital marketing creative', width: 1600, height: 1200 },
      { src: '/images/services/marketing/gallery-03.jpg', alt: 'Content marketing assets', width: 1600, height: 1200 },
      { src: '/images/services/marketing/gallery-04.jpg', alt: 'Influencer collaboration', width: 1600, height: 1200 },
      { src: '/images/services/marketing/gallery-05.jpg', alt: 'Offline marketing materials', width: 1600, height: 1200 },
      { src: '/images/services/marketing/gallery-06.jpg', alt: 'Campaign performance overview', width: 1600, height: 1200 },
    ],
  },
);

export const graphicsProduction = service(
  'graphics-production',
  'Graphics Production',
  'GRAPHICS PRODUCTION',
  'Design · Print · Install — offset printing, signage, vehicle graphics, uniforms, and large-format production.',
  {
    overview:
      'Turn your ideas and designs to life using high quality materials and by a highly experienced team.',
    scopeItems: [
      'Offset & digital printing',
      'Digital & large format printing',
      'Signages',
      'Custom clothing & branded gifts',
      'Vehicle graphics',
      'Uniforms & embroidery',
    ],
    gallery: [
      { src: '/images/services/graphics/gallery-01.jpg', alt: 'Offset printing samples', width: 1600, height: 1200 },
      { src: '/images/services/graphics/gallery-02.jpg', alt: 'Large format signage', width: 1600, height: 1200 },
      { src: '/images/services/graphics/gallery-03.jpg', alt: 'Vehicle graphics wrap', width: 1600, height: 1200 },
      { src: '/images/services/graphics/gallery-04.jpg', alt: 'Branded uniforms', width: 1600, height: 1200 },
      { src: '/images/services/graphics/gallery-05.jpg', alt: 'Stationery production', width: 1600, height: 1200 },
      { src: '/images/services/graphics/gallery-06.jpg', alt: 'Custom branded gifts', width: 1600, height: 1200 },
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
      { src: '/images/services/websites/gallery-01.jpg', alt: 'Website homepage design', width: 1600, height: 1200 },
      { src: '/images/services/websites/gallery-02.jpg', alt: 'Landing page layout', width: 1600, height: 1200 },
      { src: '/images/services/websites/gallery-03.jpg', alt: 'UX/UI interface', width: 1600, height: 1200 },
      { src: '/images/services/websites/gallery-04.jpg', alt: 'Sanapex web deliverables', width: 1600, height: 1200 },
      { src: '/images/services/websites/gallery-05.jpg', alt: 'Mobile responsive views', width: 1600, height: 1200 },
      { src: '/images/services/websites/gallery-06.jpg', alt: 'Web performance optimization', width: 1600, height: 1200 },
    ],
    relatedWork: [{ label: 'Zealerz App & Web', href: '/work/zealerz' }],
  },
);

export const mobileApplications = service(
  'mobile-applications',
  'Mobile Applications',
  'MOBILE APPLICATIONS',
  'User-friendly mobile apps that enhance your brand and delight users.',
);

export const events = service(
  'events',
  'Events',
  'EVENTS',
  'Full event branding, organization, photo/video, and social — from planning to flawless execution.',
  {
    overview:
      'From start to finish. From planning to evaluation. No matter what type of event you are planning, we can help you make it a success. We have the experience and expertise to handle every aspect of event organization and management.',
    scopeItems: [],
    eventChecklist: [
      'Re-branding',
      'Marketing materials production',
      'Full organization',
      'Photography & videography',
      'Social media marketing',
    ],
    gallery: [
      { src: '/images/services/events/gallery-01.jpg', alt: 'Conference event branding', width: 1600, height: 1200 },
      { src: '/images/services/events/gallery-02.jpg', alt: 'BIL Events campaign', width: 1600, height: 1200 },
      { src: '/images/services/events/gallery-03.jpg', alt: '3L Events branding', width: 1600, height: 1200 },
      { src: '/images/services/events/gallery-04.jpg', alt: 'Event marketing materials', width: 1600, height: 1200 },
      { src: '/images/services/events/gallery-05.jpg', alt: 'Live event coverage', width: 1600, height: 1200 },
      { src: '/images/services/events/gallery-06.jpg', alt: 'Event social activation', width: 1600, height: 1200 },
    ],
    relatedWork: [{ label: 'View Event Work', href: '/work' }],
  },
);

export const photographyVideography = service(
  'photography-videography',
  'Photography & Videography',
  'PHOTOGRAPHY & VIDEOGRAPHY',
  'Product, lifestyle, real estate, event, and cinematic video production in Dubai. Book your shoot today.',
  {
    overview:
      'Photography: products, brands, lifestyle, editorial, events, food, real estate, portraits, drone. Video: explainer videos, products, testimonials, brand videos, animated videos, motion graphics, live streaming.',
    scopeItems: [
      'Product photography',
      'Lifestyle & editorial',
      'Event coverage',
      'Real estate',
      'Cinematic video',
      'Motion graphics',
      'Live streaming',
    ],
    gallery: [
      { src: '/images/services/photography/gallery-01.jpg', alt: 'Product photography', width: 1600, height: 1200 },
      { src: '/images/services/photography/gallery-02.jpg', alt: 'Lifestyle editorial shoot', width: 1600, height: 1200 },
      { src: '/images/services/photography/gallery-03.jpg', alt: 'Event coverage', width: 1600, height: 1200 },
      { src: '/images/services/photography/gallery-04.jpg', alt: 'Real estate photography', width: 1600, height: 1200 },
      { src: '/images/services/photography/gallery-05.jpg', alt: 'Brand video production', width: 1600, height: 1200 },
      { src: '/images/services/photography/gallery-06.jpg', alt: 'Motion graphics reel', width: 1600, height: 1200 },
    ],
    relatedWork: [{ label: 'Clemson Porter Properties', href: '/work/clemson-porter-properties' }],
    tertiaryCta: { label: 'Book your shoot today', href: '/contact' },
  },
);

export const allServices: ServiceRecord[] = [
  brandingVisualIdentity,
  publicRelations,
  onlineOfflineMarketing,
  graphicsProduction,
  websites,
  mobileApplications,
  events,
  photographyVideography,
];

export const servicesBySlug = Object.fromEntries(
  allServices.map((s) => [s.slug, s]),
) as Record<ServiceRecord['slug'], ServiceRecord>;
