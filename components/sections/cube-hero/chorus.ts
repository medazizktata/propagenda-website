/**
 * The supporting cast.
 *
 * Eight cubes, hand-placed, no random seed. They exist for one reason — a single cube in a void
 * has no size — so they are kept sparse, pushed well behind the subject, and left deep enough in
 * the fog that they read as depth rather than as seven more things to read. An earlier pass put
 * fifteen of them in frame, several close enough to the lens to be legible, and the hero turned
 * into a crowd with no focal point.
 *
 * Nothing sits in front of the subject and nothing sits in the left half of the frame, which is
 * where the headline lives. Each turns on exactly one axis: tumbling on three is what makes a
 * field like this read as procedural noise; one axis each, at rates that never divide evenly,
 * reads as a mechanism. They all turn about their own vertical, too: a cube tumbling on its X
 * axis passes through upside down, and a face of inverted type reads as a bug rather than depth.
 */

export interface ChorusSpec {
  /** Position in the group's local space; the protagonist is at the origin, camera at +Z. */
  pos: readonly [number, number, number];
  /**
   * Where this cube goes in a portrait frame — and it is given as a *fraction of what the camera
   * can see at its own depth*, not in world units.
   *
   * That distinction is the whole point. Visible width at a given depth is `tan(fov/2) * depth *
   * aspect`, so a phone at 0.46 aspect sees less than a third of the width a 1440 frame does at
   * the same distance. A cube pinned to a world x that reads as "just left of the subject" on a
   * desktop is simply never in shot on a phone — nothing errors, it is just gone. Expressed as a
   * fraction, -0.55 means "55% of the way to the left edge" and means that at every aspect.
   *
   * A portrait frame also has no horizontal room left beside the subject, which already spans
   * three quarters of the width, so these are stacked above and below it rather than beside.
   */
  portrait?: {
    /** -1 is the left edge of the frame at this cube's depth, +1 the right. */
    fx: number;
    fy: number;
    z: number;
    /** Portrait override: fewer cubes, so each is allowed to be bigger. */
    scale: number;
  };
  scale: number;
  /** Fixed attitude. The spin is layered on top of this, about the cube's own vertical. */
  tilt: readonly [number, number, number];
  /** rad/s. 0.09-0.22 puts a full turn between 28 and 70 seconds. */
  rate: number;
  /** Drift amplitude in world units, and how fast it breathes. */
  drift: number;
  driftRate: number;
  phase: number;
  /** Which atlas tile lands on face 0; the rest follow in sequence around the 8-tile atlas. */
  slotOffset: number;
  /** Viewport width at which this cube starts existing. Phones get three. */
  minWidth: number;
}

export const CHORUS: readonly ChorusSpec[] = [
  // Mid ground — close enough to give the subject its scale, far enough to stay unreadable.
  {
    pos: [-2.05, 1.05, -1.9],
    portrait: { fx: -0.52, fy: 0.78, z: -2.9, scale: 0.4 },
    scale: 0.36,
    tilt: [-0.18, 0.45, -0.06],
    rate: 0.155,
    drift: 0.12,
    driftRate: 0.31,
    phase: 1.1,
    slotOffset: 2,
    minWidth: 0,
  },
  {
    pos: [1.8, 1.6, -2.5],
    scale: 0.27,
    tilt: [0.32, -0.2, 0.12],
    rate: 0.19,
    drift: 0.1,
    driftRate: 0.27,
    phase: 2.6,
    slotOffset: 6,
    minWidth: 768,
  },
  {
    pos: [-1.42, -1.45, -2.2],
    portrait: { fx: 0.5, fy: 0.78, z: -4.6, scale: 0.46 },
    scale: 0.3,
    tilt: [0.12, 0.9, 0],
    rate: 0.12,
    drift: 0.09,
    driftRate: 0.35,
    phase: 4.2,
    slotOffset: 0,
    minWidth: 0,
  },
  // Deep field — these are silhouettes, not content.
  {
    pos: [2.65, -1.0, -4.3],
    scale: 0.38,
    tilt: [0.2, 0.68, -0.09],
    rate: 0.09,
    drift: 0.15,
    driftRate: 0.25,
    phase: 0.2,
    slotOffset: 3,
    minWidth: 768,
  },
  {
    pos: [-3.05, -0.4, -5.1],
    scale: 0.34,
    tilt: [0.4, -0.75, -0.14],
    rate: 0.22,
    drift: 0.14,
    driftRate: 0.22,
    phase: 3.4,
    slotOffset: 1,
    minWidth: 1024,
  },
  {
    pos: [0.62, 2.5, -5.7],
    portrait: { fx: -0.3, fy: -0.22, z: -2.3, scale: 0.3 },
    scale: 0.3,
    tilt: [-0.1, -0.85, 0.11],
    rate: 0.2,
    drift: 0.12,
    driftRate: 0.23,
    phase: 5.6,
    slotOffset: 5,
    minWidth: 0,
  },
  {
    pos: [3.55, 1.4, -7.3],
    scale: 0.44,
    tilt: [0.15, -0.5, -0.2],
    rate: 0.115,
    drift: 0.2,
    driftRate: 0.15,
    phase: 1.8,
    slotOffset: 4,
    minWidth: 1024,
  },
  {
    pos: [-2.25, 2.35, -8.1],
    scale: 0.4,
    tilt: [0.36, 0.6, -0.05],
    rate: 0.105,
    drift: 0.22,
    driftRate: 0.14,
    phase: 2.9,
    slotOffset: 7,
    minWidth: 1024,
  },
];
