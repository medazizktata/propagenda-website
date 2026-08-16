import Link from 'next/link';
import { BrandPattern } from '@/components/ui/BrandPattern';

/**
 * Branded 404 — full-viewport charcoal composition, not the default Next stub.
 * Header is fixed, so top padding clears it before flex-centering.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-charcoal px-gutter-m pb-24 pt-[calc(var(--header-height)+1.25rem)] text-center lg:px-gutter-d">
      <div aria-hidden className="pattern-section-fade pointer-events-none absolute inset-0">
        <BrandPattern variant="tiled" className="opacity-[0.08]" />
      </div>

      <div className="relative z-content mx-auto max-w-3xl">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-orange">
          404
        </p>
        <h1
          className="font-sans font-extrabold uppercase leading-[0.85] tracking-[-0.03em] text-white"
          style={{ fontSize: 'clamp(3.5rem, 14vw, 9rem)' }}
        >
          Lost
          <span className="text-orange">.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
          This page doesn&apos;t exist, or it moved. Let&apos;s get you back to
          something worth seeing.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange px-8 py-3.5 font-sans text-sm font-bold uppercase leading-none tracking-[0.12em] text-black transition-[transform,background-color] duration-300 ease-out hover-fine:hover:-translate-y-0.5 hover-fine:hover:bg-white"
          >
            Go home
          </Link>
          <Link
            href="/work"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-8 py-3.5 font-sans text-sm font-bold uppercase leading-none tracking-[0.12em] text-white transition-[transform,border-color,color] duration-300 ease-out hover-fine:hover:-translate-y-0.5 hover-fine:hover:border-orange hover-fine:hover:text-orange"
          >
            View work
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-8 py-3.5 font-sans text-sm font-bold uppercase leading-none tracking-[0.12em] text-white transition-[transform,border-color,color] duration-300 ease-out hover-fine:hover:-translate-y-0.5 hover-fine:hover:border-orange hover-fine:hover:text-orange"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
