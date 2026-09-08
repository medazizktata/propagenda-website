---
id: TASK-3.4
title: 'Build the billboard scene: models, materials, lighting and idle-loop motion'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-09-08 11:12'
updated_date: '2026-09-08 11:57'
labels: []
dependencies:
  - TASK-3.2
documentation:
  - docs/rework/reel-hero-dissection.md
parent_task_id: TASK-3
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Author the three.js scene that makes the hero: the sky backdrop, the OOH structures, their materials and lighting, and the delta-integrated idle loop. docs/rework/reel-hero-dissection.md sections 2.4-2.6 and 4 (Tier B) are the spec and carry measured values for every number below.

Shape of the work:
- Sky: a far plane at roughly 10-20x the objects distance, driven by the measured parallax separation (sky drifts ~1-3%/s while objects change up to 7%/s). Re-keyed to a warm amber/charcoal grade, not the reference teal/sand.
- Environment: PMREMGenerator.fromEquirectangular(skyTex) into scene.environment. This is most of the photoreal read - the sky-coloured shadow side and the speculars travelling along the steel tubes both come from it.
- Structures: 12-16 instances from ~4 model families (unipole, triangular truss gantry, wall panel, portrait poster arm). Draco + KTX2.
- Keep the mirrored back faces. Poster planes use side: DoubleSide with un-flipped back-face UVs, so roughly half read backwards. That artefact is a signature of the original and a large part of why it reads as genuinely three-dimensional. Do not "fix" it.
- Motion: per-object constant angular velocity and linear drift, each randomised, seeded with a random initial quaternion, recycled when it leaves the frustum. ease: none, integrated on delta in rAF. No shared vanishing point, no camera dolly, no scroll coupling.

Asset weight is the real constraint: Cloudflare Workers caps each asset at 25 MiB, and the dissection budgets <=800 KB per model. Verify with pnpm perf:assets.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Structures tumble independently with no visible synchronisation and no shared vanishing point
- [ ] #2 Poster planes render DoubleSide with un-flipped back-face UVs, preserving the mirrored back faces
- [ ] #3 Sky and objects show distinct parallax rates, with the sky reading as far more distant
- [ ] #4 Palette is Propagenda orange #f58b27 on charcoal #121212, not the reference teal/sand
- [ ] #5 Scene holds a stable frame rate at full viewport on a mid-tier laptop GPU
- [ ] #6 pnpm perf:assets passes and no asset approaches the 25 MiB Workers cap
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Partly delivered ahead of schedule while validating the canvas host (commit cbcefab). Landed: warm amber/charcoal sky with PMREM environment, per-object delta-integrated tumble and drift at the measured rates, 11 A4-portrait poster panels plus 4 truss structures, edge-rail frames preserving the mirrored back faces, and a poster slideshow - each panel cross-fades between 12 real portfolio images on its own dwell/fade clock via a patched map_fragment (one shader program, per-panel uniforms). Assets: 253 KB for the poster set, zero bytes of geometry.

Still open: the structures are procedural stand-ins. The poster panels barely need more than a frame, but the truss gantries are crude next to the reference's real lattice. Decision pending on whether to source a detailed truss model.
<!-- SECTION:NOTES:END -->
