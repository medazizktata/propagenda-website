/**
 * The seven disciplines that ride the cube faces.
 *
 * The list is the content of the hero — the cube is just the display device — so it lives
 * on its own, free of any three.js import, and is consumed by both the DOM layer (where it
 * is the real, crawlable, screen-reader-readable text) and the texture atlas.
 */

export interface CubeService {
  readonly name: string;
}

/**
 * Order matters — it is the order the cube turns through and the order a screen reader gets —
 * but the list is deliberately unnumbered. Numbering it would invite a counter in the interface,
 * and a counter turns a continuous sculpture into a slideshow.
 */
export const CUBE_SERVICES: readonly CubeService[] = [
  { name: 'Branding' },
  { name: 'Public Relations' },
  { name: 'Online & Offline Marketing' },
  { name: 'Websites' },
  { name: 'Mobile Applications' },
  { name: 'Events' },
  { name: 'Photography & Videography' },
];

/**
 * Atlas slot holding a blank tile, used by the cube's top and bottom faces.
 *
 * They started out carrying the wordmark. At the +11deg rake the top face is compressed to a
 * few dozen pixels, and the type collapsed into a bright band across the crown of the cube that
 * competed with the face actually being read. Two plain panels give the eye somewhere to rest
 * and let the object read as a milled solid rather than six printed decals.
 */
export const BLANK_SLOT = CUBE_SERVICES.length;

export const ATLAS_COLS = 4;
export const ATLAS_ROWS = 2;

/**
 * BoxGeometry emits its six face groups in the order +X, -X, +Y, -Y, +Z, -Z.
 * Only the four side faces take part in the marquee; +Y and -Y carry the wordmark.
 */
export const FACE_PX = 0;
export const FACE_NX = 1;
export const FACE_PY = 2;
export const FACE_NY = 3;
export const FACE_PZ = 4;
export const FACE_NZ = 5;

/**
 * Which side face arrives at the front after each successive -90deg yaw.
 * Ry(-90deg) carries +X round to +Z, so the front cycles +Z -> +X -> -Z -> -X.
 */
export const FRONT_FACE_CYCLE = [FACE_PZ, FACE_PX, FACE_NZ, FACE_NX] as const;
