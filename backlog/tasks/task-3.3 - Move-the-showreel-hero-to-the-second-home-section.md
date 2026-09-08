---
id: TASK-3.3
title: Move the showreel hero to the second home section
status: To Do
assignee: []
created_date: '2026-09-08 11:12'
updated_date: '2026-09-08 11:35'
labels: []
dependencies: []
parent_task_id: TASK-3
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The current pinned, scroll-scrubbed showreel hero (components/sections/Hero.tsx) stops being the page opener and becomes the second section, below the new WebGPU hero. The reel and its scroll choreography are kept — only its position and the assumptions that came from being first change.

Two things in the current implementation assume it is the first section on the page and will misbehave once it is not:
- It installs a Lenis scroll clamp (heroGateOpenRef / clampHeroScroll) that forcibly holds scroll at the pin end until the scrub completes. As a second section that reads as the page fighting the user.
- It sets its own section height as 100vh + pin percent and pins from `top top`, which needs rechecking once content precedes it.

It already has a `flat` prop that disables pin and scrub entirely, which is a useful escape hatch but is not by itself the answer, since the scrubbed reel is the point of the section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The showreel section renders below the new hero and scrubs on scroll as before
- [ ] #2 Scrolling from the new hero into the showreel section is not blocked or snapped back
- [ ] #3 The section pins and unpins correctly with content above it
- [ ] #4 Reduced-motion and video-failure paths still degrade to a non-pinned section
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Simplified by a dissection finding: the reference hero does not scroll at all - it is an autoplaying idle loop that consumes no scroll distance. So the new hero will not pin, and this section can keep its own pin and scrub essentially as-is, with content simply above it. The Lenis scroll clamp is still the thing to remove or rescope.
<!-- SECTION:NOTES:END -->
