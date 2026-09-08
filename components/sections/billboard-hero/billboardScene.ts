import * as THREE from 'three';
import { createPanelMaterial, type PanelMaterial } from './panelMaterial';
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

const POSTER_COUNT = 12;
const PANEL_OBJECTS = 11;
const TRUSS_OBJECTS = 4;
const RECYCLE_RADIUS = 15;
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

/** Warm amber-to-charcoal sky. Also feeds the environment map, which is where the sky-coloured
 *  shadow side and the speculars travelling along the steel come from. */
function createSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#08080a');
  grad.addColorStop(0.4, '#1d1512');
  grad.addColorStop(0.72, '#6d411b');
  grad.addColorStop(1, '#e79f56');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rand = makeRandom(20260908);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 30; i += 1) {
    const y = lerp(canvas.height * 0.4, canvas.height * 1.05, rand());
    const alpha = lerp(0.012, 0.05, rand());
    const band = ctx.createLinearGradient(0, y, canvas.width, y - canvas.height * 0.28);
    band.addColorStop(0, 'rgba(255,206,156,0)');
    band.addColorStop(0.5, `rgba(255,206,156,${alpha})`);
    band.addColorStop(1, 'rgba(255,206,156,0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, y, canvas.width, lerp(8, 30, rand()));
  }
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type Slideshow = {
  material: PanelMaterial;
  /** Index into the poster set currently shown in slot A. */
  current: number;
  next: number;
  /** Seconds remaining before the next fade starts. */
  hold: number;
  /** 0 while holding, then climbs to 1 across FADE_SECONDS. */
  fade: number;
  fading: boolean;
  dwell: number;
};

type Floater = {
  group: THREE.Group;
  spin: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
};

export function createBillboardScene(ctx: HeroSceneContext): HeroScene {
  // `reducedMotion` is handled by the host: it draws exactly one frame and never starts the
  // loop, so the scene only has to look complete at elapsed = 0.
  const { renderer, width, height } = ctx;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CHARCOAL);
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 160);
  camera.position.set(0, 0, 6);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const skyTexture = createSkyTexture();
  textures.push(skyTexture);

  const skyGeo = new THREE.PlaneGeometry(1, 1);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, depthWrite: false });
  geometries.push(skyGeo);
  materials.push(skyMat);
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.z = SKY_Z;
  sky.renderOrder = -1;
  scene.add(sky);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromEquirectangular(skyTexture).texture;
  scene.environment = envTexture;

  const key = new THREE.DirectionalLight(0xffd9a8, 2.6);
  key.position.set(6, 5, 4);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xe79f56, 0x0d0d0f, 0.55));

  const steel = new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.85, roughness: 0.42 });
  const blank = new THREE.MeshStandardMaterial({
    color: ORANGE,
    metalness: 0,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });
  materials.push(steel, blank);

  // --- Poster textures -------------------------------------------------------------------
  // Loaded async; panels render lit-but-white until their first texture arrives, which is
  // invisible in practice because the poster image covers the canvas until the first frame.
  const loader = new THREE.TextureLoader();
  const posters: THREE.Texture[] = [];
  for (let i = 0; i < POSTER_COUNT; i += 1) {
    const tex = loader.load(`/images/hero-panels/panel-${String(i + 1).padStart(2, '0')}.webp`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    posters.push(tex);
    textures.push(tex);
  }

  const rand = makeRandom(0x0acce55);
  const sign = () => (rand() > 0.5 ? 1 : -1);
  const floaters: Floater[] = [];
  const slideshows: Slideshow[] = [];

  /** Portrait poster on a short arm — the family that carries the work. Panel is 1:1.41 (A4),
   *  matching the source imagery so nothing is cropped or stretched. */
  function buildPosterPanel(index: number): THREE.Group {
    const group = new THREE.Group();
    const w = lerp(0.85, 1.35, rand());
    const h = w * 1.414;

    const material = createPanelMaterial();
    materials.push(material);

    const a = index % posters.length;
    const b = (a + 1 + Math.floor(rand() * (posters.length - 1))) % posters.length;
    material.map = posters[a];
    material.userData.crossfade.uMapB.value = posters[b];

    const faceGeo = new THREE.PlaneGeometry(w, h);
    geometries.push(faceGeo);
    group.add(new THREE.Mesh(faceGeo, material));

    // An edge frame, not a backing panel. A solid box behind the poster would occlude it from
    // the rear, which would throw away the mirrored back face — the single most diagnostic
    // detail of the reference and a large part of why the field reads as truly 3D.
    const railT = 0.05;
    const rails: Array<[number, number, number, number]> = [
      [w + railT, railT, 0, (h + railT) / 2],
      [w + railT, railT, 0, -(h + railT) / 2],
      [railT, h + railT, (w + railT) / 2, 0],
      [railT, h + railT, -(w + railT) / 2, 0],
    ];
    for (const [rw, rh, rx, ry] of rails) {
      const railGeo = new THREE.BoxGeometry(rw, rh, railT);
      geometries.push(railGeo);
      const rail = new THREE.Mesh(railGeo, steel);
      rail.position.set(rx, ry, 0);
      group.add(rail);
    }

    const armGeo = new THREE.CylinderGeometry(0.032, 0.04, h * 1.15, 8);
    geometries.push(armGeo);
    const arm = new THREE.Mesh(armGeo, steel);
    arm.position.y = -h * 0.92;
    group.add(arm);

    slideshows.push({
      material,
      current: a,
      next: b,
      hold: lerp(DWELL[0], DWELL[1], rand()),
      fade: 0,
      fading: false,
      dwell: lerp(DWELL[0], DWELL[1], rand()),
    });

    return group;
  }

  /** Open steel lattice carrying a blank panel. Its interior is what stops the field reading as
   *  flat stickers when a structure rotates through edge-on. */
  function buildTruss(): THREE.Group {
    const group = new THREE.Group();
    const w = lerp(1.1, 1.7, rand());
    const h = w / 1.9;

    const faceGeo = new THREE.PlaneGeometry(w, h);
    geometries.push(faceGeo);
    group.add(new THREE.Mesh(faceGeo, blank));

    for (let i = 0; i < 3; i += 1) {
      const t = (i / 3) * Math.PI * 2;
      const legGeo = new THREE.CylinderGeometry(0.022, 0.022, h * 2.1, 6);
      geometries.push(legGeo);
      const leg = new THREE.Mesh(legGeo, steel);
      leg.position.set(Math.cos(t) * w * 0.24, -h * 1.1, Math.sin(t) * w * 0.24 - 0.1);
      group.add(leg);
    }
    for (let i = -1; i <= 1; i += 2) {
      const braceGeo = new THREE.CylinderGeometry(0.014, 0.014, w * 0.62, 5);
      geometries.push(braceGeo);
      const brace = new THREE.Mesh(braceGeo, steel);
      brace.position.set(0, -h * (1.1 + i * 0.35), -0.1);
      brace.rotation.z = Math.PI / 2;
      group.add(brace);
    }
    return group;
  }

  const place = (group: THREE.Group) => {
    // Pushed well back so each structure reads at roughly 6–10 % of viewport width, as measured
    // in the reference. Close objects crowd the lockup and break the "distant constellation" read.
    group.position.set(lerp(-9, 9, rand()), lerp(-5.5, 5.5, rand()), lerp(-16, -3, rand()));
    group.quaternion.setFromEuler(
      new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
    );
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
  };

  for (let i = 0; i < PANEL_OBJECTS; i += 1) place(buildPosterPanel(i));
  for (let i = 0; i < TRUSS_OBJECTS; i += 1) place(buildTruss());

  const fitSky = () => {
    const distance = camera.position.z - SKY_Z;
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
    sky.scale.set(h * camera.aspect * 1.15, h * 1.15, 1);
  };
  fitSky();

  return {
    scene,
    camera,
    update(dt, elapsed) {
      for (const f of floaters) {
        f.group.rotation.x += f.spin.x * dt;
        f.group.rotation.y += f.spin.y * dt;
        f.group.rotation.z += f.spin.z * dt;
        f.group.position.addScaledVector(f.velocity, dt);
        f.group.position.y += Math.sin(elapsed * 0.22 + f.phase) * 0.0016;

        if (f.group.position.lengthSq() > RECYCLE_RADIUS * RECYCLE_RADIUS) {
          f.group.position.multiplyScalar(-0.94);
        }
      }

      // Each panel runs its own slideshow clock, so the field never changes in unison.
      for (const s of slideshows) {
        if (s.fading) {
          s.fade += dt / FADE_SECONDS;
          if (s.fade >= 1) {
            // Land the fade by promoting B into A, then queue a new B. Advancing by a
            // co-prime-ish stride keeps neighbouring panels from converging on one poster.
            s.material.map = posters[s.next];
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

      skyTexture.offset.x = (elapsed * 0.0012) % 1;
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
