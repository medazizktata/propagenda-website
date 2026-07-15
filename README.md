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
| `NEXT_PUBLIC_FF_SOFT_LAUNCH` | Lock unfinished routes behind coming-soon. Default on. |
| `NEXT_PUBLIC_FF_PAGE_ABOUT` | Unlock `/about` while soft launch is on. |
| `NEXT_PUBLIC_FF_PAGE_SERVICES` | Unlock `/services` + slugs. |
| `NEXT_PUBLIC_FF_PAGE_WORK` | Unlock `/work` + slugs. |
| `NEXT_PUBLIC_FF_PAGE_BLOG` | Unlock `/blog` + slugs. |
| `NEXT_PUBLIC_FF_PAGE_CONTACT` | Unlock `/contact`. |
| `NEXT_PUBLIC_FF_PAGE_LEGAL` | Unlock privacy / terms / imprint. |
| `NEXT_PUBLIC_FF_INIT_LOADER` | Orange quote splash on full page load. Default on. |
