import * as THREE from 'three';

import { ATLAS_COLS, ATLAS_ROWS, BLANK_SLOT, CUBE_SERVICES } from './services';
import { ICON_GRID, ICON_STROKE, SERVICE_ICONS } from './serviceIcons';

/**
 * Procedural texture atlas for the cube faces.
 *
 * A face carries one idea and nothing else: the mark for a service, a hairline, the name. No
 * labels, no counters, no frame furniture — a face is read in the second or so it spends turned
 * toward you, and anything that is not the service is noise competing with the six other faces
 * in the frame.
 *
 * Every tile is drawn as a *mask*: pure white on transparent. The shader reads only the alpha
 * channel and picks the ink colour per face (see `inkRange` in cubeMaterial.ts) rather than the
 * atlas baking it in, which is what would let a single texture cross-fade between two ink
 * colourways if a preset ever needed one — no current preset does, so every face reads white ink
 * at every facing angle, but the mask stays colour-agnostic either way.
 *
 * Nothing here touches the network: the type is drawn with the two families the app already
 * loaded through next/font, read back off the documentElement's CSS custom properties.
 */

/** Tile content stays inside this margin so mip-level bleed between neighbours hits empty pixels. */
const MARGIN = 0.1;
/** The lockup, in tile fractions: mark, rule, name. */
const ICON_TOP = 0.15;
const ICON_SIZE = 0.3;
const RULE_Y = 0.515;
const RULE_HALF_WIDTH = 0.07;
const NAME_TOP = 0.575;
const NAME_BOTTOM = 0.895;

const NAME_MIN = 0.058;
const NAME_MAX = 0.175;
const NAME_LEADING = 0.94;

export interface FaceAtlas {
  texture: THREE.CanvasTexture;
  dispose(): void;
}

/**
 * next/font mints a hashed family name per build and exposes it as a CSS variable. Reading the
 * variable keeps the canvas type identical to the DOM type; the literal fallback keeps the tile
 * legible if the variable is missing (e.g. the component rendered outside the app shell).
 */
function resolveSans(): string {
  const fallback = 'ui-sans-serif, system-ui, sans-serif';
  if (typeof window === 'undefined') return fallback;
  const family = window.getComputedStyle(document.documentElement).getPropertyValue('--font-poppins').trim();
  return family ? `${family}, ${fallback}` : fallback;
}

type SpacedContext = CanvasRenderingContext2D & { letterSpacing: string };

function hasLetterSpacing(ctx: CanvasRenderingContext2D): ctx is SpacedContext {
  return 'letterSpacing' in ctx;
}

/** Canvas letterSpacing landed late in Safari; where it is missing the type simply sets solid. */
function setTracking(ctx: CanvasRenderingContext2D, px: number): void {
  if (hasLetterSpacing(ctx)) ctx.letterSpacing = `${px}px`;
}

function wrap(ctx: CanvasRenderingContext2D, words: string[], maxWidth: number): string[] | null {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (!current) return null;
    lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  // Every emitted line has to be re-checked, not just the candidates: the word that starts a new
  // line was only ever measured as part of the previous one. Without this, "APPLICATIONS" and
  // "MARKETING" happily run off the edge of their face.
  for (const line of lines) {
    if (ctx.measureText(line).width > maxWidth) return null;
  }
  return lines;
}

/**
 * Binary-searches the largest size at which the wrapped name still fits its box. Fitting per tile
 * rather than picking one size for all seven is what keeps "Events" monumental and "Photography &
 * Videography" readable on the same object.
 */
