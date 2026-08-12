'use client';

import { Fragment, useId, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { ElasticLine } from '@/components/ui/ElasticLine';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  /** Only one panel open at a time (default) or allow several. */
  single?: boolean;
  /** Index open on first render. `null` = all closed. Default 0. */
  defaultOpen?: number | null;
  /** Draw the elastic-string dividers between rows (default true). */
  elastic?: boolean;
  className?: string;
}

/**
 * Reusable FAQ accordion. Big question, a `+`→`×` toggle on the right, click to reveal
 * the answer (animated height via the grid-rows technique — no JS measuring). The rules
 * between questions are {@link ElasticLine}s: they bend toward the cursor and spring back
 * elastically, so the separators feel plucked as you scan the list. Give it plain
 * `{ question, answer }[]` and it renders anywhere.
 */
export function FAQAccordion({
  items,
  single = true,
  defaultOpen = 0,
  elastic = true,
  className,
}: FAQAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen == null ? [] : [defaultOpen]),
  );

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = single ? new Set<number>() : new Set(prev);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // A fresh separator each call — the elastic line owns its own pointer state, so it
  // can't be a shared element. Lowercase helper (not a component) to keep state stable.
  const renderRule = (key: string) =>
    elastic ? (
      <ElasticLine key={key} hitZone={34} thickness={1.5} className="opacity-90" />
    ) : (
      <div key={key} className="h-px w-full bg-white/10" />
    );

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `${baseId}-panel-${i}`;
        const btnId = `${baseId}-btn-${i}`;
        return (
          <Fragment key={item.question}>
            {renderRule(`rule-${i}`)}
            <div>
              <h3 className="m-0">
                <button
                  id={btnId}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                >
                  <span
                    className={cn(
                      'font-sans text-base font-semibold transition-colors duration-200 md:text-lg',
                      isOpen ? 'text-orange' : 'text-white',
                    )}
                  >
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'relative flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 ease-out',
                      isOpen && 'rotate-45',
                    )}
                  >
                    <span className="absolute h-0.5 w-3.5 rounded-full bg-orange" />
                    <span className="absolute h-3.5 w-0.5 rounded-full bg-orange" />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <p className="w-full pr-10 text-[0.95rem] leading-relaxed text-white/65 md:pr-16">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
      {renderRule('rule-end')}
    </div>
  );
}
