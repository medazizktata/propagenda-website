import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { createBackdrop } from './backdrop';
import { createRoundedBox, type RoundedBoxOptions } from './roundedBox';
import { CHORUS, type ChorusSpec } from './chorus';
import { CHORUS_PRESET, PROTAGONIST_PRESET, createCubeMaterial } from './cubeMaterial';
import { createFaceAtlas } from './faceAtlas';
import { STUDIO } from './studio';
import { createStudioEnvironment } from './studioEnvironment';
import { FinishShader } from './finishShader';
import {
  BLANK_SLOT,
  CUBE_SERVICES,
  FACE_NY,
  FACE_PY,
  FRONT_FACE_CYCLE,
} from './services';

/** A long-ish lens. Wide-angle would splay the cube's verticals and make the type look drunk. */
const CAMERA_FOV = 34;
const CAMERA_DIST = 8.4;
const CUBE_SIZE = 2;

/**
 * Rest attitude. 30deg of yaw gives a proper three-quarter read — a broad front face plus a
 * narrow bright side — while keeping the front foreshortened by only ~13%, so the type is still
 * comfortably readable. Dead-on would be legible and lifeless; it would also stop reading as a
 * cube at all.
 */
const REST_YAW = -Math.PI / 6;
const TILT_X = THREE.MathUtils.degToRad(11);
const QUARTER = Math.PI / 2;

/**
 * Two levels of cube, sharing one builder and one shader.
 *
 * The split is a level of detail, not a difference of kind. The subject is ~330 CSS px across and
 * its edge roll is about twenty device pixels wide, which is where a rolling highlight is actually
 * legible and worth ten facets. A chorus cube is ~150 px with a roll barely three pixels wide; the
 * same segment count there would put several triangles inside a single pixel, and sub-pixel
 * triangles are the one way extra geometry does cost real money — every one of them rasterises as
 * a 2x2 quad, so the fragment shader runs again for coverage nobody can see.
 *
 * Both still get the crown, which costs four quads a face and is the only thing keeping a 150px
 * cube's specular from flashing on and off as a single flat plane.
 */
const PROTAGONIST_GEOMETRY: RoundedBoxOptions = {
  radius: 0.03,
  edgeSegments: 5,
  faceSegments: 8,
  crown: 0.013,
};

const CHORUS_GEOMETRY: RoundedBoxOptions = {
  radius: 0.03,
  edgeSegments: 3,
  faceSegments: 4,
  crown: 0.013,
};

const BEAT_SECONDS = 3.4;
/**
 * Critically-ish damped spring, omega = 9 rad/s and zeta = 0.72: the quarter turn lands in about
 * a second and settles with a ~4% overshoot. A spring rather than a tween because the follow-
 * through then comes out of the physics instead of being drawn on top of it.
 */
const SPRING_K = 81;
const SPRING_C = 12.96;
/** A kick against the direction of travel — the anticipation dip before the cube commits. */
const ANTICIPATION = 0.8;
/** Hand the new service name to the DOM once the turn is this far along. */
const ANNOUNCE_AT = 0.45;

/**
 * Total rendered pixels, roughly a 2560x1720 frame. Device pixel ratio is capped at 2 as required,
 * but a cap alone is not a budget: at DPR 2 a 1440x900 viewport is 5.2M pixels through four
 * full-screen passes, which measured at 17.7ms median here, and a 4K panel would be 33M. The
 * budget steps the ratio down instead — 1.84 at 1440x900, still 2 on any phone — which is
 * invisible on type drawn from a 1024px tile and is the difference between 56fps and 60.
 */
const MAX_PIXELS = 4.4e6;

export interface CubeSceneOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  reducedMotion: boolean;
  /** Fires mid-turn, when the incoming face has visibly taken over. */
  onService: (index: number) => void;
  onReady: () => void;
}

export interface CubeSceneHandle {
  setActive(active: boolean): void;
  setPointer(x: number, y: number): void;
  resize(): void;
  dispose(): void;
}

interface Layout {
  /** Subject position in NDC, so the framing holds from 390px to ultrawide. */
  nx: number;
  ny: number;
  /** Multiplier on CUBE_SIZE. In portrait this is derived rather than art-directed; see below. */
  scale: number;
  portrait: boolean;
}

