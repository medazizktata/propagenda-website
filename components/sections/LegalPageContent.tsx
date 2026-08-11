import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BrandPattern } from '@/components/ui/BrandPattern';
import {
  Eyebrow,
  EditorialSectionHeader,
  LeadText,
  pad2,
} from '@/components/ui/Editorial';
import type { LegalRecord } from '@/types/content';
import { cn } from '@/components/ui/cn';

/* ── helpers ───────────────────────────────────────────────────────────── */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
const isPhone = (s: string) => /^\+?[\d\s()-]{7,}$/.test(s.trim());

const hoverLink = 'transition-hover hover-fine:hover:text-orange';
const mailHref = (v: string) => `mailto:${v.trim()}`;
const telHref = (v: string) => `tel:${v.replace(/\s+/g, '')}`;

/**
 * A single contact/address line. Auto-links bare emails/phones, and for labelled lines
 * ("Email: x@y.z", "Phone: +971 …") keeps the label muted and links only the value.
 */
function AddressLine({ line, strong }: { line: string; strong?: boolean }) {
  const size = strong ? 'font-sans text-lg font-semibold text-white md:text-xl' : 'text-base';

  const labelled = line.match(/^([A-Za-z][A-Za-z ]*?):\s*(.+)$/);
  if (labelled) {
    const [, label, value] = labelled;
    const href = isEmail(value) ? mailHref(value) : isPhone(value) ? telHref(value) : undefined;
    return (
      <span className={cn(size, 'text-white/70')}>
        <span className="text-white/55">{label}: </span>
        {href ? (
          <a href={href} className={cn('text-white/85', hoverLink)}>
            {value}
          </a>
        ) : (
          <span className="text-white/85">{value}</span>
        )}
      </span>
    );
  }
  if (isEmail(line)) {
    return (
      <a href={mailHref(line)} className={cn(size, 'w-fit text-white/85', hoverLink)}>
        {line}
      </a>
    );
  }
  if (isPhone(line)) {
    return (
      <a href={telHref(line)} className={cn(size, 'w-fit text-white/85', hoverLink)}>
        {line}
      </a>
    );
  }
  return <span className={cn(size, strong ? 'text-white' : 'text-white/70')}>{line}</span>;
}

/* ── Imprint (centred identity masthead) ───────────────────────────────── */

function ImprintView({ legal }: { legal: LegalRecord }) {
  const lines = legal.sections[0]?.paragraphs ?? [];
  return (
    <article className="relative flex min-h-[84vh] flex-col items-center justify-center overflow-hidden bg-charcoal px-gutter-m py-32 text-center lg:px-gutter-d">
      <div aria-hidden className="pattern-section-fade pointer-events-none absolute inset-0">
        <BrandPattern variant="dense" half="right" className="opacity-[0.13]" />
      </div>
      <div className="relative z-content flex flex-col items-center">
        <Eyebrow className="justify-center">Legal — Imprint</Eyebrow>
        <DisplayHeading as="h1" size="display-sm" className="mt-6 text-white">
          {legal.h1}
        </DisplayHeading>
        {lines.length > 0 && (
          <div className="mt-14 flex flex-col items-center gap-2">
            <AddressLine line={lines[0]} strong />
            <span aria-hidden className="my-4 h-px w-10 bg-orange/50" />
            {lines.slice(1).map((line) => (
              <AddressLine key={line} line={line} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ── Policy (privacy / terms — two-column editorial document) ───────────── */

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold uppercase tracking-label text-white/55">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-white/80">{value}</dd>
    </div>
  );
}

type PolicyItem = { heading: string; paragraphs: string[]; index: number; id: string };

function ContentsRail({ items }: { items: PolicyItem[] }) {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="On this page" className="sticky top-28">
        <p className="mb-5 text-xs font-semibold uppercase tracking-label text-white/55">
          On this page
        </p>
        <ol className="space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex items-baseline gap-3 py-1.5 text-sm leading-snug text-white/55 transition-hover hover-fine:hover:text-white"
              >
                <span className="tabular-nums text-xs font-bold text-orange/70">
                  {pad2(item.index)}
                </span>
                <span>{item.heading}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

function PolicyView({ legal }: { legal: LegalRecord }) {
  const [first, ...tail] = legal.sections;
  const hasIntro = Boolean(first && !first.heading);
  const introParas = hasIntro ? first.paragraphs : [];
  const bodySections = hasIntro ? tail : legal.sections;

  const updated = introParas
    .find((p) => /^last updated/i.test(p))
    ?.replace(/^last updated:?\s*/i, '')
    .replace(/\.$/, '');
  const leadParas = introParas.filter((p) => !/^last updated/i.test(p));

  const items: PolicyItem[] = bodySections.map((s, i) => ({
    heading: s.heading ?? `Section ${i + 1}`,
    paragraphs: s.paragraphs,
    index: i + 1,
    id: s.heading ? slugify(s.heading) : `section-${i + 1}`,
  }));

  const wordCount = legal.sections
    .flatMap((s) => s.paragraphs)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <article className="relative bg-charcoal px-gutter-m pb-28 pt-32 lg:px-gutter-d lg:pb-36 lg:pt-40">
      {/* Masthead */}
      <header className="max-w-4xl">
        <Eyebrow>Legal</Eyebrow>
        <DisplayHeading as="h1" size="display-xs" className="mt-6 text-balance text-white">
          {legal.h1}
        </DisplayHeading>
        {leadParas.length > 0 && (
          <LeadText className="mt-8 max-w-measure-lead">{leadParas.join(' ')}</LeadText>
        )}
        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/12 pt-6">
          {updated && <MetaItem label="Last updated" value={updated} />}
          <MetaItem label="Sections" value={pad2(items.length)} />
          <MetaItem label="Reading" value={`~${minutes} min`} />
        </dl>
      </header>

      {/* Body — sticky contents rail + measured, ruled sections */}
      <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24">
        <ContentsRail items={items} />
        <div className="space-y-16 lg:space-y-20">
          {items.map((item) => (
            <section key={item.id} id={item.id} className="scroll-mt-28">
              <EditorialSectionHeader index={item.index} title={item.heading} />
              {item.heading === 'Contact' ? (
                <div className="mt-6 flex flex-col gap-1.5 border-l-2 border-orange/50 pl-5">
                  {item.paragraphs.map((line, i) => (
                    <AddressLine key={line} line={line} strong={i === 0} />
                  ))}
                </div>
              ) : (
                <div className="prose-editorial mt-6 max-w-measure">
                  {item.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ── entry ─────────────────────────────────────────────────────────────── */

export function LegalPageContent({ legal }: { legal: LegalRecord }) {
  const isImprint = legal.slug === 'imprint' || legal.centered;
  return isImprint ? <ImprintView legal={legal} /> : <PolicyView legal={legal} />;
}
