---
id: TASK-3.2
title: Add the hero canvas host with poster-first LCP and graceful degradation
status: In Progress
assignee:
  - '@claude'
created_date: '2026-09-08 11:12'
updated_date: '2026-09-08 11:47'
labels: []
dependencies: []
parent_task_id: TASK-3
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A client component that owns the hero canvas: mounts the three.js renderer, runs the rAF loop, and tears everything down cleanly. Scene-agnostic, so the billboard content can be built and swapped independently.

Reframed after the tech decision changed from vgpu/WebGPU to three.js. The WebGPU capability gate is gone - WebGL2 runs essentially everywhere, so there is no longer a second hero to design. What remains is real but different:

- LCP. A WebGL hero is an LCP hazard. Ship a static poster (AVIF/WebP of the composed scene) as the LCP element and swap the canvas in after it is ready, off the critical path. The dissection flags this explicitly.
- WebGL2 context loss. Handle webglcontextlost/webglcontextrestored rather than leaving a dead black canvas.
- Teardown. React StrictMode double-mounts effects; without disposing geometries, materials, textures and the renderer, each remount leaks GPU memory. The existing HeroLogo3D is the in-repo reference for how this project already does three.js lifecycle.
- Pausing. Stop the rAF loop when the hero leaves the viewport or the tab is hidden. The reference hero animates forever, so an unpaused loop burns battery for the whole visit.
- Reduced motion. Hold a still frame rather than animating.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A static poster is the LCP element and the canvas swaps in after first paint
- [ ] #2 The rAF loop stops when the hero is scrolled out of view or the tab is hidden
- [ ] #3 Renderer, geometries, materials and textures are disposed on unmount with no leak across StrictMode remounts or route changes
- [ ] #4 WebGL2 context loss is handled and recovers or falls back to the poster rather than showing a dead canvas
- [ ] #5 prefers-reduced-motion holds a still frame instead of animating
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define a scene-agnostic contract (HeroScene / HeroSceneFactory) so TASK-3.4 can swap the real billboard scene in without touching the host.
2. Build BillboardHeroCanvas: renderer setup matching HeroLogo3D conventions (pixelRatio clamp, powerPreference, antialias), rAF loop with delta, resize handling.
3. Poster-first LCP: render a static <img> poster as the LCP element; mount the canvas only after first paint (requestIdleCallback with a timeout fallback), then cross-fade the canvas over the poster once the first frame is drawn.
4. Pausing: IntersectionObserver with rootMargin 40% plus visibilitychange, reusing the hero3d:suspend / hero3d:resume events HeroLogo3D already listens to so both canvases suspend together.
5. Context loss: listen for webglcontextlost (preventDefault) and webglcontextrestored; on unrecoverable loss reveal the poster again rather than leaving a dead canvas.
6. Teardown: disposables array, dispose geometries/materials/textures/pmrem/renderer, remove the canvas element, cancel rAF, drop every listener. Must survive StrictMode double-mount.
7. Reduced motion: render exactly one frame and never start the loop.
8. Ship a placeholder scene so the host is demonstrable; the real scene lands in TASK-3.4.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented and committed (4654b4d): types.ts (HeroScene/HeroSceneFactory contract), BillboardHeroCanvas.tsx (renderer lifecycle, poster-first LCP, IntersectionObserver + visibilitychange + hero3d:suspend/resume pausing, webglcontextlost/restored with rebuild-by-generation, full teardown, reduced-motion single frame), placeholderScene.ts, and public/images/billboard-hero-poster.jpg (21.9 KB). Typecheck passes; zero lint problems in these files (the repo's lint was already failing on 12 unrelated pre-existing files). Acceptance criteria not yet checked - they need browser verification, which requires TASK-3.3 to mount the hero on the page first.
<!-- SECTION:NOTES:END -->
