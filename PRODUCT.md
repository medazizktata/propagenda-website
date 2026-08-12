# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · GSAP 3 + ScrollTrigger ·
Framer Motion (mobile menu) · three.js (hero mark) · TypeScript · pnpm · dev on :4000.
E2E guardrails: Playwright (`pnpm test:e2e`, `e2e/smoke.spec.ts`).

## Users

Dubai/GCC business owners and marketing managers (SME → mid-market; real estate, F&B,
automotive, retail, events per the live case studies). Often evaluating on mobile, often
Arabic-first, arriving via Instagram, WhatsApp, or referral. They are qualifying an agency —
"is this studio real, does it produce high-end work, is it easy to start?" — not browsing design.

## Product Purpose

The agency's proof-and-conversion surface: show real client work (video-first), establish
credibility in about 60 seconds, and convert visitors into project briefs.

## Positioning

**Generalist 360° agency with niche spotlights** (confirmed 2026-08-12): base positioning stays
"your 360° marketing solutions partner"; vertical depth (real estate, F&B, automotive, events)
is expressed through tagged work and case studies, not through a narrowed headline claim.
Brand line: "Where creativity meets strategy." Tagline: "Looking for the better future."

## Operating Context

- Dubai, UAE (Al Quoz Industrial Area 2); GCC market norms apply (WhatsApp is a real business
  channel; trust signals matter; mobile-first).
- **Conversion hierarchy (confirmed 2026-08-12): the brief form leads.** The qualified-lead form
  (name/company/email/source/budget/timeframe/brief) is the primary CTA everywhere; WhatsApp,
  phone, and the scheduled intro call (`NEXT_PUBLIC_BOOKING_URL`, currently Calendly) are
  secondary channels, always present, never the headline ask. Scheduling renders as the site's
  own styled links — never a third-party widget/badge.
- **Arabic is the next milestone (confirmed 2026-08-12)**, not a launch requirement: ship EN now,
  keep tokens/layout RTL-ready, treat full AR content as its own project. Candidate faces are
  documented in `docs/rework/05-design-diagnosis.md` (Cairo display · Almarai/Tajawal functional).
- Soft-launch flag system gates unfinished routes (`lib/featureFlags.ts`); `feat/video-work`
  branch holds the unmerged video hub.

## Capabilities and Constraints

- Real assets are the differentiator: actual client reels, extracted client logos
  (`public/images/clients/`), portfolio posters (WebP), the physical signage photo. Never
  placeholder/fake brand logos.
- Contact form posts to `CONTACT_FORM_ENDPOINT` (empty in dev → validation-only round trip).
- Legacy WordPress redirect map must keep working (`lib/constants/redirects.ts`).
- Reduced-motion support is a hard requirement across all animation (established discipline).
- Performance floor: no multi-MB images (WebP q80 pipeline), loader once per session,
  page-transition budget ≤ ~700ms.

## Brand Commitments

- Poppins is brand law (brand PDF) — never swap the family; expression comes from weight/scale
  and the mono backstage register (currently IBM Plex Mono), not new faces.
- Black + orange (#f58b27) identity. Orange is punctuation (<5% of a screen: one CTA, terminal
  periods, active states) or a deliberate flood — never wallpaper. Text on orange is near-black
  `ink` (#141414, 7.55:1); white-on-orange is banned (2.44:1).
- One protagonist per screen; the terminal orange period is the brand's verdict device.
- Full design laws: `docs/rework/06-design-direction.md` (do-not-drift list) and `docs/BRAND.md`.
