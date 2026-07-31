"use client";

import { useState } from "react";
import Link from "next/link";
import { aboutContent } from "@/content/about";
import { cn } from "@/components/ui/cn";

type ServiceItem = (typeof aboutContent.services.items)[number];

/**
 * Plusdrie-style service rows: title | collage | copy + option list.
 * Clicking an option swaps the collage images.
 */
export function AboutServices() {
  const { services } = aboutContent;

  return (
    <div className="px-gutter-m py-24 lg:px-gutter-d lg:py-32">
      <div className="mx-auto max-w-[1920px]">
        <p data-about-reveal className="mb-16 text-sm font-medium text-white/45 md:mb-24">
          {services.label}
        </p>

        <div className="flex flex-col gap-20 lg:gap-28">
          {services.items.map((item) => (
            <ServiceRow key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceRow({ item }: { item: ServiceItem }) {
  const [active, setActive] = useState(0);
  const images = item.options[active]?.images ?? item.options[0].images;
  const [hero, ...rest] = images;

  return (
    <article
      data-about-reveal
      className="grid gap-10 lg:grid-cols-[minmax(9rem,0.7fr)_minmax(18rem,1.35fr)_minmax(14rem,0.95fr)] lg:items-start lg:gap-12 xl:gap-16"
    >
      <h3
        className="font-sans font-bold leading-[1.08] tracking-[-0.02em] text-white lg:sticky lg:top-28"
        style={{ fontSize: "clamp(1.75rem, 3vw, 2.65rem)" }}
      >
        {item.title}
      </h3>

      <div
        key={`${item.slug}-${active}`}
        className="grid grid-cols-2 gap-2.5 sm:gap-3 animate-fade-in"
      >
        <div className="relative col-span-2 aspect-[16/10] overflow-hidden bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        {rest.slice(0, 2).map((src, i) => (
          <div
            key={`${item.slug}-${active}-${i}`}
            className="relative aspect-[4/3] overflow-hidden bg-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="max-w-md lg:pt-1">
        <p className="text-base leading-relaxed text-white/70 md:text-[1.05rem]">
          {item.body}
        </p>
        <Link
          href={`/services/${item.slug}`}
          className={cn(
            "mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-orange",
            "transition-colors duration-300 hover-fine:hover:text-white",
          )}
        >
          {item.cta}
          <span aria-hidden>→</span>
        </Link>

        <ul className="mt-8 flex flex-col gap-1" role="listbox" aria-label={`${item.title} focus`}>
          {item.options.map((opt, i) => {
            const isActive = active === i;
            return (
              <li key={opt.label} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full rounded-md px-3 py-2.5 text-left text-sm leading-snug transition-colors duration-200",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
                    isActive
                      ? "bg-orange font-semibold text-black"
                      : "bg-transparent font-medium text-white/40 hover-fine:hover:bg-white/5 hover-fine:hover:text-white/70",
                  )}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
