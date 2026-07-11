import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { BodyText } from '@/components/ui/BodyText';
import type { BrandingTier } from '@/types/content';

interface TierTableProps {
  tiers: BrandingTier[];
}

export function TierTable({ tiers }: TierTableProps) {
  return (
    <section className="px-gutter-m pb-16 lg:px-gutter-d">
      <DisplayHeading as="h2" size="display-xs" className="mb-8 text-2xl">
        Branding Packages
      </DisplayHeading>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[320px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-navy/60">
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Includes</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.name} className="border-b border-border last:border-b-0">
                <td className="px-6 py-5 align-top font-bold uppercase text-orange">{tier.name}</td>
                <td className="px-6 py-5 align-top">
                  <ul className="space-y-2">
                    {tier.items.map((item) => (
                      <li key={item}>
                        <BodyText as="span" size="text-sm">
                          {item}
                        </BodyText>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
