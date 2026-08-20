import type { ContactFormConfig, FooterConfig, NavItem, SocialLink } from '@/types/navigation';

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

export const serviceNav: NavItem[] = [
  { label: 'Branding', href: '/services/branding-visual-identity' },
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
  tagline: 'Looking for the Better Future',
  secondaryTagline: 'Together for the Better Future',
  phone: '+971 52 753 3253',
  email: 'info@thepropagenda.com',
  copyright: 'Propagenda. All Rights Reserved.',
  legalLinks: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Imprint', href: '/imprint' },
  ],
};

export const contactForm: ContactFormConfig = {
  heading: "Let's start your project together",
  subheading: 'Tell us what you need',
  submitLabel: 'Submit',
  fields: {
    name: { label: 'Your name', placeholder: 'Your name…' },
    company: { label: 'Your company', placeholder: 'Your company…' },
    email: { label: 'Your email', placeholder: 'Your email…' },
    source: {
      label: 'How did you find out about us?',
      placeholder: 'How did you find out about us?',
    },
    budget: {
      label: 'Budget for the project?',
      placeholder: 'Budget for the project?',
    },
    timeframe: {
      label: 'Time frame of the project?',
      placeholder: 'Time frame of the project?',
    },
    message: {
      label: 'Tell us about the project',
      placeholder: 'Please tell us about scope, requirements, features…',
    },
  },
};

export const hero = {
  h1: 'WHERE CREATIVITY MEETS STRATEGY',
  subtitle: 'Your 360° Marketing Solutions Partner',
  cta: { label: 'See the work', href: '/work' },
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
