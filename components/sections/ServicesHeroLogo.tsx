'use client';

import dynamic from 'next/dynamic';

const HeroLogo3D = dynamic(
  () => import('@/components/sections/HeroLogo3D').then((m) => m.HeroLogo3D),
  { ssr: false },
);

export function ServicesHeroLogo() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(92vw,28rem)] lg:max-w-[min(38vw,34rem)] xl:max-w-[36rem]">
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
