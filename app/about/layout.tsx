import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function AboutLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/about');
  return children;
}
