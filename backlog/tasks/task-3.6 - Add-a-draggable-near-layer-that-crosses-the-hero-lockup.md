---
id: TASK-3.6
title: Add a draggable near layer that crosses the hero lockup
status: Done
assignee:
  - '@claude'
created_date: '2026-09-10 23:03'
updated_date: '2026-09-10 23:03'
labels: []
dependencies: []
parent_task_id: TASK-3
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Requested departure from TASK-3's dissection: the reference never lets anything pass in front of the type, and the hero was built to honour that (place() pushes centre structures deep for exactly this reason). Two structures now cross the lockup to add depth, and they are draggable like the field behind them.

The type is DOM, and DOM stacking is absolute — a single canvas is one layer, so everything it draws is either wholly in front of the text or wholly behind it. Interleaving therefore needs the text between two canvases, which means a second WebGL context.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Two near structures render in front of the lockup without making it illegible
- [x] #2 Both the near layer and the field behind it are draggable through one input path
- [x] #3 The near layer never blocks pointer input to the field beneath it
- [x] #4 A near object released away from its band stays where it was dropped
- [x] #5 No frame-rate regression against the pre-overlay scene
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented as a second BillboardHeroCanvas stacked at z-[3] with transparent:true, running foregroundScene.ts — two mid-sized families (portrait citylight, lightbox) pinned to bands at the left and right edges so they clip the ends of the word rather than covering it. The mega wall and unipole are excluded: at this distance either one covers most of the lockup on its own.

Input was the real design problem. The overlay is pointer-events:none, because with pointer events on it would swallow everything and the field beneath would stop being draggable — but that also means it can never receive an event itself. So the host gained a role: 'overlay' registers its scene in overlayPointer.ts and attaches no listeners; 'base' listens and asks the registered overlay whether it wants each hit before trying its own scene. Both canvases are absolute inset-0 at the same size with matching cameras, so a normalised coordinate computed against the base is valid for the overlay — that equivalence is what makes hit-testing a scene the base does not own correct rather than approximate. The registry is a single slot and clearOverlayPointerTarget takes the target being torn down, since StrictMode can register a new overlay before the old one's cleanup runs.

A near object re-homes to wherever it was dropped instead of being pulled back to its band. Without that, releasing one away from its lane put it outside the recycle margin and it snapped across the frame a moment later, which reads as the drag having been undone.

Not blurred. An earlier pass had a CSS blur on this layer as a depth-of-field cue, which measured at ~2.6ms of compositor cost per frame; more to the point, soft focus reads as depth on scenery but as a rendering fault on something you can pick up. Its pixel ratio is capped at 1.5 rather than 2 — two objects do not warrant a full-resolution buffer.

Verified by scripted pointer events against the base canvas: hover reports grab over a near object, pointerdown is claimed (preventDefault fires, cursor 'grabbing'), and a held drag moves the object from its left band to centre frame where a screenshot shows it drawing over the lockup — which proves both that the overlay received the drag and that it renders in front of the type. Frame timing 220 samples at median 9.4ms / p95 10.8ms, against 8.3-9.4ms for the pre-overlay scene on the same display. No console errors; tsc and lint clean.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a second, transparent hero canvas above the type lockup running two draggable near structures, for depth. Interleaving DOM text with 3D needs the text between two canvases, so input is routed through a single owner: the overlay is pointer-events:none and the base canvas hit-tests it first via overlayPointer.ts, leaving both layers draggable and the field beneath unblocked. Dropped objects re-home where released. Verified with scripted pointer events (grab claimed, cursor 'grabbing', object dragged from its band to centre frame and screenshotted drawing over the lockup) and 220-sample frame timing at median 9.4ms, no regression.
<!-- SECTION:FINAL_SUMMARY:END -->
