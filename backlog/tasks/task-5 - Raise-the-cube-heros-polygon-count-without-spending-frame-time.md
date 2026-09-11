---
id: TASK-5
title: Raise the cube hero's polygon count without spending frame time
status: Done
assignee: []
created_date: '2026-09-11 13:32'
updated_date: '2026-09-11 13:33'
labels: []
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The cube hero's cubes were a ~96-vertex flat-chamfered box: one bevel facet per edge, one fixed normal, so the edge highlight switched on and off instead of rolling as the cube turned. The client asked for a noticeably higher polygon count with no loss of performance.

On this scene vertex count is nearly free; frame time is made of fill rate at DPR, the full-screen post chain, MSAA sample count and per-fragment work. So the budget goes into geometry that changes what the light does, and nothing extra is spent per pixel: no new pass, no extra MSAA samples, no new per-fragment instructions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The protagonist cube's edges are a true multi-segment radius, so the specular band travels along the edge as the cube turns rather than switching between facets
- [x] #2 Each printed panel is very slightly crowned, so its highlight travels across the face instead of switching on flatly, and the facing-driven orange stays constant across the panel (no vignette toward the corners)
- [x] #3 Draw calls do not increase at any breakpoint
- [x] #4 One geometry is shared across the background cubes rather than one per cube
- [x] #5 Geometry is indexed and is never rebuilt per frame
- [x] #6 Settled frame time at 1440x900 DPR2 and 390x844 DPR3 stays within the measured budget (13.3ms median / 14.6 p95 / 0 frames over 20ms, and full refresh rate on the phone)
- [x] #7 Reduced motion still renders one settled frame and never starts the loop
- [x] #8 npx tsc --noEmit passes and eslint is clean for components/sections/cube-hero/
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace the flat-chamfer builder with a rounded-box builder (roundedBox.ts): per-face grid pushed onto the rounded surface by core = clamp(p, +/-inner); surface = core + radius * normalize(p - core). Grid steps uniformly across the panel and in equal angle (inner + radius*tan(theta)) across the roll. Panel and roll are separate vertex runs sharing positions on the tangent line, so uv stops dead at the panel edge.
2. Crown each panel with a quartic dome (zero slope at the panel edge, so it is tangent to the roll and leaves no shading crease).
3. Ship aFaceNormal so the colourway keeps measuring facing from the panel's nominal normal, not the crowned shading normal.
4. Move the atlas tile lookup into the vertex shader (face-local uv + aFaceIndex + a uFaceSlot uniform), which makes one geometry serve every cube and turns the per-beat face repaint into a uniform write.
5. Collapse the eight chorus meshes into one InstancedMesh with per-instance slot offset, roughness variation and tint; repack the visible set on layout so the drawn instances are always a prefix.
6. Measure before/after on a production build, three consecutive runs, one tab, vsync uncapped so the rAF interval reports real per-frame cost.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Counts, from renderer.info-equivalent draw tallies taken on a settled frame of a production build (the WebGL2 draw entry points are wrapped, which reproduces three own accounting including instanceCount):

| | before | after |
|---|---|---|
| triangles, 1440x900 | 413 | 13,505 |
| triangles, 390x844 | 180 | 7,492 |
| draw calls, 1440x900 | 25 | 18 |
| draw calls, 900x700 | 22 | 18 |
| draw calls, portrait / phone | 20 | 18 |
| cube geometries | 9 | 2 |
| cube materials | 9 | 2 |

Scene draws went 10 -> 3 (backdrop, protagonist, one instanced chorus). The post chain is untouched at 15 draws. Draw calls are now constant across every breakpoint.

Per cube: protagonist 44 -> 3,888 triangles (88x), chorus cube 44 -> 1,200 (27x).

