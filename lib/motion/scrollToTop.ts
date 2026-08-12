import { gsap } from '@/lib/motion/gsap';

const PROXY = { y: 0 };

function suspendHero3d() {
  window.dispatchEvent(new Event('hero3d:suspend'));
}

function resumeHero3d() {
  window.dispatchEvent(new Event('hero3d:resume'));
}

/**
 * Smooth scroll to top. Suspends the hero WebGL loop for the duration so the
 * canvas doesn't restart mid-flight and hitch the main thread / GPU.
 */
export function scrollToTopSmooth(opts?: { instant?: boolean }) {
  gsap.killTweensOf(PROXY);

  if (opts?.instant || window.scrollY < 2) {
    window.scrollTo(0, 0);
    resumeHero3d();
    return;
  }

  suspendHero3d();
  PROXY.y = window.scrollY;
  // Distance-scaled — long pages don't feel rushed, short ones don't crawl.
  const duration = Math.min(2.35, Math.max(0.95, PROXY.y / 2200));

  gsap.to(PROXY, {
    y: 0,
    duration,
    ease: 'power3.inOut',
    overwrite: true,
    onUpdate: () => window.scrollTo(0, PROXY.y),
    onComplete: resumeHero3d,
    onInterrupt: resumeHero3d,
  });
}
