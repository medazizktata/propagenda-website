'use client';

import dynamic from 'next/dynamic';

const HeroLogo3D = dynamic(
  () => import('@/components/sections/HeroLogo3D').then((m) => m.HeroLogo3D),
  { ssr: false },
);

/**
 * `large` (the Services hero): on desktop the box grows past its column into the empty right
 * gutter (the page gutter is 14vw there), so the monogram reads bigger without squeezing the
 * one-line headline beside it.
 */
export function ServicesHeroLogo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const box =
    size === 'large'
      ? 'relative mx-auto aspect-square w-full max-w-[min(92vw,30rem)] lg:mx-0 lg:w-[calc(100%+11vw)] lg:max-w-none lg:-mr-[11vw]'
      : 'relative mx-auto aspect-square w-full max-w-[min(92vw,28rem)] lg:mx-0 lg:ml-auto lg:max-w-[min(38vw,34rem)] xl:max-w-[36rem]';
  return (
    <div className={box}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[12%] rounded-full bg-orange/10 blur-[128px]"
      />
      <div className="relative h-full w-full scale-110 lg:scale-[1.22]">
        <HeroLogo3D align="center" className="absolute inset-0" />
      </div>
    </div>
  );
}
