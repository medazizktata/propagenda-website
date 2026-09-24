/**
 * One description of the room, used twice.
 *
 * The cubes are lit by, and reflect, a procedural environment map; the backdrop behind them is a
 * screen-space shader. If those two disagree the cubes read as objects pasted onto a colour, so
 * both are built from the constants below — the same warm key high on the right, the same cool
 * rake top-left, the same floor bounce under the subject. When the chamfer of a cube catches a
 * warm highlight, there is a reason for it two hundred pixels away in the background.
 *
 * Values are linear-light multipliers, not sRGB: the key is meant to blow past 1.0.
 */
export const STUDIO = {
  /** Warm key, high and to the right. The bright band every chamfer catches. */
  key: { color: '#ffdcb4', intensity: 3.6 },
  /**
   * Cool rake from the upper left. Desaturated hard on purpose: a properly blue fill turned every
   * dormant face navy and put a second saturated colour into a composition that is meant to run
   * on charcoal and warm neutrals. It only has to be *cooler* than the key, not blue.
   */
  // Raised from 0.6: the shadow side read too dark/contrasty against the key. This single number
  // now drives both the fill's own directional light and the fill panel baked into the IBL (see
  // cubeScene.ts and studioEnvironment.ts) — one turn of this dial lifts the whole shadow side,
  // in the direct light and in what the chamfers reflect, together.
  fill: { color: '#6d7f94', intensity: 1.05 },
  /**
   * Bounce off the floor the subject stands on. Used to be brand orange — throwing the light the
   * subject's own lit face was casting — but the face no longer turns orange, so a colour with no
   * source in the scene stayed lit for no visible reason. A warm, near-neutral stone keeps the
   * floor-bounce cue (the pool of light and the IBL panel it shares this constant with both read
   * as "something warm is bouncing off the ground here") without implying a light nobody casts.
   */
  bounce: { color: '#a99884', intensity: 0.62 },
  /** A narrow bright strip behind the subject, for the back edges to pick up. */
  rim: { color: '#e9e7e4', intensity: 1.5 },
  /** The surround. Everything that is not a panel. */
  room: '#0a0a0c',

  /** Screen fraction where the cyclorama curves from wall to floor. */
  horizon: 0.27,
  wallTop: '#262523',
  wallBase: '#1c1b1a',
  floorNear: '#0e0d0c',
  floorBase: '#171615',
} as const;
