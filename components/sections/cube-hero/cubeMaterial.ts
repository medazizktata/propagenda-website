import * as THREE from 'three';

import { ATLAS_COLS, ATLAS_ROWS, BLANK_SLOT } from './services';
import { NO_PRINT_FACE } from './roundedBox';

/**
 * The cube surface.
 *
 * This is a MeshPhysicalMaterial with five chunks of three's own shader replaced, rather than a
 * ShaderMaterial written from scratch. The trade is deliberate: everything that is hard to get
 * right — the split-sum IBL, the GGX specular, the clearcoat lobe, energy compensation — stays
 * three's problem, and only the parts that are genuinely this hero's idea are authored here.
 *
 * What a stock material cannot do, and this one does:
 *
 * 1. **Facing-driven legibility.** `vFacing` — how squarely a face has turned toward camera —
 *    used to also drive an orange colourway; that flip is gone (see `PROTAGONIST_PRESET` below,
 *    where `faceLit` now matches `faceDark` and `inkRange` never crosses), so every face keeps its
 *    normal panel colour regardless of facing. What `vFacing` still drives is the type: dormant
 *    faces carry dimmer type (`typeDim`) so the arriving face is legible before it has fully
 *    turned. `vFacing` is computed per face, not per fragment — see the vertex chunk.
 *
 * 2. **The type as part of the material, not a decal.** The mask does four separate jobs: it picks
 *    the albedo, it makes the ink *matte* where the panel is satin, it debosses the surface so
 *    glyph edges catch a real highlight, and it punches a hole in the panel's emission so the ink
 *    reads as opaque on a backlit sign rather than glowing along with it.
 *
 * 3. **Emission, wired but currently unused.** The shader can still make a lit face emit its own
 *    colour (`uEmissive`, masked by the type so ink stays opaque instead of glowing with the
 *    panel) — that machinery existed only to carry #f58b27 intact through the tone-mapping curve
 *    once a face turned orange. With the colourway flip gone, `PROTAGONIST_PRESET.emissive` is 0
 *    and every face is shaded by the room's actual lights instead of a flat self-lit override.
 *    Left in the shader rather than stripped out, in case a future preset wants a genuinely
 *    self-lit panel again.
 *
 * 4. **A Fresnel rim keyed to the shadow side.** Faces turned away get a cool edge lift that the
 *    lit face does not, so the silhouette separates from a near-black backdrop without washing a
 *    blue cast across the one surface that has to stay brand-accurate.
 *
 * 5. **The atlas lookup in the vertex shader.** The geometry carries face-local uv and a face
 *    index; which tile a face shows is a uniform, and for the chorus a per-instance offset on top
 *    of it. That is what lets nine cubes showing nine different sets of services share a single
 *    geometry — and it turns "repaint the back face" from a buffer re-upload into one float.
 */

