import * as THREE from 'three';

/**
 * The cube surface.
 *
 * This is a MeshPhysicalMaterial with four chunks of three's own fragment shader replaced, rather
 * than a ShaderMaterial written from scratch. The trade is deliberate: everything that is hard to
 * get right — the split-sum IBL, the GGX specular, the clearcoat lobe, energy compensation — stays
 * three's problem, and only the parts that are genuinely this hero's idea are authored here.
 *
 * What a stock material cannot do, and this one does:
 *
 * 1. **Facing-driven colourway.** A face earns the brand orange by turning toward camera and loses
 *    it by turning away. The reveal and the highlight are therefore the same event: there is no
 *    timeline to keep in sync with the rotation, and there cannot be a frame where the wrong face
 *    is lit. `vFacing` is computed per face, not per fragment — see the vertex chunk.
 *
 * 2. **The type as part of the material, not a decal.** The mask does four separate jobs: it picks
 *    the albedo, it makes the ink *matte* where the panel is satin, it debosses the surface so
 *    glyph edges catch a real highlight, and it punches a hole in the panel's emission so the ink
 *    reads as opaque on a backlit sign rather than glowing along with it.
 *
 * 3. **Emission that follows the reveal.** A lit face emits most of its own colour. That is what
 *    keeps #f58b27 on screen as #f58b27 through a tone-mapping curve, and it is also why there is
 *    an orange pool on the backdrop behind it — the face is a sign, and signs light the room.
 *
 * 4. **A Fresnel rim keyed to the shadow side.** Faces turned away get a cool edge lift that the
 *    lit face does not, so the silhouette separates from a near-black backdrop without washing a
 *    blue cast across the one surface that has to stay brand-accurate.
 */

export interface CubeMaterialPreset {
  /** Colour of a face turned away from camera. */
  faceDark: string;
  /** Colour of a face turned squarely to camera. */
  faceLit: string;
  /** Ink used while the face is dark. */
  inkLight: string;
  /** Ink used once the face has gone orange — never white, which fails contrast on #f58b27. */
  inkDark: string;
  /** Opacity of the printed matter. The chorus whispers; the protagonist speaks. */
  typeAlpha: number;
  /** What that opacity falls to on a face turned away. Keeps dormant faces from shouting. */
  typeDim: number;
  /** facing values that bracket the dark -> lit fade. */
  fillRange: [number, number];
  /** facing values that bracket the light-ink -> dark-ink flip. Set above 1 to never flip. */
  inkRange: [number, number];
  /** Fraction of its own colour a fully lit face emits. */
  emissive: number;
  /** Satin panel. */
  roughness: number;
  /** Matte ink. The gap between the two is what says "printed on" rather than "printed in". */
  inkRoughness: number;
  metalness: number;
  envMapIntensity: number;
  clearcoat: number;
  /** How far the mask's gradient tilts the shading normal. Negative presses the type in. */
  deboss: number;
  /**
   * Strength of the cool Fresnel edge on faces turned away. Kept low and nearly neutral: the
   * Fresnel term peaks on faces raked away from camera, which is exactly the cube's top, so a
   * genuinely blue rim colour tints the whole crown navy rather than drawing an edge.
   */
  rim: number;
}

export const PROTAGONIST_PRESET: CubeMaterialPreset = {
  faceDark: '#2b2a29',
  // Pre-compensated, NOT the brand hex. What has to measure #f58b27 is the pixel on screen, and
  // between here and there sit an 88% emissive weight, the lighting on the remaining 12%, and
  // Khronos Neutral's black offset — which subtracts the same small constant from every channel
  // and so eats proportionally far more of a saturated orange's blue than of its red. Feeding it
  // the literal brand value rendered #ee811900; this lands the rendered face on #f58b27 +/- 2.
  faceLit: '#fd963f',
  inkLight: '#ffffff',
  inkDark: '#141414',
  typeAlpha: 1,
  // White type at full strength on the dark side faces reads almost as loudly as the orange one
  // and splits the first read in two. At a third, the next service is still legible as it comes
  // round but never competes with the face that has arrived.
  typeDim: 0.34,
  // At rest the front face reads facing ~0.93 (it is yawed 30deg off axis for the three-quarter
  // view); the range closes below that with enough headroom that pointer parallax can swing the
  // pose a few degrees without the orange flickering off.
  fillRange: [0.62, 0.82],
  // The ink flips late and fast, so the window where mid-grey type sits on a half-orange panel is
  // a couple of degrees of rotation wide instead of a third of the turn.
  inkRange: [0.77, 0.825],
  emissive: 0.88,
  roughness: 0.34,
  inkRoughness: 0.62,
  metalness: 0,
  envMapIntensity: 0.85,
  // A laminate over the print: one tight, colourless specular lobe on top of the satin one, which
  // is what a coated card or a vinyl-wrapped panel actually does with a studio light.
  clearcoat: 0.55,
  deboss: -0.85,
  rim: 0.15,
};

