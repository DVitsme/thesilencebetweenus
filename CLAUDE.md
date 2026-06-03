# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Donation/marketing site for filmmaker **Kevin Cameron** — a support landing page for his film
**"The Silence Between Us"** (it replaces the JotForm at https://form.jotform.com/261476294934165).
Primary goal: **capture supporter contributions** (Stripe Checkout) while marketing the film.
Reference docs in **`docs/`**: full build spec `docs/ia-and-architecture.md`; voice/copy guide
`docs/persona-kevin-cameron.md`; page copy drafts `docs/copy/`; portfolio page plan
`docs/portfolio-page-plan.md`; typed portfolio data `content/portfolio.ts`. `transcripts/` and
`portfolio/` hold research/source material, not application code. **Read "Build status" next.**

## Build status — read first after a context reset (updated 2026-06-03)

**Phase 0 (tooling) ✅ done & verified:** npm→pnpm; OpenNext + Wrangler (Cloudflare Workers); UI
foundation mirrored from `digitaldog-site-starter` (new-york shadcn + Shadcn Studio registries).
`pnpm build`, `opennextjs-cloudflare build`, and `pnpm preview` (workerd) all pass.

**Built so far:**
- `/` (`app/page.tsx`) — the real **warm-literary designed home page**, built from the design handoff
  in `The-Silence-Between-Us/handoff/` (Newsreader font, brand tokens in `app/globals.css`). Composed
  from `components/site/home/*` (hero → film still → story w/ drop cap → pull quote → teacher split →
  filmmaker → dark proof band → endorsements → tiers → gold final CTA). **Hero 30 was deleted.**
  Placeholders remain: imagery (`<Placeholder>`), endorsements (`TODO(endorsements)`), Partner/Patron
  prices (illustrative — only **$175** confirmed), `<SupportButton>` → hosted Checkout w/ `TODO(checkout)` fallback.
- `app/layout.tsx` — real chrome now: `<SiteHeader>` (sticky nav + Support CTA), `<SiteFooter>`
  (**988** line), Newsreader, metadata/OG (`components/site/*`). No longer the scaffold.
- `/about` (`app/about/page.tsx`) — the designed **About Kevin** page (warm-literary; reuses the home
  primitives + the dark "record" band). Kevin's spoken catchphrases were **adapted to the serious
  register** per `handoff/07`; documented facts kept; portrait/classroom are `<Placeholder>`.
- `/portfolio` (`app/portfolio/page.tsx` + `components/site/portfolio/work-grid.tsx`) — the designed
  portfolio, **wired to real data** (`content/portfolio.ts`) and **real images** (`public/portfolio/*`
  via `next/image` — first page using it; sharp works in dev, prod uses the CF IMAGES binding):
  featured-film spotlight, filterable work grid (client), tour timeline, grouped partner logo wall
  (mental-health leads), bio strip → /about, screening gallery, support bridge. Bio catchphrase adapted.
- `/faq` (`app/faq/page.tsx`) — provisional FAQ (Accordion); now inherits the warm theme + chrome. (Minor: it has its own `<main>` nested in the layout's — fix when reworked.)

**Not built yet:** `/supporters`, `/contact`, `/thank-you`,
`/support/canceled`, `/legal/{terms,privacy,contributions}`, `not-found.tsx`/`error.tsx`/`global-error.tsx`,
and api routes `/api/{checkout,webhooks/stripe,contact}`. Designed mockups for each live in
`The-Silence-Between-Us/` (route map: `handoff/06-ROUTE-AND-LINK-MAP.md`); page copy drafts in `docs/copy/`.
**Design system** (warm-literary): `The-Silence-Between-Us/handoff/01-DESIGN-SYSTEM.md`.

**Locked decisions:** Stripe **Checkout (hosted), one-time** (tiers + custom amount); fulfillment via
**webhook** `checkout.session.completed` (not the redirect; Workers → `constructEventAsync`). **Resend**
email; **Google reCAPTCHA** on contact. Framing = **rewards crowdfunding** ("support/back/contribute",
**never** "tax-deductible" or "invest"); **988** crisis line in footer. Copy = **teens-first** (NOT "a
movie about a teacher") in a **serious sales register — no spoken catchphrases** ("true to this", "what
are we waiting for", "yes sir" are for social/video, not the site). Voice source: `docs/persona-kevin-cameron.md`.

**Still needed from Kevin:** full **tier ladder + amounts** (only Tier 1 = **$175** confirmed);
**release window**; **fundraising goal** (progress bar); verified **Resend sending domain**; faith dial
(currently crossover); trailer/pitch video.

**Git:** branch **`setup/foundation`** (off `main`; `main` = initial commit only). Committed checkpoints
cover planning + Phase 0, the warm-literary retrofit + new-york UI foundation, and the `/about` +
`/portfolio` designed pages. Commit only when asked.

## Commands

**Package manager: pnpm** (migrated off npm; `pnpm-lock.yaml` is the lockfile).

| Task | Command | Notes |
| ---- | ------- | ----- |
| Dev server | `pnpm dev` | Turbopack (default in 16), http://localhost:3000, outputs to `.next/dev` |
| Prod build | `pnpm build` | `next build` (Turbopack). TS step takes **~3 min** (recharts/motion types) — not hung. A stray `webpack` config in `next.config.ts` fails the build |
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
- **shadcn/ui**, style `new-york` (Radix-based, via the unified `radix-ui` package). The repo mirrors
  the `digitaldog-site-starter` UI foundation: 47 primitives in `components/ui/`, theme tokens in
  `app/globals.css`. **Shadcn Studio + shadcnblocks** private registries are wired in `components.json`
  (`@shadcn-studio` / `@ss-blocks` / `@ss-components` / `@shadcnblocks`). Add blocks via the vendor
  script: `pnpm vendor:blocks:search @ss-blocks <query>`, then `pnpm vendor:blocks -- only @ss-blocks/<id>`.
  It loads `.env.local` and maps `SHADCNSTUDIO_EMAIL`/`SHADCNSTUDIO_LICENSE_KEY` → `EMAIL`/`LICENSE_KEY`
  (shadcnblocks auth uses `SHADCNBLOCKS_API_KEY`; creds must be in `.env.local`). Block slugs are
  `<category>-section-<N>` (e.g. `hero-section-30`) — use `:search` to find exact ids. Vendored blocks
  land in `components/shadcn-studio/blocks/<id>/` (+ `assets/svg/`, sometimes new `ui/` primitives), and
  the CLI also writes a throwaway demo route `app/<id>/page.tsx` — **delete it**. Icons: `lucide-react`.
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge); use it for conditional class merging.
- **Building the remaining designed pages** (`/contact`, `/supporters`, `/thank-you`, `/support/canceled`,
  legal): port layout + copy from the mockup in `The-Silence-Between-Us/` (HTML wins on look/copy), but
  use our brand tokens (warm-literary, in `app/globals.css`) + `components/site/primitives.tsx`
  (`Eyebrow`/`SectionHeading`/`Rule`/`Placeholder`) + `SupportButton`; rewrite cross-page links per
  `handoff/06-ROUTE-AND-LINK-MAP.md`; **adapt Kevin's spoken catchphrases** to the serious register
  (see `handoff/07` table); use **real data/images** from `content/portfolio.ts` + `public/portfolio/`
  where the design shows works/partners/photos. Page metadata `title` only (layout adds the template).
- **Two layout gotchas (learned, applied):** (1) `app/layout.tsx` `<body>` has `suppressHydrationWarning`
  to silence benign browser-extension attribute injection (`cz-shortcut-listen`, etc.). (2) **Never put a
  `next/image fill` inside an `items-center` grid/flex column without an explicit height** — the box
  collapses to height 0; wrap the aspect box and give it `w-full`, or use an explicit `h-[Npx]`.

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
