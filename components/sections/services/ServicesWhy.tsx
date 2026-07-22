import { SectionLabel } from '@/components/ui/SectionLabel';
import { BrandPattern } from '@/components/ui/BrandPattern';

/**
 * Services hub — a second act beyond the index: why brands consolidate with the studio, plus a
 * client-logo marquee for proof. Static (CSS marquee), so it works as a server component.
 */
const VALUES = [
  {
    title: 'One studio, every capability',
    desc: 'Branding, PR, marketing, web, and production — from first strategy to launch — handled by one integrated team.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: 'Strategy before design',
    desc: 'Every visual and every campaign is anchored to a clear brand strategy — decisions with a reason, not guesswork.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: 'Built in Dubai, made to travel',
    desc: 'Local market insight paired with work that holds its own on a global stage.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const CLIENTS = [
  { name: 'Sanapex Interiors', src: '/images/clients/sanapex-interiors.png' },
  { name: 'P2P Motors', src: '/images/clients/p2p-motors.png' },
  { name: 'Centralhub', src: '/images/clients/centralhub.png' },
  { name: 'Ghaf Tree', src: '/images/clients/ghaf-tree.png' },
  { name: 'Dr. Shifa', src: '/images/clients/dr-shifa.png' },
  { name: 'OU Optics', src: '/images/clients/ou-optics.png' },
];

export function ServicesWhy() {
  return (
    <section className="relative overflow-hidden bg-charcoal px-gutter-m py-20 lg:px-gutter-d lg:py-28">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="mb-4">Why Propagenda</SectionLabel>
        <h2
          className="mb-14 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4.4vw, 3.2rem)' }}
        >
          One partner for the whole brand.
        </h2>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {VALUES.map((v) => (
            <div key={v.title}>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange">
                {v.icon}
              </div>
              <h3 className="font-sans text-lg font-bold text-white">{v.title}</h3>
              <p className="mt-2 leading-relaxed text-white/60">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-12">
          <SectionLabel className="mb-8">Trusted by</SectionLabel>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
            <div className="flex w-max animate-[marquee_32s_linear_infinite] motion-reduce:animate-none">
              {[...CLIENTS, ...CLIENTS].map((logo, i) => (
                <span
                  key={`${logo.name}-${i}`}
                  className="mx-2 flex h-20 w-40 shrink-0 items-center justify-center rounded-xl bg-white/90 px-6 py-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
