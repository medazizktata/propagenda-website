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
      const t = Math.min(1, Math.max(0, u * 0.44 + v * 0.68 - 0.14));
      const e = Math.pow(t * t * (3 - 2 * t), 1.5);
      // Channel curves stay close together on purpose. Falling off green and blue much faster
      // than red drags the hue to maroon; these keep it on the brand's amber.
      let r = lerp(8, 152, e);
      let g = lerp(8, 76, Math.pow(e, 1.15));
      let b = lerp(12, 36, Math.pow(e, 1.45));

      // Cirrus, confined to the lit corner so the charcoal stays clean.
      const nu = (u * cosA - v * sinA) * 3.1;
      const nv = (u * sinA + v * cosA) * (3.1 / STRETCH);
      // The cirrus carries the light, not the flat ramp. A gradient bright enough to feel like
      // sky washes the whole frame; structured highlights read as atmosphere at a much lower
      // average luminance, which is what keeps the white lockup legible.
      const cloud = Math.pow(Math.max(0, fbm(nu, nv) * 1.6 - 0.40), 1.35);
      const lit = Math.min(1, Math.max(0, u * 0.4 + v * 0.78 - 0.16));
      const c = cloud * lit * 240;
      r = Math.min(255, r + c);
      g = Math.min(255, g + c * 0.66);
      b = Math.min(255, b + c * 0.40);

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
  vig.addColorStop(1, 'rgba(3,3,5,0.62)');
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

  const TOTAL_OBJECTS = PANEL_OBJECTS + TRUSS_OBJECTS;
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
