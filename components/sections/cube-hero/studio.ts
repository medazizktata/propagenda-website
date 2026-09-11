/**
 * One description of the room, used twice.
 *
 * The cubes are lit by, and reflect, a procedural environment map; the backdrop behind them is a
 * screen-space shader. If those two disagree the cubes read as objects pasted onto a colour, so
 * both are built from the constants below — the same warm key high on the right, the same cool
 * rake top-left, the same orange bounce off the floor the subject stands on. When the chamfer of
 * a cube catches a warm highlight, there is a reason for it two hundred pixels away in the
 * background.
 *
 * Values are linear-light multipliers, not sRGB: the key is meant to blow past 1.0.
 */
export const STUDIO = {
  /** Warm key, high and to the right. The bright band every chamfer catches. */
  key: { color: '#ffdcb4', intensity: 3.6 },
  /**
   * Cool rake from the upper left. Desaturated hard on purpose: a properly blue fill turned every
   * dormant face navy and put a second colour in a composition that is meant to run on charcoal
   * and one orange. It only has to be *cooler* than the key, not blue.
   */
  fill: { color: '#6d7f94', intensity: 0.6 },
  /** Orange bounce off the floor: the light the subject's own lit face is throwing. */
  bounce: { color: '#f58b27', intensity: 0.62 },
  /** A narrow bright strip behind the subject, for the back edges to pick up. */
  rim: { color: '#e9e7e4', intensity: 1.5 },
  /** The surround. Everything that is not a panel. */
  room: '#0a0a0c',

  /** Screen fraction where the cyclorama curves from wall to floor. */
  horizon: 0.27,
  wallTop: '#121216',
  wallBase: '#0d0d11',
  floorNear: '#040405',
  floorBase: '#0a0a0d',
} as const;
