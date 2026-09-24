import * as THREE from 'three';

import { STUDIO } from './studio';

/**
 * The room the cubes are standing in.
 *
 * Not a flat clear colour, and not the environment map shown raw, but a screen-space shader that
 * paints the same studio the environment map is built from: a cyclorama curving from wall to
 * floor, the warm key spilling where the subject stands, the cool rake in the upper left, and a
 * slow drift of haze so the empty half of the frame is air rather than a swatch.
 *
 * The cyclorama is the whole trick. A vertical gradient is a wall, and objects float in front of
 * it; a soft horizon plus a floor spill underneath the subject is a *space*, and the same cubes
 * stand in it. It costs one untextured full-screen quad.
 *
 * Screen space rather than a mesh because the framing is art-directed per breakpoint: at 1920 the
 * subject sits at 71% across, on a phone it is centred near the top, and the pool of light has to
 * follow it or the composition falls apart. Drawn straight to clip space, so it always covers the
 * frame exactly regardless of camera, and needs no resize maths.
 */

export interface Backdrop {
  mesh: THREE.Mesh;
  /** Aim the warm pool, in 0..1 screen coordinates with the origin bottom-left. */
  setFocus(x: number, y: number): void;
  setAspect(aspect: number): void;
  /** Seconds. Drives the haze only, which drifts about one frame width every two minutes. */
  setTime(seconds: number): void;
  dispose(): void;
}

export function createBackdrop(): Backdrop {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uFocus: { value: new THREE.Vector2(0.71, 0.49) },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uHorizon: { value: STUDIO.horizon },
      uWallTop: { value: new THREE.Color(STUDIO.wallTop) },
      uWallBase: { value: new THREE.Color(STUDIO.wallBase) },
      uFloorNear: { value: new THREE.Color(STUDIO.floorNear) },
      uFloorBase: { value: new THREE.Color(STUDIO.floorBase) },
      uGlow: { value: new THREE.Color(STUDIO.bounce.color) },
      uCool: { value: new THREE.Color(STUDIO.fill.color) },
      uKey: { value: new THREE.Color(STUDIO.key.color) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        // Straight to clip space at the far plane: no camera dependency, no resize maths.
        gl_Position = vec4(position.xy, 1.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec2 uFocus;
      uniform float uAspect;
      uniform float uTime;
      uniform float uHorizon;
      uniform vec3 uWallTop;
      uniform vec3 uWallBase;
      uniform vec3 uFloorNear;
      uniform vec3 uFloorBase;
      uniform vec3 uGlow;
      uniform vec3 uCool;
      uniform vec3 uKey;

      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Value noise, smoothstep-interpolated so the haze shows no lattice.
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 w = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), w.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), w.x),
          w.y
        );
      }

      // Two octaves, not three. This runs on every pixel of the frame and the third octave was
      // adding roughly 15 instructions for detail that is invisible under an amplitude of four
      // 8-bit steps.
      float fbm(vec2 p) {
        return noise(p) * 0.65 + noise(p * 2.31) * 0.35;
      }

      void main() {
        vec2 aspect = vec2(uAspect, 1.0);

        // ── The cyclorama. A wide, soft curve from wall to floor rather than a drawn line: the
        // eye takes it as a coved studio corner and stops reading the frame as a flat card.
        float floorMix = smoothstep(uHorizon + 0.16, uHorizon - 0.12, vUv.y);
        vec3 wall = mix(uWallBase, uWallTop, smoothstep(uHorizon, 1.05, vUv.y));
        vec3 ground = mix(uFloorNear, uFloorBase, smoothstep(-0.05, uHorizon, vUv.y));
        vec3 color = mix(wall, ground, floorMix);

        // A faint line of light along the cove, where a real cyclorama catches the floor bounce.
        color += uKey * exp(-pow((vUv.y - uHorizon) * 11.0, 2.0)) * 0.012;

        // ── The pool the subject stands in, and its spill across the floor below. Two terms, not
        // one: light landing on a wall behind an object and light on the floor under it have
        // completely different shapes, and faking both with a single radial blob is why so many
        // dark hero scenes read as a vignette instead of a room.
        // The pool is a circle in screen space, so on a portrait phone a radius sized against the
        // height covers the entire width and the frame goes brown. Tighten it as the viewport
        // narrows: the subject is smaller there too, and wants a smaller pool under it.
        float poolSpread = mix(10.0, 5.2, smoothstep(0.6, 1.2, uAspect));
        vec2 toFocus = (vUv - uFocus) * aspect;
        float pool = exp(-dot(toFocus, toFocus) * poolSpread);
        vec2 toSpill = vec2((vUv.x - uFocus.x) * max(uAspect, 0.8) * 0.5, (vUv.y - (uHorizon - 0.05)) * 2.8);
        float spill = exp(-dot(toSpill, toSpill) * 2.6) * floorMix;
        // Warm light scales back on narrow viewports for the same reason the pool tightens: the
        // subject occupies far more of a phone frame, so the same spill turns the whole page
        // brown instead of pooling under one object.
        float warmScale = mix(0.55, 1.0, smoothstep(0.6, 1.2, uAspect));
        color += uGlow * (pool * 0.06 + spill * 0.05) * warmScale;

        // ── The cool rake, upper left. Same source as the environment's fill panel, so the blue
        // edge on a cube's shadow side has something visible to have come from.
        vec2 toCool = (vUv - vec2(0.04, 0.98)) * aspect;
        color += uCool * exp(-dot(toCool, toCool) * 1.5) * 0.009;

        // ── Haze. Two frame-widths across, drifting roughly one width every two minutes: slow
        // enough to register as air rather than as motion competing with the cubes. Amplitude is
        // about four 8-bit steps, which is also enough to break up gradient banding.
        float haze = fbm(vUv * aspect * 2.1 + vec2(uTime * 0.0055, uTime * 0.0032));
        color += vec3(0.85, 0.78, 0.72) * (haze - 0.45) * 0.011;

        gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  return {
    mesh,
    setFocus(x, y) {
      (material.uniforms.uFocus.value as THREE.Vector2).set(x, y);
    },
    setAspect(aspect) {
      material.uniforms.uAspect.value = aspect;
    },
    setTime(seconds) {
      material.uniforms.uTime.value = seconds;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
