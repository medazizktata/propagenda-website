---
id: TASK-2
title: Fix hero scroll-to-play showreel scrub
status: Done
assignee:
  - '@claude'
created_date: '2026-09-02 13:26'
updated_date: '2026-09-02 13:45'
labels: []
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The homepage hero pins and scrubs propagenda-marketing.mp4 on scroll, but the intended effect does not land: at rest and through most of the pin the hero reads as a classic click-to-play video placeholder (static poster JPEG + centred play button) while the reel scrubs invisibly behind it.

Runtime measurements on localhost:4000 @1440x900:
- GSAP timeline tweens use duration: CLIP_EXPAND_RATIO (0.28) as if it were a fraction of scroll, but a scrubbed timeline maps progress 0-1 across the WHOLE timeline duration. Longest tween is 0.28s, so every 'early phase' tween is stretched across 100% of the pin. Measured poster opacity: 0.90 @y=0, 0.59 @y=1000, 0.29 @y=2000, 0.01 @y=4000 - the poster only clears once the reel is already at 25.4s of 27.44s. The headline dissolve likewise spans 36% of the pin instead of 10%.
- Pin length and section height disagree: section height is 100+480=580vh (5220px) but ScrollTrigger end '+=480%' resolves against the viewport (4320px). Reel finishes at y=4320 and the hero holds a frozen last frame for ~900px of dead scroll before Manifesto at y=5220.
- syncVideoScrub assigns video.currentTime on every ScrollTrigger update (up to 60Hz) with no seek-in-flight coalescing. Measured seek cost on the 4K source is 34ms median / 53ms p90, so seeks thrash and drop.
- Source is already 3840x2160 @25fps, 10Mbps, 35MB, GOP=1s (25 frames). Long GOP plus 4K makes per-seek decode expensive; scrubbing needs a short-GOP proxy.

Goal: scroll drives the reel frame-by-frame from the very first scroll, the hero never reads as a click-to-play placeholder, and the pin ends exactly when the reel ends.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Timeline phase timings are expressed as real fractions of pin progress: clip expand and poster/vignette clear within the first ~28% of the pin, foreground dissolve within the first ~10%
- [x] #2 Hero at rest shows a live video frame, not a static poster overlay; no centred click-to-play button reads as the primary affordance
- [x] #3 Video time advances visibly within the first 10% of scroll (measurable: currentTime increases while poster/overlay opacity is already 0)
- [x] #4 currentTime seeks are coalesced (no new seek issued while one is in flight) so scrubbing stays smooth under fast scroll
- [x] #5 A short-GOP scrub proxy drives the pinned scrub while the 3840x2160 master still serves the fullscreen lightbox
- [x] #6 flat mode, prefers-reduced-motion, VideoLightbox, HeroLogo3D placement and hero360Sync all still behave as before
- [x] #7 Reel scrubs across the full pin and its last frame lands at the pin end; pin geometry (section height == pin-spacer height) stays consistent
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Encode a short-GOP scrub proxy from the 4K master: 1280x720, -g 5 (keyframe every 0.2s), no audio, faststart -> public/videos/propagenda-marketing-scrub.mp4. Keep the 3840x2160 master for the lightbox only.
2. Rewrite the scrub timeline so phase timings are true fractions of pin progress: give the timeline a total duration of 1 and set each tween's duration to its intended fraction (clip/poster 0.28, dissolve 0.10), so a scrubbed progress 0-1 maps onto real fractions.
3. Drop the .hero-poster overlay from the scrubbed path - the video element itself, seeked to HERO_VIDEO_SCRUB_START on metadata, is the resting frame. Keep the poster attribute as the pre-decode fallback only.
4. Replace the centred click-to-play button as the resting affordance so the hero does not read as a click-to-play placeholder; keep a discreet fullscreen entry to VideoLightbox.
5. Coalesce seeks: ScrollTrigger.onUpdate writes a desired-time ref only; a rAF loop issues video.currentTime only when no seek is in flight (guard on video.seeking) and the delta exceeds a frame.
6. Reconcile pin length with section height so ScrollTrigger end and the section box agree and no dead scroll remains before Manifesto (end in px derived from the same number that sizes the section, or size the section from the pin spacer).
7. Verify in-browser at 1440x900: sample currentTime + overlay opacity across the pin, confirm reel advances inside the first 10% of scroll, confirm reel ends exactly at pin end, confirm flat/reduced-motion/lightbox unaffected. Run pnpm lint and pnpm typecheck.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified pin geometry in-browser before changing it: section 5220px == pin-spacer 5220px (900px element + 4320px padding-bottom). Element is position:fixed from y=0 to y=4320, then relative, reaching top=-900 at y=5220. That trailing 900px is the hero scrolling away, NOT dead scroll - the original AC#4 was based on a wrong inference and has been rewritten. No pin-length change needed.

