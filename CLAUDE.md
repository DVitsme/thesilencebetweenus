# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Donation/marketing site for filmmaker **Kevin Cameron** — a support landing page for his film
**"The Silence Between Us"** (replaces a JotForm; Stripe Checkout + Resend). `app/` is still the
unmodified `create-next-app` starter — the real site isn't built yet, but tooling/deploy are wired up
(see Deployment). Planning lives in **`docs/`** (IA: `docs/ia-and-architecture.md`; voice:
`docs/persona-kevin-cameron.md`; copy: `docs/copy/`; portfolio data: `content/portfolio.ts`).
`transcripts/` and `portfolio/` hold research/source material, not application code.

## Commands

**Package manager: pnpm** (migrated off npm; `pnpm-lock.yaml` is the lockfile).

| Task | Command | Notes |
| ---- | ------- | ----- |
| Dev server | `pnpm dev` | Turbopack (default in 16), http://localhost:3000, outputs to `.next/dev` |
| Prod build | `pnpm build` | `next build` (Turbopack). A stray `webpack` config in `next.config.ts` fails the build |
| Lint | `pnpm lint` | Runs `eslint` directly — `next lint` was removed in 16, and `build` no longer lints |
| CF preview | `pnpm preview` | Builds + serves on the real Cloudflare **workerd** runtime via OpenNext |
| Deploy | `pnpm deploy` | Builds + deploys to Cloudflare Workers (needs `CLOUDFLARE_*` creds or `wrangler login`) |
| CF env types | `pnpm cf-typegen` | Regenerate `cloudflare-env.d.ts` after editing `wrangler.jsonc` bindings |

`pnpm start` (`next start`) runs a Node server, but this app **deploys to Cloudflare** — use
`pnpm preview` to exercise the deploy runtime. No test runner is configured.

## Deployment — Cloudflare Workers via OpenNext

- Adapter: **`@opennextjs/cloudflare`** (+ `wrangler`). Config: `wrangler.jsonc` (worker name
  **`silence-between-us`**, `nodejs_compat`, bindings `ASSETS` / `IMAGES` / `WORKER_SELF_REFERENCE`) and
  `open-next.config.ts`. `next.config.ts` calls `initOpenNextCloudflareForDev()` so `pnpm dev` sees CF bindings.
- **Workers runtime ≠ full Node.** Write runtime code accordingly — e.g. the Stripe webhook must use
  `stripe.webhooks.constructEventAsync` (Web Crypto), not the sync Node variant.
- **Secrets:** local preview reads `.dev.vars` (gitignored); `pnpm dev` reads `.env.local`; deployed
  secrets go in Cloudflare (dashboard / `wrangler secret put`). Env var names: `.env.example`.
- Build artifacts `.open-next/` and `.wrangler/` are gitignored. Run `pnpm cf-typegen` after changing
  `wrangler.jsonc` bindings.

## Stack & conventions

- **Next.js 16 App Router** + **React 19.2**. App lives in `app/` (no `src/`). Path alias `@/*` → repo root.
- **TypeScript** strict. Async request APIs are mandatory (see below) — type `params`/`searchParams` as Promises.
- **Tailwind CSS v4**, CSS-first: there is no `tailwind.config.js`. Theme tokens, the `@theme inline`
  block, oklch color variables, the `.dark` palette, and the custom `dark` variant all live in
  `app/globals.css`. PostCSS uses `@tailwindcss/postcss`.
- **shadcn/ui**, style `base-nova` (see `components.json`). Components are built on **Base UI**
  (`@base-ui/react`), **not Radix** — do not assume Radix APIs. Generated components wrap a primitive
  with CVA variants and `data-slot` attributes (see `components/ui/button.tsx`). Add new components
  with the shadcn CLI (`npx shadcn@latest add <name>`) rather than hand-writing them, so they match
  the configured style/registry. Icons: `lucide-react`.
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge); use it for conditional class merging.

## Next.js 16 — this is NOT the Next.js in your training data

`AGENTS.md` requires reading the relevant guide under `node_modules/next/dist/docs/` before writing
code. Start with the breaking-change list in
`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`. The traps most likely to bite:

- **Request APIs are async-only.** `cookies()`, `headers()`, `draftMode()`, and `params` /
  `searchParams` (in `page`/`layout`/`route`/`default` and metadata files) must be `await`ed —
  synchronous access was removed. The `params`/`searchParams` props are Promises. Run `npx next typegen`
  to get the `PageProps<'/route'>`, `LayoutProps`, and `RouteContext` global helpers.
- **`middleware` → `proxy`.** Use a single `proxy.ts` at the root exporting a `proxy` function. The
  edge runtime is NOT supported (nodejs only); keep `middleware.ts` if you need edge. Config flags
  renamed (e.g. `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`).
- **Turbopack is the default** for `dev` and `build` (no `--turbopack` flag needed). Turbopack config
  is the top-level `turbopack` key in `next.config.ts`, not `experimental.turbopack`.
- **Caching:** `revalidateTag(tag, profile)` now requires a `cacheLife` profile as a 2nd arg. New
  `updateTag` (read-your-writes) and `refresh` Server-Action APIs. `cacheLife`/`cacheTag` are stable
  (drop the `unstable_` prefix). PPR's `experimental.ppr` / `experimental_ppr` and
  `experimental.dynamicIO` / `experimental.useCache` are gone — opt into `cacheComponents: true`
  instead (see `02-guides/migrating-to-cache-components.md`).
- **Instant navigation:** with Cache Components enabled, `<Suspense>` alone does not guarantee fast
  client navigations. Export `unstable_instant` from routes that must navigate instantly — it validates
  caching structure at dev/build time. Read `02-guides/instant-navigation.md` before touching this.
- **`next/image`:** `images.domains` is deprecated (use `remotePatterns`); defaults tightened —
  `qualities` is `[75]`, `minimumCacheTTL` is 4h, local-IP optimization is blocked, redirects capped at 3.
- **Removed:** AMP, `serverRuntimeConfig`/`publicRuntimeConfig` (use env vars; call `connection()`
  before reading `process.env` at runtime), `next/legacy/image`, `unstable_rootParams`. Parallel-route
  slots now require an explicit `default.js`. Requires Node 20.9+ and TypeScript 5.1+.
