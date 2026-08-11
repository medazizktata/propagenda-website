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
    name: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    source: { label: string; placeholder: string };
    budget: { label: string; placeholder: string };
    timeframe: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
}
