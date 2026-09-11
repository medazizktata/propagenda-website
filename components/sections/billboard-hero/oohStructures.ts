import * as THREE from 'three';
import { createPanelMaterial, type PanelMaterial } from './panelMaterial';

/**
 * Procedural OOH / marketing structures for the billboard hero.
 *
 * Families mirror the reference reel inventory (unipole, truss gantry, mega wall, portrait
 * poster) plus street-level formats Propagenda actually sells into: bus-shelter citylight,
 * lightbox, and a vertical wayfinding totem. Everything stays procedural so we never push
 * GLB weight against the Workers asset cap.
 */

export type Slideshow = {
  material: PanelMaterial;
  current: number;
  next: number;
  hold: number;
  fade: number;
  fading: boolean;
  dwell: number;
};

export type StructureCtx = {
  rand: () => number;
  steel: THREE.MeshStandardMaterial;
  charcoal: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  posters: THREE.Texture[];
  /** Seconds a poster holds before cross-fading. */
  dwell: readonly [number, number];
  slideshows: Slideshow[];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function addBox(
  group: THREE.Group,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  geometries: THREE.BufferGeometry[],
) {
  geometries.push(geo);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

/** Thin steel edge frame — keeps the poster DoubleSide readable from the rear. */
function addEdgeFrame(
  group: THREE.Group,
  w: number,
  h: number,
  railT: number,
  steel: THREE.Material,
  geometries: THREE.BufferGeometry[],
  z = 0,
) {
  const rails: Array<[number, number, number, number]> = [
    [w + railT, railT, 0, (h + railT) / 2],
    [w + railT, railT, 0, -(h + railT) / 2],
    [railT, h + railT, (w + railT) / 2, 0],
    [railT, h + railT, -(w + railT) / 2, 0],
  ];
  for (const [rw, rh, rx, ry] of rails) {
    addBox(group, new THREE.BoxGeometry(rw, rh, railT), steel, rx, ry, z, geometries);
  }
}

/**
 * Adds the poster face(s) to a structure and registers its slideshow.
 *
 * `backZ` adds a second face on the rear. Nearly every family here puts an opaque tray, glass or
 * body box behind its poster, and those boxes are what made the structures read blank once they
 * tumbled past side-on — the front plane is DoubleSide, but you cannot see through a charcoal
 * box to reach it. The rear face is turned to look backwards, so the artwork reads the right way
 * round from behind rather than mirrored.
 *
 * Both faces share one material, so they show the same poster and cross-fade in step: the
 * slideshow drives the material, not the mesh.
 *
 * **Every caller must place `z` and `backZ` against its own backing box, not by eye.** These
 * faces are flat planes and the boxes behind them are opaque, so a face level with a box surface
 * z-fights — it shimmers and tears as the structure tumbles, and no amount of depth-buffer
 * precision fixes a genuine tie. Clear each box surface by `POSTER_CLEARANCE`.
 */
/** Minimum gap between a poster face and any box surface behind or in front of it. */
export const POSTER_CLEARANCE = 0.06;
function attachPoster(
  ctx: StructureCtx,
  group: THREE.Group,
  w: number,
  h: number,
  index: number,
  z = 0,
  backZ?: number,
) {
  const material = createPanelMaterial();
  ctx.materials.push(material);

  const a = index % ctx.posters.length;
  const b = (a + 1 + Math.floor(ctx.rand() * (ctx.posters.length - 1))) % ctx.posters.length;
  material.map = ctx.posters[a];
  // Same texture in both slots: the face is lit AND backlit by its own artwork.
  material.emissiveMap = ctx.posters[a];
  material.userData.crossfade.uMapB.value = ctx.posters[b];

  const faceGeo = new THREE.PlaneGeometry(w, h);
  ctx.geometries.push(faceGeo);
  const face = new THREE.Mesh(faceGeo, material);
  face.position.z = z;
  group.add(face);

  if (backZ !== undefined) {
    const back = new THREE.Mesh(faceGeo, material);
    back.position.z = backZ;
    back.rotation.y = Math.PI;
    group.add(back);
  }

  const slideshow: Slideshow = {
    material,
    current: a,
    next: b,
    hold: lerp(ctx.dwell[0], ctx.dwell[1], ctx.rand()),
    fade: 0,
    fading: false,
    dwell: lerp(ctx.dwell[0], ctx.dwell[1], ctx.rand()),
  };
  ctx.slideshows.push(slideshow);
  group.userData.slideshow = slideshow;
  return { w, h };
}

/** Citylight / portrait poster on a short arm — classic street furniture face. */
export function buildPortraitPoster(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(0.85, 1.25, ctx.rand());
  const h = w * 1.414;
  attachPoster(ctx, group, w, h, index);
  addEdgeFrame(group, w, h, 0.05, ctx.steel, ctx.geometries);

  const armGeo = new THREE.CylinderGeometry(0.032, 0.04, h * 1.15, 8);
  ctx.geometries.push(armGeo);
  const arm = new THREE.Mesh(armGeo, ctx.steel);
  arm.position.y = -h * 0.92;
  group.add(arm);

  const baseGeo = new THREE.BoxGeometry(0.28, 0.06, 0.28);
  addBox(group, baseGeo, ctx.charcoal, 0, -h * 1.48, 0, ctx.geometries);
  return group;
}

/** Highway unipole — landscape face on a single chunky mast with a base plate. */
export function buildUnipole(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(1.6, 2.3, ctx.rand());
  const h = w / 1.9;
  // Tray spans z −0.06…0.02; faces clear both of its surfaces by POSTER_CLEARANCE.
  attachPoster(ctx, group, w, h, index, 0.08, -0.12);
  addEdgeFrame(group, w, h, 0.06, ctx.steel, ctx.geometries, 0.08);

  // Backing tray so the structure reads as a real box when edge-on.
  const trayGeo = new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.08);
  addBox(group, trayGeo, ctx.charcoal, 0, 0, -0.02, ctx.geometries);

  const mastH = h * 1.85;
  const mastGeo = new THREE.BoxGeometry(0.14, mastH, 0.14);
  addBox(group, mastGeo, ctx.steel, 0, -h / 2 - mastH / 2, -0.05, ctx.geometries);

  const plateGeo = new THREE.BoxGeometry(0.55, 0.05, 0.55);
  addBox(group, plateGeo, ctx.charcoal, 0, -h / 2 - mastH - 0.02, -0.05, ctx.geometries);

  // Small brand stub on the mast — orange reads as a media owner plate.
  const stubGeo = new THREE.BoxGeometry(0.16, 0.12, 0.04);
  addBox(group, stubGeo, ctx.accent, 0, -h * 0.15, 0.04, ctx.geometries);
  return group;
}

/** Open triangular truss gantry with a face and a luminaire drum. */
export function buildTrussGantry(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(1.2, 1.8, ctx.rand());
  const h = w / 1.85;
  // Draw one anyway, so removing the blank-face branch does not shift every later structure's
  // placement, size and poster index — the RNG is a fixed sequence and the composition is
  // tuned against it.
  ctx.rand();

  // The open gantry carries no backing box, so its single DoubleSide face already shows from
  // both sides. It used to have a blank orange-plate variant; every face in the field is live
  // artwork now.
  attachPoster(ctx, group, w, h, index, 0.02);
  addEdgeFrame(group, w, h, 0.045, ctx.steel, ctx.geometries, 0.02);

  const legLen = h * 2.15;
  for (let i = 0; i < 3; i += 1) {
    const t = (i / 3) * Math.PI * 2;
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, legLen, 6);
    ctx.geometries.push(legGeo);
    const leg = new THREE.Mesh(legGeo, ctx.steel);
    leg.position.set(Math.cos(t) * w * 0.28, -h * 0.55, Math.sin(t) * w * 0.28 - 0.12);
    group.add(leg);
  }

  // Cross braces — the lattice is what sells the structure as 3D when it turns edge-on.
  for (let i = 0; i < 3; i += 1) {
    const t0 = (i / 3) * Math.PI * 2;
    const t1 = ((i + 1) / 3) * Math.PI * 2;
    const x0 = Math.cos(t0) * w * 0.28;
    const z0 = Math.sin(t0) * w * 0.28 - 0.12;
    const x1 = Math.cos(t1) * w * 0.28;
    const z1 = Math.sin(t1) * w * 0.28 - 0.12;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const len = Math.hypot(dx, dz);
    const braceGeo = new THREE.CylinderGeometry(0.012, 0.012, len, 5);
    ctx.geometries.push(braceGeo);
    const brace = new THREE.Mesh(braceGeo, ctx.steel);
    brace.position.set((x0 + x1) / 2, -h * 1.15, (z0 + z1) / 2);
    brace.rotation.y = Math.atan2(dx, dz);
    brace.rotation.z = Math.PI / 2;
    group.add(brace);
  }

  const drumGeo = new THREE.CylinderGeometry(0.09, 0.09, w * 0.55, 10);
  ctx.geometries.push(drumGeo);
  const drum = new THREE.Mesh(drumGeo, ctx.charcoal);
  drum.rotation.z = Math.PI / 2;
  drum.position.set(0, h * 0.62, -0.08);
  group.add(drum);

  return group;
}

