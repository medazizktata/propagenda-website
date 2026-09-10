---
id: TASK-3.4
title: 'Build the billboard scene: models, materials, lighting and idle-loop motion'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-09-08 11:12'
updated_date: '2026-09-10 23:42'
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

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
7. Wire pointer raycast on billboard floaters (click impulse + slideshow advance, hover cursor)

8. Diversify procedural OOH families (unipole, truss, mega wall, shelter, lightbox, totem, portrait) — all marketing-space, keep DoubleSide posters
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Partly delivered ahead of schedule while validating the canvas host (commit cbcefab). Landed: warm amber/charcoal sky with PMREM environment, per-object delta-integrated tumble and drift at the measured rates, 11 A4-portrait poster panels plus 4 truss structures, edge-rail frames preserving the mirrored back faces, and a poster slideshow - each panel cross-fades between 12 real portfolio images on its own dwell/fade clock via a patched map_fragment (one shader program, per-panel uniforms). Assets: 253 KB for the poster set, zero bytes of geometry.

Still open: the structures are procedural stand-ins. The poster panels barely need more than a frame, but the truss gantries are crude next to the reference's real lattice. Decision pending on whether to source a detailed truss model.

Balance and background pass (commit 70e1823). Fixed a real bug: the sky animated texture.offset.x on a CanvasTexture, which defaults to ClampToEdgeWrapping, so the edge pixels were stretched across the plane — that was the horizontal smear over the whole background. The sky mesh drifts instead.

Field balance now holds by construction: stratified placement (one object per column with jitter) rather than uniform random, which clumps at ~15 draws. Recycling wraps per axis instead of mirroring through the origin, which used to preserve any starting imbalance.

Cirrus rebuilt as fBm value noise along a rotated, stretched axis instead of 30 filled rectangles.

Measured in dev: scene construction is sky 11ms + PMREM 13ms + geometry 2ms = 26ms. Long-task totals 240ms with the hero vs 203ms on main without it, so the hero adds roughly 37ms; the ~100ms tasks are pre-existing. Dev-build numbers — production will be lower and should be re-measured before this is called done.

Adding click interactivity: raycast hit on floaters → spin/drift impulse + force panel slideshow advance; pointer cursor on hover. Outside original AC but requested.

Click interactivity landed: raycast on floaters, decaying spin/drift impulse, force slideshow advance on panels, pointer cursor on hover. Poster set to pointer-events-none so clicks reach the canvas.

Mark shadow tucked behind lockup only (not full-viewport). Floaters: drag to move, release rewrites steady drift direction/speed; short tap still kicks + advances slideshow.

Starting structure diversification pass: replace 11 identical portraits + 4 crude trusses with a mixed OOH/marketing kit.

Diversified field: 16 structures across 7 marketing/OOH families (unipole, portrait citylight, truss gantry, mega wall, bus shelter, lightbox, wayfinding totem) in oohStructures.ts. Still procedural; posters keep DoubleSide + slideshow.

Drag feel and lighting pass.

Drag was mutating the object's position inside the pointermove handler, which is two problems in one: pointermove fires at the pointer's rate rather than the display's, so a frame absorbed several unevenly sized steps and only the last one showed; and the object was welded to the cursor, so there was no weight to it. Now pointermove only writes a target, and `update` springs the object toward it once per frame (DRAG_STIFFNESS 44, damping ratio 0.78 — under 1, so it trails and overshoots slightly). The object is grabbed where it was clicked rather than by its centre, and gets a velocity-fed angular lean so a slung object swirls.

The spring's own velocity is now what gets thrown on release, which deleted the old throw estimator entirely (per-event pointer deltas over per-event timestamps, smoothed by a frame-rate-dependent EMA). Released below THROW_MIN_SPEED it is a set-down, not a throw: the object gets back the drift it arrived with instead of hanging dead. No recycling while held — wrapping to the far edge mid-drag read as the object being yanked out of your hand.

Host: hover picking raycasts the whole field, so it is coalesced to one call per frame instead of one per pointermove. Manual redraws outside the rAF loop now pass a real delta (drawOnce) — the drag spring never advances on drawFrame(0); reduced motion keeps dt at 0 and the scene tracks the pointer directly instead. setPointerCapture wrapped: it throws NotFoundError when a fast click beats it.

