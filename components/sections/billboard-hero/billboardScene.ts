import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { loadLogoShapes } from '../logoGeometry';
import { getHeroEmitter } from './heroEmitter';
import {
  buildMegaWall,
  buildUnipole,
  STRUCTURE_MIX,
  type Slideshow,
  type StructureCtx,
} from './oohStructures';
import type { HeroScene, HeroSceneContext } from './types';

/**
 * The hero's billboard field: a loose constellation of OOH structures tumbling in a warm sky,
 * each poster panel running its own slideshow of real Propagenda work.
 *
 * Motion is taken from the measurements in `docs/rework/reel-hero-dissection.md` §2.5: every
 * object carries its own constant angular velocity and linear drift, integrated on delta with
 * no easing and no shared vanishing point. Anything tweened reads wrong here.
 *
 * Palette is translated to brand — orange #f58b27 on charcoal #121212 — rather than copied from
 * the reference, which is coral red and cream on teal. See TASK-3.
 */

const CHARCOAL = 0x121212;
const STEEL = 0x8d8f93;
const ORANGE = 0xf58b27;

/** Measured in the reference: 2–5 deg/s about Y, so a full turn takes 70–180 s. */
const SPIN_Y = [0.035, 0.09] as const;
const SPIN_X = [0.01, 0.03] as const;
const SPIN_Z = [0.004, 0.015] as const;
/** ~0.5–1.5 % of viewport width per second. */
const DRIFT = [0.015, 0.045] as const;

/**
 * Aerial perspective. Keyed to the sky's mid tone rather than to black: fog is standing in for
 * the air between the camera and the object, so it has to be the colour of what is behind it.
 * The range is set against the field's actual depth — objects live at z −18…−3.5 with the camera
 * at +6, so ~9 to ~24 units out. Near sits past the closest of them so nothing in the foreground
 * is touched, and far sits beyond the deepest so even those keep some presence.
 */
/**
 * Bloom. An emissive material in three glows but lights nothing — it is not a light source, so
 * a backlit panel would otherwise sit in its housing with no spill at all, which is precisely
 * what reads as "bright texture" rather than "emitting light". Bloom bleeds the panel into the
 * air and the structure around it, and it is the cheap half of the pair: the shadow map handles
 * the occlusion side.
 *
 * The threshold is the important number. It sits above anything the key light alone produces,
 * so only the backlit faces bloom — lift it and the whole frame hazes over, which is the
 * failure mode that makes bloom look amateur.
 */
const BLOOM_STRENGTH = 0.34;
const BLOOM_RADIUS = 0.72;
// Above what the key light alone produces on a white poster. At 0.86 a bright panel drifting to
// the frame edge blew out and took its own artwork with it, which is the opposite of a subtle
// glow that keeps its detail.
const BLOOM_THRESHOLD = 1.02;

const FOG_COLOR = 0x2a1d14;
const FOG_NEAR = 14;
const FOG_FAR = 44;

/**
 * The monogram, cast on the sky as a cloud shadow.
 *
 * `place()` pushes any structure near the centre back to z −18…−11 so the type owns the middle,
 * which leaves a large well behind the lockup. The mark fills that well — but as shadow, not as
 * an object: it sits at −46, between the sky at −60 and the field's deepest structure at −18, so
 * it parallaxes with the backdrop rather than with the field.
 */
const LOGO_Z = -46;
/**
 * World units tall — roughly 78% of the frame height at that depth, which is about as large as
 * it goes: the drift below swings it another 1.3 units vertically, and past this the mark starts
 * running off the bottom edge rather than sitting on the sky.
 */
const LOGO_HEIGHT = 28;
/** The monogram's SVG viewBox is 126.868 x 132.068. */
const LOGO_ASPECT = 126.868 / 132.068;
/**
 * Density at its darkest, before the cloud mask thins it. High, because a shadow can only be
 * seen where there is light for it to take away — and this one lies over the sky's mid tones,
 * not its highlight.
 */
const LOGO_OPACITY = 0.85;
/**
 * Blur radius as a fraction of the mask's width. Feathered enough to read as cast shadow, but
 * no further: the counters that spell the 'm' are narrow, and past roughly this much blur they
 * close up and the mark collapses into an anonymous rounded blob.
 */
const LOGO_FEATHER = 0.032;
/**
 * Nudged off the lockup's centre, down and to the right, toward the lit quarter of the sky.
 * Dead centre put it over the darkest part of the frame, where darkening changes nothing.
 */
const LOGO_OFFSET_X = 2.6;
const LOGO_OFFSET_Y = -2.2;
/**
 * Mask resolution.
 *
 * Small on purpose. The mask is blurred by ~3% of its own width and then thinned by noise, so
 * nothing in it survives at pixel scale — and the noise pass is a per-pixel loop with four
 * octaves of value noise in it, which makes this number quadratic in main-thread cost. At 512
 * that is a quarter of a million pixels of setup work on a phone, for a shape whose finest
 * detail is tens of pixels across.
 */
const LOGO_MASK_W = 256;

/**
 * The large formats — mega walls and unipoles — carry a light of their own, so a backlit face
 * throws warmth onto the steel around it and onto whatever drifts past. Emissive alone cannot do
 * this: in three an emissive surface glows but illuminates nothing.
 *
 * Point rather than spot, and shadowless. A shadow-casting light costs an extra depth pass over
 * the whole field each frame, and four of them would cost more than the whole scene currently
 * does — while adding almost nothing, since these sit face-on to what they light.
 */
const PANEL_LIGHT_COLOR = 0xffb571;
const PANEL_LIGHT_INTENSITY = 1.5;
/** Falls off to nothing well inside a structure's own neighbourhood. */
const PANEL_LIGHT_RANGE = 3.4;

/**
 * The lockup's cast shadow, thrown back onto the sky.
 *
 * Depth sits between the field and the sky so the shadow reads as landing on the backdrop, and
 * the offset carries it down and left — away from the key at upper right, so it falls where that
 * light would actually put it.
 */
