import * as THREE from 'three';

export type CrossfadeUniforms = {
  uMapB: { value: THREE.Texture | null };
  uMix: { value: number };
};

export type PanelMaterial = THREE.MeshStandardMaterial & {
  userData: { crossfade: CrossfadeUniforms };
};

/**
 * A lit panel that can cross-fade between two poster textures.
 *
 * three has no built-in second diffuse map, so `map_fragment` is patched to sample a second
 * texture and mix between them. Doing it in the shader keeps this to one draw call and one
 * material per panel, and — because every panel compiles the identical shader source — three
 * reuses a single compiled program across all of them; only the uniforms differ.
 *
 * The varying is `vMapUv`, not `vUv`: three renamed the per-map UV varyings in r152.
 */
export function createPanelMaterial(): PanelMaterial {
  const crossfade: CrossfadeUniforms = {
    uMapB: { value: null },
    uMix: { value: 0 },
  };

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.82,
    // Un-flipped back-face UVs are deliberate — see billboardScene.ts.
    side: THREE.DoubleSide,
  }) as PanelMaterial;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uMapB = crossfade.uMapB;
    shader.uniforms.uMix = crossfade.uMix;

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        ['#include <common>', 'uniform sampler2D uMapB;', 'uniform float uMix;'].join('\n'),
      )
      .replace(
        '#include <map_fragment>',
        [
          '#ifdef USE_MAP',
          '  vec4 sampledA = texture2D( map, vMapUv );',
          '  vec4 sampledB = texture2D( uMapB, vMapUv );',
          '  diffuseColor *= mix( sampledA, sampledB, uMix );',
          '#endif',
        ].join('\n'),
      );
  };

  material.userData = { crossfade };
  return material;
}
