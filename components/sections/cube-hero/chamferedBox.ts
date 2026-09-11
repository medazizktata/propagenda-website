import * as THREE from 'three';

import { ATLAS_COLS, ATLAS_ROWS, BLANK_SLOT } from './services';

/**
 * A flat-chamfered box, built by hand.
 *
 * A plain BoxGeometry edge is a perfect 90 degree corner, and a perfect corner catches no light —
 * it is a single line where two shading regions meet, so the object reads as a diagram of a cube
 * rather than a cube. Milled solids have a chamfer, and that chamfer is what carries the bright
 * line along every edge that tells you the thing has mass.
 *
 * RoundedBoxGeometry would have given a soft edge, but it also subdivides each face into a grid
 * and spreads one uv range across the flat part *and* the roll, which wrecks the per-face atlas
 * mapping this hero depends on. Building it here costs 96 vertices and 44 triangles and buys:
 *
 *  - exact, unshared per-face uv, so a face can be re-pointed at a different service by writing
 *    eight floats;
 *  - flat facets on the chamfer, which give a crisp specular band rather than a soft roll — this
 *    is a crisp object, not a pillow;
 *  - a real geometric silhouette, so MSAA anti-aliases the edges instead of leaving a shader-drawn
 *    highlight to alias on its own;
 *  - a per-vertex tangent frame, which the material uses to deboss the type into the face.
 *
 * There is a happy accident in the facet normals. A chamfer between two faces points halfway
 * between them, so its "facing" value is the average of theirs — which means the bevels around
 * whichever face has turned to camera go orange with it, and the lit face gets a mitred frame for
 * free, from geometry rather than from a texture.
 */

const HALF = 0.5;

interface FaceBasis {
  /** Outward normal. */
  n: readonly [number, number, number];
  /** Direction of increasing texture u, seen from outside. */
  u: readonly [number, number, number];
  /** Direction of increasing texture v. */
  v: readonly [number, number, number];
}

/**
 * Face order and uv orientation replicate THREE.BoxGeometry exactly (+X, -X, +Y, -Y, +Z, -Z, with
 * u running to the viewer's right and v upward on each face as seen from outside). Matching it
 * means the marquee's face-cycle indices stay true and the type reads upright on all six.
 */
const FACES: readonly FaceBasis[] = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
];

/**
 * Face uv is squeezed 3% inside its tile so the linear-mip filter cannot drag a neighbouring
 * tile's ink across a face edge.
 */
const TILE_INSET = 0.03;

function tileUv(slot: number, faceU: number, faceV: number): [number, number] {
  const col = slot % ATLAS_COLS;
  const rowFromTop = Math.floor(slot / ATLAS_COLS);
  const u = (col + TILE_INSET + faceU * (1 - 2 * TILE_INSET)) / ATLAS_COLS;
  // The atlas grid is indexed from the canvas's top-left but textures upload with flipY, so the
  // canvas row fraction has to be inverted on the way into v.
  const rowFraction = (rowFromTop + TILE_INSET + (1 - faceV) * (1 - 2 * TILE_INSET)) / ATLAS_ROWS;
  return [u, 1 - rowFraction];
}

/** Dead centre of the blank tile — where every chamfer facet samples, so its mask is always 0. */
const BLANK_UV = tileUv(BLANK_SLOT, 0.5, 0.5);

class Builder {
  readonly position: number[] = [];
  readonly normal: number[] = [];
  readonly uv: number[] = [];
  readonly tangent: number[] = [];
  readonly bitangent: number[] = [];
  readonly index: number[] = [];

  vertex(
    p: readonly number[],
    n: readonly number[],
    uv: readonly number[],
    t: readonly number[],
    b: readonly number[],
  ): number {
    const i = this.position.length / 3;
    this.position.push(p[0], p[1], p[2]);
    this.normal.push(n[0], n[1], n[2]);
    this.uv.push(uv[0], uv[1]);
    this.tangent.push(t[0], t[1], t[2]);
    this.bitangent.push(b[0], b[1], b[2]);
    return i;
  }
}

