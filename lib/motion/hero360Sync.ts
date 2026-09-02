/** Shared hero "360°" spin — matches tailwind `hero360Spin` timing. */
export const HERO_360_CYCLE_S = 7;
export const HERO_360_HOLD_RATIO = 0.72;
const HERO_360_EASE = { x1: 0.65, y1: 0, x2: 0.35, y2: 1 };

function bezierPoint(t: number, a: number, b: number, c: number, d: number) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

function cubicBezierY(p: number, x1: number, y1: number, x2: number, y2: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    if (bezierPoint(mid, 0, x1, x2, 1) < p) lo = mid;
    else hi = mid;
  }
  const t = (lo + hi) / 2;
  return bezierPoint(t, 0, y1, y2, 1);
}

/** Clockwise spin progress for the subtitle mark (0–360). */
export function hero360Degrees(now = performance.now()): number {
  const cycle = (now / 1000 % HERO_360_CYCLE_S) / HERO_360_CYCLE_S;
  if (cycle < HERO_360_HOLD_RATIO) return 0;
  const p = (cycle - HERO_360_HOLD_RATIO) / (1 - HERO_360_HOLD_RATIO);
  return cubicBezierY(p, HERO_360_EASE.x1, HERO_360_EASE.y1, HERO_360_EASE.x2, HERO_360_EASE.y2) * 360;
}

/** Same cycle for the 3D monogram Y axis (clockwise on screen). */
export function hero360Radians(now = performance.now()): number {
  return (hero360Degrees(now) * Math.PI) / 180;
}
