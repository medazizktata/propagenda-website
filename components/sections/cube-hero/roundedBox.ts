import * as THREE from 'three';

/**
 * A rounded box, built by hand.
 *
 * A plain BoxGeometry edge is a perfect 90 degree corner, and a perfect corner catches no light —
 * it is a single line where two shading regions meet, so the object reads as a diagram of a cube
 * rather than a cube. Milled solids have a radius on every edge, and that radius is what carries
 * the bright line that tells you the thing has mass.
 *
 * This started as a single flat chamfer facet per edge: 96 vertices, 44 triangles, one crisp
 * highlight line. The trouble with one facet is that it has one normal, so the highlight does not
 * move — it switches on when the facet swings past the key and off again a few degrees later. A
 * real radius rolls it. That is the whole reason this file now spends ~2.4k vertices instead of
 * 96: not detail, but a normal that varies continuously where the light is brightest.
 *
 * ## Construction
 *
 * Each of the six faces carries a grid that runs the full width of the box, and every grid point
 * is pushed onto the rounded surface by the same map:
 *
 *     core = clamp(p, -inner, +inner)        // nearest point on the shrunken inner box
 *     surface = core + radius * normalize(p - core)
 *
 * That one expression produces all three regions — flat panel, quarter-round edge, spherical
 * corner — and, because it is a continuous function of the un-rounded point, the three grids that
 * meet at every corner land on identical positions. No seam bookkeeping, no T-junctions, no
 * cracks for MSAA to find.
 *
 * The grid is *not* evenly spaced. Inside the panel it is uniform; across the roll it steps in
 * equal angle (`inner + radius * tan(theta)` inverts the map above), so each of the 2 * edge
 * segments facets on a 90 degree arc subtends the same few degrees and the specular band crosses
 * them at a constant rate. Even spacing there would bunch facets at the ends of the arc and
 * stretch them through the middle, which is exactly where the highlight sits.
 *
 * ## Why not RoundedBoxGeometry
 *
 * Same reason as before: it spreads one uv range across the flat panel *and* the roll, which
 * wrecks the per-face atlas mapping this hero depends on. Here the flat panel and the roll are
 * separate vertex runs — they share positions along their common edge but carry different uv —
 * so a face's print stops dead at the tangent line and never smears around the corner.
 *
 * ## What the shader gets
 *
 *  - `uv` is *face-local* (0..1 across the panel), not an atlas coordinate. The tile lookup is a
 *    dozen instructions in the vertex shader, which is what lets one geometry serve the
 *    protagonist and every instance in the chorus while each shows different services.
 *  - `aFaceIndex` is 0..5 on a printed panel and NO_PRINT on the roll.
 *  - `aFaceNormal` is the *panel's* nominal normal, not the shading normal. The material colours
 *    a face by how squarely it is turned to camera, and that has to be constant across a panel or
 *    the orange vignettes toward its own corners — so the crown below must not reach it. On the
 *    roll the two are the same vector, which is what rolls the lit face's colour over the edge.
 *  - `aTangent` is the panel's u axis; the material crosses it with the face normal to deboss the
 *    type in texture space.
 */

/** `aFaceIndex` for a vertex that carries no print: the roll and the corners. */
export const NO_PRINT_FACE = 6;

export interface RoundedBoxOptions {
  /**
   * Edge radius as a fraction of the unit cube's edge. 0.03 lands at roughly twenty device pixels
   * on the hero cube at 1440px — wide enough to hold a rolling highlight, narrow enough that the
   * object still reads as hard-edged rather than as a pillow. Deliberately the same width the
   * flat chamfer used, so the silhouette and the proportions are unchanged; only the shading of
   * the edge is different.
   */
  radius: number;
  /**
   * Quads across *half* the roll, so a full edge gets 2x this. 5 puts a facet every 9 degrees,
   * about two device pixels on the hero cube — below the point where a clearcoat lobe sliding
   * along the arc shows a step. Three is plenty for the chorus, where the whole roll is ~3px.
   */
  edgeSegments: number;
  /**
   * Quads per axis across the printed panel. These exist only to carry the crown: at 8 the
   * interpolated normal is within about a third of a degree of the true one, which is well under
   * the crown's own 2.5 degree range.
   */
  faceSegments: number;
  /**
   * Peak height of the panel's crown, in unit-cube fractions. A dead flat panel switches its
   * highlight on and off across the whole face at once; a crown makes the reflection *travel*.
   *
   * The profile is quartic — (1-u^2)^2 (1-v^2)^2 — rather than a plain dome, because a quartic
   * also has zero slope at the panel edge. That makes it tangent to the roll, so there is no
   * shading crease where the two meet, and it puts the steepest part of the dome at 58% out from
   * the centre, across the middle of the face where the type is.
   *
   * 0.013 works out to a maximum normal tilt of ~2.5 degrees (so the reflection sweeps ~5) and a
   * bulge about four and a half CSS pixels tall on the hero cube — invisible as a shape, plainly
   * visible as a moving highlight. Past that it starts reading as inflated rather than machined.
   */
  crown: number;
}

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
 *
 * Every basis here is right-handed with u x v == n, which the material relies on: it is handed
 * only the tangent and reconstructs the bitangent from the cross product rather than paying for a
 * third attribute.
 */
