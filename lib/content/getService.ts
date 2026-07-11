import { servicesBySlug } from '@/content/services';
import type { ServiceRecord, ServiceSlug } from '@/types/content';

export function getService(slug: ServiceSlug): ServiceRecord | undefined {
  return servicesBySlug[slug];
}

export function getAllServices(): ServiceRecord[] {
  return Object.values(servicesBySlug);
}