export interface CubeMaterialPreset {
  /** Colour of a face turned away from camera. */
  faceDark: string;
  /** Colour of a face turned squarely to camera. */
  faceLit: string;
  /** Ink used while the face is dark. */
  inkLight: string;
  /** Ink used once facing crosses `inkRange` — for a preset whose lit colourway needs it. */
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
  /**
   * How much of the ink colour the printed matter emits on its own, on top of being lit. Lit by
   * the studio alone, brand-orange ink shades to a muddy brown; this carries it back to the brand
   * value on screen. Masked by the type, so the panel around it never glows.
   */
  inkGlow: number;
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
  // Equal to faceDark, on purpose: this used to be a pre-compensated brand orange that a face
  // eased into as it turned toward camera. The panel now keeps its normal colourway at every
  // facing angle, and `mix(faceDark, faceLit, lit)` — still evaluated below, still cheap — simply
  // has nothing to mix toward. Left as its own field rather than deleted so a future preset can
  // reintroduce a (non-orange) lit colourway without touching the shader.
  faceLit: '#2b2a29',
  // Owner direction (2026-09-25): the printed icons and service names are brand orange (#f58b27,
  // --color-orange), not white. inkDark matches because the ink never flips (see inkRange).
  inkLight: '#f58b27',
  inkDark: '#f58b27',
  typeAlpha: 1,
  // White type at full strength on the dark side faces reads almost as loudly as the arrived one
  // and splits the first read in two. At a third, the next service is still legible as it comes
  // round but never competes with the face that has arrived.
  typeDim: 0.34,
  // At rest the front face reads facing ~0.93 (it is yawed 30deg off axis for the three-quarter
  // view); the range closes below that with enough headroom that pointer parallax can swing the
  // pose a few degrees without the type-dim easing flickering.
  fillRange: [0.62, 0.82],
  // Never crosses (facing tops out around 0.97): the panel no longer has a lit colourway to
  // flip ink against, so ink stays `inkLight` at every angle. Kept as a range, not a boolean, so
  // a future preset that does give the panel a lit colourway only has to move these two numbers.
  inkRange: [9, 10],
  // 0: there is no lit colourway left to carry through the tone-mapping curve (see the file
  // header). Every face is shaded by the room's actual lights instead of a flat self-lit override.
  emissive: 0,
  inkGlow: 1.1,
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
  // A near-black warm brown, not the protagonist's charcoal-on-charcoal: the chorus still gets a
  // faint, per-cube warmth as an individual cube turns to face camera, which keeps the field
  // reading as many small objects catching the same light rather than one flat backdrop.
  faceLit: '#32200f',
  // Brand orange like the protagonist's (owner direction 2026-09-25); at typeAlpha 0.22 it reads
  // as a warm whisper in the field rather than a second protagonist.
  inkLight: '#f58b27',
  // Never flips: a chorus face never gets bright enough to need dark ink.
  inkDark: '#f58b27',
  typeAlpha: 0.22,
  typeDim: 0.32,
  fillRange: [0.84, 0.995],
  inkRange: [9, 10],
  emissive: 0,
  inkGlow: 1.1,
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

/**
 * Face uv is squeezed 3% inside its tile so the linear-mip filter cannot drag a neighbouring
 * tile's ink across a face edge.
 */
const TILE_INSET = 0.03;
/** Slots in the atlas, so a chorus offset can wrap through all of them including the blank. */
const ATLAS_SLOTS = ATLAS_COLS * ATLAS_ROWS;

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
uniform float uInkGlow;
uniform float uInkRoughness;
uniform float uDeboss;
uniform float uRim;

varying float vFacing;
varying vec3 vTangentView;
varying vec3 vBitangentView;
`;

/** Per-instance drift, interpolated flat in practice — every vertex of an instance agrees. */
const INSTANCED_VARYINGS = /* glsl */ `
varying float vVariation;
varying vec3 vInstanceFaceDark;
`;

function vertexDeclarations(instanced: boolean): string {
  return /* glsl */ `
attribute vec3 aTangent;
attribute vec3 aFaceNormal;
attribute float aFaceIndex;
uniform float uFaceSlot[6];
varying float vFacing;
varying vec3 vTangentView;
varying vec3 vBitangentView;
${
  instanced
    ? /* glsl */ `
attribute float aSlotOffset;
attribute float aVariation;
attribute vec3 aFaceDark;
${INSTANCED_VARYINGS}`
    : ''
}`;
}

/**
 * Which atlas tile this vertex's face is showing, resolved here rather than baked into the uv
 * buffer.
 *
 * Doing it in the shader is what collapses nine geometries into two: the chorus is one
 * InstancedMesh whose cubes each carry a different slot offset, and repainting the protagonist's
 * back face on a beat is a single uniform write instead of re-uploading 48 floats.
 *
 * Appended after three's own `<uv_vertex>` rather than replacing it, so every other uv varying
 * the material might need is still set up the way three expects.
 */
function uvChunk(instanced: boolean): string {
  return /* glsl */ `
float tileSlot = ${BLANK_SLOT}.0;
if (aFaceIndex < ${NO_PRINT_FACE}.0 - 0.5) {
  tileSlot = uFaceSlot[int(aFaceIndex)];
  ${instanced ? `tileSlot = mod(tileSlot + aSlotOffset, ${ATLAS_SLOTS}.0);` : ''}
}
vec2 tileLocal = mix(vec2(${TILE_INSET}), vec2(${1 - TILE_INSET}), uv);
// The atlas grid is indexed from the canvas's top-left but textures upload with flipY, so the
// canvas row fraction has to be inverted on the way into v.
vMapUv = vec2(
  (mod(tileSlot, ${ATLAS_COLS}.0) + tileLocal.x) / ${ATLAS_COLS}.0,
  1.0 - (floor(tileSlot / ${ATLAS_COLS}.0) + 1.0 - tileLocal.y) / ${ATLAS_ROWS}.0
);
${
  instanced
    ? /* glsl */ `
vVariation = aVariation;
vInstanceFaceDark = aFaceDark;`
    : ''
}`;
}

/**
 * Per face, not per fragment.
 *
 * Measuring "how squarely is this turned toward me" from the object's centre keeps it constant
 * across a face, as it must be for a flat printed panel — measured per fragment, a large near face
 * fades toward its own corners and the type-dim (or any future lit colourway) vignettes across the
 * type. Note that it reads `aFaceNormal` and not the shading normal: the panel is now slightly
 * crowned, and letting that 2.5 degree dome into this term would reintroduce exactly the vignette
 * the per-face measurement exists to avoid. On the roll the two vectors are the same, which is
 * what carries a lit colourway smoothly over the edge and mitres its frame out of geometry rather
 * than texture.
 */
function vertexChunk(instanced: boolean): string {
  return /* glsl */ `
#include <begin_vertex>
vec3 faceNormal = aFaceNormal;
vec3 faceTangent = aTangent;
vec4 cubeCentre = vec4(0.0, 0.0, 0.0, 1.0);
${
  instanced
    ? /* glsl */ `
// Without this the whole chorus would take its facing from the group's origin and light as one
// object; instanceMatrix is rotation plus uniform scale, so the mat3 needs no inverse-transpose.
faceNormal = mat3(instanceMatrix) * faceNormal;
faceTangent = mat3(instanceMatrix) * faceTangent;
cubeCentre = instanceMatrix * cubeCentre;`
    : ''
}
vec3 faceNormalView = normalize(normalMatrix * faceNormal);
vec4 cubeCentreView = modelViewMatrix * cubeCentre;
vFacing = dot(faceNormalView, normalize(-cubeCentreView.xyz));
vTangentView = normalize(normalMatrix * faceTangent);
// The geometry ships a right-handed basis (u x v == n), so the bitangent is a cross product
// rather than a third vertex attribute.
vBitangentView = cross(faceNormalView, vTangentView);`;
}

function mapChunk(instanced: boolean): string {
  return /* glsl */ `
float mask = texture2D(map, vMapUv).a;
float lit = smoothstep(uFillRange.x, uFillRange.y, vFacing);
float typeAlpha = clamp(mask * uTypeAlpha * mix(uTypeDim, 1.0, lit), 0.0, 1.0);
vec3 panel = mix(${instanced ? 'vInstanceFaceDark' : 'uFaceDark'}, uFaceLit, lit);
vec3 ink = mix(uInkLight, uInkDark, smoothstep(uInkRange.x, uInkRange.y, vFacing));
diffuseColor.rgb *= mix(panel, ink, typeAlpha);`;
}

function roughnessChunk(instanced: boolean): string {
  return /* glsl */ `
// Identical material on every cube is the tell that says "instanced"; a couple of points of
// roughness drift per cube is small enough to be felt rather than seen.
float roughnessFactor = roughness${instanced ? ' + (vVariation - 0.5) * 0.14' : ''};
// Ink is matte; the panel it sits on is satin. The cheapest honest cue that the type is a material
// on the surface rather than a picture of type: the highlight breaks as it crosses the glyphs.
roughnessFactor = mix(roughnessFactor, uInkRoughness, typeAlpha);`;
}

/**
 * Debossing, done in texture space rather than from screen-space derivatives. Four taps give the
 * mask's gradient; the face's own uv axes — reconstructed in the vertex chunk from the tangent and
 * the face normal — turn that gradient into a normal tilt. Texture space matters: a screen-space
 * bump would grow stronger as the cube came closer and evaporate on the small ones, whereas this
 * softens exactly in step with the mip the texture is already being read from.
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
  // highlight sliding along an edge roll as the cube turns, which on a bright band against a
  // near-black ground is the artifact that actually reads as crawling — and the roll now has a
  // continuously varying normal for it to crawl along, so this matters more than it did against
  // a single flat chamfer facet. Where the normal changes fast across a pixel, widen the lobe to
  // cover the variance it is hiding: a Toksvig-style filter, about six instructions, in place of
  // three full-screen AA passes.
  vec3 normalDx = dFdx(normal);
  vec3 normalDy = dFdy(normal);
  float normalVariance = max(dot(normalDx, normalDx), dot(normalDy, normalDy));
  roughnessFactor = min(1.0, sqrt(roughnessFactor * roughnessFactor + normalVariance * 0.6));
}
`;

const EMISSIVE_CHUNK = /* glsl */ `
// uEmissive is 0 on every current preset (see cubeMaterial.ts) — no face self-lights any more —
// but the term is left wired: a preset that sets uEmissive > 0 makes that face a lit sign rather
// than a painted panel, and masking the emission by the type is what would keep the ink opaque
// instead of glowing along with the panel behind it.
totalEmissiveRadiance += uFaceLit * (lit * uEmissive * (1.0 - typeAlpha));

// The ink's own light (\`ink\` and \`typeAlpha\` come from the map chunk above): brand-orange type
// stays brand orange on screen instead of shading to brown under a dim studio key.
totalEmissiveRadiance += ink * (typeAlpha * uInkGlow);

// Fresnel rim, weighted onto the shadow side only. A cool lift along an edge is what separates a
// silhouette from a near-black ground; putting it on the lit face too would drag a blue cast
// across the one surface that has to stay brand-accurate.
float rimFresnel = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 4.0);
totalEmissiveRadiance += uRimColor * (rimFresnel * uRim * (1.0 - 0.85 * lit));
`;

export interface CubeMaterial {
  material: THREE.MeshPhysicalMaterial;
  /**
   * Point the six printed faces at atlas tiles. Six floats into a uniform: no buffer is touched,
   * nothing is re-uploaded, and it is safe to call on a beat.
   */
  setFaceSlots(slots: readonly number[]): void;
  dispose(): void;
}

export interface CubeMaterialOptions {
  /**
   * Built for an InstancedMesh. Adds the per-instance tile offset and the per-cube roughness and
   * tint drift, which are attributes rather than uniforms once every cube shares one material.
   */
  instanced?: boolean;
  /** 0..1 seed. Small per-cube drift in roughness and tint; ignored when instanced. */
  variation?: number;
}

export function createCubeMaterial(
  atlas: THREE.Texture,
  atlasTexel: THREE.Vector2,
  preset: CubeMaterialPreset,
  options: CubeMaterialOptions = {},
): CubeMaterial {
  const instanced = options.instanced ?? false;
  const variation = options.variation ?? 0.5;

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: atlas,
    roughness: preset.roughness + (instanced ? 0 : (variation - 0.5) * 0.14),
    metalness: preset.metalness,
    // Per-instance envMapIntensity would mean patching three's IBL uniform into a varying for a
    // +/-15% brightness nudge on cubes that are 150px wide and half-buried in fog. The per-cube
    // roughness drift below already spreads their specular; this stays a single value.
    envMapIntensity: preset.envMapIntensity * (instanced ? 1 : 1 + (variation - 0.5) * 0.3),
    clearcoat: preset.clearcoat,
    clearcoatRoughness: 0.2,
    emissive: 0x000000,
  });

  const faceDark = new THREE.Color(preset.faceDark);
  if (!instanced) {
    // A couple of per-cube degrees of tint drift. Identical material on every cube is the tell
    // that says "instanced"; this is small enough to be felt rather than seen.
    faceDark.offsetHSL(0, (variation - 0.5) * 0.05, (variation - 0.5) * 0.035);
  }

  // Held outside onBeforeCompile so setFaceSlots can write to it before, during or after the
  // material's first compile.
  const faceSlot = { value: [0, 0, 0, 0, 0, 0] as number[] };

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
    shader.uniforms.uInkGlow = { value: preset.inkGlow };
    shader.uniforms.uInkRoughness = { value: preset.inkRoughness };
    shader.uniforms.uDeboss = { value: preset.deboss };
    shader.uniforms.uRim = { value: preset.rim };
    shader.uniforms.uFaceSlot = faceSlot;

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDeclarations(instanced)}`)
      .replace('#include <uv_vertex>', `#include <uv_vertex>\n${uvChunk(instanced)}`)
      .replace('#include <begin_vertex>', vertexChunk(instanced));

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\n${COMMON_PARS}${instanced ? INSTANCED_VARYINGS : ''}`,
      )
      .replace('#include <map_fragment>', mapChunk(instanced))
      .replace('#include <roughnessmap_fragment>', roughnessChunk(instanced))
      .replace('#include <normal_fragment_maps>', NORMAL_CHUNK)
      .replace('#include <emissivemap_fragment>', EMISSIVE_CHUNK);
  };

  // Every cube of a kind compiles to the same program. Without a stable key three would treat each
  // material's patched source as unique and compile it again per cube.
  const kind = `${preset.clearcoat > 0 ? 'coated' : 'plain'}-${instanced ? 'instanced' : 'single'}`;
  material.customProgramCacheKey = () => `cube-hero-${kind}`;

  return {
    material,
    setFaceSlots(slots) {
      for (let face = 0; face < 6; face += 1) faceSlot.value[face] = slots[face];
    },
    dispose() {
      material.dispose();
    },
  };
}
