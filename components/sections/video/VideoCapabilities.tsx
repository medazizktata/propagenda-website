'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { cn } from '@/components/ui/cn';

type Capability = {
  label: string;
  blurb: string;
  poster: string;
  src?: string;
};

// Craft list with hover-preview work in the background (poster / muted loop).
export function VideoCapabilities({ items }: { items: Capability[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || items.length === 0) return;
    registerGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.cap-in', { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        '.cap-in',
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%', once: true },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [reducedMotion, items.length]);

  // Play the active craft's loop; pause + reset the rest.
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (active === i && !reducedMotion) {
        if (vid.preload === 'none') vid.preload = 'metadata';
        void vid.play().catch(() => {});
      } else {
        vid.pause();
        try {
          vid.currentTime = 0;
        } catch {
          /* ignore seek before load */
        }
      }
    });
  }, [active, reducedMotion]);

  if (items.length === 0) return null;

  const activate = (i: number) => setActive(i);
  const clear = () => setActive(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-gutter-m py-20 lg:px-gutter-d lg:py-28"
      onPointerLeave={clear}
    >
      {/* Example work — full-bleed behind the list, crossfades per row. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {items.map((item, i) => {
          const on = active === i;
          return (
            <div
              key={item.label}
              className={cn(
                'absolute inset-0 transition-[opacity,transform] duration-500 ease-out',
                on ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
              )}
            >
              {item.src && !reducedMotion ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={item.src}
                  poster={item.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.poster} alt="" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-charcoal/78" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/45" />
            </div>
          );
        })}
      </div>

      <div className="relative z-content mx-auto max-w-6xl">
        <div className="cap-in flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3.1rem)' }}
          >
            What we shoot<span className="text-orange">.</span>
          </h2>
          <p className="max-w-xs text-sm text-white/45 sm:text-right">
            Four formats. One motion language.
          </p>
        </div>

        <ul className="mt-14 space-y-1 sm:mt-16">
          {items.map((item, i) => {
            const on = active === i;
            return (
              <li key={item.label} className="cap-in">
                <div
                  onPointerEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                  tabIndex={0}
                  className={cn(
                    'group/cap grid cursor-default grid-cols-[3rem_1fr] items-baseline gap-x-4 rounded-2xl px-3 py-5 outline-none transition-colors duration-300 sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-x-8 sm:px-5 sm:py-7',
                    'focus-visible:ring-2 focus-visible:ring-orange/60',
                    on ? 'bg-white/[0.06]' : 'hover-fine:hover:bg-white/[0.03]',
                  )}
                >
                  <span className="font-sans text-xs font-bold tabular-nums tracking-wider text-orange/80 sm:text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={cn(
                      'font-sans font-bold uppercase tracking-tight text-white transition-transform duration-300',
                      on && 'translate-x-1',
                    )}
                    style={{ fontSize: 'clamp(1.35rem, 3.2vw, 2.35rem)' }}
                  >
                    {item.label}
                  </h3>
                  <p className="col-start-2 mt-1.5 text-sm leading-relaxed text-white/50 sm:col-start-3 sm:mt-0 sm:self-center sm:text-base">
                    {item.blurb}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
