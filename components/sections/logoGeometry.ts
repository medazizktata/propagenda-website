import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/**
 * The Propagenda monogram, extruded from its SVG into 3D geometry.
 *
 * Shared rather than per-component: extruding the mark means parsing the SVG, converting every
 * path to shapes and running each through ExtrudeGeometry with bevels and 28 curve segments.
 * That is expensive enough to be worth doing exactly once per page, and there are now several
 * consumers — the home showreel logo, the services header, and the billboard hero's backdrop.
 *
 * The cache is the module-level promise, not the geometries: a second caller during the first
 * load gets the same in-flight promise instead of starting a parallel parse.
 *
 * Callers must `clone()` what they get and dispose their clones. The cached originals are never
 * added to a scene and are never disposed — releasing them would break every later consumer,
 * and they are a fixed, small cost for the life of the page.
 */
let logoShapesPromise: Promise<THREE.Shape[]> | null = null;
let logoGeometriesPromise: Promise<THREE.BufferGeometry[]> | null = null;

/**
 * The mark as flat 2D shapes, holes included.
 *
 * This is the shared root: the 3D geometries are derived from it, so the SVG is fetched and
 * parsed once whether a caller wants the extrusion or just the silhouette.
 *
 * Coordinates come straight out of the SVG, so they are Y-down. That matches canvas 2D and is
 * upside down in three's Y-up world — whichever a caller needs, it has to say so explicitly.
 */
export function loadLogoShapes(): Promise<THREE.Shape[]> {
  if (!logoShapesPromise) {
    logoShapesPromise = new Promise((resolve, reject) => {
      const loader = new SVGLoader();
      loader.load(
        '/images/brand/logo-monogram.svg',
        (data) => resolve(data.paths.flatMap((path) => path.toShapes())),
        undefined,
        reject,
      );
    });
  }
  return logoShapesPromise;
}

export function loadLogoGeometries(): Promise<THREE.BufferGeometry[]> {
  if (!logoGeometriesPromise) {
    logoGeometriesPromise = loadLogoShapes().then((shapes) =>
      shapes.map(
        (shape) =>
          new THREE.ExtrudeGeometry(shape, {
            depth: 22,
            bevelEnabled: true,
            bevelThickness: 2.6,
            bevelSize: 2,
            bevelSegments: 4,
            curveSegments: 28,
          }),
      ),
    );
  }
  return logoGeometriesPromise;
}