Root cause was NOT the video encode alone - it was GSAP timeline duration semantics. Tween durations (CLIP_EXPAND_RATIO 0.28, DISSOLVE_DURATION 0.1) were written as if they were fractions of scroll, but a scrubbed timeline maps progress 0-1 across its whole duration. The longest tween (0.28) therefore defined the duration and every 'early phase' stretched across 100% of the pin. Fixed by adding tl.to({}, { duration: 1 }, 0) so the timeline length is pinned at 1 and each duration reads literally as a fraction of the pin.

Measured before/after at 1440x900 (pin = 4320px):
- poster/clip clear: was still 0.59 opacity at 10% and 0.29 at 46% of pin -> now dissolve 0 at 10%, clip inset 0 at 28%.
- The .hero-poster <img> overlay sat above the video and was the literal 'placeholder' - the reel was scrubbing invisibly behind a JPEG for ~93% of its length. Removed; the <video poster> attribute still covers the pre-decode frame.
- Centred play triangle removed. Fullscreen moved to a quiet bottom-left chip outside the clipped panel (the clip-path was cropping it there) and fades in via autoAlpha at 75% of the clip expand, so it is never an invisible click target.
- Left scrim now fades with the headline it exists for, instead of dimming the full-bleed reel for the whole scrub.

Seek performance (measured in Chrome, 40 serialized seeks):
- 3840x2160 master, GOP 25, B-frames on: 34.1ms median / 50.4 p90 - over the 16.7ms frame budget.
- 1920x1080 proxy, keyint=5, bframes=0, ref=1: 4.4ms median / 5.0 p90. 6.01 MB vs 33.53 MB.
Encoder: ffmpeg -vf scale=1920:-2 -an -crf 23 -preset slow -x264-params keyint=5:min-keyint=5:scenecut=0:ref=1:bframes=0 -movflags +faststart

Also fixed a pre-existing tsc error in SmoothScroll.tsx scrollerProxy (scrollTop(value) typed number|undefined) that was blocking pnpm typecheck on the file the scrub depends on.

Verification (browser-driven, 1440x900, pin = 4320px):
- Scrub choreography: videoT 0.5 -> 1.85 (5%) -> 3.19 (10%) -> 8.05 (28%) -> 13.97 (50%) -> 27.44 (100%). Foreground dissolve 1 -> 0.5 (5%) -> 0 (10%). Scrim 1 -> 0.14 (10%) -> 0 (21%). Fullscreen chip visibility hidden until 28%, visible after.
- Fast-scroll smoothness: scrubbed the entire 27.4s reel in 2.5s wall-clock (~11x real time); video updated on 86% of animation frames, 273 distinct source frames, strictly monotonic, landed on 27.42.
- Lightbox: opens 3840x2160 master while the inline 1920x1080 proxy pauses; on close the inline frame restores to exactly the scroll position (11.28s at 40%, expected 11.28).
- prefers-reduced-motion (Playwright emulateMedia): no Lenis, no pin-spacer, section = 900px = 1 viewport, video autoplays and loops, fullscreen control visible.
- flat mode: verified live on /preview?preview=1 against a throwaway dev server with NEXT_PUBLIC_FF_SOFT_LAUNCH=false (the route is soft-launch locked on the normal server). Section 900px natural height, no pin, no Lenis, autoplay loop, headline visible, page scrolls normally.
- HeroLogo3D (.hero-3d) and the headline still render on desktop; hero360Sync untouched.
- Bonus: homepage now fetches only the 6.01 MB proxy (verified via network log); the 33.53 MB master is not requested until the lightbox opens.
- Also fixed reduced-motion dead scroll: the section reserved 100+pinPercent vh (5220px) even with no pin running, leaving ~4320px of empty scroll under an autoplaying loop. Height is now viewport-natural whenever the scrub does not run.

Checks: pnpm typecheck passes; eslint clean on Hero.tsx and SmoothScroll.tsx (the repo's other 112 lint problems are pre-existing in the CMS admin WIP); pnpm perf:videos all OK.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Hero scroll-to-play now scrubs properly. The real defect was GSAP timeline duration semantics, not the encode: tween durations were written as if they were fractions of scroll, but a scrubbed timeline maps progress across its whole duration, so every 'early phase' stretched over the entire pin - the poster JPEG overlay stayed opaque while ~93% of the reel scrubbed invisibly behind it, which is exactly the click-to-play placeholder look reported. Fixed by pinning the timeline length to 1 so durations read as true fractions; removed the poster overlay and the centred play triangle; moved fullscreen to a quiet corner chip that fades in once the reel is full-bleed; faded the left scrim with the headline it exists for. Added a 1920x1080 short-GOP scrub proxy (keyint=5, bframes=0) that seeks in 4.4ms vs 34.1ms for the 4K master, and coalesced seeks behind a rAF pump so no seek is issued while one is in flight. The 3840x2160 master still serves the lightbox. Verified by browser-driven scroll sampling, an 11x-real-time fast-scrub stress test, network inspection, and separate reduced-motion and flat-mode passes.
<!-- SECTION:FINAL_SUMMARY:END -->
