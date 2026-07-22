'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/cn';
import { BrandPattern } from '@/components/ui/BrandPattern';
import { SectionLabel } from '@/components/ui/SectionLabel';

// The signature module for Graphics Production — a "material bench" that follows a job from
// screen to street. Pick a production capability from the sample rail and the bench crossfades:
// a large produced-example plate becomes the bold focal element, and a quiet spec board lists the
// real substrates (each with its own tactile texture swatch), the finishes on offer, and the
// turnaround. Deliberately unlike the PR roster (face ledger + reach spotlight) and the marketing
// funnel (tapering rail + online/offline columns): a top sample rail feeding one physical bench.
// Imagery is borrowed from the portfolio pool as stand-ins; turnaround/quantity figures are
// reasonable placeholders until production data lands.

// Substrate swatch textures — built from CSS gradients so each material reads as a real, physical
// sample chip (coated stock, brushed metal, woven fabric, corrugated board, glossy vinyl…).
const TEXTURES: Record<string, CSSProperties> = {
  coated: {
    backgroundColor: '#e9edf2',
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(188,199,214,0.72))',
  },
  paper: {
    backgroundColor: '#ded8cc',
    backgroundImage:
      'repeating-linear-gradient(90deg, rgba(0,0,0,0.045) 0 1px, transparent 1px 3px), linear-gradient(135deg, #ece7dc, #cdc5b4)',
  },
  board: {
    backgroundColor: '#c9a97e',
    backgroundImage: 'repeating-linear-gradient(0deg, #b9895a 0 2px, #e4c89d 2px 5px)',
  },
  foam: {
    backgroundColor: '#eceff3',
    backgroundImage: 'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.92), rgba(198,205,214,0.6))',
  },
  vinyl: {
    backgroundColor: '#f58b27',
    backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.4), rgba(0,0,0,0.18))',
  },
  film: {
    backgroundColor: '#4a6b82',
    backgroundImage:
      'linear-gradient(135deg, rgba(150,200,230,0.55), rgba(255,255,255,0.14), rgba(66,106,136,0.5))',
  },
  metal: {
    backgroundColor: '#9aa2b0',
    backgroundImage: 'repeating-linear-gradient(90deg, #8b93a1 0 1px, #c3cad5 1px 2px, #9aa2b0 2px 3px)',
  },
  acrylic: {
    backgroundColor: '#8fb7c6',
    backgroundImage:
      'linear-gradient(135deg, rgba(200,235,245,0.62), rgba(255,255,255,0.22) 42%, rgba(118,158,178,0.5))',
  },
  mesh: {
    backgroundColor: '#3a4150',
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.34) 1px, transparent 1.4px)',
    backgroundSize: '5px 5px',
  },
  fabric: {
    backgroundColor: '#454d5e',
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 4px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.13) 0 2px, transparent 2px 4px)',
  },
  solid: {
    backgroundColor: '#0f151f',
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0))',
  },
};

type Substrate = { name: string; tex: keyof typeof TEXTURES };
type Capability = {
  name: string;
  tagline: string;
  image: string;
  turnaround: string;
  minOrder: string;
  substrates: Substrate[];
  finishes: string[];
};