const FACES: readonly FaceBasis[] = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
];

type Vec3 = [number, number, number];

function clamp(value: number, limit: number): number {
  return Math.min(limit, Math.max(-limit, value));
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function dot(a: readonly number[], b: readonly number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: readonly number[], b: readonly number[]): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/**
 * Coordinates of one grid line along one axis of a face, from -HALF to +HALF.
 *
 * Uniform through the panel; `inner + radius * tan(theta)` through each roll, which is the inverse
 * of the rounding map and therefore lands the surface points at equal angular steps.
 */
function axisGrid(inner: number, radius: number, faceSegments: number, edgeSegments: number): number[] {
  const grid: number[] = [];
  for (let k = 0; k <= edgeSegments; k += 1) {
    const theta = ((edgeSegments - k) / edgeSegments) * (Math.PI / 4);
    grid.push(-(inner + radius * Math.tan(theta)));
  }
  for (let k = 1; k <= faceSegments; k += 1) {
    grid.push(-inner + (2 * inner * k) / faceSegments);
  }
  for (let k = 1; k <= edgeSegments; k += 1) {
    const theta = (k / edgeSegments) * (Math.PI / 4);
    grid.push(inner + radius * Math.tan(theta));
  }
  return grid;
}

class Builder {
  readonly position: number[] = [];
  readonly normal: number[] = [];
  readonly uv: number[] = [];
  readonly tangent: number[] = [];
  readonly faceNormal: number[] = [];
  readonly faceIndex: number[] = [];
  readonly index: number[] = [];

  vertex(
    p: readonly number[],
    n: readonly number[],
    uv: readonly number[],
    tangent: readonly number[],
    faceNormal: readonly number[],
    faceIndex: number,
  ): number {
    const i = this.faceIndex.length;
    this.position.push(p[0], p[1], p[2]);
    this.normal.push(n[0], n[1], n[2]);
    this.uv.push(uv[0], uv[1]);
    this.tangent.push(tangent[0], tangent[1], tangent[2]);
    this.faceNormal.push(faceNormal[0], faceNormal[1], faceNormal[2]);
    this.faceIndex.push(faceIndex);
    return i;
  }

  /** Two triangles, wound counter-clockwise as seen from outside given u x v == n. */
  quad(i00: number, i10: number, i11: number, i01: number): void {
    this.index.push(i00, i10, i11, i00, i11, i01);
  }
}

export function createRoundedBox(options: RoundedBoxOptions): THREE.BufferGeometry {
  const { radius, edgeSegments, faceSegments, crown } = options;
  const inner = HALF - radius;
  const grid = axisGrid(inner, radius, faceSegments, edgeSegments);
  const last = grid.length - 1;
  /** Grid indices of the panel's two tangent lines: everything between them is flat. */
  const flatLo = edgeSegments;
  const flatHi = edgeSegments + faceSegments;

  const builder = new Builder();

  for (let faceIndex = 0; faceIndex < FACES.length; faceIndex += 1) {
    const face = FACES[faceIndex];
    const n = face.n;
    const u = face.u;
    const v = face.v;

    // ── The printed panel ─────────────────────────────────────────────────────────────────
    // Its own vertex run, even though it shares the tangent line with the roll below, because
    // the two carry different uv. Emitted first and contiguously so the flat block of a face is
    // easy to reason about when reading a capture.
    const panel: number[] = [];
    for (let b = 0; b <= faceSegments; b += 1) {
      for (let a = 0; a <= faceSegments; a += 1) {
        const su = (a / faceSegments) * 2 - 1;
        const sv = (b / faceSegments) * 2 - 1;
        const fu = 1 - su * su;
        const fv = 1 - sv * sv;
        const height = crown * fu * fu * fv * fv;
        // Analytic gradient of the crown, in world units: d/dx == d/du / inner.
        const slopeU = (crown * -4 * su * fu * (fv * fv)) / inner;
        const slopeV = (crown * -4 * sv * fv * (fu * fu)) / inner;

        const x = su * inner;
        const y = sv * inner;
        const position: Vec3 = [
          n[0] * (HALF + height) + u[0] * x + v[0] * y,
          n[1] * (HALF + height) + u[1] * x + v[1] * y,
          n[2] * (HALF + height) + u[2] * x + v[2] * y,
        ];
        const normal = normalize([
          n[0] - u[0] * slopeU - v[0] * slopeV,
          n[1] - u[1] * slopeU - v[1] * slopeV,
          n[2] - u[2] * slopeU - v[2] * slopeV,
        ]);
        panel.push(
          builder.vertex(position, normal, [a / faceSegments, b / faceSegments], u, n, faceIndex),
        );
      }
    }
    const stride = faceSegments + 1;
    for (let b = 0; b < faceSegments; b += 1) {
      for (let a = 0; a < faceSegments; a += 1) {
        builder.quad(
          panel[b * stride + a],
          panel[b * stride + a + 1],
          panel[(b + 1) * stride + a + 1],
          panel[(b + 1) * stride + a],
        );
      }
    }

    // ── The roll ──────────────────────────────────────────────────────────────────────────
    // Every quad of the face's full grid that is not inside the panel. Vertices are minted on
    // first use, so the panel's interior points are never duplicated into this run.
    const rolled = new Map<number, number>();
    const rollVertex = (a: number, b: number): number => {
      const key = a * (last + 1) + b;
      const existing = rolled.get(key);
      if (existing !== undefined) return existing;

      const x = grid[a];
      const y = grid[b];
      const p: Vec3 = [
        n[0] * HALF + u[0] * x + v[0] * y,
        n[1] * HALF + u[1] * x + v[1] * y,
        n[2] * HALF + u[2] * x + v[2] * y,
      ];
      const core: Vec3 = [clamp(p[0], inner), clamp(p[1], inner), clamp(p[2], inner)];
      const out = normalize([p[0] - core[0], p[1] - core[1], p[2] - core[2]]);
      const position: Vec3 = [
        core[0] + out[0] * radius,
        core[1] + out[1] * radius,
        core[2] + out[2] * radius,
      ];
      // The roll never tilts more than 54.7 degrees off its own face (that is the corner, where
      // all three axes contribute equally), so the panel's u axis is never parallel to the
      // surface normal and Gram-Schmidt against it cannot degenerate.
      const along = dot(out, u);
      const tangent = normalize([u[0] - out[0] * along, u[1] - out[1] * along, u[2] - out[2] * along]);
      // Dead centre of the tile, so whichever slot the shader resolves for NO_PRINT_FACE is
      // sampled well away from its neighbours.
      const id = builder.vertex(position, out, [0.5, 0.5], tangent, out, NO_PRINT_FACE);
      rolled.set(key, id);
      return id;
    };

    for (let b = 0; b < last; b += 1) {
      for (let a = 0; a < last; a += 1) {
        const insidePanel = a >= flatLo && a < flatHi && b >= flatLo && b < flatHi;
        if (insidePanel) continue;
        builder.quad(
          rollVertex(a, b),
          rollVertex(a + 1, b),
          rollVertex(a + 1, b + 1),
          rollVertex(a, b + 1),
        );
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(builder.position, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(builder.normal, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(builder.uv, 2));
  geometry.setAttribute('aTangent', new THREE.Float32BufferAttribute(builder.tangent, 3));
  geometry.setAttribute('aFaceNormal', new THREE.Float32BufferAttribute(builder.faceNormal, 3));
  geometry.setAttribute('aFaceIndex', new THREE.Float32BufferAttribute(builder.faceIndex, 1));
  geometry.setIndex(builder.index);
  geometry.computeBoundingSphere();
  return geometry;
}

// `cross` is used by the material's tangent-frame reconstruction contract (u x v == n); keeping
// the check here means a mistyped basis above fails at module load rather than as a face that is
// lit from the wrong side.
for (const face of FACES) {
  const derived = cross(face.u, face.v);
  if (
    Math.abs(derived[0] - face.n[0]) > 1e-6 ||
    Math.abs(derived[1] - face.n[1]) > 1e-6 ||
    Math.abs(derived[2] - face.n[2]) > 1e-6
  ) {
    throw new Error('CubeHero: face basis is not right-handed (u x v must equal n)');
  }
}
