# Propagenda

Marketing website for Propagenda — branding, digital, events, print & install.

## Structure

```
Propagenda/
├── app/           # Next.js App Router
├── components/    # UI, layout, sections
├── content/       # Static content modules
├── lib/           # Utils, SEO, forms, motion
├── hooks/         # React hooks
├── public/        # Static assets
├── styles/        # Global CSS additions
└── types/         # TypeScript types
```

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

Package manager: **pnpm** (`packageManager` in `package.json`).

**pnpm 11:** build scripts require approval in `pnpm-workspace.yaml`:

```bash
pnpm approve-builds --all
pnpm install
```

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for production.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public inbox (footer, mailto, legal) + prod form To fallback. |
| `CONTACT_TO_EMAIL` | Form recipient override (dev only). Prod: leave unset → uses `NEXT_PUBLIC_CONTACT_EMAIL`. |
| `CONTACT_FROM_EMAIL` | Resend From. Default `Propagenda <noreply@thepropagenda.com>` (domain verified). |
| `RESEND_API_KEY` | Server secret — sends contact briefs via Resend. Required in production. |
| `NEXT_PUBLIC_FF_SOFT_LAUNCH` | Lock unfinished routes behind coming-soon. Default on. |
| `NEXT_PUBLIC_FF_PAGE_ABOUT` | Unlock `/about` while soft launch is on. |
| `NEXT_PUBLIC_FF_PAGE_SERVICES` | Unlock `/services` + slugs. |
| `NEXT_PUBLIC_FF_PAGE_WORK` | Unlock `/work` + `/work/*`. |
| `NEXT_PUBLIC_FF_PAGE_CONTACT` | Unlock `/contact`. |
| `NEXT_PUBLIC_FF_PAGE_LEGAL` | Unlock privacy / terms / imprint. |
| `NEXT_PUBLIC_FF_INIT_LOADER` | Orange quote splash on full page load. Default on. |
| `NEXT_PUBLIC_FF_COMPLEX_CURTAIN` | `false` = simple Cuberto wipe (default). `true` = ornate orange curtain. |

### Contact email (Resend) — prod

Domain `thepropagenda.com` is verified in Resend. Production Worker needs:

| Var | Prod |
|-----|------|
| `RESEND_API_KEY` | Worker **secret** (`wrangler secret put RESEND_API_KEY`) |
| `CONTACT_FROM_EMAIL` | `Propagenda <noreply@thepropagenda.com>` (also in `wrangler.jsonc` vars) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `contact@thepropagenda.com` |
| `CONTACT_TO_EMAIL` | `contact@thepropagenda.com` |

Local: keep a throwaway in `CONTACT_TO_EMAIL` if you want, or point at the live inbox. Restart `pnpm dev` after env changes. Deploy after secrets/vars change.

## Deploy

```bash
pnpm deploy
```

Cloudflare Worker name: `propagenda-website` (`wrangler.jsonc`).
