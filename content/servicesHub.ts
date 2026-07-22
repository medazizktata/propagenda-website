import type { ServiceSlug } from '@/types/content';

export const servicesHubHeading = 'EXPLORE OUR SERVICES';

/** Discipline the service belongs to — the structural label on each index row. */
export type ServiceDiscipline = 'brand' | 'digital' | 'production' | 'experience';

export interface ServiceHubCard {
  slug: ServiceSlug;
  title: string;
  description: string;
  image: string;
  subBullets?: string[];
  /** Structural discipline tag shown on the right of each index row. */
  tag: ServiceDiscipline;
  /** Short line revealed on hover/focus (trimmed from the overview). */
  descriptor: string;
  /**
   * Preview image the row blooms into on hover. TEMPORARY: mapped to real portfolio
   * renders until dedicated /images/services/* assets land. If omitted, the row falls
   * back to a branded monogram panel (no broken image).
   */
  preview?: string;
}

export const serviceHubCards: ServiceHubCard[] = [
  {
    slug: 'branding-visual-identity',
    title: 'Branding & Visual Identity',
    description:
      'From logo design to visual identity development and uplifting, our team of branding experts is dedicated to helping you establish a credible and trustworthy brand that drives long-term success for your business.',
    image: '/images/services/branding-and-visual-identity.jpg',
    tag: 'brand',
    descriptor: 'Logos, identity systems & guidelines',
    preview: '/images/portfolio/work-sanapex.png',
  },
  {
    slug: 'public-relations',
    title: 'Public Relations',
    description:
      "Our team of experts will meticulously select and collaborate with influential individuals in various fields, including A-list celebrities, bloggers, gamers, and actors to expand your brand's reach, engagement, and credibility.",
    image: '/images/services/public-relations.jpg',
    tag: 'brand',
    descriptor: 'Influencer & celebrity reach',
    preview: '/images/portfolio/work-food.png',
  },
  {
    slug: 'online-offline-marketing',
    title: 'Online & Offline Marketing',
    description:
      "Whether it's developing a brand strategy, creating a digital marketing campaign, producing video content, or managing social media accounts, we have the skills and experience to deliver exceptional results.",
    image: '/images/services/online-offline-marketing.jpg',
    subBullets: [
      'Social Media Management',
      'Content Marketing',
      'Influencer Marketing',
      'Digital Ads',
    ],
    tag: 'digital',
    descriptor: 'Campaigns, social & digital ads',
    preview: '/images/portfolio/work-ghaftree.png',
  },
  {
    slug: 'websites',
    title: 'Websites',
    description:
      'High-performing, user-friendly websites that drive business growth and achieve your digital goals.',
    image: '/images/services/websites.jpg',
    tag: 'digital',
    descriptor: 'Sites that drive growth',
    preview: '/images/portfolio/work-quickcars.png',
  },
  {
    slug: 'mobile-applications',
    title: 'Mobile Applications',
    description:
      'Our team of experienced mobile app developers uses advanced technology and effective methods to create creative and user-friendly mobile apps that enhance your brand, boost business growth, and delight users.',
    image: '/images/services/mobile-apps.jpg',
    tag: 'digital',
    descriptor: 'Apps that delight users',
    preview: '/images/portfolio/work-sanapex.png',
  },
  {
    slug: 'events',
    title: 'Events',
    description:
      'No matter what type of event you are planning, we can help you make it a success. We have the experience and expertise to handle every aspect of event organization and management.',
    image: '/images/services/events.jpg',
    tag: 'experience',
    descriptor: 'End-to-end event management',
    preview: '/images/portfolio/work-events.png',
  },
  {
    slug: 'photography-videography',
    title: 'Photography & Videography',
    description:
      'We have a team of experienced videographers who use state-of-the-art equipment and techniques to capture your brand story.',
    image: '/images/services/photography-vid.jpg',
    tag: 'production',
    descriptor: 'Your brand story, captured',
    preview: '/images/portfolio/work-food.png',
  },
];
