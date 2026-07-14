'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

// Brand palette (branding PDF p.16): orange, white, black.
const COLOR_ORANGE = new THREE.Color(0xf58b27);
// Light silver, not pure #fff, so strong key light doesn't clip it to a flat blown-out white.
const COLOR_WHITE = new THREE.Color(0xc8c8c8);
const COLOR_BLACK = new THREE.Color(0x000000);
const COLOR_CYCLE = [COLOR_ORANGE, COLOR_WHITE, COLOR_BLACK];
// Per-colour surface: black is glossy "obsidian" (low roughness + high metalness) so
// its 3D form reads via highlights/reflections instead of a matte black blob.
const MAT_PARAMS = [
  { metalness: 0.5, roughness: 0.28, env: 0.0 }, // orange — vibrant, light-driven gloss (v14)
  { metalness: 0.2, roughness: 0.45, env: 0.0 }, // white/silver — glossy but not blown
  { metalness: 0.75, roughness: 0.1, env: 1.0 }, // black — glossy, env-driven form
];
const GLOW_COLOR = new THREE.Color(0xffb066); // warm flash during the transition

/**
 * The real Propagenda monogram (Asset 1.svg) extruded into 3D — a single orange
 * speech-bubble "m" mark that turns on 3 axes following the mouse. Click it to
 * flip its colour orange↔white with a full spin + smooth colour lerp + glow pulse.
 */
export function HeroLogo3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    // Studio environment so metallic surfaces show form via reflections (crucial for black).
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 6, 9);
    scene.add(key);
    const warm = new THREE.PointLight(0xf58b27, 1.4, 60);
    warm.position.set(-7, -3, 6);
    scene.add(warm);
    const rim = new THREE.DirectionalLight(0xffd9a0, 1.0);
    rim.position.set(-5, 4, -7);
    scene.add(rim);
    // Modest back rim — traces an edge so a black logo separates from the dark bg.
    const backRim = new THREE.DirectionalLight(0xffffff, 0.55);
    backRim.position.set(3, -3, -8);
    scene.add(backRim);

    const group = new THREE.Group();
    scene.add(group);
    const positionGroup = () => {
      // Slightly left of the previous wide-layout bias.
      group.position.x = el.clientWidth / el.clientHeight > 1 ? 2.85 : 0;
    };
    positionGroup();

    const disposables: { dispose: () => void }[] = [];
    let logoMaterial: THREE.MeshStandardMaterial | null = null;

    const loader = new SVGLoader();
    loader.load('/images/brand/logo-monogram.svg', (data) => {
      const orange = new THREE.MeshStandardMaterial({
        color: COLOR_ORANGE.clone(),
        metalness: 0.5,
        roughness: 0.28,
        envMapIntensity: 0,
        side: THREE.DoubleSide,
      });
      logoMaterial = orange;
      disposables.push(orange);

      const logo = new THREE.Group();
      data.paths.forEach((path) => {
        path.toShapes(true).forEach((shape) => {
          const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 22,
            bevelEnabled: true,
            bevelThickness: 2.6,
            bevelSize: 2,
            bevelSegments: 4,
            curveSegments: 28,
          });
          disposables.push(geo);
          logo.add(new THREE.Mesh(geo, orange));
        });
      });

      const box = new THREE.Box3().setFromObject(logo);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      logo.children.forEach((m) => m.position.sub(center));
      const fit = 3.05 / Math.max(size.x, size.y);
      logo.scale.set(fit, -fit, fit);
      group.add(logo);
      // Signal the loading screen that the heavy 3D asset is ready.
      (window as unknown as { __hero3dReady?: boolean }).__hero3dReady = true;
      window.dispatchEvent(new Event('hero3d:ready'));
    });

    // --- Mouse-driven rotation ---
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    // --- Click-to-toggle colour (orange ↔ white) with a spin + glow ---
    let colorIndex = 0;
    let fromIndex = 0;
    let spinTarget = 0;
    let spin = 0;
    let transStart = -1;
    const fromColor = COLOR_ORANGE.clone();
    const toColor = COLOR_ORANGE.clone();
    const raycaster = new THREE.Raycaster();
    const onClick = (e: MouseEvent) => {
      if (!logoMaterial) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(group, true).length === 0) return;
      fromIndex = colorIndex;
      colorIndex = (colorIndex + 1) % COLOR_CYCLE.length; // orange → white → black → …
      fromColor.copy(logoMaterial.color);
      toColor.copy(COLOR_CYCLE[colorIndex]);
      transStart = (performance.now() - start) / 1000;
      spinTarget += Math.PI * 2; // one full turn per click
    };
    renderer.domElement.addEventListener('click', onClick);

    const start = performance.now();
    let raf = 0;
    const render = () => {
      const t = (performance.now() - start) / 1000;
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      spin += (spinTarget - spin) * 0.06;
      group.rotation.y = cur.x * 0.9 + Math.sin(t * 0.25) * 0.12 + spin;
      group.rotation.x = cur.y * 0.7 + Math.sin(t * 0.3) * 0.06;
      group.rotation.z = cur.x * 0.12;

      if (transStart >= 0 && logoMaterial) {
        const p = Math.min((t - transStart) / 1.0, 1);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
        logoMaterial.color.lerpColors(fromColor, toColor, e);
        const fp = MAT_PARAMS[fromIndex];
        const tp = MAT_PARAMS[colorIndex];
        logoMaterial.metalness = fp.metalness + (tp.metalness - fp.metalness) * e;
        logoMaterial.roughness = fp.roughness + (tp.roughness - fp.roughness) * e;
        logoMaterial.envMapIntensity = fp.env + (tp.env - fp.env) * e;
        const glow = Math.sin(p * Math.PI); // 0 → 1 → 0
        logoMaterial.emissive.copy(GLOW_COLOR).multiplyScalar(glow * 0.4);
        if (p >= 1) {
          transStart = -1;
          logoMaterial.emissive.setScalar(0);
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    if (reducedMotion) {
      const once = window.setInterval(() => {
        if (group.children.length) {
          renderer.render(scene, camera);
          window.clearInterval(once);
        }
      }, 100);
      disposables.push({ dispose: () => window.clearInterval(once) });
    } else {
      render();
    }

    const onResize = () => {
      if (!el.clientWidth || !el.clientHeight) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      positionGroup();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onClick);
      disposables.forEach((d) => d.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [reducedMotion]);

  return <div ref={mountRef} className={className} aria-hidden />;
}
