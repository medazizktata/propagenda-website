import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function ContactLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/contact');
  return children;
}
