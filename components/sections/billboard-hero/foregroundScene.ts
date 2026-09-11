import * as THREE from 'three';
import { setHeroEmitter } from './heroEmitter';
import { buildLightbox, buildPortraitPoster, type StructureCtx } from './oohStructures';
import { createHero360Beat } from '@/lib/motion/hero360Sync';
import type { HeroScene, HeroSceneContext } from './types';

/**
 * The near layer: three structures that drift across the front of the lockup.
 *
 * This exists as a second canvas rather than as part of the main scene because the type is DOM,
 * and DOM stacking is absolute — a single canvas is one layer, so everything it draws is either
 * wholly in front of the text or wholly behind it. Interleaving needs the text between two
 * canvases, which means two contexts. It stays cheap by being genuinely small: three structures,
 * four textures, no environment map, no shadows and no post-processing.
 *
 * Note this deliberately breaks the reference's rule that nothing crosses the type — see the
 * comment in `BillboardHero.tsx`. It is a requested departure, not an oversight.
 *
 * What keeps it from wrecking the lockup's legibility is that nothing is allowed over the middle
 * of the frame: `LANES` pins each object to a band at one edge and the recycle logic returns it
 * there, so the two of them clip the ends of the word rather than covering it.
 *
 * These are draggable, like the field behind them, which is why they are not blurred — a soft
 * focus pass reads as depth on scenery but as a rendering fault on something you can pick up.
 * Input does not arrive here directly: this canvas is `pointer-events: none` and the base canvas
 * routes hits through `overlayPointer.ts`.
 */

const STEEL = 0x8d8f93;
const ORANGE = 0xf58b27;

/** Slower than the main field: closer objects cover more screen per unit moved. */
const SPIN = [0.02, 0.055] as const;
const DRIFT = [0.02, 0.05] as const;

const DWELL = [5, 9] as const;
const FADE_SECONDS = 1.1;
const POSTER_COUNT = 4;

/**
 * Bands the near objects are confined to, as fractions of the visible frame at their depth.
 *
 * Two exclusions shape these. The centre stays clear so the lockup is never buried — these are
 * meant to clip the ends of the type, not cover it. And nothing sits high: the site header runs
 * across the top of this section, and this layer draws over it.
 */
const LANES = [
  // Both sit on the lockup's own line, close enough in to clip the ends of the word — that
  // crossing is the whole point of the layer.
  // The left band is biased high so it crosses the name rather than the line beneath it: that
  // row now carries the positioning and role copy, which is small and cannot survive being sat on.
  { x: -0.66, y: 0.22 },
  { x: 0.84, y: -0.14 },
] as const;

function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type NearObject = {
  group: THREE.Group;
  spin: THREE.Vector3;
  velocity: THREE.Vector3;
  /** Half-extents of the visible frame at this object's depth, in world units. */
  bounds: THREE.Vector2;
  lane: (typeof LANES)[number];
  /** Centre of the band this object drifts within, in world units. */
  home: THREE.Vector2;
  /**
   * True once a pointer has moved it. After that the object keeps whatever position it was
   * released at instead of being pulled back to its lane — drop something and have it snap
   * across the frame a moment later and the drag stops feeling like it did anything.
   */
  placed: boolean;
};

