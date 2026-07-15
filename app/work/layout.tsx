import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function WorkLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/work');
  return children;
}
