import * as THREE from 'three';
import type { HeroScene, HeroSceneContext } from './types';

/**
 * First-cut billboard field. Geometry is procedural stand-in for the GLTF structures that land
 * in TASK-3.4; everything else — camera, palette, lighting, and above all the motion model — is
 * the real thing, taken from the measurements in `docs/rework/reel-hero-dissection.md` §2.5.
 *
 * Palette is translated to brand (orange #f58b27 on charcoal #121212), not copied from the
 * reference, which is coral red and cream on teal — see TASK-3 for that decision.
 */

const ORANGE = 0xf58b27;
const CHARCOAL = 0x121212;
const STEEL = 0x8d8f93;

/** Measured in the reference: 2–5 deg/s about Y, so a full turn takes 70–180 s. */
const SPIN_Y = [0.035, 0.09] as const;
const SPIN_X = [0.01, 0.035] as const;
const SPIN_Z = [0.004, 0.015] as const;
/** ~0.5–1.5 % of viewport width per second. */
const DRIFT = [0.02, 0.06] as const;
const OBJECT_COUNT = 14;
/** Distance at which an object is recycled to the opposite side of the field. */
const RECYCLE_RADIUS = 9;
const SKY_Z = -45;

/** Deterministic RNG — a fixed field beats a different composition on every reload. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Warm amber-to-charcoal sky, drawn once into a canvas texture. Stands in for the photographic
 * sky plate; it also feeds the environment map, which is where most of the "photoreal" read
 * comes from (the sky-coloured shadow side and the speculars travelling along the steel).
 */
function createSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#0b0b0d');
  grad.addColorStop(0.42, '#241a16');
  grad.addColorStop(0.72, '#7a4a1e');
  grad.addColorStop(1, '#f0a95c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cirrus band running lower-left to upper-right, matching the reference's streak direction.
  const rand = makeRandom(20260908);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i += 1) {
    const y = lerp(canvas.height * 0.45, canvas.height * 1.05, rand());
    const h = lerp(6, 26, rand());
    const alpha = lerp(0.015, 0.06, rand());
    const band = ctx.createLinearGradient(0, y, canvas.width, y - canvas.height * 0.3);
    band.addColorStop(0, 'rgba(255,214,168,0)');
    band.addColorStop(0.5, `rgba(255,214,168,${alpha})`);
    band.addColorStop(1, 'rgba(255,214,168,0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, y, canvas.width, h);
  }
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type Floater = {
  group: THREE.Group;
  spin: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
};

/** A panel on a mast — the "unipole" family, the simplest of the four in the reference. */
function buildStructure(
  rand: () => number,
  steel: THREE.Material,
  panel: THREE.Material,
  disposables: THREE.BufferGeometry[],
): THREE.Group {
  const group = new THREE.Group();

  const w = lerp(1.1, 1.9, rand());
  const h = w / lerp(1.7, 2.1, rand());

  const faceGeo = new THREE.PlaneGeometry(w, h);
  disposables.push(faceGeo);
  const face = new THREE.Mesh(faceGeo, panel);
  group.add(face);

  const frameGeo = new THREE.BoxGeometry(w * 1.04, h * 1.06, 0.05);
  disposables.push(frameGeo);
  const frame = new THREE.Mesh(frameGeo, steel);
  frame.position.z = -0.04;
  group.add(frame);

  const mastGeo = new THREE.CylinderGeometry(0.045, 0.055, h * 1.5, 8);
  disposables.push(mastGeo);
  const mast = new THREE.Mesh(mastGeo, steel);
  mast.position.y = -h * 1.05;
  group.add(mast);

  // Cross-bracing behind the panel — the open lattice is what stops it reading as a sticker
  // when it rotates through edge-on.
  for (let i = -1; i <= 1; i += 2) {
    const braceGeo = new THREE.CylinderGeometry(0.02, 0.02, h * 0.9, 6);
    disposables.push(braceGeo);
    const brace = new THREE.Mesh(braceGeo, steel);
    brace.position.set(i * w * 0.28, -h * 0.5, -0.12);
    brace.rotation.z = i * 0.42;
    group.add(brace);
  }

  return group;
}

export function createPlaceholderScene(ctx: HeroSceneContext): HeroScene {
  // `reducedMotion` is handled by the host: it draws exactly one frame and never starts the
  // loop, so the scene only has to look complete at elapsed = 0.
  const { renderer, width, height } = ctx;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 120);
  camera.position.set(0, 0, 6);
  camera.lookAt(0, 0, 0);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const skyTexture = createSkyTexture();
  textures.push(skyTexture);

  // Sky sits ~7x further out than the objects, which is what produces the parallax separation
  // measured in the reference (sky drifts ~1-3 %/s while objects change up to 7 %/s).
  const skyGeo = new THREE.PlaneGeometry(1, 1);
  geometries.push(skyGeo);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, depthWrite: false });
  materials.push(skyMat);
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.z = SKY_Z;
  sky.renderOrder = -1;
  scene.add(sky);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromEquirectangular(skyTexture).texture;
  scene.environment = envTexture;
  scene.background = new THREE.Color(CHARCOAL);

  const key = new THREE.DirectionalLight(0xffd9a8, 2.4);
  key.position.set(6, 5, 4);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xf0a95c, 0x121212, 0.6));

  const steel = new THREE.MeshStandardMaterial({
    color: STEEL,
    metalness: 0.85,
    roughness: 0.45,
  });
  // DoubleSide with un-flipped back-face UVs is deliberate: in the reference roughly half the
  // panels read mirrored, and that artefact is a large part of why the field reads as genuinely
  // three-dimensional. See TASK-3.4 — do not "fix" it.
  const panel = new THREE.MeshStandardMaterial({
    color: ORANGE,
    metalness: 0,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });
  materials.push(steel, panel);

  const rand = makeRandom(0x0acce55);
  const floaters: Floater[] = [];

  for (let i = 0; i < OBJECT_COUNT; i += 1) {
    const group = buildStructure(rand, steel, panel, geometries);
    group.position.set(
      lerp(-6.5, 6.5, rand()),
      lerp(-4, 4, rand()),
      lerp(-7, 1.5, rand()),
    );
    // A random starting orientation stops the field looking combed on first frame.
    group.quaternion.setFromEuler(
      new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
    );

    const sign = () => (rand() > 0.5 ? 1 : -1);
    floaters.push({
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
      phase: rand() * Math.PI * 2,
    });
    scene.add(group);
  }

  const fitSky = () => {
    // Cover the frustum at the sky's depth, with margin so drift never exposes an edge.
    const distance = camera.position.z - SKY_Z;
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
    sky.scale.set(h * camera.aspect * 1.12, h * 1.12, 1);
  };
  fitSky();

  return {
    scene,
    camera,
    update(dt, elapsed) {
      // Delta-integrated with no easing — the reference showed constant rates across its whole
      // run, so anything tweened or eased reads wrong.
      for (const f of floaters) {
        f.group.rotation.x += f.spin.x * dt;
        f.group.rotation.y += f.spin.y * dt;
        f.group.rotation.z += f.spin.z * dt;
        f.group.position.addScaledVector(f.velocity, dt);
        f.group.position.y += Math.sin(elapsed * 0.22 + f.phase) * 0.0016;

        if (f.group.position.lengthSq() > RECYCLE_RADIUS * RECYCLE_RADIUS) {
          f.group.position.multiplyScalar(-0.92);
        }
      }
      // Sky drifts an order of magnitude slower than the field.
      skyTexture.offset.x = (elapsed * 0.0015) % 1;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fitSky();
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTexture.dispose();
      pmrem.dispose();
    },
  };
}