export function createForegroundScene(ctx: HeroSceneContext): HeroScene {
  const { renderer, width, height, requestDraw, reducedMotion } = ctx;

  /** The same 360° beat the base scene turns on, so both layers move as one field. */
  const beatFor = createHero360Beat();

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
  camera.position.set(0, 0, 6);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  // Lights only, no environment map. Generating a second PMREM for three objects would cost more
  // than it shows, and these read mostly by their own emissive faces anyway. Values mirror the
  // main scene so the two layers agree about where the light comes from.
  const key = new THREE.DirectionalLight(0xffd2a0, 2.9);
  key.position.set(18, 15, 12);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9dbcff, 0.24);
  fill.position.set(-5, -2, 3);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xf09340, 0x18140f, 0.5));
  const bounce = new THREE.DirectionalLight(ORANGE, 0.85);
  bounce.position.set(-8, -9, 5);
  scene.add(bounce);

  const steel = new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.68, roughness: 0.5 });
  const charcoal = new THREE.MeshStandardMaterial({
    color: 0x212124,
    metalness: 0.3,
    roughness: 0.68,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: ORANGE,
    metalness: 0.2,
    roughness: 0.55,
    emissive: new THREE.Color(ORANGE),
    emissiveIntensity: 0.28,
  });
  materials.push(steel, charcoal, accent);

  const loader = new THREE.TextureLoader();
  const posters: THREE.Texture[] = [];
  for (let i = 0; i < POSTER_COUNT; i += 1) {
    // Offset into the set so the near layer is never showing the same poster as the panel
    // directly behind it.
    const n = String(i * 3 + 2).padStart(2, '0');
    const tex = loader.load(`/images/hero-panels/panel-${n}.webp`, requestDraw);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    posters.push(tex);
    textures.push(tex);
  }

  const rand = makeRandom(0x3f0126);
  const sign = () => (rand() > 0.5 ? 1 : -1);
  const slideshows: StructureCtx['slideshows'] = [];
  const objects: NearObject[] = [];

  const structureCtx: StructureCtx = {
    rand,
    steel,
    charcoal,
    accent,
    geometries,
    materials,
    posters,
    dwell: DWELL,
    slideshows,
  };

  /** Half the visible frame at `z`, in world units. */
  const visibleHalf = (z: number) => {
    const distance = camera.position.z - z;
    const h = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
    return new THREE.Vector2(h * camera.aspect, h);
  };

  // Mid-sized families only. The mega wall and the unipole are the two largest in the set, and
  // at this distance either one covers most of the lockup on its own.
  const builders = [buildPortraitPoster, buildLightbox];
  builders.forEach((build, i) => {
    const group = build(structureCtx, i);
    // Depth here buys perspective and scale, nothing else: this canvas stacks above the type
    // wholesale, so an object does not need to be near the camera to cross it. Sitting them well
    // back is what keeps them to a size that clips the type rather than swallowing it.
    const z = lerp(-5.5, -2.5, rand());
    const half = visibleHalf(z);
    const lane = LANES[i];
    group.position.set(half.x * lane.x, half.y * lane.y, z);
    group.quaternion.setFromEuler(
      new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
    );
    objects.push({
      group,
      home: new THREE.Vector2(half.x * lane.x, half.y * lane.y),
      placed: false,
      spin: new THREE.Vector3(
        lerp(SPIN[0], SPIN[1], rand()) * sign(),
        lerp(SPIN[0], SPIN[1], rand()) * sign(),
        lerp(SPIN[0], SPIN[1], rand()) * sign(),
      ),
      velocity: new THREE.Vector3(
        lerp(DRIFT[0], DRIFT[1], rand()) * sign(),
        lerp(DRIFT[0], DRIFT[1], rand()) * sign(),
        0,
      ),
      bounds: half,
      lane,
    });
    scene.add(group);
  });

  // Same spring-follow as the main field, minus the parts that only make sense there (tumble
  // impulse, slideshow advance, throw-driven spin). Kept local rather than shared: the two
  // scenes hold different object types, and threading accessors through a generic controller
  // would cost more clarity than the forty lines it saves.
  const DRAG_STIFFNESS = 44;
  const DRAG_DAMPING = 0.78;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const dragPlane = new THREE.Plane();
  const dragPoint = new THREE.Vector3();
  const springForce = new THREE.Vector3();
  const hitTargets = objects.map((o) => o.group);

  const drag = {
    object: null as NearObject | null,
    target: new THREE.Vector3(),
    grab: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    resume: new THREE.Vector3(),
  };

  const pick = (ndcX: number, ndcY: number): NearObject | null => {
    ndc.set(ndcX, ndcY);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitTargets, true);
    if (!hits.length) return null;
    let node: THREE.Object3D | null = hits[0].object;
    while (node) {
      const found = objects.find((o) => o.group === node);
      if (found) return found;
      node = node.parent;
    }
    return null;
  };

  const projectToPlane = (ndcX: number, ndcY: number, out: THREE.Vector3, z: number) => {
    dragPlane.set(new THREE.Vector3(0, 0, 1), -z);
    ndc.set(ndcX, ndcY);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(dragPlane, out) !== null;
  };

  const refitBounds = () => {
    objects.forEach((o) => {
      o.bounds = visibleHalf(o.group.position.z);
      // A hand-placed object keeps where it was put; only lane-placed ones re-derive, so the
      // composition still adapts to a new aspect ratio.
      if (!o.placed) o.home.set(o.bounds.x * o.lane.x, o.bounds.y * o.lane.y);
    });
  };

  return {
    scene,
    camera,
    pointerMove(ndcX, ndcY) {
      if (drag.object) return true;
      return pick(ndcX, ndcY) !== null;
    },
    pointerDown(ndcX, ndcY) {
      const hit = pick(ndcX, ndcY);
      if (!hit) return false;
      if (!projectToPlane(ndcX, ndcY, dragPoint, hit.group.position.z)) return false;
      drag.object = hit;
      drag.vel.set(0, 0, 0);
      drag.grab.subVectors(hit.group.position, dragPoint);
      drag.target.copy(hit.group.position);
      drag.resume.copy(hit.velocity);
      hit.velocity.set(0, 0, 0);
      return true;
    },
    pointerDrag(ndcX, ndcY) {
      const o = drag.object;
      if (!o) return;
      if (!projectToPlane(ndcX, ndcY, dragPoint, o.group.position.z)) return;
      drag.target.copy(dragPoint).add(drag.grab);
    },
    pointerUp() {
      const o = drag.object;
      if (!o) return;
      // Hand back its idle drift. There is no throw here: these live in narrow bands, and a
      // flung object would hit its own recycle bound within a second and snap across.
      o.velocity.copy(drag.resume);
      // Re-home to wherever it was dropped, so it drifts on from there.
      o.home.set(o.group.position.x, o.group.position.y);
      o.placed = true;
      drag.object = null;
    },
    update(dt, elapsed) {
      const held = drag.object;

      const beat = reducedMotion ? 0 : beatFor(dt);
      // Publish the nearest lit face for the base scene to cast the lockup's shadow from. The
      // nearest is the one that dominates: it is closest to the camera, so it is the one in
      // front of the type from the viewer's point of view.
      let nearest: NearObject | null = null;
      for (const o of objects) {
        if (!nearest || o.group.position.z > nearest.group.position.z) nearest = o;
      }
      if (nearest) {
        setHeroEmitter({
          x: nearest.group.position.x,
          y: nearest.group.position.y,
          z: nearest.group.position.z,
          strength: 1,
        });
      }
      for (const o of objects) {
        o.group.rotation.x += o.spin.x * dt;
        o.group.rotation.y += o.spin.y * dt + beat;
        o.group.rotation.z += o.spin.z * dt;

        if (o === held) {
          const c = 2 * Math.sqrt(DRAG_STIFFNESS) * DRAG_DAMPING;
          springForce
            .subVectors(drag.target, o.group.position)
            .multiplyScalar(DRAG_STIFFNESS)
            .addScaledVector(drag.vel, -c);
          drag.vel.addScaledVector(springForce, dt);
          o.group.position.addScaledVector(drag.vel, dt);
          // No recycling while held, so it cannot be snapped out of the pointer's grip.
          continue;
        }

        o.group.position.addScaledVector(o.velocity, dt);

        // Recycle within the object's own band rather than across the whole frame, so drift can
        // never walk it into the middle where the lockup is.
        const marginX = o.bounds.x * 0.16;
        const marginY = o.bounds.y * 0.16;
        const homeX = o.home.x;
        const homeY = o.home.y;
        if (o.group.position.x > homeX + marginX) o.group.position.x = homeX - marginX;
        else if (o.group.position.x < homeX - marginX) o.group.position.x = homeX + marginX;
        if (o.group.position.y > homeY + marginY) o.group.position.y = homeY - marginY;
        else if (o.group.position.y < homeY - marginY) o.group.position.y = homeY + marginY;
      }

      void elapsed;
      for (const s of slideshows) {
        if (s.fading) {
          s.fade += dt / FADE_SECONDS;
          if (s.fade >= 1) {
            s.material.map = posters[s.next];
            s.material.emissiveMap = posters[s.next];
            s.current = s.next;
            s.next = (s.next + 1) % posters.length;
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
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      refitBounds();
    },
    dispose() {
      // Leaving a stale position published would have the base scene throwing a shadow from a
      // light that is no longer on screen.
      setHeroEmitter(null);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