/** Mega wall / rooftop panel — large face, heavy frame, lateral support arm. */
export function buildMegaWall(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(2.0, 2.8, ctx.rand());
  const h = w / 2.15;
  // Back box spans z −0.09…0.01.
  attachPoster(ctx, group, w, h, index, 0.07, -0.15);
  addEdgeFrame(group, w, h, 0.07, ctx.steel, ctx.geometries, 0.07);

  const backGeo = new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.1);
  addBox(group, backGeo, ctx.charcoal, 0, 0, -0.04, ctx.geometries);

  const armGeo = new THREE.BoxGeometry(w * 0.55, 0.09, 0.09);
  addBox(group, armGeo, ctx.steel, w * 0.15, -h * 0.55, -0.2, ctx.geometries);

  const uprightGeo = new THREE.BoxGeometry(0.1, h * 1.1, 0.1);
  addBox(group, uprightGeo, ctx.steel, -w * 0.35, -h * 0.2, -0.2, ctx.geometries);
  return group;
}

/** Bus-shelter citylight — twin posts, shallow canopy, landscape poster. */
export function buildBusShelter(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(1.4, 1.9, ctx.rand());
  const h = w / 1.55;
  // Glass spans z −0.03…0.01.
  attachPoster(ctx, group, w, h, index, 0.07, -0.09);
  addEdgeFrame(group, w, h, 0.05, ctx.steel, ctx.geometries, 0.07);

  const glassGeo = new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.04);
  addBox(group, glassGeo, ctx.charcoal, 0, 0, -0.01, ctx.geometries);

  for (const side of [-1, 1]) {
    const postGeo = new THREE.BoxGeometry(0.07, h * 1.35, 0.07);
    addBox(group, postGeo, ctx.steel, side * (w * 0.52), -h * 0.15, -0.12, ctx.geometries);
  }

  const canopyGeo = new THREE.BoxGeometry(w * 1.15, 0.05, 0.45);
  addBox(group, canopyGeo, ctx.accent, 0, h * 0.62, -0.05, ctx.geometries);
  return group;
}

