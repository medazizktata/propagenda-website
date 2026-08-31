import { usesDatabaseContent } from '@/lib/cms/config';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export default function AdminHomePage() {
  const supabaseReady = isSupabaseConfigured();
  const databaseContent = usesDatabaseContent();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Content editors for services, case studies, and video work ship next.
        </p>
      </div>

      <dl className="divide-y divide-neutral-800 rounded-lg border border-neutral-800">
        <StatusRow label="Supabase env" ok={supabaseReady} />
        <StatusRow label="Database content" ok={databaseContent} />
        <StatusRow label="Auth" ok detail="active" />
        <StatusRow label="Revalidate route" ok detail="/api/revalidate" />
      </dl>

      <div className="grid gap-3 sm:grid-cols-2">
        <QuickLink href="/admin/services" title="Services" detail="List, filter, bulk actions" />
      </div>

      {!supabaseReady && (
        <p className="text-sm text-neutral-400">
          Regenerate SQL with <code className="text-orange-300">pnpm seed:sql</code>, then{' '}
          <code className="text-orange-300">supabase db reset</code>.
        </p>
      )}
    </div>
  );
}

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok?: boolean;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <dt className="text-neutral-300">{label}</dt>
      <dd className="font-mono text-xs text-neutral-500">
        {detail ?? (ok ? 'ready' : 'pending')}
      </dd>
    </div>
  );
}

function QuickLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <a
      href={href}
      className="rounded-lg border border-neutral-800 px-4 py-3 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
    >
      <p className="font-medium text-neutral-100">{title}</p>
      <p className="mt-1 text-xs text-neutral-500">{detail}</p>
    </a>
  );
}
