interface StubPageProps {
  title: string;
  description?: string;
}

export function StubPage({ title, description }: StubPageProps) {
  return (
    <section className="px-gutter-m py-24 lg:px-gutter-d">
      <p className="text-sm uppercase tracking-wide text-muted">Stub route</p>
      <h1 className="mt-4 font-bold uppercase text-display-xs">{title}</h1>
      {description ? <p className="mt-4 max-w-prose-fixed text-muted">{description}</p> : null}
    </section>
  );
}
