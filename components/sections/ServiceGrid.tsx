'use client';

import { useRef } from 'react';
import { ServiceCard, type ServiceCardProps } from '@/components/ServiceCard';
import { useFadeUpOnEnter } from '@/hooks/useFadeUpOnEnter';

interface ServiceGridProps {
  services: ServiceCardProps[];
  columns?: 2 | 3 | 4;
}

const columnClasses: Record<NonNullable<ServiceGridProps['columns']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

export function ServiceGrid({ services, columns = 2 }: ServiceGridProps) {
  const ref = useRef<HTMLElement>(null);
  useFadeUpOnEnter(ref);

  return (
    <section ref={ref} className="px-gutter-m pb-24 lg:px-gutter-d">
      <div className={`grid grid-cols-1 gap-8 ${columnClasses[columns]}`}>
        {services.map((service) => (
          <ServiceCard key={service.href} {...service} />
        ))}
      </div>
    </section>
  );
}