const CAPABILITIES: Capability[] = [
  {
    name: 'Offset & digital printing',
    tagline: 'Business cards, menus, brochures and stationery — sharp, colour-accurate, on quality stock.',
    image: '/images/portfolio/work-restaurant.png',
    turnaround: '2–4 days',
    minOrder: 'From 100 pcs',
    substrates: [
      { name: 'Gloss art paper', tex: 'coated' },
      { name: 'Silk & uncoated stock', tex: 'paper' },
      { name: 'Recycled board', tex: 'board' },
      { name: 'Synthetic stock', tex: 'film' },
    ],
    finishes: ['Matte & gloss lamination', 'Spot UV', 'Foil stamping', 'Emboss & deboss', 'Die-cutting'],
  },
  {
    name: 'Large-format printing',
    tagline: 'Banners, posters, backdrops and displays — printed big, colour-true, ready to hang.',
    image: '/images/portfolio/work-ghaftree.png',
    turnaround: '3–5 days',
    minOrder: 'From 1 unit',
    substrates: [
      { name: 'PVC banner', tex: 'vinyl' },
      { name: 'Mesh banner', tex: 'mesh' },
      { name: 'Backlit film', tex: 'film' },
      { name: 'Foamex board', tex: 'foam' },
    ],
    finishes: ['Eyelets & hemming', 'Pole pockets', 'Lamination', 'Mounting'],
  },
  {
    name: 'Signage',
    tagline: 'Shopfronts, wayfinding and built-up letters — fabricated and installed to spec.',
    image: '/images/portfolio/work-events.png',
    turnaround: '5–10 days',
    minOrder: 'From 1 unit',
    substrates: [
      { name: 'Cast acrylic', tex: 'acrylic' },
      { name: 'Brushed aluminium', tex: 'metal' },
      { name: 'Dibond composite', tex: 'metal' },
      { name: 'Foamex board', tex: 'foam' },
    ],
    finishes: ['CNC & laser cutting', 'Built-up letters', 'Standoff mounting', 'LED illumination'],
  },
  {
    name: 'Vehicle graphics',
    tagline: 'Full and partial wraps, fleet livery and cut decals — contour-cut and fitted on site.',
    image: '/images/portfolio/work-quickcars.png',
    turnaround: '2–4 days / vehicle',
    minOrder: 'From 1 vehicle',
    substrates: [
      { name: 'Cast wrap vinyl', tex: 'vinyl' },
      { name: 'Cut vinyl', tex: 'vinyl' },
      { name: 'One-way vision', tex: 'mesh' },
      { name: 'Reflective film', tex: 'metal' },
    ],
    finishes: ['Full & partial wraps', 'Gloss & matte laminate', 'Contour cutting', 'Fleet roll-out'],
  },
  {
    name: 'Uniforms & embroidery',
    tagline: 'Workwear and branded apparel — embroidered, printed and finished in-house.',
    image: '/images/portfolio/work-sanapex.png',
    turnaround: '7–10 days',
    minOrder: 'From 10 pcs',
    substrates: [
      { name: 'Cotton tee', tex: 'fabric' },
      { name: 'Polo piqué', tex: 'fabric' },
      { name: 'Softshell jacket', tex: 'fabric' },
      { name: 'Hi-vis workwear', tex: 'vinyl' },
    ],
    finishes: ['Flat & 3D-puff embroidery', 'Screen printing', 'DTF transfer', 'Woven & PVC badges'],
  },
  {
    name: 'Custom clothing & gifts',
    tagline: 'Drinkware, tech, notebooks and promo gifts — decorated with your brand, gift-ready.',
    image: '/images/portfolio/work-food.png',
    turnaround: '7–14 days',
    minOrder: 'From 25 pcs',
    substrates: [
      { name: 'Drinkware', tex: 'metal' },
      { name: 'Totes & bags', tex: 'fabric' },
      { name: 'Notebooks', tex: 'paper' },
      { name: 'Tech & USB', tex: 'solid' },
    ],
    finishes: ['Pad & screen print', 'Laser engraving', 'Debossing', 'Full-colour print'],
  },
];

const num = (i: number) => String(i + 1).padStart(2, '0');
const total = num(CAPABILITIES.length - 1);

