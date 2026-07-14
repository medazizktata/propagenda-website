export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  platform: 'facebook' | 'threads' | 'tiktok' | 'instagram' | 'linkedin';
}

export interface FooterConfig {
  marquee: {
    line1: string;
    line2: string;
    ctaLabel: string;
    ctaHref: string;
  };
  tagline: string;
  secondaryTagline?: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
  legalLinks: NavItem[];
}

export interface ContactFormConfig {
  heading: string;
  subheading: string;
  submitLabel: string;
  fields: {
    firstName: { label: string; placeholder: string };
    lastName: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
}
