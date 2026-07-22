import type { ContactFormConfig, FooterConfig, NavItem, SocialLink } from '@/types/navigation';

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const serviceNav: NavItem[] = [
  { label: 'Branding & Visual Identity', href: '/services/branding-visual-identity' },
  { label: 'Public Relations', href: '/services/public-relations' },
  { label: 'Online & Offline Marketing', href: '/services/online-offline-marketing' },
  { label: 'Websites', href: '/services/websites' },
  { label: 'Mobile Applications', href: '/services/mobile-applications' },
  { label: 'Events', href: '/services/events' },
  { label: 'Photography & Videography', href: '/services/photography-videography' },
];

export const socialLinks: SocialLink[] = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/propagenda.marketing',
    platform: 'facebook',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/propagenda_marketing/',
    platform: 'instagram',
  },
  {
    label: 'Threads',
    href: 'https://www.threads.net/@propagenda_marketing',
    platform: 'threads',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@propagenda_marketing',
    platform: 'tiktok',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/propagenda-marketing',
    platform: 'linkedin',
  },
];

export const footer: FooterConfig = {
  marquee: {
    line1: 'PROPAGENDA · MARKETING SERVICES · LOOKING FOR THE BETTER FUTURE ·',
    line2: 'CONNECT NOW →',
    ctaLabel: 'CONNECT NOW',
    ctaHref: '/contact',
  },
  tagline: 'Looking for the Better Future',
  secondaryTagline: 'Together for the Better Future',
  phone: '+971 52 753 3253',
  email: 'info@thepropagenda.com',
  address: 'Al Quoz Industrial Area 2, Dubai, UAE',
  copyright: 'Propagenda. All Rights Reserved.',
  legalLinks: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Imprint', href: '/imprint' },
  ],
};

export const contactForm: ContactFormConfig = {
  heading: "Let's start a conversation",
  subheading: 'Get a free consultation',
  submitLabel: 'Send Message',
  fields: {
    firstName: { label: 'First Name', placeholder: 'First Name' },
    lastName: { label: 'Last Name', placeholder: 'Last Name' },
    email: { label: 'Email', placeholder: 'Email' },
    phone: { label: 'Phone', placeholder: 'Phone' },
    message: { label: 'Message', placeholder: 'Message' },
  },
};

export const hero = {
  h1: 'WHERE CREATIVITY MEETS STRATEGY',
  subtitle: 'Your 360° Marketing Solutions Partner',
  cta: { label: 'View Our Portfolio', href: '/work' },
};

export const site = {
  name: 'Propagenda',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepropagenda.com',
  primaryNav,
  serviceNav,
  socialLinks,
  footer,
  contactForm,
  hero,
};