Measurement method. Production build (next build with NEXT_PUBLIC_HERO_VARIANT=cubes), served, one headed Chrome page at a time, machine allowed to settle 8s after the canvas fades in. The first instrument tried was EXT_disjoint_timer_query_webgl2 and it is useless here - ANGLE on Metal reports scheduled-to-completed, so it returns a flat ~32ms pipeline depth against a 16ms frame. gl.finish() serialisation also reads ~0 because the scene is nowhere near the vsync ceiling on this machine (Apple M3 Pro, 120Hz panel). What works is launching with --disable-gpu-vsync --disable-frame-rate-limit: the rAF interval then reports real per-frame pipeline cost, and it reproduces the stated budget almost exactly (12.7ms median, p95 14.0, 0/600 over 20ms vs the budgeted 13.3 / 14.6 / 0 of 480).

Because the machine drifted over the session (run-to-run spread about +/-0.6ms, and the client is right that a second WebGL tab or an unsettled machine wrecks a reading), the two builds were served simultaneously on separate ports and measured alternately, six A/B pairs, uncapped, 1440x900 DPR2. Before -> after medians: 13.50 -> 13.50, 14.10 -> 12.90, 13.70 -> 13.80, 13.70 -> 12.90, 12.90 -> 13.00, 12.90 -> 13.70. Before median of medians 13.60, after 13.25. The change is not resolvable above the noise floor. Phone (390x844 DPR3, backing 780x1688) paired runs: rAF interval median 2.60ms in all six, before and after.

Vsync-capped (normal operation): desktop 16.60ms interval, 0/555 over 20ms; phone 8.30ms interval (full 120Hz), 0/960 over 20ms - identical before and after. Main-thread work per frame 0.4-0.6ms both.

Correctness checks: resize sweep across 1440x900, 900x700, 700x900, 390x844, 768x1024, 1920x1080 - the instance repack reproduces the old per-breakpoint cube counts exactly (9 / 6 / 4 / 4 / 4 / 9 cubes including the protagonist) with no console errors. Brand orange on the lit face measured before (238,133,41)-(241,137,46) and after (239,133,42)-(242,137,46) at six points across the panel: unchanged, and flatter across the face than before. Reduced motion renders one settled frame and issues zero draws per frame thereafter.

Deliberately not done: real geometric relief for the type. Poppins stems land at 2.5-7 CSS px on the hero face and sub-pixel on the chorus, so a displaced height field would need a grid finer than a pixel (~650k vertices per cube) and would still read as a ragged, shimmering extrusion of an antialiased mask rather than as type - and this rig has no shadow maps by design, so "self-shadows" is not on the table anyway. The analytic four-tap deboss is smoother and mip-correct. The short rule under each icon was measured too (46 x 1.3 CSS px) and is too thin to mill. Per-instance envMapIntensity was also dropped rather than patching three IBL uniform into a varying for a +/-15% brightness nudge on 150px background cubes; the per-instance roughness drift already spreads their specular.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Replaced the flat-chamfered box with a rounded-box builder (components/sections/cube-hero/roundedBox.ts): a per-face grid pushed onto the rounded surface by core = clamp(p, +/-inner); surface = core + radius * normalize(p - core), stepping in equal angle across the roll so the specular band crosses facets at a constant rate, plus a quartic crown on each panel that is tangent to the roll. The atlas tile lookup moved into the vertex shader (face-local uv + aFaceIndex + a uFaceSlot uniform, with a per-instance offset for the chorus), which let the eight background meshes collapse into one InstancedMesh sharing one geometry and one material.

Protagonist 44 -> 3,888 triangles, each chorus cube 44 -> 1,200; scene total 396 -> 13,488. Draw calls fell 25 -> 18 at 1440x900 and are now constant at 18 across every breakpoint. Verified with paired A/B measurement of both builds served simultaneously and measured alternately over six runs on a production build with vsync uncapped: no resolvable frame-time difference (before median-of-medians 13.60ms, after 13.25ms, run-to-run spread +/-0.6ms). Vsync-capped both hold 16.6ms at 1440x900 DPR2 and 8.3ms at 390x844 DPR3 with 0 frames over 20ms. Resize sweep reproduces the old per-breakpoint cube counts, brand orange on the lit face is unchanged, reduced motion still renders one frame and stops. tsc --noEmit clean, eslint clean for components/sections/cube-hero/.
<!-- SECTION:FINAL_SUMMARY:END -->
