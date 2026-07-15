import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function ServicesLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/services');
  return children;
}