export const CHORUS_PRESET: CubeMaterialPreset = {
  faceDark: '#1c1b1a',
  // Deliberately not brand orange: only one object in this composition gets to be #f58b27. A
  // near-black warm brown keeps the field at the same temperature without competing.
  faceLit: '#32200f',
  inkLight: '#ffffff',
  // Never flips: a chorus face never gets bright enough to need dark ink.
  inkDark: '#ffffff',
  typeAlpha: 0.22,
  typeDim: 0.32,
  fillRange: [0.84, 0.995],
  inkRange: [9, 10],
  emissive: 0,
  // Rougher and less reflective than the subject, and not only for cost. At 0.44 a chorus face
  // that happened to line up with the key panel mirrored it almost directly and flashed up as a
  // pale card floating in a charcoal field — the one thing the background cast must never do.
  // Spreading the lobe turns that specular event into a soft warm sheen.
  roughness: 0.6,
  inkRoughness: 0.75,
  metalness: 0,
  envMapIntensity: 0.48,
  // No clearcoat on the chorus. It is the most expensive term in the material and nobody can see
  // a second specular lobe on a cube that is 60 pixels across and half-buried in fog.
  clearcoat: 0,
  deboss: -0.4,
  rim: 0.09,
};

const COMMON_PARS = /* glsl */ `
uniform vec3 uFaceDark;
uniform vec3 uFaceLit;
uniform vec3 uInkLight;
uniform vec3 uInkDark;
uniform vec3 uRimColor;
uniform vec2 uFillRange;
uniform vec2 uInkRange;
uniform vec2 uAtlasTexel;
uniform float uTypeAlpha;
uniform float uTypeDim;
uniform float uEmissive;
uniform float uInkRoughness;
uniform float uDeboss;
uniform float uRim;

varying float vFacing;
varying vec3 vTangentView;
varying vec3 vBitangentView;
`;

/**
 * Per face, not per fragment. Measuring "how squarely is this turned toward me" from the object's
 * centre keeps it constant across a face, as it must be for a flat printed panel — measured per
 * fragment, a large near face fades toward its own corners and the orange vignettes across the
 * type. It also makes every chamfer facet average its two neighbours, which is what mitres the
 * orange frame around whichever face is lit, out of geometry rather than out of a texture.
 */
const VERTEX_CHUNK = /* glsl */ `
#include <begin_vertex>
vec4 cubeCentreView = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
vFacing = dot(normalize(normalMatrix * objectNormal), normalize(-cubeCentreView.xyz));
vTangentView = normalize(normalMatrix * aTangent);
vBitangentView = normalize(normalMatrix * aBitangent);
`;

const MAP_CHUNK = /* glsl */ `
float mask = texture2D(map, vMapUv).a;
float lit = smoothstep(uFillRange.x, uFillRange.y, vFacing);
float typeAlpha = clamp(mask * uTypeAlpha * mix(uTypeDim, 1.0, lit), 0.0, 1.0);
vec3 panel = mix(uFaceDark, uFaceLit, lit);
vec3 ink = mix(uInkLight, uInkDark, smoothstep(uInkRange.x, uInkRange.y, vFacing));
diffuseColor.rgb *= mix(panel, ink, typeAlpha);
`;

const ROUGHNESS_CHUNK = /* glsl */ `
float roughnessFactor = roughness;
// Ink is matte; the panel it sits on is satin. The cheapest honest cue that the type is a material
// on the surface rather than a picture of type: the highlight breaks as it crosses the glyphs.
roughnessFactor = mix(roughnessFactor, uInkRoughness, typeAlpha);
`;

/**
 * Debossing, done in texture space rather than from screen-space derivatives. Four taps give the
 * mask's gradient; the face's own uv axes — passed up from the geometry as a tangent frame — turn
 * that gradient into a normal tilt. Texture space matters: a screen-space bump would grow stronger
 * as the cube came closer and evaporate on the small ones, whereas this softens exactly in step
 * with the mip the texture is already being read from.
 */
