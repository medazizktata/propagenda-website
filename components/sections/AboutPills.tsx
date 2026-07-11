'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AboutPillsProps {
  onTellMeMore: () => void;
}

export function AboutPills({ onTellMeMore }: AboutPillsProps) {
  const [active, setActive] = useState<'go' | 'more' | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-4 px-gutter-m pb-16 lg:px-gutter-d">
      <Button
        variant={active === 'go' ? 'invert' : 'secondary'}
        href="/contact"
        onClick={() => setActive('go')}
      >
        Let&apos;s Go!
      </Button>
      <Button
        variant={active === 'more' ? 'invert' : 'secondary'}
        onClick={() => {
          setActive('more');
          onTellMeMore();
        }}
      >
        Tell Me More
      </Button>
    </div>
  );
}
