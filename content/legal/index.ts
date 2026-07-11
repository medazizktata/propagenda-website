import type { LegalRecord } from '@/types/content';

export const privacy: LegalRecord = {
  slug: 'privacy',
  title: 'Privacy Policy',
  h1: 'PRIVACY POLICY',
  sections: [
    {
      paragraphs: [
        'Propagenda Marketing Services ("Propagenda", "we", "us") respects your privacy. This policy explains how we collect, use, and protect personal information when you visit our website or contact us.',
        'Last updated: January 2025.',
      ],
    },
    {
      heading: 'Information We Collect',
      paragraphs: [
        'When you submit our contact form, we may collect your first name, last name, email address, phone number, and message content.',
        'We may also collect technical data such as browser type, device information, and pages visited through standard server logs and analytics tools.',
      ],
    },
    {
      heading: 'How We Use Your Information',
      paragraphs: [
        'We use contact form submissions to respond to inquiries, provide consultations, and deliver our marketing services.',
        'We do not sell your personal information to third parties.',
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'Our website may use cookies and similar technologies to improve performance and user experience. You can control cookies through your browser settings.',
      ],
    },
    {
      heading: 'Third-Party Services',
      paragraphs: [
        'We may use trusted third-party providers for hosting, analytics, email delivery, and form processing. These providers process data only as needed to perform their services.',
      ],
    },
    {
      heading: 'Data Retention',
      paragraphs: [
        'We retain contact form data only as long as necessary to respond to your inquiry, maintain business records, or comply with legal obligations.',
      ],
    },
    {
      heading: 'Your Rights',
      paragraphs: [
        'You may request access to, correction of, or deletion of your personal data by contacting us at info@thepropagenda.com.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'Propagenda Marketing Services',
        'Al Quoz Industrial Area 2, Dubai, UAE',
        'Email: info@thepropagenda.com',
        'Phone: +971 52 753 3253',
      ],
    },
    {
      heading: 'Governing Law',
      paragraphs: [
        'This privacy policy is governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.',
      ],
    },
  ],
  seo: {
    title: 'Privacy Policy | Propagenda',
    description: 'Privacy policy for Propagenda Marketing Services — UAE-facing standard template.',
  },
};

export const terms: LegalRecord = {
  slug: 'terms',
  title: 'Terms of Service',
  h1: 'TERMS OF SERVICE',
  sections: [
    {
      paragraphs: [
        'These Terms of Service govern your use of the Propagenda Marketing Services website and related digital properties. By accessing this site, you agree to these terms.',
      ],
    },
    {
      heading: 'Use of Website',
      paragraphs: [
        'You may use this website for lawful purposes only. You agree not to misuse the site, attempt unauthorized access, or interfere with its operation.',
        'Content on this site is provided for general information about our services and portfolio. It does not constitute a binding offer until confirmed in writing.',
      ],
    },
    {
      heading: 'Intellectual Property',
      paragraphs: [
        'All content on this website — including text, visuals, logos, case studies, and design assets — is owned by Propagenda Marketing Services or used with permission.',
        'You may not copy, reproduce, distribute, or create derivative works without our prior written consent.',
      ],
    },
    {
      heading: 'Services Disclaimer',
      paragraphs: [
        'Marketing outcomes depend on market conditions, client participation, and third-party platforms. We provide professional services with reasonable care but do not guarantee specific business results unless expressly agreed in a signed contract.',
      ],
    },
    {
      heading: 'Limitation of Liability',
      paragraphs: [
        'To the fullest extent permitted by applicable law, Propagenda Marketing Services shall not be liable for indirect, incidental, or consequential damages arising from use of this website or reliance on its content.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'Propagenda Marketing Services',
        'Al Quoz Industrial Area 2, Dubai, UAE',
        'Email: info@thepropagenda.com',
        'Phone: +971 52 753 3253',
      ],
    },
  ],
  seo: {
    title: 'Terms of Service | Propagenda',
    description: 'Terms of service for Propagenda Marketing Services website and services.',
  },
};

export const imprint: LegalRecord = {
  slug: 'imprint',
  title: 'Imprint',
  h1: 'IMPRINT',
  centered: true,
  sections: [
    {
      paragraphs: [
        'Propagenda Marketing Services',
        'Al Quoz Industrial Area 2',
        'Dubai, UAE',
        '+971 52 753 3253',
        'info@thepropagenda.com',
        '@propagenda_marketing',
      ],
    },
  ],
  seo: {
    title: 'Imprint | Propagenda',
    description: 'Legal imprint — company name, address, and contact details.',
  },
};

export const legalBySlug = { privacy, terms, imprint } as const;