const NORMAL_CHUNK = /* glsl */ `
#include <normal_fragment_maps>
{
  float hu = texture2D(map, vMapUv + vec2(uAtlasTexel.x, 0.0)).a
           - texture2D(map, vMapUv - vec2(uAtlasTexel.x, 0.0)).a;
  float hv = texture2D(map, vMapUv + vec2(0.0, uAtlasTexel.y)).a
           - texture2D(map, vMapUv - vec2(0.0, uAtlasTexel.y)).a;
  normal = normalize(normal + uDeboss * (vTangentView * hu + vBitangentView * hv));

  // Geometric specular anti-aliasing. MSAA resolves silhouettes; it does nothing about a tight
  // highlight sliding across a chamfer as the cube turns, which on a bright one-pixel band
  // against a near-black ground is the artifact that actually reads as crawling. Where the
  // normal is changing fast across a pixel, widen the lobe to cover the variance it is hiding —
  // a Toksvig-style filter, about six instructions, in place of three full-screen AA passes.
  vec3 normalDx = dFdx(normal);
  vec3 normalDy = dFdy(normal);
  float normalVariance = max(dot(normalDx, normalDx), dot(normalDy, normalDy));
  roughnessFactor = min(1.0, sqrt(roughnessFactor * roughnessFactor + normalVariance * 0.6));
}
`;

const EMISSIVE_CHUNK = /* glsl */ `
// A face turned to camera is a lit sign, not a painted panel. Emitting most of its own colour is
// what carries #f58b27 intact through the tone-mapping curve, and masking that emission by the
// type keeps the ink opaque instead of glowing along with the panel behind it.
totalEmissiveRadiance += uFaceLit * (lit * uEmissive * (1.0 - typeAlpha));

// Fresnel rim, weighted onto the shadow side only. A cool lift along an edge is what separates a
// silhouette from a near-black ground; putting it on the lit face too would drag a blue cast
// across the one surface that has to stay brand-accurate.
float rimFresnel = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 4.0);
totalEmissiveRadiance += uRimColor * (rimFresnel * uRim * (1.0 - 0.85 * lit));
`;

export function createCubeMaterial(
  atlas: THREE.Texture,
  atlasTexel: THREE.Vector2,
  preset: CubeMaterialPreset,
  /** 0..1 seed. Small per-cube drift in roughness and tint, so a field of them is not clones. */
  variation = 0.5,
): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: atlas,
    roughness: preset.roughness + (variation - 0.5) * 0.14,
    metalness: preset.metalness,
    envMapIntensity: preset.envMapIntensity * (1 + (variation - 0.5) * 0.3),
    clearcoat: preset.clearcoat,
    clearcoatRoughness: 0.2,
    emissive: 0x000000,
  });

  const faceDark = new THREE.Color(preset.faceDark);
  // A couple of per-cube degrees of tint drift. Identical material on every cube is the tell that
  // says "instanced"; this is small enough to be felt rather than seen.
  faceDark.offsetHSL(0, (variation - 0.5) * 0.05, (variation - 0.5) * 0.035);

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFaceDark = { value: faceDark };
    shader.uniforms.uFaceLit = { value: new THREE.Color(preset.faceLit) };
    shader.uniforms.uInkLight = { value: new THREE.Color(preset.inkLight) };
    shader.uniforms.uInkDark = { value: new THREE.Color(preset.inkDark) };
    shader.uniforms.uRimColor = { value: new THREE.Color('#bcc2c9') };
    shader.uniforms.uFillRange = {
      value: new THREE.Vector2(preset.fillRange[0], preset.fillRange[1]),
    };
    shader.uniforms.uInkRange = {
      value: new THREE.Vector2(preset.inkRange[0], preset.inkRange[1]),
    };
    shader.uniforms.uAtlasTexel = { value: atlasTexel };
    shader.uniforms.uTypeAlpha = { value: preset.typeAlpha };
    shader.uniforms.uTypeDim = { value: preset.typeDim };
    shader.uniforms.uEmissive = { value: preset.emissive };
    shader.uniforms.uInkRoughness = { value: preset.inkRoughness };
    shader.uniforms.uDeboss = { value: preset.deboss };
    shader.uniforms.uRim = { value: preset.rim };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\n' +
          'attribute vec3 aTangent;\n' +
          'attribute vec3 aBitangent;\n' +
          'varying float vFacing;\n' +
          'varying vec3 vTangentView;\n' +
          'varying vec3 vBitangentView;',
      )
      .replace('#include <begin_vertex>', VERTEX_CHUNK);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${COMMON_PARS}`)
      .replace('#include <map_fragment>', MAP_CHUNK)
      .replace('#include <roughnessmap_fragment>', ROUGHNESS_CHUNK)
      .replace('#include <normal_fragment_maps>', NORMAL_CHUNK)
      .replace('#include <emissivemap_fragment>', EMISSIVE_CHUNK);
  };

  // Every cube of a kind compiles to the same program. Without a stable key three would treat each
  // material's patched source as unique and compile it again per cube.
  material.customProgramCacheKey = () => `cube-hero-${preset.clearcoat > 0 ? 'coated' : 'plain'}`;

  return material;
}
