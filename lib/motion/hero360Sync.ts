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

/**
 * A smoothed, phase-locked follower for the 360° cycle, for 3D objects that should turn with the
 * mark without inheriting its snap.
 *
 * The mark's own curve is a steep ease-in-out — a whole turn inside roughly 28% of the cycle,
 * peaking at 530°/s at 60fps. That reads fine on a small glyph and snaps on a field of objects,
 * so this spreads the same rotation over a longer tail: each frame's increment is banked and
 * released exponentially.
 *
 * Total rotation is preserved — the follower lags rather than scaling, so each cycle still turns
 * exactly once and stays locked to the mark's phase.
 *
 * The default is chosen so the objects never fully stop. Simulated at 60fps across two settled
 * cycles, peak angular velocity and the fraction of frames still moving come out as:
 *
 *     5.0 → 425°/s, moving 38% of frames
 *     2.6 → 343°/s, moving 53%
 *     1.6 → 274°/s, moving 71%
 *     0.8 → 181°/s, moving 100%  ← default
 *
 * Below about 1.1 the bank never empties before the next cycle arrives, so the surge becomes a
 * continuous turn that merely speeds up in time with the mark. That is the point: a start and a
 * stop are what read as a snap, and at 0.8 there is neither.
 *
 * Returns the radians to add *this frame*. Callers add it to an existing rotation rather than
 * assigning it: these objects accumulate their own idle spin, and assigning an absolute angle
 * would discard that and snap every object to the same facing.
 */
export function createHero360Beat(smoothing = 0.8) {
  let last = hero360Radians();
  let banked = 0;

  return (dt: number, now = performance.now()): number => {
    const current = hero360Radians(now);
    let delta = current - last;
    // The cycle resets 2π → 0 rather than running on. Those are the same facing, so fold the
    // seam forward instead of letting it register as a backward whole turn.
    if (delta < -Math.PI) delta += Math.PI * 2;
    last = current;
    banked += delta;

    // dt of 0 is the reduced-motion frame: hold the bank, move nothing.
    if (dt <= 0) return 0;
    const release = banked * (1 - Math.exp(-smoothing * dt));
    banked -= release;
    return release;
  };
}