Lighting: the sky is both the backdrop and, through PMREM, the light, so a saturated key plus hemisphere on top of it at full strength put every surface — lit and shadowed — on the same hue. Split those roles: environmentIntensity 0.92 rather than an implicit 1, key desaturated to 0xffeeda, a cool 0xa8c4ff counter-fill owning the shadow side, and a neutral ambient floor so faces turned away from all three lights are dark rather than black. Amber in the sky texture pulled back to the lower-right corner where it was supposed to be.

Then lightened on request while holding the dark-mode read: sky base floor moved off black to the app's charcoal (biggest single lever, and it adds no orange since it moves the neutral end of the ramp), vignette 0.62 -> 0.34, exposure 1.12. The structures were black for a material reason, not a lighting one — steel at 0.85 metalness has almost no diffuse term, so against a dark environment no amount of light reaches it; dropped to 0.55, and the charcoal material off the brand floor to 0x2b2b2f so it separates from the background it sits against.

Verified in the browser at 1440x741: hover picking reports 20 grabbable points across a grid scan; grab takes (cursor 'grabbing', preventDefault fired); a 3-revolution arc drag with a marker at the pointer shows the object trailing it. No console errors. tsc --noEmit and lint clean.

Integration pass: the objects were reading as pasted onto the backdrop rather than sitting in it, and the previous lift had gone too far.

Two causes. There was no aerial perspective — objects live between ~9 and ~24 units from the camera and every one of them rendered at full contrast, so depth carried no atmospheric cue at all. Added THREE.Fog keyed to the sky's mid tone (0x2a1d14, near 11 / far 38, set against the field's actual depth range) so the deep structures wash toward the backdrop. The sky plane sits 66 units out, well past FOG_FAR, so it needs fog: false or it fogs to a flat brown card and takes the whole background with it.

The second cause was the neutral AmbientLight added in the previous pass: a flat lift matching nothing in the environment reads as studio light, which is precisely what makes an object look composited. Removed; the hemisphere light already does that job in the sky's own colours and absorbs the role.

Levels pulled back: exposure 1.12 -> 1.0, environmentIntensity 0.92 -> 0.72, key 3.0 -> 2.35, fill 0.8 -> 0.5, sky base floor 31 -> 23, vignette 0.34 -> 0.44. Steel back up to 0.68 metalness — at 0.55 it had enough diffuse to read as light grey paint, which is its own kind of not-belonging, and the fog now carries the deep ones so higher metalness no longer crushes them to black.

Verified at 1440x741, no console errors, tsc and lint clean.

Object lighting dropped again so the structures sit into the backdrop instead of standing off it: key 2.35 -> 1.45, fill 0.5 -> 0.28, hemisphere 0.52 -> 0.34, environmentIntensity 0.72 -> 0.5, fog pulled forward to near 8 / far 34.

Exposure deliberately left at 1.0 rather than lowered. Tone mapping is applied after the sky is drawn as well, so dropping it darkens backdrop and objects by the same factor and the objects stand out exactly as much as before — the separation is between the two, so only the object-side lights can close it.

Companion type pass (BillboardHero.tsx).

Both lines were failing for the same reason: white/55 and white/70 at 10-11px over a field that is not a constant background. When a white poster panel drifted behind the tagline it erased it completely. Raised both to white/85, 12-14px, and gave them text-shadows sized to separate them from whatever is behind rather than to decorate.

Placement: the tagline sat mt-8/mt-10 below the lockup, which put it a third of the way down the field, outside the lockup's protected centre and reading as a caption for whichever structure happened to be drifting behind it. Pulled to mt-5/mt-6 so it belongs to the lockup group.

Added a second scrim element: a feathered elliptical pool behind the type only. The existing vignette is transparent out to 45% by design — it holds the corners off the lockup and deliberately leaves the centre clear — so it was doing nothing where the text actually sits. Kept as a separate layer rather than folded into the vignette so the two intents stay separable, and sized to the lockup so the surrounding field keeps its contrast.

Checked at 1440x900 and 390x844; the tagline stays on one line at both. tsc and lint clean, no console errors.

Contrast + illuminated panels + occlusion.

Panels are now emissive, which is what a citylight or lightbox actually is — a backlit face, a light source rather than a print catching the key. emissiveMap carries the same poster texture as map, and emissivemap_fragment gets the same crossfade patch as map_fragment sharing one uMix, or a poster change tears: half the face lit on the old image, half on the new. Both texture slots must stay non-null for the material's life; going null drops USE_EMISSIVEMAP and forces a recompile mid-slideshow.

