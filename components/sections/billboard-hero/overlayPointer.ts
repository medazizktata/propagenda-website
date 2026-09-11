import type { HeroScene } from './types';

/**
 * The hero stacks two canvases with the type lockup between them, which means two WebGL
 * contexts but only one of them can own pointer input: the overlay sits on top and would
 * otherwise swallow every event meant for the field underneath.
 *
 * So the overlay is `pointer-events: none` and the base canvas receives everything, then asks
 * here whether the overlay wants the hit first. Both canvases are `absolute inset-0` at the same
 * size with matching cameras, so a normalised coordinate computed against one is valid for the
 * other — that equivalence is what lets the base host hit-test a scene it does not own.
 *
 * A single slot rather than a list: there is one overlay, and silently stacking more would make
 * hit-test order depend on mount order, which is not something a caller can reason about.
 */
export type OverlayPointerTarget = Pick<
  HeroScene,
  'pointerMove' | 'pointerDown' | 'pointerDrag' | 'pointerUp'
> & {
  /** Draw one overlay frame. Only needed when the overlay's loop is not running. */
  requestDraw: () => void;
};

let current: OverlayPointerTarget | null = null;

export function setOverlayPointerTarget(target: OverlayPointerTarget) {
  current = target;
}

/**
 * Pass the target being torn down rather than clearing blindly. React StrictMode remounts
 * effects, so a newer overlay can register before the older one's cleanup runs; clearing
 * unconditionally would drop the live target and leave the overlay permanently unhittable.
 */
export function clearOverlayPointerTarget(target: OverlayPointerTarget) {
  if (current === target) current = null;
}

export function getOverlayPointerTarget(): OverlayPointerTarget | null {
  return current;
}
