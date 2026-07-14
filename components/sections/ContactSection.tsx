'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactInfoBlock } from '@/components/sections/ContactInfoBlock';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          ['.contact-monogram', '.contact-head', '.contact-info', '.contact-form'],
          { autoAlpha: 1, y: 0 },
        );
        return;
      }

      gsap.set('.contact-monogram', { autoAlpha: 0 });
      gsap.set('.contact-head', { autoAlpha: 0, y: 36 });
      gsap.set('.contact-info', { autoAlpha: 0, y: 28 });
      gsap.set('.contact-form', { autoAlpha: 0, y: 36 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // Play while contact is entering — early handoff, still on-screen (110% finished off-screen).
          start: 'top 85%',
          end: 'top 28%',
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      tl.to('.contact-monogram', { autoAlpha: 1, ease: 'power2.out', duration: 0.3 }, 0)
        .to('.contact-head', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.28 }, 0.08)
        .to('.contact-info', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.26 }, 0.2)
        .to('.contact-form', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.28);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-charcoal py-32">
      {/*
        Full-bleed left mark. Rotate -90° with a horizontal offset that cancels the
        centre-origin AABB shift (otherwise the glyph sits ~gutter-inset even at left:0).
      */}
      <div
        aria-hidden
        className="contact-monogram pointer-events-none absolute inset-y-0 left-0 z-0 hidden lg:block"
        style={{ width: 'min(56vw, 720px)' }}
      >
        <div
          className="absolute top-1/2 opacity-[0.1]"
          style={{
            width: 'min(130vh, 1200px)',
            aspectRatio: '16 / 9',
            // AABB left after -90° around center = left + (w - h) / 2. Solve for left = 0:
            left: 'calc(min(130vh, 1200px) * (9 / 16 - 1) / 2)',
            transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'center center',
          }}
        >
          <Image
            src="/images/brand/monogram-hero.png"
            alt=""
            fill
            sizes="1200px"
            className="object-contain object-left"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-40% to-charcoal" />
      </div>

      <div className="relative z-content px-gutter-m lg:px-gutter-d">
        <div className="contact-head">
          <SectionLabel>Contact us</SectionLabel>
          <DisplayHeading as="h2" size="display-sm" className="mb-12 mt-3">
            Let&apos;s start a <span className="accent-word">conversation</span>
          </DisplayHeading>
        </div>
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="contact-info">
            <ContactInfoBlock showWhatsApp />
          </div>
          <div className="contact-form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