An emissive material in three glows but lights nothing — it is not a light source — so a backlit panel would sit in its housing with no spill, which is what reads as 'bright texture' rather than 'emitting light'. Added a bloom chain for that: EffectComposer with RenderPass -> UnrealBloomPass -> OutputPass. Order matters and is not arbitrary: three applies tone mapping only when rendering to the screen (WebGLPrograms.getParameters gates it on currentRenderTarget === null), so RenderPass hands over untone-mapped linear HDR, bloom thresholds against real values, and OutputPass maps once at the end. Threshold sits at 0.96, above anything the key light alone produces, so only backlit faces bloom — at 0.78 a bright panel at the frame edge threw a large halo into the corner.

This needed a contract change: HeroScene gained an optional render(renderer) so a scene that owns a post-processing chain can draw itself. Without it the host calls renderer.render() directly and bloom never runs.

Occlusion is a real shadow map rather than SSAO: one extra depth pass over ~16 low-poly structures is cheaper than an SSAO pass over every pixel of a full-viewport hero. Key light moved from (6,5,4) to (18,15,12) — same direction, 3x the distance — so the shadow camera encloses a field running to z -18, with the ortho frustum fitted to +/-13 x +/-9 rather than the +/-5 default. normalBias 0.035 over depth bias: these are thin boxes and flat planes, where a bias large enough to kill acne also detaches the shadow. PCFShadowMap, not PCFSoftShadowMap — the latter is deprecated in r18x and falls back to it with a console warning.

Contrast restored: exposure 1.15, key 2.5, env 0.62, fog pushed back to near 14 / far 44 (wash is the opposite of contrast; it still carries the deepest structures, which is all it was for), sky floor down to 19 for deeper blacks behind the glow.

Measured after: 175 frames at DPR 2, median 17.2ms / p95 19.2ms / worst 21.6ms — vsync-bound with headroom on this machine. Still a dev build, and AC#5 asks for a mid-tier laptop GPU, so this needs re-measuring on production before the AC is checked.

Six-part revision pass.

Glow without losing artwork: panel emissive down to 0.42 and the work moved into bloom — strength 0.34, radius 0.72, threshold 0.86. Detail loss is a function of bloom strength far more than threshold, because strength is what spreads the halo back over the panel that produced it. Low strength with a wide radius gives a halo that reads around the face while leaving the image under it intact.

Companion sentence removed from the lockup, and billboardHero.line dropped from content/site.ts since nothing else read it. The type scrim was sized around that sentence, so it tightened from 52vh/58% to 40vh/52% and now darkens less of the field.

Contrast and orange restored — this deliberately reverses the earlier desaturation. The fix for the 'everything is one orange mass' problem turned out to be the cool counter-fill and the separation it creates, not the desaturation, so the warmth came back and the fill stayed (dropped to 0.24, where it separates metal without cancelling the orange it sits against). Exposure 1.22, key 0xffd2a0 at 2.9, hemisphere 0xf09340 at 0.5, environment 0.85, sky ramp reaching a hotter amber with a deeper floor, cirrus tinted warm by falling green and blue off faster. Added a dedicated orange bounce from the lit side at 0.85 — it rakes brand colour across the structures where the key does not reach, without lifting the overall level the way raising key or environment would. Accent plates carry emissiveIntensity 0.28 so they hold their colour on the shadow side, where a purely lit orange goes brown and stops reading as the brand.

Posters on both sides: this was never a DoubleSide problem. Every family except the portrait poster and the open truss puts an opaque tray, glass or body box behind its face, and you cannot see through a charcoal box to reach the DoubleSide plane behind it — that is what made structures read blank once they tumbled past side-on. attachPoster gained an optional backZ and each family passes a value clearing its own box; the rear face is rotated 180 deg so the artwork reads the right way round from behind rather than mirrored, and both faces share one material so they cross-fade in step. The truss gantry's blank orange-plate variant is gone, so no face in the field is dead. Its ctx.rand() call is retained deliberately: the RNG is a fixed sequence and the whole composition is tuned against it, so dropping a draw would reshuffle every later structure's placement, size and poster index.

Note this narrows TASK-3.4 AC#2. The mirrored back faces survive only on the two families with no backing box; everywhere else the rear is now a correctly-oriented face. Worth confirming that is acceptable before AC#2 is checked.

Verified at 1440x741: 200-frame timing median 8.3ms / p95 9.4ms on a 120Hz display, vsync-bound with headroom. Reduced motion (matchMedia stubbed pre-page-scripts) composes complete in one frame with shadow, glow and posters. Drag still picks and grabs after the extra rear meshes entered the raycast set. No console errors; tsc and lint clean.

