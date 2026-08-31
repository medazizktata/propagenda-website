type Props = { params: Promise<{ slug: string }> };

export default async function EditServicePage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Edit service</h1>
      <p className="font-mono text-sm text-neutral-400">{slug}</p>
      <p className="text-sm text-neutral-400">Edit form ships in Phase C1.</p>
    </div>
  );
}
