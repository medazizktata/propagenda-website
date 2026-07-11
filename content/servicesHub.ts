import type { ServiceSlug } from '@/types/content';

export const servicesHubHeading = 'EXPLORE OUR SERVICES';

export interface ServiceHubCard {
  slug: ServiceSlug;
  title: string;
  description: string;
  image: string;
  subBullets?: string[];
}

export const serviceHubCards: ServiceHubCard[] = [
  {
    slug: 'branding-visual-identity',
    title: 'Branding & Visual Identity',
    description:
      'From logo design to visual identity development and uplifting, our team of branding experts is dedicated to helping you establish a credible and trustworthy brand that drives long-term success for your business.',
    image: '/images/services/branding-and-visual-identity.jpg',
  },
  {
    slug: 'public-relations',
    title: 'Public Relations',
    description:
      "Our team of experts will meticulously select and collaborate with influential individuals in various fields, including A-list celebrities, bloggers, gamers, and actors to expand your brand's reach, engagement, and credibility.",
    image: '/images/services/public-relations.jpg',
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
  },
  {
    slug: 'graphics-production',
    title: 'Graphics Production',
    description:
      'Turn your ideas and designs to life using high quality materials and by a highly experienced team.',
    image: '/images/services/graphics-prod.jpg',
  },
  {
    slug: 'websites',
    title: 'Websites',
    description:
      'High-performing, user-friendly websites that drive business growth and achieve your digital goals.',
    image: '/images/services/websites.jpg',
  },
  {
    slug: 'mobile-applications',
    title: 'Mobile Applications',
    description:
      'Our team of experienced mobile app developers uses advanced technology and effective methods to create creative and user-friendly mobile apps that enhance your brand, boost business growth, and delight users.',
    image: '/images/services/mobile-apps.jpg',
  },
  {
    slug: 'events',
    title: 'Events',
    description:
      'No matter what type of event you are planning, we can help you make it a success. We have the experience and expertise to handle every aspect of event organization and management.',
    image: '/images/services/events.jpg',
  },
  {
    slug: 'photography-videography',
    title: 'Photography & Videography',
    description:
      'We have a team of experienced videographers who use state-of-the-art equipment and techniques to capture your brand story.',
    image: '/images/services/photography-vid.jpg',
  },
];
