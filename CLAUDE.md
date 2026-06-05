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

## Build status — read first after a context reset (updated 2026-06-04)

**Phase 0 (tooling) ✅ done & verified:** npm→pnpm; OpenNext + Wrangler (Cloudflare Workers); UI
foundation mirrored from `digitaldog-site-starter` (new-york shadcn + Shadcn Studio registries).
`pnpm build`, `opennextjs-cloudflare build`, and `pnpm preview` (workerd) all pass.

**Built so far:**
- `/` (`app/page.tsx`) — the real **warm-literary designed home page**, built from the design handoff
  in `The-Silence-Between-Us/handoff/` (Newsreader font, brand tokens in `app/globals.css`). Composed
  from `components/site/home/*` (hero → film still (a looping muted `<BackgroundVideo>`) → story w/ drop cap → pull quote → teacher split →
  filmmaker → dark proof band → endorsements → tiers → gold final CTA). **Hero 30 was deleted.**
  Real imagery now (2026-06-04, all via `next/image`): home film-still **video** (`<BackgroundVideo>`),
  filmmaker portrait (`kevin-speaking.jpg`), teacher still (`teacher-at-school.jpg`), the partner-logo wall
  (`content/proof.ts` → `public/images/partners-logos/`, real `<Image>` on light chips; brand logos held back
  for portfolio); **about** (portrait `kevin-good-waistup-shot.jpg` + classroom `teacher-at-school.jpg`);
  **portfolio** (premiere-tour gallery cell). **Only placeholder left site-wide: endorsement avatars**
  (`TODO(endorsements)` — never attach invented quotes to real faces; real quotes pending the Sacramento
  screening transcript). Partner/Patron prices stay illustrative (only **$175** confirmed).
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
- `/faq` (`app/faq/page.tsx`) — the **warm-literary FAQ**, reworked 2026-06-04: nested `<main>` removed (the layout supplies one), rebuilt on-brand (Eyebrow / Rule / restyled Accordion grouped by topic + a support bridge → `/give` + `/contact`), em-dashes scrubbed, copy reconciled with `docs/copy/secondary-pages.md`. Release-window answer stays date-free until Kevin confirms.
- `/supporters` (`app/supporters/page.tsx`) — the designed **Founding Supporters wall**, built from `handoff/10`. Server page computes the live counts (total / patrons+partners / founding year) + renders the dark bridge CTA; the search/tier-filter/show-more block is the `"use client"` island `components/site/supporters/wall.tsx`. Roster now reads **Cloudflare D1** (`lib/db/supporters.ts`; the webhook persists per doc 08 §7) — page is `force-dynamic`; **privacy:** credit-name only, never email. V1 seed `db/seed-supporters.sql` makes the wall look complete for review (cleared at go-live via `DELETE … LIKE 'seed:%'`). Filter behavior ported verbatim from the mockup (patrons hide under Partner/Supporter; search narrows both). CTAs link to `/give`.
- `/contact` (`app/contact/page.tsx`) — the designed **Contact** page, built from `handoff/11`. Server page = hero + `<Rule>` + a two-col grid (form left, direct-details aside right); the form is the `"use client"` island `components/site/contact/contact-form.tsx` (inquiry chips, validation, inline warm success state). Submit is a resolved **stub** (`TODO(contact-wiring)`: POST `/api/contact` → verify reCAPTCHA → Resend to `kevin@kcfilmsmedia.com` with the inquiry category in the subject). Two **`TODO(contact-confirm)`** content calls await Kevin: the phone **216-308-4427** (it's the original form's **Zelle** number — OK to publish?) and **Cleveland vs Tampa** as the shown production location (+ a real Facebook URL). Admin note still carries the deferred "Donations…" wording (same as footer).
- `/thank-you` (`app/thank-you/page.tsx`) — the Stripe success **return_url**, built from `handoff/12`. **Dynamic** `async` Server Component: `await`s `searchParams` and branches on `redirect_status` (`succeeded`/missing → confirmation; `processing` → "we're confirming"; `failed` → error → `/give` + `/support/canceled`). **Display-only — never fulfills** (that's the webhook, doc 08 §7). Receipt is `TODO(receipt)`: shows the **real** PaymentIntent id from the URL when present + "Paid via Stripe", but **no fabricated tier/amount/number** (doc 08 wires the PI retrieve later). `robots:{index:false}`. Success body = confirmation seal → "what happens next" timeline (1st step → `/supporters`) → director quote → share/upgrade (share intents; upgrade → `/#support` `TODO(give)`).
- `/support/canceled` (`app/support/canceled/page.tsx`) — the reassuring canceled-checkout page, built
  from `handoff/13`. **Static** Server Component (`robots:{index:false}`), display-only (never touches
  Stripe): soft "↻" seal + a **"Your card was not charged"** pill → four no-blame "common reasons" (each
  with a one-line fix) → a gentle team note (their place among Founding Supporters stays open) → two ways
  forward (**Return to checkout** → `/give` gold; **Choose a different amount** → `/give?tier=custom`;
  **Contact us** → `/contact`; email). Resolves the `/thank-you` failed-state "What happened?" link.
- `/legal/{terms,privacy,contributions}` (`app/legal/*/page.tsx`) — the **legal trio**, built from
  `handoff/14`. One shared `components/site/legal/legal-layout.tsx` (+ `legal.module.css` = the
  CSS-counter numbered TOC/sections + diamond bullets) + three **static** pages: header → pill nav →
  sticky numbered TOC → auto-numbered sections. **"Draft for review" banner is baked into the layout**
  (every page). Copy ported from the mockups with **em-dashes scrubbed**; **$175 Supporter benefits
  render from `content/tiers.ts`** (single source); recurring-billing language dropped (one-time only).
  ⚠️ governing law defaulted **Florida** per `docs/copy/legal.md` (the mockup said Ohio) = `TODO(legal-confirm)`.
  Footer legal links now resolve.

**All designed pages are now built.** The error/empty states were built 2026-06-04 from the `404`/`Error`
mockups: `app/not-found.tsx` (site-wide 404 → `/_not-found` Static), `app/error.tsx` (segment error
boundary, v16 `unstable_retry`, "card was not charged" reassurance + `error.digest` reference), and
`app/global-error.tsx` (root-layout fallback; own `<html>`/`<body>`, Georgia serif fallback since the
layout font is gone). **Phase 4 hardening is underway:** SEO (`app/sitemap.ts` + `app/robots.ts` +
`metadataBase`, all env-driven via `lib/site.ts` `SITE_URL` from `NEXT_PUBLIC_SITE_URL`) ✅ and the FAQ
rework ✅ are done; remaining = a default/OG image + an a11y/Lighthouse pass. ⚠️ `.env.local`
`NEXT_PUBLIC_SITE_URL=digitaldog.io` currently drives canonical/sitemap/share URLs — set the real or
staging value (or remove it for the placeholder). Launch checklist: `docs/build-plan.md`.

**Payment slice (Phase 1 ✅ end-to-end verified 2026-06-04 — full roadmap `docs/build-plan.md`):** built &
test-verified = `lib/stripe/{server,tiers}.ts` (lazy client + Fetch httpClient for Workers, apiVersion
`2026-05-27.dahlia` = account default, amounts derive from `content/tiers.ts`), `/api/payment-intent`,
`/api/stripe/webhook` (`constructEventAsync`; `recordSupporter` is a `TODO(data)` log stub), and **`/give`**
(`app/give/page.tsx` + `components/site/give/give-form.tsx` — Stripe **Payment Element**, deferred mode; page
reads the publishable key via `connection()`; per-tier benefits live in `content/tiers.ts`). **`SupportButton`
links to `/give?tier=` site-wide** (#6 — the `/#support`/`/api/checkout` interims are retired), and **`/thank-you`
renders the real PaymentIntent receipt** (#7 — read-only retrieve: tier + amount + ref; falls back gracefully).
**#8 end-to-end ✅ verified 2026-06-04** (dev + workerd): `/give`→PI→`/thank-you` receipt; webhook→`recordSupporter` via `stripe listen` (all `[200]`); Stripe create/retrieve + amount-validation on the CF runtime; `pnpm build`+`pnpm preview` pass; `4000…0002` decline → **402** inline error, no redirect (runbook `docs/stripe-test-runbook.md`). **#12 supporters D1 ✅** (`DB` binding + `lib/db/supporters.ts`; webhook persists; `/supporters` reads D1, `force-dynamic`; v1 seed `db/seed-supporters.sql`; verified read-on-workerd + write-on-dev 2026-06-04; remote D1 `wrangler d1 create` = `TODO(d1)`). **Email program ✅** — 6 email-safe React Email templates (`emails/*` + `emails/components/shell.tsx`, claude.ai-designed, QA-approved), dev preview route `/api/dev/email-preview` + `docs/email-qa-runbook.md`. **#1 ✅** payment-confirmation emails wired into the webhook (`lib/email/notify.tsx` → supporter-confirmation + internal-new-contribution, best-effort). **#2 ✅** `/api/contact` auto-reply + **reCAPTCHA v3** (`siteverify`; ⚠️ site key needs `localhost`/prod domain registered — `browser-error` until then, dev falls through). **Next work = the ordered table in `docs/build-plan.md` ("Recommended order — Phase 2 + 3") → #6 broadcasts** (`production-update` + `trailer-first-look` via Resend Broadcasts; gated on Kevin's mailing address + a verified marketing subdomain). (**#3 ✅** `/support/canceled`, **#4 ✅** refund email (full refunds only; ⚠️ prod endpoint must enable `charge.refunded`), **#5 ✅** legal trio — all built 2026-06-04. #5 = shared `components/site/legal/legal-layout.tsx` (+ `legal.module.css`) + 3 static pages; "Draft for review" banner; $175 benefits from `content/tiers.ts`; em-dashes scrubbed; ⚠️ governing law defaulted **Florida**, `TODO(legal-confirm)`.) Local test workflow: see the `local-dev-test-loop` memory. ⚠️ test webhook secret env is `STRIPE_WEBHOOK_SECRET` (no
`_TEST_`); live is `STRIPE_LIVE_WEBHOOK_SECRET`.
**Design system** (warm-literary): `The-Silence-Between-Us/handoff/01-DESIGN-SYSTEM.md`.

**Locked decisions:** Stripe **custom `/give` checkout** (Payment Element, *deferred* mode), **one-time**
(tiers + custom amount) — **not** hosted Checkout (superseded by `handoff/08`); fulfillment via **webhook**
`payment_intent.succeeded` (not the redirect; Workers → `constructEventAsync`). **Resend**
email; **Google reCAPTCHA** on contact. Framing = **rewards crowdfunding** ("support/back/contribute",
**never** "tax-deductible" or "invest"); **988** crisis line in footer. Copy = **teens-first** (NOT "a
movie about a teacher") in a **serious sales register — no spoken catchphrases** ("true to this", "what
are we waiting for", "yes sir" are for social/video, not the site). Voice source: `docs/persona-kevin-cameron.md`.

**Still needed from Kevin:** full **tier ladder + amounts** (only Tier 1 = **$175** confirmed);
**release window**; **fundraising goal** (progress bar); verified **Resend sending domain**; faith dial
(currently crossover); trailer/pitch video.
**Full prioritized list of Kevin-gated decisions:** `docs/decisions-for-kevin.md`.

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
- **▶ STAGING DEPLOY — LIVE (2026-06-05):** `https://silence-between-us.derrick-2fd.workers.dev` (Stripe
  **test** mode). Deploy with **`pnpm run deploy`** (NOT `pnpm deploy` — pnpm's built-in `deploy` shadows
  the script). ⚠️ Auth: `.env.local`'s `CLOUDFLARE_API_TOKEN` is under-scoped, wrangler auto-loads it, and
  it shadows OAuth — so it's **commented out**, and wrangler uses the `wrangler login` OAuth (super-admin).
  Re-scope it (Workers Scripts + D1) + un-comment for CI later. Remote **D1** `silence-between-us-db` created
  (`database_id` in `wrangler.jsonc`), schema applied, wall **seeded** (47 `seed:` rows — clear at launch).
  Worker **secrets set** (test): `STRIPE_MODE=test` + `STRIPE_TEST_{SECRET,PUBLISHABLE}_KEY` + `RESEND_API_KEY`
  + `CONTACT_{FROM,TO}_EMAIL` + `RECAPTCHA_SECRET_KEY`. **Pending for the demo:** register the workers.dev
  domain on the reCAPTCHA site key (contact form 403s until then); add a Stripe **test** webhook →
  `…/api/stripe/webhook` (`payment_intent.succeeded` + `charge.refunded`) → set `STRIPE_WEBHOOK_SECRET`.
  **Video force-autoplays (2026-06-05):** the deployed no-autoplay was just `prefers-reduced-motion` on the
  test machine — `<BackgroundVideo>`'s reduced-motion gate was **removed** per request, so the muted,
  decorative loop autoplays for everyone (debug logging stripped). The video loads fine (`readyState 3`);
  the ASSETS `200`/no-`accept-ranges` serving is cosmetic, not blocking.

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
  **Each remaining page has a dedicated handoff doc — READ IT FIRST:** `handoff/08-CHECKOUT-CUSTOM-GIVE.md`
  (Stripe Checkout / Give flow), `09-PAGE-PORTFOLIO.md`, `10-PAGE-SUPPORTERS.md`, `11-PAGE-CONTACT.md`,
  `12-PAGE-THANK-YOU.md`, `13-PAGE-CANCELED.md`, `14-PAGES-LEGAL.md`. (⚠️ `/portfolio` was built from the
  mockup *before* doc 09 landed — reconcile against `09` if it differs.) Real assets are arriving:
  `public/images/teacher-at-school.jpg`, `public/videos/*.mp4`. Use `next/image` for stills and the
  reusable **`<BackgroundVideo>`** (`components/site/background-video.tsx` — mobile-optimized muted autoplay
  loop: `playsInline`, off-screen pause, reduced-motion aware) for clips, to replace `<Placeholder>`s. The
  home film-still band already uses it (`/videos/Kid-With-Basketball-24.mp4`).
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
