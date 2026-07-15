import type { ReactNode } from 'react';
import { assertRouteAccess } from '@/lib/assertRouteAccess';

export default function BlogLayout({ children }: { children: ReactNode }) {
  assertRouteAccess('/blog');
  return children;
}
