---
id: TASK-4
title: Build an alternate cube-type hero (CubeHero)
status: Done
assignee: []
created_date: '2026-09-11 10:44'
updated_date: '2026-09-11 11:54'
labels: []
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Clean-sheet alternate home hero: a WebGL cube sculpture whose faces carry Propagenda's seven service names. Built as an independent commission to be mounted later behind a feature flag, in parallel with the existing billboard hero (TASK-3 family). Lives at components/sections/cube-hero/ and is not wired into any route.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CubeHero is exported from components/sections/cube-hero/CubeHero.tsx as a client component
- [x] #2 Root element is <section data-seamless-act class="relative h-screen overflow-hidden bg-charcoal">
- [x] #3 All seven service names appear on cube faces and are revealed in turn as the cubes rotate
- [x] #4 Reduced motion renders a composed still frame with no animation loop
- [x] #5 WebGL lifecycle is leak-free under StrictMode double-mount: geometries, materials, textures, composer and rAF are released on unmount
- [x] #6 Render loop pauses when the section is off-screen or the tab is hidden, and device pixel ratio is capped at 2
- [x] #7 Layout holds with no horizontal overflow and legible type from 390px to 1920px+
- [x] #8 No new npm dependencies and no network fetches; textures are generated procedurally
- [x] #9 npx tsc --noEmit passes clean
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built as 12 modules under components/sections/cube-hero/.

Concept: one hero cube at the golden third turns a quarter at a time through the seven services; each face carries a hand-drawn mark plus the service name. A face earns the brand orange by facing camera (shader-side, from the face normal), so the reveal and the highlight are the same event. Six faces carry seven services because the face at the BACK is repainted two beats before it is seen — a marquee, not a die.

Key decisions:
- Geometry: hand-built flat-chamfered box (96 verts / 44 tris). RoundedBoxGeometry was rejected because it subdivides faces and spreads one uv range over the flat part and the roll, which breaks per-face atlas mapping. The chamfer turns every edge highlight into real geometry MSAA can resolve.
- Material: MeshPhysicalMaterial + onBeforeCompile, four chunks replaced (map / roughnessmap / normal_fragment_maps / emissivemap). Keeps three's IBL, GGX and clearcoat; authors the facing-driven colourway, matte-ink roughness mask, texture-space deboss, emissive-masked-by-type and a Fresnel rim weighted onto the shadow side.
- Lighting: warm key camera-right, deliberately cooler fill, near-white back light, plus a procedural PMREM studio environment. No shadow maps (nothing stands on anything).
- Tone mapping: NeutralToneMapping, not ACES — ACES cannot reproduce #f58b27. faceLit is pre-compensated (#fd963f in, #f58b27 +/-5 out, measured).

Measured verification (Chrome, real device emulation):
- 1440x900 DPR2: 14.3/14.6ms median, p95 15.3/16.0, worst 17.3, 0 frames >20ms over 2x250 frames.
- SMAAPass was built and removed: +4.6ms (15.2 -> 19.8ms median, 90/230 frames >20ms). Replaced by 4x MSAA on the composer target plus Toksvig specular AA in the material.
- 390x844 DPR3 and 414x896 DPR3: 8.3ms median, canvas backing store 780x1688 / 828x1792 = DPR capped at 2.
- scrollWidth === innerWidth at 390, 414, 768, 1440, 1920.
- Ink contrast on the rendered orange face: 7.92:1 (sampled from the framebuffer).
- Lifecycle: 14 mount/unmount cycles under StrictMode left 1 canvas, 1 live context, no console warnings, frame time unchanged.
- Reduced motion: matchMedia override confirmed one still frame, no rAF loop, static seven-item list in the rail.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
CubeHero: a full-viewport WebGL hero whose subject is a chamfered cube turning a quarter at a time through Propagenda's seven services, each face carrying a procedurally drawn service mark and its name in near-black ink on brand orange. Lit by a hand-built three-light rig plus a procedural PMREM studio environment that the screen-space backdrop is derived from, so reflections and background describe one room. Not wired into any route; mounts behind NEXT_PUBLIC_HERO_VARIANT=cubes. Verified in Chrome at 390x844, 414x896, 768x1024, 1440x900 and 1920: 60fps held at 1440x900 DPR2 (14.3ms median, 0 frames over 20ms across 500 samples), no horizontal overflow at any width, DPR capped at 2 on a DPR3 phone, 7.92:1 ink contrast measured off the framebuffer, and no WebGL context leak over 14 StrictMode mount/unmount cycles. tsc --noEmit, eslint and check:import-casing all clean.
<!-- SECTION:FINAL_SUMMARY:END -->
