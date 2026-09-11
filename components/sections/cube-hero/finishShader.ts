import * as THREE from 'three';

/**
 * Final grade, run after OutputPass so it works on display-referred sRGB values.
 *
 * Three jobs, all of them about making a synthetic image feel photographed:
 * vignette to push the eye back toward the subject, a whisper of chromatic aberration that is
 * zero at the centre and only shows in the corners, and film grain weighted into the shadows.
 * The grain doubles as dithering — a near-black gradient across a 1920px frame bands horribly
 * in 8-bit, and the noise floor hides it completely.
 */
export const FinishShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uGrain: { value: 0.035 },
    uVignette: { value: 0.5 },
    uAberration: { value: 0.001 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uAberration;

    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 centered = vUv - 0.5;
      float r2 = dot(centered, centered);

      // Aberration scales with r^2 so it is literally zero where the subject and its type sit,
      // and only bends light at the frame edge the way a fast lens would.
      vec2 offset = centered * uAberration * r2 * 4.0;
      vec4 mid = texture2D(tDiffuse, vUv);
      vec3 color = vec3(
        texture2D(tDiffuse, vUv + offset).r,
        mid.g,
        texture2D(tDiffuse, vUv - offset).b
      );

      color *= 1.0 - uVignette * smoothstep(0.1, 0.62, r2);

      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      // uTime is wrapped before it reaches the shader, so sin() never loses precision.
      float noise = hash(vUv * uResolution + uTime * 137.0) - 0.5;
      color += noise * uGrain * mix(1.0, 0.28, luma);

      gl_FragColor = vec4(color, mid.a);
    }
  `,
};
