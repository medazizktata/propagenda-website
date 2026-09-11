import * as THREE from 'three';

import { STUDIO } from './studio';

/**
 * A photographic studio, built out of six emissive rectangles and prefiltered into an environment
 * map. No image is fetched and none is shipped: the panels are positioned in code, rendered once
 * into a cubemap at mount, and run through PMREMGenerator so roughness picks the right mip.
 *
 * This is the single biggest thing separating a surface that looks made from one that looks
 * painted. Lit only by direct lights, a MeshPhysicalMaterial's specular has nothing to reflect:
 * every highlight is a mathematical blob at the light's half-vector and the rest of the surface
 * is dead. Give it a room and the reflection has *shape* — a warm band across the top chamfers, a
 * cool one down the shadow side, an orange smear at the bottom where the floor bounce is. Those
 * bands moving across the bevels as the cube turns are most of the sense of a solid object.
 *
 * The panels are deliberately few and large. A busy environment reads as noise at this roughness
 * and would compete with the type; four sources with clear direction read as intent.
 */

export interface StudioEnvironment {
  texture: THREE.Texture;
  dispose(): void;
}

interface Panel {
  /** Where the panel sits, in the same world units as the scene it lights. */
  position: [number, number, number];
  /** Width and height of the emitting rectangle. */
  size: [number, number];
  color: string;
  intensity: number;
}

/**
 * Positions mirror the backdrop shader's: the key is high and to the right (screen-right of the
 * subject), the cool rake is high and to the left, the orange bounce is low and in front. When a
 * chamfer catches a warm line, the reason for it is visible in the background.
 */
const PANELS: readonly Panel[] = [
  { position: [6.2, 4.8, 3.4], size: [7, 7], color: STUDIO.key.color, intensity: STUDIO.key.intensity },
  { position: [-6.4, 3.6, 0.5], size: [6, 8], color: STUDIO.fill.color, intensity: STUDIO.fill.intensity },
  { position: [0.4, -4.6, 3.0], size: [10, 5], color: STUDIO.bounce.color, intensity: STUDIO.bounce.intensity },
  // A narrow strip directly behind the subject. This is what puts a hard bright line on the back
  // chamfers and lifts the silhouette off the backdrop — the rim light, but as a reflection.
  { position: [-1.6, 1.4, -7.4], size: [1.4, 6], color: STUDIO.rim.color, intensity: STUDIO.rim.intensity },
  // Overhead. Near-neutral: a blue ceiling put a navy cast on every upward-facing panel.
  { position: [0, 6.4, -1.0], size: [9, 9], color: '#9d9a96', intensity: 0.22 },
];

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): StudioEnvironment {
  const scene = new THREE.Scene();
  const disposables: Array<{ dispose(): void }> = [];

  // The surround. Everything the panels do not cover reflects this, which is why the cubes' dark
  // faces stay dark instead of picking up a grey studio wash.
  const roomGeometry = new THREE.BoxGeometry(20, 20, 20);
  const roomMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(STUDIO.room),
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(roomGeometry, roomMaterial));
  disposables.push(roomGeometry, roomMaterial);

  const panelGeometry = new THREE.PlaneGeometry(1, 1);
  disposables.push(panelGeometry);

  for (const panel of PANELS) {
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    // Linear-light values above 1.0 on purpose: a key panel is a light source, and clamping it to
    // display range would make the whole environment read as flat grey card.
    material.color.copy(new THREE.Color(panel.color)).multiplyScalar(panel.intensity);
    const mesh = new THREE.Mesh(panelGeometry, material);
    mesh.position.set(...panel.position);
    mesh.scale.set(panel.size[0], panel.size[1], 1);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
    disposables.push(material);
  }

  const pmrem = new THREE.PMREMGenerator(renderer);
  // A touch of blur softens the panel edges into gradients. Left sharp, a glossy chamfer reflects
  // a hard-edged rectangle and reads as a mirror rather than a finished surface.
  const target = pmrem.fromScene(scene, 0.015, 0.1, 100);
  pmrem.dispose();

  for (const item of disposables) item.dispose();
  scene.clear();

  return {
    texture: target.texture,
    dispose() {
      target.dispose();
    },
  };
}
