// What Propagenda shoots — an editorial divided list (no cards).
export function VideoCapabilities({ items }: { items: { label: string; blurb: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="relative px-gutter-m py-16 lg:px-gutter-d lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2
          className="font-sans font-bold uppercase leading-[0.95] tracking-display text-white"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 3.1rem)' }}
        >
          What we shoot<span className="text-orange">.</span>
        </h2>
        <ul className="mt-10 grid border-t border-white/12 sm:grid-cols-2">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={
                'group/cap flex items-start gap-5 border-b border-white/10 py-7 transition-colors duration-300 hover-fine:hover:bg-white/[0.03] sm:px-6 sm:odd:border-r sm:odd:border-r-white/10' +
                (i === 0 ? '' : '')
              }
            >
              <span className="pt-1 font-sans text-sm font-bold tabular-nums text-orange">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3
                  className="font-sans font-bold tracking-tight text-white transition-transform duration-300 group-hover/cap:translate-x-1"
                  style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.6rem)' }}
                >
                  {item.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55 md:text-base">
                  {item.blurb}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
