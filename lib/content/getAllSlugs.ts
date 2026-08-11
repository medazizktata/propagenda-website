import { SERVICE_SLUGS, WORK_SLUGS } from '@/lib/constants/routes';

export function getServiceSlugs() {
  return [...SERVICE_SLUGS];
}

export function getWorkSlugs() {
  return [...WORK_SLUGS];
}