const TEXT_SHADOW_Z = -34;
const TEXT_SHADOW_OPACITY = 0.5;
/** Where the shadow sits when nothing in the near layer is lighting the type. */
const TEXT_SHADOW_OFFSET = { x: -1.1, y: -1.4 };
/**
 * Depth the lockup is treated as occupying when a near-layer face throws its shadow.
 *
 * The near layer's structures live at z −5.5…−2.5, so this puts them genuinely in front of the
 * type — which is the arrangement the compositing already implies, and the one the projection
 * below needs in order to throw the shadow backwards onto the sky rather than towards the camera.
 */
const TEXT_PLANE_Z = -8;
/**
 * How much of the true projection to keep.
 *
 * A point light this close to its caster magnifies enormously — a face at z −4 casting onto the
 * sky at −34 scales the shadow by 7.5x, which is physically right and visually unusable. These
 * damp the throw and the growth separately, so the shadow tracks the light's direction honestly
 * while staying roughly the size of the word that cast it.
 */
const TEXT_SHADOW_THROW_DAMP = 0.055;
const TEXT_SHADOW_GROWTH_DAMP = 0.014;
/** How fast the shadow follows the light. Instant tracking reads as a glitch, not as light. */
const TEXT_SHADOW_FOLLOW = 3.2;
/**
 * Blur radius as a fraction of the mask's width. Much smaller than the monogram's, and it has to
 * be: that mark is one broad shape, whereas letter strokes are narrow, and a blur wide enough to
 * soften the outline of the word dissolves the letters inside it into a single blob.
 */
const TEXT_SHADOW_FEATHER = 0.006;

const POSTER_COUNT = 12;
const RECYCLE_X = 11;
const RECYCLE_Y = 7;
const SKY_Z = -60;

/** Seconds a poster holds before cross-fading, and how long the fade itself takes. */
const DWELL = [4.5, 8.5] as const;
const FADE_SECONDS = 1.1;

/** Deterministic RNG — a fixed composition beats a different one on every reload. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Value noise on a lattice, bilinearly interpolated. Cheap, smooth, and enough for cloud
 * structure — Perlin's gradient noise would be marginally nicer and is not worth the code here.
 */
function makeValueNoise(gw: number, gh: number, seed: number) {
  const rand = makeRandom(seed);
  const grid = new Float32Array(gw * gh);
  for (let i = 0; i < grid.length; i += 1) grid[i] = rand();

  return (x: number, y: number) => {
    // Wrap so octaves tile instead of clamping at the edges.
    const fx = ((x % gw) + gw) % gw;
    const fy = ((y % gh) + gh) % gh;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const x1 = (x0 + 1) % gw;
    const y1 = (y0 + 1) % gh;
    const tx = fx - x0;
    const ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const a = grid[y0 * gw + x0];
    const b = grid[y0 * gw + x1];
    const c = grid[y1 * gw + x0];
    const d = grid[y1 * gw + x1];
    return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
  };
}

/**
 * Warm amber-to-charcoal sky with soft cirrus.
 *
 * The cirrus is fBm value noise sampled along a rotated, horizontally stretched axis, which is
 * what produces long organic streaks running lower-left to upper-right. An earlier pass drew
 * them as filled rectangles with gradients; at this scale those read as hard banding rather
 * than atmosphere.
 *
 * Generated at a quarter resolution and scaled up: the interpolation is doing the smoothing
 * anyway, and it keeps the one-time cost to a few tens of thousands of samples.
 */
function createSkyTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 576;
  const SW = 256;
  const SH = 144;

  const small = document.createElement('canvas');
  small.width = SW;
  small.height = SH;
  const sctx = small.getContext('2d')!;
  const img = sctx.createImageData(SW, SH);

  const noise = makeValueNoise(32, 32, 0x5eed17);
  // Cirrus runs lower-left to upper-right, and is far wider than it is tall.
  const ANGLE = -0.31;
  const cosA = Math.cos(ANGLE);
  const sinA = Math.sin(ANGLE);
  const STRETCH = 0.19;

  const fbm = (u: number, v: number) => {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    for (let o = 0; o < 5; o += 1) {
      sum += noise(u * freq, v * freq) * amp;
      amp *= 0.5;
      freq *= 2.07;
    }
    return sum;
  };

  for (let y = 0; y < SH; y += 1) {
    for (let x = 0; x < SW; x += 1) {
      const u = x / SW;
      const v = y / SH;

      // Base: deep charcoal over most of the frame, opening to burnt amber only in the
      // lower-right. Held dark deliberately — the lockup is white and sits centre-left, and an
      // evenly bright sky costs it contrast. The exponent is what keeps the dark half wide.
      const t = Math.min(1, Math.max(0, u * 0.44 + v * 0.68 - 0.22));
      const e = Math.pow(t * t * (3 - 2 * t), 1.7);
      // Channel curves stay close together on purpose. Falling off green and blue much faster
      // than red drags the hue to maroon; these keep it on the brand's amber.
      let r = lerp(14, 186, e);
      let g = lerp(14, 88, Math.pow(e, 1.2));
      let b = lerp(19, 38, Math.pow(e, 1.5));

      // Cirrus, confined to the lit corner so the charcoal stays clean.
      const nu = (u * cosA - v * sinA) * 3.1;
      const nv = (u * sinA + v * cosA) * (3.1 / STRETCH);
      // The cirrus carries the light, not the flat ramp. A gradient bright enough to feel like
      // sky washes the whole frame; structured highlights read as atmosphere at a much lower
      // average luminance, which is what keeps the white lockup legible.
      const cloud = Math.pow(Math.max(0, fbm(nu, nv) * 1.6 - 0.40), 1.35);
      const lit = Math.min(1, Math.max(0, u * 0.4 + v * 0.76 - 0.24));
      const c = cloud * lit * 245;
      r = Math.min(255, r + c);
      g = Math.min(255, g + c * 0.58);
      b = Math.min(255, b + c * 0.3);

      const i = (y * SW + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  sctx.putImageData(img, 0, 0);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(small, 0, 0, W, H);

  // Vignette — present in the reference, and it keeps the corners off the lockup.
  const vig = ctx.createRadialGradient(W * 0.5, H * 0.46, H * 0.15, W * 0.5, H * 0.5, H * 1.05);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(4,4,7,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Fine grain. An 8-bit gradient this smooth bands visibly without it.
  //
  // Built as a small tile and stamped with a repeating pattern rather than walked per pixel in
  // JS: a full-size getImageData/putImageData pass over ~590k pixels was a measurable long task,
  // and the blend here is native.
  const GRAIN = 128;
  const grainTile = document.createElement('canvas');
  grainTile.width = GRAIN;
  grainTile.height = GRAIN;
  const gctx = grainTile.getContext('2d')!;
  const grainData = gctx.createImageData(GRAIN, GRAIN);
  const grand = makeRandom(0xbeef);
  for (let i = 0; i < grainData.data.length; i += 4) {
    const n = 118 + Math.round((grand() - 0.5) * 34);
    grainData.data[i] = n;
    grainData.data[i + 1] = n;
    grainData.data[i + 2] = n;
    grainData.data[i + 3] = 255;
  }
  gctx.putImageData(grainData, 0, 0);

  const pattern = ctx.createPattern(grainTile, 'repeat');
  if (pattern) {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * The monogram as a soft, cloud-broken shadow mask, returned as an alpha map.
 *
 * Three steps, and the order is the whole trick:
 *
 * 1. Fill the mark at a generous inset. The blur pulls coverage inward, so a shape drawn
 *    edge-to-edge would lose its outermost feather off the canvas boundary.
 * 2. Blur it. Canvas `filter` does this in one pass; blurring a quarter-million pixels by hand
 *    in JS would be a visible hitch on the main thread.
 * 3. Multiply the blurred alpha by fBm noise. This is what makes it read as cloud rather than as
 *    a drop shadow — without it the edge falls off at a constant rate the whole way round, which
 *    the eye reads as a blurred object, not as shadow cast through moving air.
 *
 * Returns null when a 2D context is unavailable, in which case the hero goes without a backdrop
 * mark rather than failing.
 */
function createLogoShadowTexture(shapes: THREE.Shape[]): THREE.CanvasTexture | null {
  const W = LOGO_MASK_W;
  const H = Math.round(W / LOGO_ASPECT);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  // SVG coordinates are Y-down and so is canvas, so these shapes need no flip here — unlike the
  // same shapes used as geometry, which do.
  const bounds = new THREE.Box2();
  const outlines = shapes.map((shape) => {
    const points = shape.extractPoints(24);
    points.shape.forEach((pt) => bounds.expandByPoint(pt));
    return points;
  });
  const span = bounds.getSize(new THREE.Vector2());
  if (span.x <= 0 || span.y <= 0) return null;

  const inset = W * LOGO_FEATHER * 2.2;
  const scale = Math.min((W - inset * 2) / span.x, (H - inset * 2) / span.y);
  const offX = (W - span.x * scale) / 2 - bounds.min.x * scale;
  const offY = (H - span.y * scale) / 2 - bounds.min.y * scale;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  const trace = (points: THREE.Vector2[]) => {
    points.forEach((pt, i) => {
      const x = pt.x * scale + offX;
      const y = pt.y * scale + offY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };
  outlines.forEach(({ shape, holes }) => {
    trace(shape);
    holes.forEach(trace);
  });
  // evenodd so the counters that spell the 'm' punch through instead of filling solid.
  ctx.fill('evenodd');

  // Blur into a second canvas: `filter` applies to what is drawn, not to what is already there.
  const soft = document.createElement('canvas');
  soft.width = W;
  soft.height = H;
  const sctx = soft.getContext('2d');
  if (!sctx) return null;
  sctx.fillStyle = '#000';
  sctx.fillRect(0, 0, W, H);
  sctx.filter = `blur(${Math.round(W * LOGO_FEATHER)}px)`;
  sctx.drawImage(canvas, 0, 0);
  sctx.filter = 'none';

  const img = sctx.getImageData(0, 0, W, H);
  const noise = makeValueNoise(24, 24, 0xc10dd);
  const fbm = (u: number, v: number) => {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    for (let o = 0; o < 4; o += 1) {
      sum += noise(u * freq, v * freq) * amp;
      amp *= 0.5;
      freq *= 2.13;
    }
    return sum;
  };
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = (y * W + x) * 4;
      const a = img.data[i] / 255;
      if (a <= 0) continue;
      // Stretched horizontally to match the cirrus, which runs wide and shallow.
      const n = fbm((x / W) * 3.4, (y / H) * 1.5);
      // Biased toward full density, so the noise thins the shadow unevenly without punching
      // holes clean through the middle of the mark.
      const density = Math.min(1, a * (0.58 + n * 1.05));
      const v = Math.round(density * 255);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  sctx.putImageData(img, 0, 0);

  const texture = new THREE.CanvasTexture(soft);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/**
 * Rasterise the lockup into a soft mask, measured from the live element.
 *
 * Reading the element rather than hard-coding the string and font is what keeps this correct:
 * the type is a clamp() size that changes with the viewport, the family comes from a CSS
 * variable, and the tracking is set in em. Any of those drifting would leave a hand-positioned
 * shadow subtly misaligned with the text it belongs to.
 *
 * Returns the mask plus the element's screen rect, which the caller needs to place and scale it.
 */
function createTextShadowMask(
  el: HTMLElement,
): { texture: THREE.CanvasTexture; rect: DOMRect } | null {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const style = getComputedStyle(el);
  const text = (el.textContent ?? '').trim();
  if (!text) return null;

  // Pad for the blur to spread into, exactly as the monogram mask does.
  const pad = Math.ceil(rect.width * TEXT_SHADOW_FEATHER * 3);
  const W = Math.ceil(rect.width) + pad * 2;
  const H = Math.ceil(rect.height) + pad * 2;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  // letterSpacing is honoured by Chromium and Safari and ignored elsewhere; where it is ignored
  // the mask is marginally narrow, which is invisible at this blur.
  ctx.letterSpacing = style.letterSpacing;
  ctx.fillText(text, W / 2, H / 2);

  const soft = document.createElement('canvas');
  soft.width = W;
  soft.height = H;
  const sctx = soft.getContext('2d');
  if (!sctx) return null;
  sctx.fillStyle = '#000';
  sctx.fillRect(0, 0, W, H);
  sctx.filter = `blur(${Math.max(2, Math.round(W * TEXT_SHADOW_FEATHER))}px)`;
  sctx.drawImage(canvas, 0, 0);
  sctx.filter = 'none';

  const texture = new THREE.CanvasTexture(soft);
  texture.colorSpace = THREE.NoColorSpace;
  return { texture, rect };
}

type Floater = {
  group: THREE.Group;
  spin: THREE.Vector3;
  velocity: THREE.Vector3;
  /** Decaying kick applied on click — layered on top of the steady spin. */
  impulse: THREE.Vector3;
  phase: number;
  slideshow?: Slideshow;
};

/** How fast a click impulse dies back into the idle tumble. */
const IMPULSE_DECAY = 3.2;
const CLICK_SPIN = 2.4;
const CLICK_DRIFT = 0.9;
/** World units — below this, a pointer-up counts as a tap rather than a throw. */
const TAP_SLOP = 0.12;
/** Steady drift speed after a throw, clamped so objects don't leave the field instantly. */
const THROW_SPEED = [DRIFT[0], 0.14] as const;

/**
 * Drag follow. The held object is not welded to the cursor: it is pulled toward a target point
 * by a spring and damped, so it trails, leans and settles. A damping ratio below 1 leaves a
 * little overshoot, which is what reads as weight rather than as lag.
 *
 * Integrating this in `update` rather than in the pointer handler is the other half of it.
 * pointermove fires at the pointer's rate, not the display's, so moving the object there applies
 * several unevenly sized steps per rendered frame — micro-stutter that no amount of smoothing
 * downstream can hide, because the frame only ever sees the last one.
 */
const DRAG_STIFFNESS = 44;
const DRAG_DAMPING = 0.78;
/** Angular lean fed from drag speed, so a slung object swirls instead of sliding flat. */
const DRAG_SWIRL = 0.55;
/** Below this release speed the object is being set down, not thrown. */
const THROW_MIN_SPEED = 0.06;

export function createBillboardScene(ctx: HeroSceneContext): HeroScene {
  // `reducedMotion` is handled by the host: it draws exactly one frame and never starts the
  // loop, so the scene only has to look complete at elapsed = 0. The one thing the scene has to
  // handle itself is drag, which has no loop to integrate its spring in — see `pointerDrag`.
  const { renderer, width, height, reducedMotion, requestDraw } = ctx;

  // Real occlusion rather than a post-processed approximation: one extra depth pass over ~16
  // low-poly structures is cheaper here than an SSAO pass over every pixel of a full-viewport
  // hero, and it gives contact shadows where the frames meet the faces.
  renderer.shadowMap.enabled = true;
  // PCFSoftShadowMap is deprecated as of r18x and silently falls back to this anyway.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CHARCOAL);
  scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
  // Near/far are fitted to the scene, not left at generous defaults, and that is a correctness
  // fix rather than a tuning one. Depth buffer precision falls off with the far/near ratio, and
  // at 160/0.1 = 1600:1 there was not enough resolution left at 20 units out to separate a
  // poster face from the backing box a few centimetres behind it — so they z-fought, which is
  // what read as panels flickering. Nothing sits closer than ~9 units (objects live at z −18…−3.5
  // with the camera at +6) or further than the sky at 66, so 2/90 is 45:1 with room to spare.
  const camera = new THREE.PerspectiveCamera(38, width / height, 2, 90);
  camera.position.set(0, 0, 6);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const skyTexture = createSkyTexture();
  textures.push(skyTexture);

  const skyGeo = new THREE.PlaneGeometry(1, 1);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, depthWrite: false, fog: false });
  geometries.push(skyGeo);
  materials.push(skyMat);
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.z = SKY_Z;
  sky.renderOrder = -1;
  scene.add(sky);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromEquirectangular(skyTexture).texture;
  scene.environment = envTexture;

  // Warmth comes from `scene.environment` — the amber sky — plus a warm key on top of it. An
  // earlier pass desaturated both to stop the field reading as one orange mass; the fix for that
  // turned out to be the cool counter-fill and the separation it creates, not the desaturation,
  // so the warmth is back and the fill stays.
  scene.environmentIntensity = 0.85;

  const key = new THREE.DirectionalLight(0xffd2a0, 2.9);
  // Same direction as before — (6,5,4) scaled by 3. Only the distance changes, which moves the
  // shadow camera far enough back to enclose a field that runs to z = -18.
  key.position.set(18, 15, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 3;
  // Fitted to the field rather than left at the ±5 default, which would have shadowed only the
  // objects nearest the centre. Any larger and the texel density drops below what reads as a
  // contact shadow on a one-unit panel.
  key.shadow.camera.left = -13;
  key.shadow.camera.right = 13;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 55;
  // normalBias over bias: these are thin boxes and flat planes, where a depth bias large enough
  // to kill the acne also detaches the shadow from its object.
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.035;
  scene.add(key);
  // The counter-fill is doing more than filling. Steel only reads as metal when its dark side
  // differs in hue from its lit side; with amber on both it flattens into painted board.
  const fill = new THREE.DirectionalLight(0x9dbcff, 0.24);
  fill.position.set(-5, -2, 3);
  scene.add(fill);
  // Sky above, ground below, in the backdrop's own colours — this is the ambient term, and
  // keeping it tinted rather than neutral is what stops the objects reading as studio-lit.
  scene.add(new THREE.HemisphereLight(0xf09340, 0x18140f, 0.5));
  const bounce = new THREE.DirectionalLight(ORANGE, 0.85);
  bounce.position.set(-8, -9, 5);
  scene.add(bounce);

  const steel = new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.68, roughness: 0.5 });
  const charcoalMat = new THREE.MeshStandardMaterial({
    color: 0x212124,
    metalness: 0.3,
    roughness: 0.68,
  });
  // The accent plates are the only pure brand orange in the field, so they carry a little
  // emissive of their own — enough to hold their colour on the shadow side, where a purely lit
  // orange goes brown and stops reading as the brand at all.
  const accent = new THREE.MeshStandardMaterial({
    color: ORANGE,
    metalness: 0.2,
    roughness: 0.55,
    emissive: new THREE.Color(ORANGE),
    emissiveIntensity: 0.28,
  });
  materials.push(steel, charcoalMat, accent);

  // --- Poster textures -------------------------------------------------------------------
  // Loaded async; panels render lit-but-white until their first texture arrives, which is
  // invisible in practice because the poster image covers the canvas until the first frame.
  const loader = new THREE.TextureLoader();
  const posters: THREE.Texture[] = [];
  for (let i = 0; i < POSTER_COUNT; i += 1) {
    // The redraw matters only under reduced motion, where the host has already drawn its single
    // frame by the time these arrive — without it the panels would stay blank in that one frame.
    const tex = loader.load(
      `/images/hero-panels/panel-${String(i + 1).padStart(2, '0')}.webp`,
      requestDraw,
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    posters.push(tex);
    textures.push(tex);
  }

  const rand = makeRandom(0x0acce55);
  const sign = () => (rand() > 0.5 ? 1 : -1);
  const floaters: Floater[] = [];
  const slideshows: Slideshow[] = [];

  const structureCtx: StructureCtx = {
    rand,
    steel,
    charcoal: charcoalMat,
    accent,
    geometries,
    materials,
    posters,
    dwell: DWELL,
    slideshows,
  };

  const TOTAL_OBJECTS = STRUCTURE_MIX.length;
  // Stratified, not uniform-random. With only ~15 draws, `rand()` across the full width clumps
  // — which is exactly what produced a left-heavy field. One object per column with jitter
  // guarantees even coverage by construction, so balance no longer depends on the seed.
  const columns = Array.from({ length: TOTAL_OBJECTS }, (_, i) => i);
  for (let i = columns.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [columns[i], columns[j]] = [columns[j], columns[i]];
  }
  let placed = 0;

  const place = (group: THREE.Group) => {
    const column = columns[placed];
    placed += 1;

    const spanX = 20;
    const cellW = spanX / TOTAL_OBJECTS;
    const x = -spanX / 2 + cellW * (column + lerp(0.15, 0.85, rand()));
    // Alternate high/low per column so the field does not settle into a horizontal band.
    const yBias = column % 2 === 0 ? lerp(0.4, 5.8, rand()) : lerp(-5.8, -0.4, rand());

    // The lockup owns the centre. Objects there are pushed deep rather than removed, so they
    // still pass behind the type the way they do in the reference.
    const central = Math.abs(x) < 3.2;
    const z = central ? lerp(-18, -11, rand()) : lerp(-16, -3.5, rand());

    group.position.set(x, yBias, z);
    group.quaternion.setFromEuler(
      new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
    );
    const floater: Floater = {
      group,
      spin: new THREE.Vector3(
        lerp(SPIN_X[0], SPIN_X[1], rand()) * sign(),
        lerp(SPIN_Y[0], SPIN_Y[1], rand()) * sign(),
        lerp(SPIN_Z[0], SPIN_Z[1], rand()) * sign(),
      ),
      velocity: new THREE.Vector3(
        lerp(DRIFT[0], DRIFT[1], rand()) * sign(),
        lerp(DRIFT[0], DRIFT[1], rand()) * sign(),
        0,
      ),
      impulse: new THREE.Vector3(),
      phase: rand() * Math.PI * 2,
      slideshow: group.userData.slideshow as Slideshow | undefined,
    };
    group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    group.userData.floater = floater;
    floaters.push(floater);
    scene.add(group);
  };

  const GRAND_FAMILIES = new Set<(typeof STRUCTURE_MIX)[number]>([buildMegaWall, buildUnipole]);
  const panelLights: THREE.PointLight[] = [];

  STRUCTURE_MIX.forEach((build, i) => {
    const group = build(structureCtx, i);
    if (GRAND_FAMILIES.has(build)) {
      const light = new THREE.PointLight(
        PANEL_LIGHT_COLOR,
        PANEL_LIGHT_INTENSITY,
        PANEL_LIGHT_RANGE,
        2,
      );
      // Sits just off the face, on the side the poster looks out of, so the light leaves the
      // structure rather than being trapped inside its own backing box.
      light.position.set(0, 0, 0.55);
      group.add(light);
      panelLights.push(light);
    }
    place(group);
  });

  // --- Monogram cloud shadow ----------------------------------------------------------------
  // Not an object in the scene: a shadow cast on the sky. That rules out geometry — an extruded
  // mark has a hard silhouette edge no material can soften, and a hard edge is exactly what
  // stops a shape reading as shadow. So the mark becomes a mask instead: filled, blurred, then
  // eaten into by the same kind of fBm noise the cirrus is built from, so its density breaks up
  // the way cloud cover does and no two parts of the edge fade at the same rate.
  //
  // It sits at −46, between the sky at −60 and the field's deepest structure at −18, so it
  // parallaxes with the backdrop rather than with the objects. Fog is off for the same reason it
  // is off for the sky: at that distance fog would flatten it to a uniform card.
  let disposed = false;
  const logoGeo = new THREE.PlaneGeometry(1, 1);
  const logoMaterial = new THREE.MeshBasicMaterial({
    color: 0x08070b,
    transparent: true,
    opacity: LOGO_OPACITY,
    depthWrite: false,
    fog: false,
  });
  geometries.push(logoGeo);
  materials.push(logoMaterial);
  const logoPlane = new THREE.Mesh(logoGeo, logoMaterial);
  logoPlane.position.set(LOGO_OFFSET_X, LOGO_OFFSET_Y, LOGO_Z);
  // Nothing to show until the mask arrives; an unmasked plane would be a black rectangle.
  logoPlane.visible = false;
  scene.add(logoPlane);

  void loadLogoShapes()
    .then((shapes) => {
      if (disposed) return;
      const mask = createLogoShadowTexture(shapes);
      if (!mask) return;
      textures.push(mask);
      logoMaterial.alphaMap = mask;
      logoMaterial.needsUpdate = true;
      logoPlane.scale.set(LOGO_HEIGHT * LOGO_ASPECT, LOGO_HEIGHT, 1);
      logoPlane.visible = true;
      // Under reduced motion the host has already drawn its one and only frame.
      requestDraw();
    })
    .catch(() => {
      // A missing or unparseable monogram costs the hero its backdrop, nothing more. The field
      // and the lockup are the hero; this is decoration and must never take them down.
    });


  // --- Lockup shadow --------------------------------------------------------------------
  const textShadowGeo = new THREE.PlaneGeometry(1, 1);
  const textShadowMat = new THREE.MeshBasicMaterial({
    color: 0x05040a,
    transparent: true,
    opacity: TEXT_SHADOW_OPACITY,
    depthWrite: false,
    // Sits in front of the sky, which opts out of fog for the same reason: at this distance fog
    // would wash it into a flat patch.
    fog: false,
  });
  geometries.push(textShadowGeo);
  materials.push(textShadowMat);
  const textShadow = new THREE.Mesh(textShadowGeo, textShadowMat);
  textShadow.position.z = TEXT_SHADOW_Z;
  textShadow.visible = false;
  scene.add(textShadow);
  let textShadowTexture: THREE.CanvasTexture | null = null;

  /** Half the visible frame at `z`, in world units. */
  const visibleHalfAt = (z: number) => {
    const distance = camera.position.z - z;
    const h = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
    return { x: h * camera.aspect, y: h };
  };

  /**
   * Match the shadow to where the lockup actually is on screen.
   *
   * The plane lives at a fixed depth, so its world size and position come from projecting the
   * element's screen rect out to that depth. Doing it this way rather than with hand-tuned world
   * coordinates means the shadow follows the type through every breakpoint and clamp() step for
   * free — and it has to, because a cast shadow that drifts off its caster reads as a bug
   * instantly.
   */
  /** Base placement, before any near-layer light is taken into account. */
  const textShadowBase = {
    /** Where the shadow sits on the receiver with no emitter, in world units. */
    centre: new THREE.Vector2(),
    size: new THREE.Vector2(),
    /** Where the type itself sits, at TEXT_PLANE_Z — the caster the projection works from. */
    caster: new THREE.Vector2(),
    ready: false,
  };
  /** Smoothed, so the shadow eases as the light moves rather than snapping frame to frame. */
  const textShadowThrow = new THREE.Vector2();

  const placeTextShadow = (rect: DOMRect) => {
    const canvasRect = renderer.domElement.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) return;
    const half = visibleHalfAt(TEXT_SHADOW_Z);
    const worldPerPxX = (half.x * 2) / canvasRect.width;
    const worldPerPxY = (half.y * 2) / canvasRect.height;

    // The mask carries blur padding on every side, so the plane is wider than the text itself.
    const padX = rect.width * TEXT_SHADOW_FEATHER * 3;
    textShadowBase.size.set(
      (rect.width + padX * 2) * worldPerPxX,
      (rect.height + padX * 2) * worldPerPxY,
    );

    const fx = (rect.left + rect.width / 2 - canvasRect.left) / canvasRect.width - 0.5;
    const fy = -((rect.top + rect.height / 2 - canvasRect.top) / canvasRect.height - 0.5);
    textShadowBase.centre.set(fx * half.x * 2, fy * half.y * 2);

    // Same screen position, resolved at the caster's depth rather than the receiver's.
    const casterHalf = visibleHalfAt(TEXT_PLANE_Z);
    textShadowBase.caster.set(fx * casterHalf.x * 2, fy * casterHalf.y * 2);
    textShadowBase.ready = true;
  };

  /**
   * Throw the lockup's shadow from whichever near-layer face is currently lit.
   *
   * This is the projection a shadow map would do, worked out directly: a caster at TEXT_PLANE_Z,
   * a receiver at TEXT_SHADOW_Z, and a light in front of both. The ratio of those two distances
   * to the light gives the magnification, and the offset falls out of it — the shadow slides away
   * from the light and grows as the light closes in, which is what makes dragging a near object
   * around read as moving a lamp rather than dragging a decal.
   *
   * Damped, because the honest numbers are unusable at this range — see the constants.
   */
  const updateTextShadow = (dt: number) => {
    if (!textShadowBase.ready) return;
    const emitter = getHeroEmitter();

    let targetX = TEXT_SHADOW_OFFSET.x;
    let targetY = TEXT_SHADOW_OFFSET.y;
    let growth = 1;

    // Only a light genuinely in front of the caster can throw its shadow backwards.
    if (emitter && emitter.z > TEXT_PLANE_Z) {
      const magnification = (TEXT_SHADOW_Z - emitter.z) / (TEXT_PLANE_Z - emitter.z);
      const excess = magnification - 1;
      targetX = (textShadowBase.caster.x - emitter.x) * excess * TEXT_SHADOW_THROW_DAMP;
      targetY = (textShadowBase.caster.y - emitter.y) * excess * TEXT_SHADOW_THROW_DAMP;
      growth = 1 + excess * TEXT_SHADOW_GROWTH_DAMP * emitter.strength;
    }

    // Frame-rate independent ease. dt is 0 on the reduced-motion frame, which lands it directly.
    const t = dt > 0 ? 1 - Math.exp(-TEXT_SHADOW_FOLLOW * dt) : 1;
    textShadowThrow.x += (targetX - textShadowThrow.x) * t;
    textShadowThrow.y += (targetY - textShadowThrow.y) * t;

    textShadow.scale.set(textShadowBase.size.x * growth, textShadowBase.size.y * growth, 1);
    textShadow.position.set(
      textShadowBase.centre.x + textShadowThrow.x,
      textShadowBase.centre.y + textShadowThrow.y,
      TEXT_SHADOW_Z,
    );
  };

  const buildTextShadow = () => {
    if (disposed) return;
    const el = document.querySelector<HTMLElement>('[data-hero-lockup]');
    if (!el) return;
    const built = createTextShadowMask(el);
    if (!built) return;
    textShadowTexture?.dispose();
    textShadowTexture = built.texture;
    textShadowMat.alphaMap = built.texture;
    textShadowMat.needsUpdate = true;
    placeTextShadow(built.rect);
    updateTextShadow(0);
    textShadow.visible = true;
    requestDraw();
  };

  // Wait for the webfont: measuring and rasterising before it lands gives a shadow shaped like
  // the fallback face, which is a different width entirely.
  if (document.fonts?.status === 'loaded') buildTextShadow();
  else void document.fonts?.ready.then(buildTextShadow).catch(() => {});

  const fitSky = () => {
    const distance = camera.position.z - SKY_Z;
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
    sky.scale.set(h * camera.aspect * 1.15, h * 1.15, 1);
  };
  fitSky();

  // Bloom operates on linear HDR values, which is why it sits before OutputPass: tone mapping
  // is applied only when three renders to the screen, so RenderPass hands over untone-mapped
  // colour and OutputPass maps it exactly once at the end.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD,
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  composer.setSize(width, height);

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hitTargets = floaters.map((f) => f.group);
  const dragPlane = new THREE.Plane();
  const dragPoint = new THREE.Vector3();
  const springForce = new THREE.Vector3();

  const drag = {
    floater: null as Floater | null,
    /** Where the held object is being pulled to. Written by the pointer, read by `update`. */
    target: new THREE.Vector3(),
    /** Pointer-to-centre offset at grab time, so the object does not snap under the cursor. */
    grab: new THREE.Vector3(),
    /** The spring's own velocity, which doubles as the throw velocity on release. That removes
     *  the second, much noisier estimate the throw used to be built from — per-event pointer
     *  deltas divided by per-event timestamps, smoothed by a frame-rate-dependent EMA. */
    vel: new THREE.Vector3(),
    /** The drift the object had before it was picked up, restored if it is set down gently. */
    resume: new THREE.Vector3(),
    moved: 0,
  };

  const pickFloater = (ndcX: number, ndcY: number): Floater | null => {
    ndc.set(ndcX, ndcY);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitTargets, true);
    if (!hits.length) return null;
    let node: THREE.Object3D | null = hits[0].object;
    while (node) {
      const floater = node.userData.floater as Floater | undefined;
      if (floater) return floater;
      node = node.parent;
    }
    return null;
  };

  const setDragPlane = (f: Floater) => {
    // Camera looks down −Z; a constant-Z plane through the object is enough for screen-space drag.
    dragPlane.set(new THREE.Vector3(0, 0, 1), -f.group.position.z);
  };

  const projectToDragPlane = (ndcX: number, ndcY: number, out: THREE.Vector3) => {
    ndc.set(ndcX, ndcY);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(dragPlane, out) !== null;
  };

  const kickFloater = (f: Floater) => {
    f.impulse.x += (Math.random() - 0.5) * CLICK_SPIN;
    f.impulse.y += (Math.random() - 0.5) * CLICK_SPIN * 1.35;
    f.impulse.z += (Math.random() - 0.5) * CLICK_SPIN * 0.55;
    f.velocity.x += (Math.random() - 0.5) * CLICK_DRIFT;
    f.velocity.y += (Math.random() - 0.5) * CLICK_DRIFT;
    // Force the next cross-fade immediately so a click always changes the face.
    if (f.slideshow && !f.slideshow.fading) {
      f.slideshow.hold = 0;
      f.slideshow.fading = true;
      f.slideshow.fade = 0;
    }
  };

  const commitThrow = (f: Floater) => {
    const speed = drag.vel.length();
    if (speed < THROW_MIN_SPEED) {
      // Set down rather than thrown: hand the object back the drift it arrived with, so it
      // rejoins the field instead of hanging dead in the air.
      f.velocity.copy(drag.resume);
      return;
    }
    const clamped = THREE.MathUtils.clamp(speed * 0.2, THROW_SPEED[0], THROW_SPEED[1]);
    f.velocity.copy(drag.vel).setLength(clamped);
    // Nudge tumble so the throw reads as a shove, not a teleport.
    f.spin.y = THREE.MathUtils.clamp(f.spin.y + drag.vel.x * 0.03, -0.18, 0.18);
    f.spin.x = THREE.MathUtils.clamp(f.spin.x - drag.vel.y * 0.025, -0.1, 0.1);
    if (f.slideshow && !f.slideshow.fading) {
      f.slideshow.hold = 0;
      f.slideshow.fading = true;
      f.slideshow.fade = 0;
    }
  };

  return {
    scene,
    camera,
    pointerMove(ndcX, ndcY) {
      if (drag.floater) return true;
      return pickFloater(ndcX, ndcY) !== null;
    },
    pointerDown(ndcX, ndcY) {
      const hit = pickFloater(ndcX, ndcY);
      if (!hit) return false;
      setDragPlane(hit);
      if (!projectToDragPlane(ndcX, ndcY, dragPoint)) return false;
      drag.floater = hit;
      drag.moved = 0;
      drag.vel.set(0, 0, 0);
      // Grab the object where it was clicked, not by its centre.
      drag.grab.subVectors(hit.group.position, dragPoint);
      drag.target.copy(hit.group.position);
      // Freeze steady drift while held so the pointer owns the motion, but remember it in case
      // this turns out to be a set-down rather than a throw.
      drag.resume.copy(hit.velocity);
      hit.velocity.set(0, 0, 0);
      return true;
    },
    pointerDrag(ndcX, ndcY) {
      const f = drag.floater;
      if (!f) return;
      setDragPlane(f);
      if (!projectToDragPlane(ndcX, ndcY, dragPoint)) return;
      // Only move the target here. The object itself is integrated once per frame in `update`,
      // which is what keeps the follow smooth however often the pointer reports.
      dragPoint.add(drag.grab);
      drag.moved += drag.target.distanceTo(dragPoint);
      drag.target.copy(dragPoint);
      // With no loop running there is no spring to integrate, so track the pointer exactly.
      if (reducedMotion) f.group.position.copy(dragPoint);
    },
    pointerUp() {
      const f = drag.floater;
      if (!f) return;
      if (drag.moved < TAP_SLOP) kickFloater(f);
      else commitThrow(f);
      drag.floater = null;
    },
    update(dt, elapsed) {
      const damp = Math.exp(-IMPULSE_DECAY * dt);
      const held = drag.floater;
      const dragDamp = 2 * Math.sqrt(DRAG_STIFFNESS) * DRAG_DAMPING;
      for (const f of floaters) {
        f.group.rotation.x += (f.spin.x + f.impulse.x) * dt;
        f.group.rotation.y += (f.spin.y + f.impulse.y) * dt;
        f.group.rotation.z += (f.spin.z + f.impulse.z) * dt;
        f.impulse.multiplyScalar(damp);

        if (f === held) {
          // Spring toward the pointer's target rather than snapping onto it: one step per
          // rendered frame, however fast the pointer reports.
          springForce
            .subVectors(drag.target, f.group.position)
            .multiplyScalar(DRAG_STIFFNESS)
            .addScaledVector(drag.vel, -dragDamp);
          drag.vel.addScaledVector(springForce, dt);
          f.group.position.addScaledVector(drag.vel, dt);
          // Lean into the sling. Fed continuously against the impulse decay, so it holds a
          // steady swirl while the object is moving and unwinds once it stops.
          f.impulse.y += THREE.MathUtils.clamp(drag.vel.x, -6, 6) * DRAG_SWIRL * dt;
          f.impulse.x -= THREE.MathUtils.clamp(drag.vel.y, -6, 6) * DRAG_SWIRL * dt;
          // Deliberately no idle drift and no recycling while held — wrapping the object to the
          // far edge mid-drag reads as it being yanked out of your hand.
          continue;
        }

        f.group.position.addScaledVector(f.velocity, dt);
        f.group.position.y += Math.sin(elapsed * 0.22 + f.phase) * 0.0016;

        // Wrap on each axis independently. Mirroring through the origin (the previous
        // approach) preserves any imbalance in the starting field and slowly amplifies it.
        if (f.group.position.x > RECYCLE_X) f.group.position.x = -RECYCLE_X;
        else if (f.group.position.x < -RECYCLE_X) f.group.position.x = RECYCLE_X;
        if (f.group.position.y > RECYCLE_Y) f.group.position.y = -RECYCLE_Y;
        else if (f.group.position.y < -RECYCLE_Y) f.group.position.y = RECYCLE_Y;
      }

      // Each panel runs its own slideshow clock, so the field never changes in unison.
      for (const s of slideshows) {
        if (s.fading) {
          s.fade += dt / FADE_SECONDS;
          if (s.fade >= 1) {
            // Land the fade by promoting B into A, then queue a new B. Advancing by a
            // co-prime-ish stride keeps neighbouring panels from converging on one poster.
            s.material.map = posters[s.next];
            s.material.emissiveMap = posters[s.next];
            s.current = s.next;
            s.next = (s.next + 5) % posters.length;
            s.material.userData.crossfade.uMapB.value = posters[s.next];
            s.material.userData.crossfade.uMix.value = 0;
            s.fade = 0;
            s.fading = false;
            s.hold = s.dwell;
          } else {
            s.material.userData.crossfade.uMix.value = smoothstep(s.fade);
          }
          continue;
        }
        s.hold -= dt;
        if (s.hold <= 0) s.fading = true;
      }

      // Drift the sky mesh, not the texture UVs. CanvasTexture defaults to ClampToEdgeWrapping,
      // so animating `offset` stretched the edge pixels right across the plane — that was the
      // horizontal smear over the whole background, not a stylistic choice.
      sky.position.x = Math.sin(elapsed * 0.012) * 1.6;
      sky.position.y = Math.cos(elapsed * 0.009) * 0.9;

      // Drifts with the sky and slightly faster, so it separates from the backdrop without ever
      // reading as one of the objects in the field.
      logoPlane.position.x = LOGO_OFFSET_X + Math.sin(elapsed * 0.017) * 2.4;
      logoPlane.position.y = LOGO_OFFSET_Y + Math.cos(elapsed * 0.013) * 1.3;

      updateTextShadow(dt);
    },
    render(r) {
      // The host would otherwise call renderer.render() directly and skip bloom entirely.
      void r;
      composer.render();
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer.setSize(w, h);
      fitSky();
      // The lockup is clamp()-sized, so a resize changes the caster's dimensions, not just the
      // projection — the mask itself has to be rebuilt, not merely repositioned.
      buildTextShadow();
    },
    dispose() {
      // Stops the monogram's pending load from building meshes into a scene that is going away.
      disposed = true;
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTexture.dispose();
      pmrem.dispose();
      textShadowTexture?.dispose();
      bloomPass.dispose();
      composer.dispose();
    },
  };
}