/** Worst-case silhouette of a unit cube under this rig, as it yaws through 45deg and tilts 11deg. */
const SILHOUETTE_W = 1.45;
const SILHOUETTE_H = 1.3;
/** How close to the frame edge anything is ever allowed to sit. */
const EDGE_MARGIN = 0.04;
/**
 * In portrait, nothing may reach above this in NDC. The site header sits across the top ~7% of a
 * phone screen, and a chorus cube drifting up behind the nav reads as a bug rather than as depth.
 * Landscape does not need it: there the subject is off to one side and the field is behind it.
 */
const PORTRAIT_HEADER_KEEP_OUT = 0.82;

const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV) / 2);

/** Half of what the camera can see, in world units, at a given distance in front of it. */
function visibleHalf(viewDepth: number, aspect: number): { w: number; h: number } {
  const h = TAN_HALF_FOV * viewDepth;
  return { h, w: h * aspect };
}

function clamp(value: number, limit: number): number {
  return Math.min(limit, Math.max(-limit, value));
}

/**
 * The breakpoint that matters here is the frame's *shape*, not the viewport's width. A 768x1024
 * tablet held upright is a portrait composition and wants the phone treatment; the same tablet
 * turned sideways is a landscape composition and wants the desktop one. Switching on width alone
 * would have put the subject at 65% across on an upright iPad, straight through the headline.
 */
function layoutFor(width: number, height: number): Layout {
  const aspect = width / height;

  if (aspect < 0.95) {
    const { w, h } = visibleHalf(CAMERA_DIST, aspect);
    // Derived, not chosen: size the subject so its silhouette fills 72% of the frame's width,
    // unless that would make it taller than 34% of the frame, in which case height wins. On a
    // 390x844 phone width binds; on a 768x1024 tablet height does. Either way the subject is as
    // large as it can be without crowding the type or touching an edge.
    const byWidth = (2 * w * 0.72) / (CUBE_SIZE * SILHOUETTE_W);
    const byHeight = (2 * h * 0.34) / (CUBE_SIZE * SILHOUETTE_H);
    return { nx: 0, ny: 0.36, scale: Math.min(byWidth, byHeight), portrait: true };
  }

  const layout: Layout =
    width >= 1024
      ? { nx: 0.42, ny: 0.06, scale: 1, portrait: false }
      : { nx: 0.26, ny: 0.2, scale: 0.84, portrait: false };
  // Landscape phones and short laptop windows: give the words their room back.
  if (height < 620) layout.scale *= 0.82;
  return layout;
}

function pixelRatioFor(width: number, height: number): number {
  const device = Math.min(window.devicePixelRatio || 1, 2);
  const budget = Math.sqrt(MAX_PIXELS / Math.max(1, width * height));
  return Math.max(1, Math.min(device, budget));
}

