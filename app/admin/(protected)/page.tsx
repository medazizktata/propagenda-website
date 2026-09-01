import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminSection';

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Manage services, case studies, and video work from the sidebar."
      />

      <div className="divide-y divide-white/10">
        <QuickLink href="/admin/services" title="Services" detail="Browse and manage service pages" />
      </div>
    </div>
  );
}

function QuickLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <Link
      href={href}
      className="group block py-4 transition-colors first:pt-0 hover:text-orange"
    >
      <p className="font-medium text-white group-hover:text-orange">{title}</p>
      <p className="mt-1 text-sm text-white/65">{detail}</p>
    </Link>
  );
}
