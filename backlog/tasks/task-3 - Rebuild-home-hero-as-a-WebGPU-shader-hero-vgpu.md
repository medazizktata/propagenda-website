---
id: TASK-3
title: Rebuild home hero as a three.js OOH billboard scene
status: To Do
assignee: []
created_date: '2026-09-08 11:12'
updated_date: '2026-09-08 11:34'
labels: []
dependencies: []
references:
  - 'https://vgpu.sh/docs/guides/nextjs'
documentation:
  - docs/rework/reel-hero-dissection.md
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the home page's opening section with a new hero modelled on the reference Instagram reel ("Three Angles", an OOH agency). The existing scroll-scrubbed showreel hero moves down to become the second home section rather than being deleted.

Full forensic breakdown of the reference: docs/rework/reel-hero-dissection.md. Read it before designing — it is the spec.

TECH DECISION (user-approved, supersedes the earlier vgpu/WebGPU plan): build with **three.js**, which is already a dependency at 0.185.1.
The reel's hero was initially assumed to be a shader field, which is why Vercel's vgpu was considered. The dissection disproved that: it is a hard-surface PBR mesh scene (12-16 textured GLTF billboard structures, MeshStandardMaterial, a warm directional key light, and an environment map). The decisive evidence is that several poster panels read mirrored - the signature of side: DoubleSide with un-flipped back-face UVs - plus truss gantries that pass edge-on and re-open showing different internal faces.
three.js supplies GLTF/Draco/KTX2 loading, PMREMGenerator, MeshStandardMaterial and EffectComposer, all of which this effect needs and all of which would have to be hand-built on raw WebGPU. It also runs on WebGL2, so there is no capability gate and no second hero to design for devices without WebGPU - which matters for the Egyptian market's older Android share. vgpu is dropped; TASK-3.1 is archived.

PALETTE DECISION (user-approved): translate to brand, do not copy. The reel is coral red #FF3B30 and cream #F3EDE1 on petrol teal #0B2B33-#1E4D57 with warm sand #C9A882 - there is no orange in it anywhere. Keep the reel's composition, motion model and photoreal-OOH concept, but re-key to Propagenda orange #f58b27 on charcoal #121212 per docs/rework/01-propaganda-design-dna.md. The sky becomes a warm amber/charcoal grade rather than teal/sand.

MOTION MODEL (measured, not guessed): the reference hero is an autoplaying idle loop, NOT scroll-driven. The page never scrolls in the reel, the camera never zooms, and every object carries its own constant angular velocity (2-5 deg/s) and linear drift (~1% of viewport width per second) with no shared vanishing point and ease: none. It is delta-integrated in rAF, not tweened.

The reference site could not be found: not publicly indexed under any candidate domain, and no URL appears in any of the reel's 324 frames. The ten open ambiguities listed in section 5 of the dissection must therefore be decided deliberately; the document recommends a default for each.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Home page opens with the new WebGPU hero
- [ ] #2 The existing showreel hero renders as the second home section with its scroll choreography intact
- [ ] #3 Visitors without WebGPU get a designed static fallback, not a blank canvas
- [ ] #4 prefers-reduced-motion is respected in both the hero and its fallback
- [ ] #5 No regression to the services page, which shares HeroLogo3D
<!-- AC:END -->
