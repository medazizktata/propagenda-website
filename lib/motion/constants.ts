export const MOTION = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    cinematic: 5,
  },
  ease: {
    default: 'power2.out',
    out: 'power1.out',
    spring: 'power3.out',
  },
} as const;
