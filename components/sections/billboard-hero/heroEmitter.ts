/**
 * Where the near layer's brightest lit face currently is, published for the base scene to read.
 *
 * The two canvases are separate WebGL contexts, so they cannot share a light — a light is GPU
 * state belonging to one renderer. But the base scene does not need the near layer's light, only
 * its *position*, because what it does with it is arithmetic: given a caster and a receiver, the
 * position of a light in front of the caster determines where the shadow lands and how big it
 * grows. That is a projection, not a rendering.
 *
 * Coordinates are directly comparable across the two scenes because both use the same camera —
 * 38° at the same aspect, sitting at z +6. If either camera changes, this stops being valid.
 */
export type HeroEmitter = {
  /** World position of the emitting face. */
  x: number;
  y: number;
  z: number;
  /** 0–1. Fades the emitter's influence in and out rather than switching it. */
  strength: number;
};

let current: HeroEmitter | null = null;

export function setHeroEmitter(emitter: HeroEmitter | null) {
  current = emitter;
}

export function getHeroEmitter(): HeroEmitter | null {
  return current;
}
