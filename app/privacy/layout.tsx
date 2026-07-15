import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/privacy');
  return children;
}
