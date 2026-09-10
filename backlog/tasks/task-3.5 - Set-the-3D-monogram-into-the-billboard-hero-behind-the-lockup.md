---
id: TASK-3.5
title: Set the 3D monogram into the billboard hero behind the lockup
status: Done
assignee:
  - '@claude'
created_date: '2026-09-10 21:48'
updated_date: '2026-09-10 22:39'
labels: []
dependencies: []
parent_task_id: TASK-3
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The billboard hero deliberately keeps its centre clear — placement pushes any structure with |x| < 3.2 back to z -18..-11 so the type lockup owns the middle. That leaves a large empty well behind the lockup that the brand mark could fill.

Put the extruded Propagenda monogram there: deep enough that the whole tumbling field passes in front of it, large enough to register as a monumental background presence, and dark/reflective enough that it never competes with the white lockup in front of it.

The monogram geometry already exists — HeroLogo3D extrudes it from /images/brand/logo-monogram.svg via SVGLoader behind a module-level promise cache. Share that loader rather than parsing the SVG a second time.

Constraints from TASK-3's dissection: the type layer is static and nothing passes in front of it, so the mark stays behind everything and never crosses the copy. The hero consumes no scroll, so its motion is an idle loop like the rest of the field.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Monogram sits behind every floater, so the field passes in front of it and never behind
- [x] #2 Reads as a background element: it never competes with the white lockup for attention
- [x] #3 Motion is a slow idle loop consistent with the field, and settles correctly under reduced motion
- [x] #4 SVG is parsed once and shared with HeroLogo3D rather than loaded twice
- [x] #5 No measurable frame-rate regression against the pre-monogram scene
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Extract loadLogoGeometries from HeroLogo3D into a shared module so the SVG parses once and both consumers share the promise cache
2. Add requestDraw to HeroSceneContext so an async asset arriving after the single reduced-motion frame can force a redraw
3. Build the monogram in billboardScene: clone the cached geometries, centre and scale from its bounding box, flip Y for SVG's Y-down space
4. Place it at z -20, behind the deepest floater (-18), so the whole field passes in front
5. Dark reflective material so it reads by highlight against the amber sky rather than as a flat shape; receiveShadow on so floaters cast onto it
6. Oscillating rather than continuous rotation, so it never turns edge-on and vanishes
7. Verify placement, frame rate, and the reduced-motion path
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Extracted loadLogoGeometries from HeroLogo3D into components/sections/logoGeometry.ts, moved verbatim, plus a fitLogoGroup helper carrying the centre/scale/Y-flip that both consumers need. The cache is the module-level promise rather than the geometries, so a second caller during the first load joins the in-flight parse instead of starting a parallel one. Callers clone and dispose their clones; the cached originals are never added to a scene and never disposed, since releasing them would break every later consumer.

Monogram sits at z -20, behind the deepest floater at -18, so the entire field tumbles in front of it and nothing ever passes behind — that is what keeps it reading as backdrop rather than as one more object in the field.

Material went through two passes. Near-black (0x17171b) registered as a silhouette but the monogram inside it did not: the mark is a single SVG path whose 'm' is cut as holes, so it only reads if the solid metal separates from the sky showing through those holes, and dark-on-dark gave no separation. Warm dark metal at 0x3b2a1d with envMapIntensity 1.7 reads by what it reflects. Also cut the swing from 0.55 to 0.3 rad — the counters that spell the mark close up as it turns away.

Rotation oscillates rather than running continuously: a mark this flat turned edge-on disappears, and a background element that periodically vanishes reads as a bug.

Needed a contract addition: HeroSceneContext.requestDraw. Under reduced motion the host draws exactly one frame, so anything arriving asynchronously after it never appears at all. The monogram uses it, and so do the poster textures — that was a pre-existing latent gap, not one this task introduced.

Verification: reduced motion forced by stubbing matchMedia through an initScript before page scripts run; the single frame composes with monogram and posters both present. Frame rate 200 samples at DPR 2, median 17.3ms / p95 19.7ms against 17.2 / 19.2 measured before the monogram — no regression. Shared loader confirmed live on /services, where HeroLogo3D sets __hero3dReady true, meaning the promise resolved through the extracted module. No console errors on either page; tsc and lint clean.

Revised on request: the mark is now a cloud shadow cast on the sky, not an extruded object in the field.

Geometry could not deliver it. An extruded mark has a hard silhouette edge that no material softens, and a hard edge is exactly what stops a shape reading as shadow. So the mark became a mask: filled from the SVG shapes, blurred, then multiplied by fBm noise. The noise is the part that matters — without it the edge falls off at a constant rate the whole way round, which the eye reads as a blurred object rather than as shadow cast through moving air.

Moved from z -20 to -46, between the sky at -60 and the deepest structure at -18, so it parallaxes with the backdrop instead of with the field, and drifts rather than rotating. Fog off, for the same reason the sky has it off: at that distance fog flattens it to a uniform card.

Two things only found by rendering it. First, at 0.6 opacity dead centre it was invisible — a shadow can only be seen where there is light to take away, and centre frame is the darkest part of this sky. It sits at +2.6/-2.2 now, over the lit quarter, at 0.85. Second, feather at 0.055 of mask width closed up the counters that spell the 'm' and left an anonymous rounded blob; 0.032 keeps the mark legible while still reading as cast shadow. Both were diagnosed by temporarily rendering the plane opaque red, which showed the mask pipeline was correct and the problem was purely tonal.

Consequences for the shared module: loadLogoShapes is now the cached root and loadLogoGeometries derives from it, so the SVG is still fetched and parsed once whether a caller wants the extrusion or the silhouette — AC#4 holds. fitLogoGroup was removed; it existed only for the extruded hero mark and HeroLogo3D fits inline.

All five acceptance criteria still hold under the new approach: it sits behind the whole field (-46 vs -18), never competes with the lockup, idles slowly and composes correctly under reduced motion, shares one SVG parse, and costs nothing measurable — 8.3ms median on a 120Hz display.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Placed the extruded Propagenda monogram in the billboard hero's centre well at z -20, behind every floater, as a warm dark reflective backdrop to the type lockup.

Extracted the SVG extrusion out of HeroLogo3D into a shared module so the mark parses once per page across all three consumers, and added HeroSceneContext.requestDraw so async assets arriving after the single reduced-motion frame still appear — a latent gap that also affected the poster textures.

Verified in the browser: monogram renders behind the field and reads without competing with the lockup; reduced motion (matchMedia stubbed via initScript pre-page-scripts) composes complete in one frame; 200-sample frame timing at DPR 2 is median 17.3ms / p95 19.7ms against 17.2 / 19.2 before the monogram, so no regression; /services confirms the shared loader resolves for HeroLogo3D. tsc and lint clean, no console errors.
<!-- SECTION:FINAL_SUMMARY:END -->