function scale(v: readonly [number, number, number], s: number): [number, number, number] {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function add(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): [number, number, number] {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function normalize(v: readonly [number, number, number]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function cross(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: readonly [number, number, number], b: readonly [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Emits a triangle fan over `points`, flipping the winding if it would face inward. Working out
 * the correct vertex order for twelve chamfer strips and eight corner triangles by hand is exactly
 * the sort of sign-juggling that produces one silently inverted facet; deriving it from the
 * intended normal cannot get it wrong.
 */
function facet(
  builder: Builder,
  points: ReadonlyArray<readonly [number, number, number]>,
  outward: readonly [number, number, number],
): void {
  const edge1: [number, number, number] = [
    points[1][0] - points[0][0],
    points[1][1] - points[0][1],
    points[1][2] - points[0][2],
  ];
  const edge2: [number, number, number] = [
    points[2][0] - points[0][0],
    points[2][1] - points[0][1],
    points[2][2] - points[0][2],
  ];
  const ordered = dot(cross(edge1, edge2), outward) >= 0 ? points : [...points].reverse();

  // Chamfer facets carry no print, so their tangent frame is never used; any orthogonal pair
  // keeps the attribute well-formed.
  const tangent = normalize(
    Math.abs(outward[1]) > 0.9 ? cross([0, 0, 1], outward) : cross([0, 1, 0], outward),
  );
  const bitangent = cross(outward, tangent);

  const base = ordered.map((p) => builder.vertex(p, outward, BLANK_UV, tangent, bitangent));
  for (let i = 1; i < base.length - 1; i += 1) {
    builder.index.push(base[0], base[i], base[i + 1]);
  }
}

/**
 * @param chamfer width of the bevel as a fraction of the unit cube's edge. 0.03 lands at roughly
 * twenty screen pixels on the hero cube at 1440px — wide enough to hold a clean highlight, narrow
 * enough that the object still reads as hard-edged.
 */
export function createChamferedBox(
  slots: readonly number[],
  chamfer = 0.03,
): THREE.BufferGeometry {
  const builder = new Builder();
  const inner = HALF - chamfer;

  // ── The six printed faces, first, so applyFaceSlots can address them as vertices 0..23 ──
  for (const face of FACES) {
    const centre = scale(face.n, HALF);
    const u = scale(face.u, inner);
    const v = scale(face.v, inner);
    const corners: Array<[readonly number[], [number, number]]> = [
      [add(add(centre, scale(u, -1)), v), [0, 1]],
      [add(add(centre, u), v), [1, 1]],
      [add(add(centre, scale(u, -1)), scale(v, -1)), [0, 0]],
      [add(add(centre, u), scale(v, -1)), [1, 0]],
    ];
    const base = builder.position.length / 3;
    for (const [p, faceUv] of corners) {
      builder.vertex(p, face.n, faceUv, face.u, face.v);
    }
    builder.index.push(base + 0, base + 2, base + 1, base + 2, base + 3, base + 1);
  }

  // ── Twelve chamfer strips ───────────────────────────────────────────────────────────────
  for (let axisA = 0; axisA < 3; axisA += 1) {
    for (let axisB = axisA + 1; axisB < 3; axisB += 1) {
      const axisFree = 3 - axisA - axisB;
      for (const signA of [-1, 1]) {
        for (const signB of [-1, 1]) {
          const outward: [number, number, number] = [0, 0, 0];
          outward[axisA] = signA;
          outward[axisB] = signB;
          const points = [-1, 1].flatMap((signFree) => {
            const onA: [number, number, number] = [0, 0, 0];
            onA[axisA] = signA * HALF;
            onA[axisB] = signB * inner;
            onA[axisFree] = signFree * inner;
            const onB: [number, number, number] = [0, 0, 0];
            onB[axisA] = signA * inner;
            onB[axisB] = signB * HALF;
            onB[axisFree] = signFree * inner;
            return signFree < 0 ? [onA, onB] : [onB, onA];
          });
          facet(builder, points, normalize(outward));
        }
      }
    }
  }

  // ── Eight corner triangles ──────────────────────────────────────────────────────────────
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        facet(
          builder,
          [
            [sx * HALF, sy * inner, sz * inner],
            [sx * inner, sy * HALF, sz * inner],
            [sx * inner, sy * inner, sz * HALF],
          ],
          normalize([sx, sy, sz]),
        );
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(builder.position, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(builder.normal, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(builder.uv, 2));
  // The material debosses the type by sampling the mask's gradient; doing that in texture space
  // rather than from screen-space derivatives needs the face's own uv axes on hand.
  geometry.setAttribute('aTangent', new THREE.Float32BufferAttribute(builder.tangent, 3));
  geometry.setAttribute('aBitangent', new THREE.Float32BufferAttribute(builder.bitangent, 3));
  geometry.setIndex(builder.index);
  applyFaceSlots(geometry, slots);
  return geometry;
}

/**
 * Points each of the six printed faces at an atlas tile by rewriting its uv. Cheap enough to call
 * on a beat: 48 floats and one small buffer re-upload, versus redrawing a canvas or swapping a
 * texture. The face being repainted is always the one at the back of the cube, so the change is
 * culled before anyone could see it happen.
 */
export function applyFaceSlots(geometry: THREE.BufferGeometry, slots: readonly number[]): void {
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute;
  const corners: ReadonlyArray<[number, number]> = [
    [0, 1],
    [1, 1],
    [0, 0],
    [1, 0],
  ];
  for (let face = 0; face < 6; face += 1) {
    for (let corner = 0; corner < 4; corner += 1) {
      const [u, v] = tileUv(slots[face], corners[corner][0], corners[corner][1]);
      uv.setXY(face * 4 + corner, u, v);
    }
  }
  uv.needsUpdate = true;
}
