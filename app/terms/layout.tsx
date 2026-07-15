import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function TermsLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/terms');
  return children;
}
