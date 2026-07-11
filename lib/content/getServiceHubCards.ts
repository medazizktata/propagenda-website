import { serviceHubCards } from '@/content/servicesHub';

export function getServiceHubCards() {
  return serviceHubCards.map((card, index) => ({
    index: index + 1,
    title: card.title,
    description: card.description,
    href: `/services/${card.slug}`,
    imageSrc: card.image,
    subBullets: card.subBullets,
  }));
}
