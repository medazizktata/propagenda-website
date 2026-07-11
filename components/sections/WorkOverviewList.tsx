'use client';

import { useRef } from 'react';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { WorkCard } from '@/components/sections/WorkCard';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';
import type { WorkHubEntry } from '@/content/workHub';
import { cn } from '@/components/ui/cn';

interface WorkOverviewListProps {
  id: 'featured' | 'more';
  title: string;
  entries: WorkHubEntry[];
}

export function WorkOverviewList({ id, title, entries }: WorkOverviewListProps) {
  const ref = useRef<HTMLElement>(null);
  useFadeUpOnEnter(ref, '.work-overview-entry');

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        'px-gutter-m lg:px-gutter-d',
        id === 'featured' ? 'pb-16 pt-12' : 'pb-[20vh] pt-[20vh]',
      )}
    >
      <DisplayHeading as="h2" size="display-xs" className="mb-10 text-orange">
        {title}
      </DisplayHeading>
      <div className="flex flex-col gap-8">
        {entries.map((entry) => (
          <div key={entry.href} className="work-overview-entry">
            <WorkCard {...entry} />
          </div>
        ))}
      </div>
    </section>
  );
}