/** Illuminated lightbox — deep tray, glowing face, top hang bar. */
export function buildLightbox(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(1.1, 1.6, ctx.rand());
  const h = w / 1.35;
  // Tray spans z −0.10…0.06. The face used to sit at exactly 0.06 — coplanar with the tray's
  // front surface, which z-fights at any depth precision. This is the deepest tray in the set,
  // so it is the one that catches a face placed by eye rather than against the box.
  attachPoster(ctx, group, w, h, index, 0.12, -0.16);
  addEdgeFrame(group, w, h, 0.055, ctx.steel, ctx.geometries, 0.12);

  const trayGeo = new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.16);
  addBox(group, trayGeo, ctx.charcoal, 0, 0, -0.02, ctx.geometries);

  const barGeo = new THREE.CylinderGeometry(0.02, 0.02, w * 0.7, 8);
  ctx.geometries.push(barGeo);
  const bar = new THREE.Mesh(barGeo, ctx.steel);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, h * 0.62, 0.02);
  group.add(bar);

  for (const side of [-1, 1]) {
    const linkGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6);
    ctx.geometries.push(linkGeo);
    const link = new THREE.Mesh(linkGeo, ctx.steel);
    link.position.set(side * w * 0.28, h * 0.52, 0.02);
    group.add(link);
  }
  return group;
}

/** Vertical wayfinding / brand totem — stacked faces on a monolith. */
export function buildWayfindingTotem(ctx: StructureCtx, index: number): THREE.Group {
  const group = new THREE.Group();
  const w = lerp(0.7, 0.95, ctx.rand());
  const h = w * 2.4;
  // Body spans z −0.14…0.04.
  attachPoster(ctx, group, w, h * 0.55, index, 0.1, -0.2);
  addEdgeFrame(group, w, h * 0.55, 0.04, ctx.steel, ctx.geometries, 0.1);

  const bodyGeo = new THREE.BoxGeometry(w + 0.12, h, 0.18);
  addBox(group, bodyGeo, ctx.charcoal, 0, -h * 0.12, -0.05, ctx.geometries);

  const capGeo = new THREE.BoxGeometry(w + 0.18, 0.08, 0.22);
  addBox(group, capGeo, ctx.accent, 0, h * 0.42, -0.05, ctx.geometries);

  const footGeo = new THREE.BoxGeometry(w * 0.9, 0.06, 0.35);
  addBox(group, footGeo, ctx.steel, 0, -h * 0.62, -0.05, ctx.geometries);
  return group;
}

export type StructureBuilder = (ctx: StructureCtx, index: number) => THREE.Group;

/** Ordered mix — marketing-space inventory, not a stack of the same poster arm. */
export const STRUCTURE_MIX: StructureBuilder[] = [
  buildUnipole,
  buildPortraitPoster,
  buildTrussGantry,
  buildMegaWall,
  buildBusShelter,
  buildLightbox,
  buildWayfindingTotem,
  // Second pass over the smaller formats. Placement is stratified one-per-column, so the count
  // sets the density directly: seven left the lower half of the frame reading as empty.
  buildPortraitPoster,
  buildLightbox,
  buildMegaWall,
  buildBusShelter,
];
