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
 * The varying is `vMapUv`, not `vUv`: three renamed the per-map UV varyings in r152, and the
 * emissive slot has its own — `vEmissiveMapUv`.
 *
 * The panel is emissive as well as lit, because a real citylight or lightbox face is backlit —
 * it is a light source in the scene, not a print catching the key. That is also what gives the
 * field its contrast: bright faces against dark steel and a dark sky. The emissive map has to
 * cross-fade in step with the diffuse one or a poster change tears, half-lit on the old image
 * and half on the new, so `emissivemap_fragment` gets the same treatment as `map_fragment` and
 * shares its `uMix`.
 */
/**
 * How hard the face glows. High enough to read as backlit against the charcoal field, low
 * enough that the poster artwork still shows its own tonal range rather than blowing out.
 */
export const PANEL_EMISSIVE_INTENSITY = 0.42;

export function createPanelMaterial(): PanelMaterial {
  const crossfade: CrossfadeUniforms = {
    uMapB: { value: null },
    uMix: { value: 0 },
  };

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.82,
    // Backlit face. `emissiveMap` is assigned alongside `map` by whoever builds the panel, and
    // both slots must stay non-null for the life of the material — going null would drop
    // USE_EMISSIVEMAP and force a recompile mid-slideshow.
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: PANEL_EMISSIVE_INTENSITY,
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
        '#include <emissivemap_fragment>',
        [
          '#ifdef USE_EMISSIVEMAP',
          '  vec4 emissiveA = texture2D( emissiveMap, vEmissiveMapUv );',
          '  vec4 emissiveB = texture2D( uMapB, vEmissiveMapUv );',
          '  totalEmissiveRadiance *= mix( emissiveA, emissiveB, uMix ).rgb;',
          '#endif',
        ].join('\n'),
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
