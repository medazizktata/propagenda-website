'use client';

import type { ReactNode } from 'react';

/** Shared charcoal field for the first home acts. Patterns live inside each section. */
export function SeamlessActs({ children }: { children: ReactNode }) {
  return <div className="relative bg-charcoal">{children}</div>;
}