/** Frame-rate independent exponential damping. */
function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function createCubeScene(options: CubeSceneOptions): CubeSceneHandle {
  const { canvas, container, reducedMotion, onService, onReady } = options;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    // The constructor flag only anti-aliases the default framebuffer, and every frame here goes
    // through an EffectComposer into an offscreen target instead — so it would do nothing but
    // allocate a multisampled backbuffer nobody draws to. MSAA is requested on the composer's
    // render target further down, which is the surface that actually receives the geometry.
    antialias: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Khronos PBR Neutral, not ACES. The scene is still HDR — the key panel in the environment
  // blows well past 1.0 — so it needs a curve, and Neutral is built to leave in-gamut colour
  // alone and only roll off the highlights rather than desaturating them the way ACES does.
  // (This used to also be load-bearing for keeping the lit face's saturated orange on-hex, which
  // ACES cannot reproduce; that colourway is gone, but Neutral is still the right call for the
  // panel highlights alone.)
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.9;
  renderer.setClearColor(0x000000, 1);

  let width = Math.max(1, container.clientWidth);
  let height = Math.max(1, container.clientHeight);
  let pixelRatio = pixelRatioFor(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.5, 40);
  camera.position.set(0, 0, CAMERA_DIST);

  const backdrop = createBackdrop();
  scene.add(backdrop.mesh);

  // The ambient half of the rig. Built once at mount and prefiltered, it is what the chamfers
  // actually reflect; without it every specular in the scene is a mathematical blob at a light's
  // half-vector and the surfaces read as painted.
  const environment = createStudioEnvironment(renderer);
  scene.environment = environment.texture;

  // ── The rig. Three directionals, no shadow maps. Nothing here stands on anything, so a shadow
  // pass per light would buy a contact shadow onto empty space at the price of three extra draws
  // of the whole scene every frame.
  //
  // Key: warm, high and camera-right, aimed along the same line as the environment's key panel.
  // It is what puts the bright band down the narrow side face and along the top chamfers.
  const key = new THREE.DirectionalLight(new THREE.Color(STUDIO.key.color), 2.5);
  key.position.set(6.2, 4.8, 3.4);
  scene.add(key);

  // Fill: cool, and deliberately a different temperature from the key. This is the single
  // decision that stops the form dying — a shadow side lit in the same hue as the lit side just
  // reads as the same paint, darker, and the cube goes flat no matter how strong the key is.
  // Intensity comes from STUDIO rather than a literal here, so raising the shadow side's ambient
  // level is one number in studio.ts instead of a hunt through both this rig and the IBL panel.
  const fill = new THREE.DirectionalLight(new THREE.Color(STUDIO.fill.color), STUDIO.fill.intensity);
  fill.position.set(-6.4, 3.6, 0.5);
  scene.add(fill);

  // Back: a hard, near-white separation light from behind and left, so the silhouette lifts off
  // a near-black backdrop instead of dissolving into it.
  const back = new THREE.DirectionalLight(new THREE.Color(STUDIO.rim.color), 0.85);
  back.position.set(-2.2, 2.4, -7.0);
  scene.add(back);

  const tileSize = width < 768 ? 512 : 1024;
  const atlas = createFaceAtlas(tileSize, renderer);
  // One texel of the atlas, for the material's four-tap deboss gradient.
  const atlasTexel = new THREE.Vector2(1 / (tileSize * 4), 1 / (tileSize * 2));

  const protagonistMaterial = createCubeMaterial(atlas.texture, atlasTexel, PROTAGONIST_PRESET);

  /** Parallax acts on this, so the subject and its field swing together as one object. */
  const parallax = new THREE.Group();
  scene.add(parallax);
  const group = new THREE.Group();
  parallax.add(group);

  // Face 0 of the marquee is the +Z face; the other three side faces are pre-loaded with the
  // services that will arrive over the next three turns. Both poles stay blank.
  const slots = [0, 0, BLANK_SLOT, BLANK_SLOT, 0, 0];
  FRONT_FACE_CYCLE.forEach((face, i) => {
    slots[face] = i % CUBE_SERVICES.length;
  });
  slots[FACE_PY] = BLANK_SLOT;
  slots[FACE_NY] = BLANK_SLOT;

  protagonistMaterial.setFaceSlots(slots);

  const protagonistGeometry = createRoundedBox(PROTAGONIST_GEOMETRY);
  const protagonist = new THREE.Mesh(protagonistGeometry, protagonistMaterial.material);
  protagonist.scale.setScalar(CUBE_SIZE);
  group.add(protagonist);

  // ── The chorus, as one draw ─────────────────────────────────────────────────────────────
  // Eight meshes with eight geometries and eight materials became one InstancedMesh with one of
  // each. What used to make them un-shareable was the atlas: every cube shows a different set of
  // services, which meant a different uv buffer per cube. The tile lookup now happens in the
  // vertex shader from a per-instance offset (see cubeMaterial), so the buffer is identical for
  // all of them — which is what makes it affordable for a background cube to be 1,200 triangles
  // instead of 44 rather than 8 x 1,200 sitting in VRAM.
  interface ChorusItem {
    spec: ChorusSpec;
    /** Rest position, before drift. Rewritten per layout; portrait places these by frustum. */
    origin: THREE.Vector3;
    /** Portrait overrides the spec's scale, so this is not always spec.scale. */
    cubeScale: number;
    /** Per-cube roughness seed and the tint it produces, both fixed at mount. */
    variation: number;
    faceDark: THREE.Color;
  }

  const chorusGeometry = createRoundedBox(CHORUS_GEOMETRY);
  const chorusMaterial = createCubeMaterial(atlas.texture, atlasTexel, CHORUS_PRESET, {
    instanced: true,
  });
  // Face i starts on tile i; the per-instance offset rotates the whole set, which reproduces the
  // old `(slotOffset + i) % 8` exactly.
  chorusMaterial.setFaceSlots([0, 1, 2, 3, 4, 5]);

  const chorus: ChorusItem[] = CHORUS.map((spec, index) => {
    const variation = (index * 0.37) % 1;
    const faceDark = new THREE.Color(CHORUS_PRESET.faceDark);
    // A couple of per-cube degrees of tint drift. Identical material on every cube is the tell
    // that says "instanced" — which it now literally is, so this matters more than it did.
    faceDark.offsetHSL(0, (variation - 0.5) * 0.05, (variation - 0.5) * 0.035);
    return {
      spec,
      origin: new THREE.Vector3(...spec.pos),
      cubeScale: spec.scale,
      variation,
      faceDark,
    };
  });

  const chorusMesh = new THREE.InstancedMesh(
    chorusGeometry,
    chorusMaterial.material,
    chorus.length,
  );
  chorusMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  // Every instance is placed inside the frame by applyLayout and every matrix changes each frame,
  // so a bounding-sphere rebuild per frame would buy a cull that can never fire.
  chorusMesh.frustumCulled = false;
  group.add(chorusMesh);

  const chorusSlotOffset = new THREE.InstancedBufferAttribute(new Float32Array(chorus.length), 1);
  const chorusVariation = new THREE.InstancedBufferAttribute(new Float32Array(chorus.length), 1);
  const chorusFaceDark = new THREE.InstancedBufferAttribute(new Float32Array(chorus.length * 3), 3);
  chorusGeometry.setAttribute('aSlotOffset', chorusSlotOffset);
  chorusGeometry.setAttribute('aVariation', chorusVariation);
  chorusGeometry.setAttribute('aFaceDark', chorusFaceDark);

  /**
   * The cubes currently in frame, packed to the front of the instance buffer.
   *
   * Packing rather than leaning on a sort order: which cubes show depends on both the viewport
   * width and the frame's shape, and an InstancedMesh can only draw a prefix. Repacking happens
   * on layout — a resize, not a frame — so it costs nothing per frame and cannot be broken by a
   * later edit to the chorus list.
   */
  const onStage: ChorusItem[] = [];

  // ── Post ────────────────────────────────────────────────────────────────────────────────
  // Four MSAA samples on the composer's target. This has to live here rather than on the renderer
  // — `new WebGLRenderer({ antialias: true })` only ever touches the default framebuffer, and
  // every frame here is drawn into an offscreen target instead, so that flag would allocate a
  // multisampled backbuffer nothing renders to.
  //
  // Four rather than two because the hardest case in frame is a bright one-pixel chamfer
  // highlight raked away from camera against a near-black ground, and two samples still step
  // visibly on it. Four rather than eight because 4 is the floor every WebGL2 implementation
  // guarantees and is what MAX_SAMPLES actually reports on a good deal of hardware; asking for
  // more buys nothing there and costs bandwidth where it is honoured.
  //
  // The chamfer geometry is what makes MSAA able to help at all. Before it, the edge highlight
  // was a band drawn inside a triangle by the shader, and no amount of multisampling touches
  // that — multisampling only anti-aliases silhouettes.
  const samples = 4;
  const renderTarget = new THREE.WebGLRenderTarget(
    Math.round(width * pixelRatio),
    Math.round(height * pixelRatio),
    { type: THREE.HalfFloatType, samples },
  );
  const composer = new EffectComposer(renderer, renderTarget);
  composer.setPixelRatio(pixelRatio);
  composer.setSize(width, height);

  composer.addPass(new RenderPass(scene, camera));

  // Bloom is deliberately starved: the threshold sits well above the panels' printed-type
  // luminance, so it catches only the brightest specular hits off the key light. Letting it touch
  // a face's type would smear it, which is the one thing this hero cannot afford — the first pass
  // ran it three times hotter and put a white haze along every top edge. (Originally tuned to also
  // sit above the lit face's emissive luminance, back when a face turned brand orange; that
  // colourway is gone, but the type-legibility constraint the threshold protects is unchanged.)
  // Decided once, from the width at mount: a phone that is later rotated into landscape keeps
  // the cheaper chain, which is the right way round for a battery-powered device.
  if (width >= 768) {
    composer.addPass(
      new UnrealBloomPass(
        // Half resolution going in, and UnrealBloomPass halves again internally: the pyramid
        // starts at a quarter and the effect is a wide soft glow that loses nothing to it.
        new THREE.Vector2(
          Math.round((width * pixelRatio) / 2),
          Math.round((height * pixelRatio) / 2),
        ),
        0.28,
        0.42,
        0.8,
      ),
    );
  }

  composer.addPass(new OutputPass());

  // An SMAAPass was built here and then taken out. Measured at 1440x741 / DPR 2 it cost
  // +4.6ms a frame — 15.2ms median went to 19.8ms, and 90 frames in 230 crossed 20ms — which
  // breaks the 60fps floor this hero is held to. What it was there to fix is instead fixed at
  // source: the chamfer turned every edge highlight into real geometry that MSAA can resolve,
  // and the specular crawl along those chamfers is handled analytically in the material (see the
  // normal chunk in cubeMaterial.ts) for about six instructions instead of three full-screen
  // passes.

  const finishPass = new ShaderPass(FinishShader);
  (finishPass.uniforms.uResolution.value as THREE.Vector2).set(
    width * pixelRatio,
    height * pixelRatio,
  );
  composer.addPass(finishPass);

  // ── Framing ─────────────────────────────────────────────────────────────────────────────
  function applyLayout(): void {
    const aspect = width / height;
    const layout = layoutFor(width, height);
    const subject = visibleHalf(CAMERA_DIST, aspect);

    // Clamp the art direction against the frustum rather than trusting it. Whatever nx the
    // breakpoint asked for, the subject's widest silhouette cannot cross the frame edge — which
    // is the failure mode that does not announce itself: nothing errors, an object is just never
    // in shot, or half of it hangs off the side.
    const subjectRadiusX = (CUBE_SIZE * layout.scale * SILHOUETTE_W) / 2 / subject.w;
    const subjectRadiusY = (CUBE_SIZE * layout.scale * SILHOUETTE_H) / 2 / subject.h;
    const nx = clamp(layout.nx, Math.max(0, 1 - subjectRadiusX - EDGE_MARGIN));
    const ny = clamp(layout.ny, Math.max(0, 1 - subjectRadiusY - EDGE_MARGIN));

    group.position.set(nx * subject.w, ny * subject.h, 0);
    group.scale.setScalar(layout.scale);

    // The pool of light tracks the subject and sits a touch below it, the way a spill would.
    backdrop.setFocus(0.5 + nx / 2, 0.5 + ny / 2 - 0.04);
    backdrop.setAspect(aspect);

    onStage.length = 0;
    for (const item of chorus) {
      const { spec } = item;
      // In portrait the field is exactly the three cubes that were placed for it. The others are
      // positioned in world units against a landscape frustum; letting them through on a tall
      // frame is how objects end up outside the view with nothing to signal it.
      const onScreen = layout.portrait ? spec.portrait !== undefined : width >= spec.minWidth;
      if (!onScreen) continue;
      const portrait = layout.portrait ? spec.portrait : undefined;

      item.cubeScale = portrait ? portrait.scale : spec.scale;

      if (portrait) {
        // Placed against what is actually visible at this cube's own depth, then clamped with
        // room left for its drift, so a portrait frame can never lose one off the edge.
        const depth = CAMERA_DIST - layout.scale * portrait.z;
        const view = visibleHalf(depth, aspect);
        const driftX = (spec.drift * 0.6 * layout.scale) / view.w;
        const driftY = (spec.drift * layout.scale) / view.h;
        const radiusX = (CUBE_SIZE * item.cubeScale * layout.scale * SILHOUETTE_W) / 2 / view.w;
        const radiusY = (CUBE_SIZE * item.cubeScale * layout.scale * SILHOUETTE_H) / 2 / view.h;
        const fx = clamp(portrait.fx, Math.max(0, 1 - radiusX - driftX - EDGE_MARGIN));
        const fy = Math.min(
          clamp(portrait.fy, Math.max(0, 1 - radiusY - driftY - EDGE_MARGIN)),
          PORTRAIT_HEADER_KEEP_OUT - radiusY - driftY,
        );
        item.origin.set(
          (fx * view.w - group.position.x) / layout.scale,
          (fy * view.h - group.position.y) / layout.scale,
          portrait.z,
        );
      } else {
        item.origin.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      }

      const slot = onStage.length;
      chorusSlotOffset.setX(slot, spec.slotOffset);
      chorusVariation.setX(slot, item.variation);
      chorusFaceDark.setXYZ(slot, item.faceDark.r, item.faceDark.g, item.faceDark.b);
      onStage.push(item);
    }
    chorusMesh.count = onStage.length;
    chorusSlotOffset.needsUpdate = true;
    chorusVariation.needsUpdate = true;
    chorusFaceDark.needsUpdate = true;
  }
  applyLayout();

  // ── Beat machine ────────────────────────────────────────────────────────────────────────
  let spinAngle = REST_YAW;
  let spinTarget = REST_YAW;
  let spinVelocity = 0;
  let spinStart = REST_YAW;
  let beatIndex = 0;
  let beatClock = 0;
  let announced = true;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;

  const spinQuat = new THREE.Quaternion();
  const tiltQuat = new THREE.Quaternion();
  const spinAxis = new THREE.Vector3(0, 1, 0);
  const tiltEuler = new THREE.Euler();

  // Scratch for the chorus's instance matrices, allocated once. Composing eight matrices a frame
  // is the same arithmetic three's Object3D.updateMatrix was doing for eight meshes before.
  const chorusMatrix = new THREE.Matrix4();
  const chorusQuat = new THREE.Quaternion();
  const chorusEuler = new THREE.Euler();
  const chorusPos = new THREE.Vector3();
  const chorusScale = new THREE.Vector3();

  function triggerBeat(): void {
    beatIndex += 1;
    spinStart = spinTarget;
    spinTarget -= QUARTER;
    // Positive kick against a negative travel: the cube leans back before it commits.
    spinVelocity += ANTICIPATION;

    // Repaint the face that is currently at the back, two turns before it is seen. This is what
    // lets six faces carry seven services forever — the cube is a marquee, not a die.
    const backFace = FRONT_FACE_CYCLE[(beatIndex + 2) % FRONT_FACE_CYCLE.length];
    slots[backFace] = (beatIndex + 2) % CUBE_SERVICES.length;
    // Six floats into a uniform. It used to rewrite 48 uv floats and re-upload the buffer; the
    // face being repainted is always at the back of the cube either way, so the change is culled
    // before anyone could see it happen.
    protagonistMaterial.setFaceSlots(slots);

    announced = false;
  }

  function updateProtagonist(): void {
    spinQuat.setFromAxisAngle(spinAxis, spinAngle);
    // A slow breath on the pitch so the two-and-a-half second dwell is never actually still.
    tiltEuler.set(TILT_X + Math.sin(elapsed * 0.42) * 0.012, 0, 0);
    tiltQuat.setFromEuler(tiltEuler);
    protagonist.quaternion.copy(tiltQuat).multiply(spinQuat);
    protagonist.position.set(
      Math.sin(elapsed * 0.31 + 1.7) * 0.03,
      Math.sin(elapsed * 0.55) * 0.045,
      0,
    );
  }

  function updateChorus(): void {
    for (let i = 0; i < onStage.length; i += 1) {
      const { spec, origin, cubeScale } = onStage[i];
      chorusEuler.set(spec.tilt[0], spec.tilt[1] + elapsed * spec.rate, spec.tilt[2]);
      chorusQuat.setFromEuler(chorusEuler);
      const wave = elapsed * spec.driftRate + spec.phase;
      chorusPos.set(
        origin.x + Math.cos(wave * 0.73) * spec.drift * 0.6,
        origin.y + Math.sin(wave) * spec.drift,
        origin.z,
      );
      chorusScale.setScalar(cubeScale * CUBE_SIZE);
      chorusMatrix.compose(chorusPos, chorusQuat, chorusScale);
      chorusMesh.setMatrixAt(i, chorusMatrix);
    }
    chorusMesh.instanceMatrix.needsUpdate = true;
  }

  function update(dt: number): void {
    elapsed += dt;

    beatClock += dt;
    if (beatClock >= BEAT_SECONDS) {
      beatClock -= BEAT_SECONDS;
      triggerBeat();
    }

    // Fixed substeps keep the spring stable if a frame is late.
    let remaining = dt;
    while (remaining > 0) {
      const step = Math.min(remaining, 1 / 120);
      spinVelocity += (SPRING_K * (spinTarget - spinAngle) - SPRING_C * spinVelocity) * step;
      spinAngle += spinVelocity * step;
      remaining -= step;
    }

    if (!announced) {
      const travelled = (spinStart - spinAngle) / QUARTER;
      if (travelled >= ANNOUNCE_AT) {
        announced = true;
        onService(beatIndex % CUBE_SERVICES.length);
      }
    }

    updateProtagonist();
    updateChorus();

    pointerX = damp(pointerX, pointerTargetX, 4.5, dt);
    pointerY = damp(pointerY, pointerTargetY, 4.5, dt);
    // Kept under 4deg: any more and the rest pose would swing far enough for the front face to
    // slip out of the shader's "lit" window and the type-dim easing would flicker (this used to
    // flicker the face's orange colourway; that's gone, but the same window still gates typeDim).
    parallax.rotation.y = pointerX * 0.055;
    parallax.rotation.x = -pointerY * 0.04;

    finishPass.uniforms.uTime.value = elapsed % 60;
    backdrop.setTime(elapsed);
  }

  // ── Loop ────────────────────────────────────────────────────────────────────────────────
  let rafId = 0;
  let active = false;
  let disposed = false;
  let resizePending = false;
  let lastFrame = 0;

  function handleResize(): void {
    const nextWidth = Math.max(1, container.clientWidth);
    const nextHeight = Math.max(1, container.clientHeight);
    if (nextWidth === width && nextHeight === height) return;

    width = nextWidth;
    height = nextHeight;
    pixelRatio = pixelRatioFor(width, height);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    (finishPass.uniforms.uResolution.value as THREE.Vector2).set(
      width * pixelRatio,
      height * pixelRatio,
    );
    applyLayout();
  }

  function renderFrame(): void {
    if (resizePending) {
      resizePending = false;
      handleResize();
    }
    composer.render();
  }

  function tick(): void {
    rafId = requestAnimationFrame(tick);
    // Clamped so a background stall (or a breakpoint on the main thread) cannot fire the beat
    // machine several times in one frame.
    const now = performance.now();
    const dt = Math.min((now - lastFrame) / 1000, 1 / 20);
    lastFrame = now;
    update(dt);
    renderFrame();
  }

  function handleContextLost(event: Event): void {
    // Without preventDefault the context never comes back and the loop would keep drawing into
    // a dead renderer; stopping is the honest response — the DOM layer carries the content.
    event.preventDefault();
    active = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }
  canvas.addEventListener('webglcontextlost', handleContextLost);

  // Compose the opening frame before anything is shown, so the hero fades up already resolved
  // rather than snapping into position.
  updateProtagonist();
  updateChorus();
  renderFrame();
  onService(0);
  onReady();

  return {
    setActive(next: boolean) {
      if (disposed || reducedMotion || next === active) return;
      active = next;
      if (next) {
        // Re-stamping the clock stops the time spent hidden from arriving as one huge delta.
        lastFrame = performance.now();
        rafId = requestAnimationFrame(tick);
      } else {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      }
    },
    setPointer(x: number, y: number) {
      if (reducedMotion) return;
      pointerTargetX = x;
      pointerTargetY = y;
    },
    resize() {
      if (disposed) return;
      if (active) {
        // Defer to the loop: ResizeObserver fires many times through a window drag and
        // reallocating four render targets per event is what makes a resize feel broken.
        resizePending = true;
      } else {
        handleResize();
        renderFrame();
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      active = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      // composer.dispose() releases both of its render targets, including the one handed in.
      for (const pass of composer.passes) pass.dispose();
      composer.dispose();

      protagonistGeometry.dispose();
      chorusGeometry.dispose();
      chorusMesh.dispose();
      protagonistMaterial.dispose();
      chorusMaterial.dispose();
      backdrop.dispose();
      atlas.dispose();
      environment.dispose();
      scene.environment = null;
      scene.clear();

      renderer.dispose();
      // StrictMode mounts effects twice in development; without an explicit context loss the
      // first renderer's context lingers and the browser starts evicting live ones.
      renderer.forceContextLoss();
    },
  };
}
