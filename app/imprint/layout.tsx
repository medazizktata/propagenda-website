import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function ImprintLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/imprint');
  return children;
}
