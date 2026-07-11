import { gsap } from '@/lib/motion/gsap';

export function playInitLoaderExit(container: HTMLElement, onComplete: () => void) {
  gsap.to(container, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
    onComplete,
  });
}
