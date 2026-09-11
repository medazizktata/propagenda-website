---
id: TASK-3.1
title: Wire the vgpu WGSL toolchain into the Next.js build
status: To Do
assignee: []
created_date: '2026-09-08 11:12'
updated_date: '2026-09-08 11:13'
labels: []
dependencies: []
references:
  - 'https://vgpu.sh/docs/guides/nextjs'
parent_task_id: TASK-3
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Install vgpu and make .wgsl files importable as typed modules, so shader work can begin. Purely build/toolchain — no visual change to the site.

The build path is unusual here and is the main risk: `pnpm dev` runs Turbopack, while `pnpm build` runs `opennextjs-cloudflare build` (which wraps `next build`) and deploys to Cloudflare Workers. Both bundler paths need the loader registered, and the production Worker bundle must still build and stay inside the Workers asset limits.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A .wgsl file can be imported from a client component and passed to effect() without a TypeScript error
- [ ] #2 Shader imports resolve under `pnpm dev` (Turbopack)
- [ ] #3 Shader imports resolve in the Cloudflare production build via `pnpm build`
- [ ] #4 pnpm check passes (lint, typecheck, import casing, worker assets, perf)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Held before any implementation. Installing vgpu presumes the reference hero is a shader field; that is unverified until the reel dissection lands. If the dissection shows a video- or DOM-driven hero, this task may be unnecessary and TASK-3's architecture choice should be revisited before this is picked up.
<!-- SECTION:NOTES:END -->