Flicker fix and field thinning.

The flickering panels were z-fighting, and the root cause was camera near/far, not the geometry. At 0.1/160 the far/near ratio is 1600:1, which leaves very little depth resolution 20 units out — not enough to separate a poster face from a backing box a few centimetres behind it, so the two surfaces alternated per frame. Nothing in the scene sits closer than ~9 units (objects at z -18..-3.5, camera at +6) or further than the sky at 66, so the camera is now 2/90 — 45:1, with room at both ends. The rear faces added in the previous pass also had only 0.02 units of clearance behind their boxes; that is now 0.08, so the fix does not depend on depth precision alone.

Field cut from 16 structures to 11 on request. Stratified placement is parameterised on the count, so column allocation adapts without further change.

Bloom threshold raised 0.86 -> 1.02. At 0.86 a bright panel drifting to the frame edge blew out and took its own artwork with it, which is the opposite of a subtle glow that keeps its detail.

Measured after: 220 frames, median 9.4ms / p95 10.8ms / worst 11.8ms.

Flicker, round two — the real cause.

The previous pass fixed camera near/far and the rear-face clearances, but only checked the rear. The front was worse: the lightbox poster sat at exactly z 0.06, which is precisely its tray's front surface. Two coplanar surfaces z-fight at any depth precision — no near/far ratio fixes a genuine tie — which is why the artefact survived. The totem was 0.01 clear and the unipole and mega wall 0.02, all inside what the buffer can resolve at 20 units.

Every face now clears both surfaces of its own box by POSTER_CLEARANCE (0.06), and attachPoster carries the invariant in its doc comment so a new family does not reintroduce it by placing a face by eye.

Committed as 2de7969. A follow-up experiment (08e2fa9) is deliberately kept as a separate commit so it can be reverted whole: point lights on the mega walls and unipoles so the large formats genuinely illuminate their surroundings, and a cast shadow of the lockup on the sky. The lockup cannot cast a shadow-map shadow — it is DOM, not geometry — so the scene rasterises a proxy from the live element (text, computed font, weight, tracking) and projects its screen rect to the shadow's depth. Measuring the element is load-bearing: the type is clamp()-sized, so a resize changes the caster itself and the mask is rebuilt rather than repositioned.

Frame timing across both: median 9.0ms, p95 10.0ms, against 9.4/10.8 before, so the lights and the shadow cost nothing measurable.

Separately: at viewports around 900px the lockup overflows its container — 12vw puts it at ~108px, wider than the line can hold — so PROPAGENDA. runs off the right edge and the role line is clipped. Pre-existing, untouched by this work, and worth a task of its own.

Text shadow made dynamic, driven by the near layer.

The two canvases are separate WebGL contexts and cannot share a light — a light is GPU state belonging to one renderer. But the base scene does not need the near layer's light, only its position, because what it does with it is arithmetic rather than rendering: a caster at one depth, a receiver at another, and the ratio of their distances to the light gives both the offset direction and the magnification. heroEmitter.ts carries that position across. It is only valid because both scenes use the same camera — 38 deg at the same aspect, at z +6 — and that assumption is written down at the module.

Heavily damped, and it has to be. A face at z −4 casting onto the sky at −34 magnifies the shadow 7.5x, which is physically correct and visually unusable; throw and growth are damped separately so the shadow tracks the light's direction honestly while staying roughly the size of the word that cast it. The follow is eased rather than instant, since a shadow that snaps frame to frame reads as a glitch, not as light.

Verified numerically rather than by eye, because the text shadow overlaps the monogram cloud shadow and the two cannot be told apart visually. A temporary non-visual hook published the computed values while a near object was dragged between extremes:
  light x −5.91  ->  throw x +1.633  (shadow pushed right)
  light x +3.62  ->  throw x −0.970  (shadow pushed left)
Sign flips and magnitude scales with distance from the lockup. growth held at 1.0707 across both, correctly — dragging moves the light in a constant-z plane, so the magnification should not change. Hook removed before commit and its absence confirmed at runtime.

An earlier attempt at this verification recoloured the shadow and hid the monogram to isolate it visually. That is a mistake worth not repeating: the dev server hot-reloaded it into the user's own browser mid-session. Diagnostics on a live shared dev server should publish data, not change what is drawn.

Field cut again on request, 11 structures to 7, one per family. That leaves one mega wall and one unipole, so two panel lights rather than four.

Frame timing after: median 8.6ms / p95 9.9ms.
<!-- SECTION:NOTES:END -->
