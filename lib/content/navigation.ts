import { footer, primaryNav, serviceNav } from '@/content/site';
import { isFeatureUnlocked, isPageUnlocked } from '@/lib/featureFlags';
import type { NavItem } from '@/types/navigation';

/** Primary nav — locked sections omitted. */
export function getPrimaryNavigation(): NavItem[] {
  return primaryNav.filter((item) => isFeatureUnlocked(item.href));
}

/** Service mega-menu — empty when services section is locked. */
export function getServiceNavigation(): NavItem[] {
  if (!isPageUnlocked('services')) return [];
  return serviceNav;
}

/** Footer legal links — locked section omitted. */
export function getLegalNavigation(): NavItem[] {
  return footer.legalLinks.filter((item) => isFeatureUnlocked(item.href));
}