function fitName(
  ctx: CanvasRenderingContext2D,
  text: string,
  tile: number,
  boxWidth: number,
  boxHeight: number,
  family: string,
): { lines: string[]; size: number } {
  const words = text.toUpperCase().split(' ');
  let low = NAME_MIN * tile;
  let high = NAME_MAX * tile;

  // Seed at the floor size so a pathological name still wraps inside the box rather than being
  // drawn as one unbroken line that runs past the margin.
  ctx.font = `700 ${low}px ${family}`;
  setTracking(ctx, low * 0.012);
  let best: { lines: string[]; size: number } = {
    lines: wrap(ctx, words, boxWidth) ?? [text.toUpperCase()],
    size: low,
  };

  for (let i = 0; i < 9; i += 1) {
    const size = (low + high) / 2;
    ctx.font = `700 ${size}px ${family}`;
    setTracking(ctx, size * 0.012);
    const lines = wrap(ctx, words, boxWidth);
    if (lines && lines.length * size * NAME_LEADING <= boxHeight) {
      best = { lines, size };
      low = size;
    } else {
      high = size;
    }
  }
  return best;
}

function drawIcon(ctx: CanvasRenderingContext2D, tile: number, index: number): void {
  const draw = SERVICE_ICONS[index];
  if (!draw) return;
  const box = tile * ICON_SIZE;
  ctx.save();
  ctx.translate((tile - box) / 2, tile * ICON_TOP);
  ctx.scale(box / ICON_GRID, box / ICON_GRID);
  ctx.lineWidth = ICON_STROKE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // A touch under the name's weight, so the eye lands on the word and the mark confirms it.
  ctx.globalAlpha = 0.9;
  draw(ctx);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawServiceTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  family: string,
  index: number,
  name: string,
): void {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';

  drawIcon(ctx, tile, index);

  // The one piece of furniture left on the face: a short rule tying the mark to the word.
  ctx.globalAlpha = 0.32;
  ctx.fillRect(
    tile * (0.5 - RULE_HALF_WIDTH),
    tile * RULE_Y,
    tile * RULE_HALF_WIDTH * 2,
    Math.max(1, tile * 0.004),
  );
  ctx.globalAlpha = 1;

  const boxWidth = tile * (1 - 2 * MARGIN);
  const boxHeight = tile * (NAME_BOTTOM - NAME_TOP);
  const { lines, size } = fitName(ctx, name, tile, boxWidth, boxHeight, family);
  ctx.font = `700 ${size}px ${family}`;
  setTracking(ctx, size * 0.012);

  // fillText takes a baseline, so the first line drops by ~0.76em — roughly Poppins' cap height
  // — which turns the box's top edge into the top of the caps rather than the top of the em square.
  const blockHeight = lines.length * size * NAME_LEADING;
  let y = tile * NAME_TOP + (boxHeight - blockHeight) / 2 + size * 0.76;
  for (const line of lines) {
    ctx.fillText(line, tile / 2, y);
    y += size * NAME_LEADING;
  }
  setTracking(ctx, 0);
}

/**
 * @param tileSize edge length of one atlas tile in pixels. 1024 on desktop keeps the front face
 * crisp at DPR 2; phones drop to 512 because the cube never exceeds ~300 CSS px there and the
 * full-size atlas would cost 33 MB of VRAM for detail nobody can see.
 */
export function createFaceAtlas(tileSize: number, renderer: THREE.WebGLRenderer): FaceAtlas {
  const canvas = document.createElement('canvas');
  canvas.width = tileSize * ATLAS_COLS;
  canvas.height = tileSize * ATLAS_ROWS;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('CubeHero: 2D context unavailable for the face atlas');

  const family = resolveSans();

  // Slot BLANK_SLOT is simply never drawn — an untouched, fully transparent tile.
  for (let slot = 0; slot < BLANK_SLOT; slot += 1) {
    const col = slot % ATLAS_COLS;
    const row = Math.floor(slot / ATLAS_COLS);
    ctx.save();
    ctx.translate(col * tileSize, row * tileSize);
    ctx.beginPath();
    ctx.rect(0, 0, tileSize, tileSize);
    ctx.clip();
    drawServiceTile(ctx, tileSize, family, slot, CUBE_SERVICES[slot].name);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  // Alpha-only mask: no colour-space conversion should touch it.
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // Faces are nearly always seen at an angle; without anisotropy the type turns to mush the
  // moment a face rakes away from camera, which is exactly when it is most in view.
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  texture.needsUpdate = true;

  return {
    texture,
    dispose() {
      texture.dispose();
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