export function GraphicsProductionShowcase() {
  const [active, setActive] = useState(0);
  const cap = CAPABILITIES[active];

  return (
    <section className="relative overflow-hidden px-gutter-m py-12 lg:px-gutter-d lg:py-16">
      <div aria-hidden className="pattern-section-fade absolute inset-0">
        <BrandPattern variant="tiled" />
      </div>
      <div className="relative z-content mx-auto max-w-6xl">
        <SectionLabel className="sd-reveal mb-4">What we produce</SectionLabel>
        <h2
          className="sd-reveal mb-4 max-w-3xl font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)' }}
        >
          From screen to street.
        </h2>
        <p className="sd-reveal mb-9 max-w-2xl text-[0.95rem] leading-relaxed text-white/60 md:text-base">
          High-quality materials, produced and installed by an experienced team — from a single
          business card to a full vehicle wrap. Pick a capability to see the substrates, finishes and
          turnaround behind it.
        </p>

        {/* ── Sample rail: choose a production capability. ── */}
        <div className="sd-reveal mb-8 flex flex-wrap gap-2.5">
          {CAPABILITIES.map((c, i) => {
            const on = active === i;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-pressed={on}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left transition-all duration-300 ease-out',
                  on
                    ? 'border-orange bg-orange/[0.08]'
                    : 'border-white/12 bg-white/[0.02] hover-fine:hover:border-white/30 hover-fine:hover:bg-white/[0.04]',
                )}
              >
                <span
                  aria-hidden
                  style={TEXTURES[c.substrates[0].tex]}
                  className={cn(
                    'h-5 w-5 shrink-0 rounded ring-1 transition-all duration-300',
                    on ? 'ring-orange/70' : 'ring-white/15',
                  )}
                />
                <span
                  className={cn(
                    'font-sans text-sm font-semibold tracking-tight transition-colors duration-300 md:text-[0.95rem]',
                    on ? 'text-white' : 'text-white/55',
                  )}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── The bench: produced-example plate (focal) + material spec board. ── */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10">
          {/* Produced example — the one bold focal element per state. */}
          <div className="sd-reveal relative min-h-[20rem] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:min-h-full">
            {CAPABILITIES.map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c.name}
                src={c.image}
                alt=""
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
                  active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent" />
            {/* Gloss sheen — sweeps once each time the capability changes (vinyl / press feel). */}
            <span
              key={`sheen-${active}`}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 motion-safe:animate-[production-sheen_900ms_ease-out]"
            />
            <div
              key={`cap-${active}`}
              className="absolute inset-x-6 bottom-6 motion-safe:animate-[tier-rise_500ms_ease-out_both]"
            >
              <span className="block font-sans text-sm font-semibold tabular-nums text-orange [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
                {num(active)} / {total}
              </span>
              <h3
                className="mt-1 font-sans font-bold leading-[0.95] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]"
                style={{ fontSize: 'clamp(1.7rem, 4vw, 2.9rem)' }}
              >
                {cap.name}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
                {cap.tagline}
              </p>
            </div>
          </div>

          {/* Material spec board — quiet supporting detail: substrates, finishes, turnaround. */}
          <div key={`board-${active}`} className="sd-reveal flex flex-col motion-safe:animate-[tier-rise_450ms_ease-out_both]">
            <p className="font-sans text-sm font-semibold text-white/70">Substrates &amp; materials</p>
            <ul className="mt-4 flex flex-col">
              {cap.substrates.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-4 border-b border-white/10 py-3 first:border-t first:border-t-white/10"
                >
                  <span
                    aria-hidden
                    style={TEXTURES[s.tex]}
                    className="h-9 w-9 shrink-0 rounded-md ring-1 ring-white/15"
                  />
                  <span className="font-sans text-[0.95rem] font-medium text-white/85">{s.name}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-sans text-sm font-semibold text-white/70">Finishes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cap.finishes.map((f) => (
                  <span
                    key={f}
                    className="rounded border border-white/12 px-3 py-1 text-sm text-white/65"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 border-t border-white/10 pt-5">
              <div>
                <span className="block font-sans text-xl font-bold text-white md:text-2xl">
                  {cap.turnaround}
                </span>
                <span className="mt-0.5 block text-sm text-white/45">Typical turnaround</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="block font-sans text-xl font-bold text-white md:text-2xl">
                  {cap.minOrder}
                </span>
                <span className="mt-0.5 block text-sm text-white/45">Minimum order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
