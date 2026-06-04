# Build Plan — The Silence Between Us

> Ranked roadmap to finish the donation/marketing site. **Build top to bottom.**
> Last updated 2026-06-04 — keep in sync as items land (check the boxes).
> Companion to `CLAUDE.md` (build status) and the design handoff
> (`The-Silence-Between-Us/handoff/`, docs 08–14).

## Where it stands

**Built & verified (8 pages):** `/`, `/about`, `/portfolio`, `/supporters`, `/contact`, `/faq`,
`/thank-you`, `/give`.

**Wired (Phase 1 ✅ — payments):** Stripe deps; `lib/stripe/{server,tiers}.ts`; `app/api/payment-intent`
+ `app/api/stripe/webhook`; `/give` checkout; `SupportButton`→`/give`; `/thank-you` PI-retrieve receipt.
**Verified end-to-end 2026-06-04** (dev + workerd `pnpm preview`) — see `docs/stripe-test-runbook.md`.

**Not yet wired:** email/captcha deps (Resend/reCAPTCHA, Phase 3); **no data binding** in `wrangler.jsonc`
(only `ASSETS`/`IMAGES`/`WORKER_SELF_REFERENCE`) — supporters still on placeholder data (#12). The env
*names* are ready in `.env.example`; the values + accounts are not.

**Primary goal (locked):** capture supporter contributions. The payment core is the keystone — it
also activates three already-built pages (thank-you, supporters, every "Support" CTA).

## What's left — four buckets

1. **Designed pages (3):** `/give` (08), `/support/canceled` (13), legal ×3 (14).
2. **Wiring/plumbing:** Stripe (deps → `lib/stripe/*` → 2 API routes → data), contact (Resend +
   reCAPTCHA), supporters store, the **`SupportButton` → `/give` flip** (`support-button.tsx` still
   points at the *superseded* `/api/checkout` hosted-checkout).
3. **Hardening:** `not-found`/`error`/`global-error`, SEO, FAQ rework, a11y/Lighthouse.
4. **Content + launch:** gated on Kevin/accounts (see bottom).

---

## ▶ Recommended order — Phase 2 + 3 (current focus, set 2026-06-04)

> Remaining Phase 2 + 3 work, merged and ordered. Finish the core user flows first (everything's
> ready to wire), then dead-link fixes, then the bigger/gated items.

| # | Task | Phase | Why / unblocks | Ready? | Effort |
|---|------|:---:|------|:---:|:---:|
| 1 ✅ | **Wire payment-confirmation emails** — `supporter-confirmation` + `internal-new-contribution` into the `payment_intent.succeeded` webhook · **DONE 2026-06-04 (verified live)** | 3 | Supporters get a branded thank-you; team gets an alert. Cleared webhook `TODO(email)`. | ✅ | M |
| 2 ✅ | **Finish + secure contact** — `contact-autoreply` 2nd send + **reCAPTCHA v3** (server verify, badge hidden + legal line) · **DONE 2026-06-04** | 3 | Submitter ack + spam protection. ⚠️ add `localhost` + the prod domain to the reCAPTCHA site key (live verify returns `browser-error` until then; dev falls through). | ✅ | M |
| 3 ✅ | **`/support/canceled`** (doc 13) · **DONE 2026-06-04** | 2 | Fixed the thank-you "What happened?" 404; completes give→thank-you→canceled. | ✅ | S |
| 4 ✅ | **Refund email** — `charge.refunded` branch → `refund-confirmation` · **DONE 2026-06-04 (verified live)** | 3 | Completes the money lifecycle (same webhook file as #1). Full refunds only; partials logged. ⚠️ prod webhook endpoint must enable `charge.refunded`. | ✅ | S |
| 5 ✅ | **Legal trio** — `/legal/{terms,privacy,contributions}` (doc 14) · **DONE 2026-06-04** | 2 | Footer legal links now resolve; renders $175 benefits from `tiers.ts`. | "Draft for review" banner kept; ⚠️ governing-law defaulted **Florida** (`TODO(legal-confirm)`) | L |
| 6 ⏸ | **Broadcast sends** — `production-update` + `trailer-first-look` via Resend Broadcasts · **DEFERRED → post-launch fast-follow** (2026-06-04) | 3 | **Not launch-blocking** — templates built, supporters captured in D1 from day one, no audience pre-launch. Delivers 2 promised perks, so do before the 1st quarterly update. | ⚠️ gated: Kevin mailing address + Resend Audience + marketing subdomain | M |

*Later (not Phase 2/3):* Phase 4 (error pages, SEO, FAQ rework, a11y), Phase 5 (Kevin content), Phase 6
(launch). Kevin-gated inputs: `docs/decisions-for-kevin.md`.

---

## 🚦 Pre-launch revisit checklist — deferred / skipped / stubbed

> Consolidated audit of everything parked along the way, so nothing ships by accident. Grounded in the
> code (every `TODO(...)`, `<Placeholder>`, `illustrative` flag) + the locked decisions. Full
> Kevin-input detail: `docs/decisions-for-kevin.md`. **Revisit this whole list before go-live.**

**Deferred features**
- **#6 Broadcasts** ⏸ → **post-launch fast-follow** (decided 2026-06-04). Not launch-blocking: the
  `production-update` + `trailer-first-look` templates are already built, supporters land in D1 from
  day one (so you can broadcast retroactively), and there's no audience to email pre-launch. It IS the
  delivery mechanism for two promised perks (quarterly updates + trailer first-look), so build it
  before the first quarterly update comes due. Gated on Kevin's mailing address (CAN-SPAM) + a Resend
  Audience + ideally a separate marketing subdomain.

**⚠️ Must not ship as-is (would mislead or break in prod)**
- **Seed supporters** — `db/seed-supporters.sql` loaded 47 fake rows (`seed:` tag); the live
  `/supporters` wall would show fabricated names. Clear at go-live: `DELETE FROM supporters WHERE
  stripe_payment_intent LIKE 'seed:%'` on the prod D1.
- **Illustrative tier prices** — Partner **$500** / Patron **$1,500** are placeholders
  (`content/tiers.ts`, `illustrative:true`); only **$175** is confirmed. The live site shows and would
  charge these. Confirm with Kevin. `TODO(tiers)`.
- **reCAPTCHA not actually verifying** — the site key lacks `localhost`/the prod domain, so live
  `siteverify` returns `browser-error` (dev falls through; prod is strict). Register the domains +
  confirm `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` ≠ `RECAPTCHA_SECRET_KEY` before trusting contact spam protection.
- **Legal trio = drafts** — carry the "Draft for review" banner; need **counsel review**. Governing law
  is a **Florida** default (`TODO(legal-confirm)`, per `docs/copy/legal.md`; the mockup said Ohio).
- **`/api/dev/email-preview`** — confirm the dev-only guard 404s it in prod.

**Launch config + accounts (Phase 6, blocking)**
- **Production domain** → `metadataBase` (`app/layout.tsx` `TODO(domain)`) + `SHARE_URL`
  (`app/thank-you/page.tsx` `TODO(domain)`) + sitemap/OG.
- **Resend** — verify the transactional sending domain; set `RESEND_API_KEY`/`CONTACT_FROM_EMAIL`/
  `CONTACT_TO_EMAIL` as Cloudflare secrets + `.dev.vars`.
- **Flip contact recipient** → `CONTACT_TO_EMAIL=kevin@kcfilmsmedia.com` (now derrick@digitaldog.io;
  `app/api/contact/route.ts` `TODO(launch)`).
- **Stripe live** — live keys + live webhook + `STRIPE_LIVE_WEBHOOK_SECRET`, and **enable both events**
  on the endpoint: `payment_intent.succeeded` + `charge.refunded` (#4).
- **Prod D1** — `wrangler d1 create` + bind in `wrangler.jsonc` (`TODO(d1)`); `pnpm cf-typegen`.
- **Statement descriptor** — what shows on the card statement (`docs/copy/legal.md` `[STATEMENT DESCRIPTOR]`).

**Kevin-gated content (Phase 5 — detail in `docs/decisions-for-kevin.md`)**
- Tier ladder + amounts · fundraising goal + progress bar · release window · endorsements
  (`endorsements.tsx` `TODO(endorsements)`) · faith dial · trailer/pitch video.
- **Imagery `<Placeholder>`s still live:** home (`filmmaker`, `teacher-split`), about (portrait,
  classroom), portfolio ("more from the tour"). Swap to `next/image` as assets land.
- **Contact confirmations** (`app/contact/page.tsx` `TODO(contact-confirm)`): phone **216-308-4427**
  (the original Zelle number — OK to publish?), **Tampa vs Cleveland**, real Facebook URL.
- **"Donations" wording** (footer + contact admin note) per the locked register.

**Code hardening (Phase 4 — no Kevin needed; the next buildable work)**
- `not-found.tsx` / `error.tsx` / `global-error.tsx` (warm-branded; today an unhandled error shows the
  raw Next page). Mockups exist (`404`/`Error` HTML).
- SEO: `sitemap.ts`, `robots.ts`, default/OG image.
- FAQ: fix the nested `<main>` + finalize copy from `docs/copy/`.
- a11y + Lighthouse pass.

**Smaller gaps**
- The **supporter-confirmation email** doesn't link the Contribution/Refund terms (doc 14 suggested it;
  the `/give` form already does).
- **Analytics** — the Privacy Policy mentions analytics + a cookie-consent banner "if added"; decide,
  and add a banner if you enable analytics.
- Legal **"Last updated"** is hardcoded `June 3, 2026`; bump when counsel revises.

---

## Phase 1 — Payment core ✅ done *(keystone; verified 2026-06-04, dev + workerd — see `docs/stripe-test-runbook.md`)*

- [x] Install deps: `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js` (+ `pnpm.onlyBuiltDependencies` if needed)
- [x] `lib/stripe/server.ts` (mode-select, **Fetch httpClient** for Workers) + `lib/stripe/tiers.ts` (server-authoritative amount validation, single source)
- [x] `/give` page + `<GiveForm>` client island — Payment Element, *deferred* mode (doc 08 §4–5)
- [x] `app/api/payment-intent/route.ts` (validate amount server-side)
- [x] `app/api/stripe/webhook/route.ts` — `constructEventAsync`, `payment_intent.succeeded` → `recordSupporter()` (stub the store)
- [x] Flip `SupportButton` → `Link href="/give?tier=…"` (doc 08 §6); retire `/api/checkout` + `/#support` interims → clears `TODO(give)`/`TODO(checkout)`
- [x] Wire thank-you receipt to the PI retrieve → clears `TODO(receipt)`
- [x] Test end-to-end with Stripe **test** keys + `stripe listen` *(success + decline `402` + webhook + workerd all verified 2026-06-04)*

## Phase 2 — Finish the designed pages

- [x] `/support/canceled` (doc 13) — completes the payment trio + resolves thank-you's failed-state link *(done 2026-06-04; static Server Component, brand tokens + primitives, reassuring "card was not charged" copy → `/give`)*
- [x] Legal trio (doc 14) — shared `legal-layout.tsx` (+ `legal.module.css` counters) + the three pages; **"Draft for review"** banner baked into the layout; $175 benefits render from `content/tiers.ts`; em-dashes scrubbed; recurring-billing language dropped (one-time only); governing-law defaulted **Florida** per `docs/copy/legal.md` (`TODO(legal-confirm)`). *(done 2026-06-04, build passes; all three `○ Static`.)*

## Phase 3 — Contact + Supporters data

- [ ] reCAPTCHA (client token + server verify) — *needs site/secret keys (free)*
- [ ] `app/api/contact/route.ts` (Resend → `kevin@kcfilmsmedia.com`, category in subject) + flip contact-form stub → real POST → clears `TODO(contact-wiring)` — *needs Resend key*
- [x] Supporters data layer — **D1** `DB` binding in `wrangler.jsonc`; `lib/db/supporters.ts` (idempotent webhook write / public read); `/supporters` reads D1 (`force-dynamic`) → clears `TODO(data)`; `pnpm cf-typegen`. *(Verified 2026-06-04: read on workerd, write end-to-end on dev. V1 seed `db/seed-supporters.sql`; remote D1 `wrangler d1 create` = deploy-time `TODO(d1)`.)*

## Phase 4 — Site hardening *(independent — parallelizable with 1–3)*

- [ ] `not-found.tsx`, `error.tsx`, `global-error.tsx` (warm, designed)
- [ ] SEO: `sitemap.ts`, `robots.ts`, default/OG image, `metadataBase` from `NEXT_PUBLIC_SITE_URL` → clears both `TODO(domain)`
- [ ] FAQ rework (fix nested `<main>`, finalize copy from `docs/copy/`)
- [ ] Accessibility + Lighthouse pass (`LIGHTHOUSE_URL` already in env)

## Phase 5 — Content finalization *(gated on Kevin — slot in as inputs arrive)*

- [ ] Tier ladder + amounts → clears `TODO(tiers)`; reconcile home tiers, `/give`, contribution terms
- [ ] Endorsements section content → clears `TODO(endorsements)`
- [ ] Replace imagery `<Placeholder>`s (home, about) with real assets via `next/image`
- [ ] Fundraising goal + progress bar (new home feature — needs the goal number)
- [ ] Release-window copy · faith dial · **trailer/pitch video** (replaces thank-you "send the trailer" + home placeholders)
- [ ] Contact confirmations: phone (ex-Zelle), Cleveland vs Tampa, real Facebook URL → clears `TODO(contact-confirm)`
- [ ] Decide the **"Donations" wording** (footer + contact admin note) per the locked register

## Phase 6 — Launch

- [ ] **Production domain** decided → set everywhere (metadataBase, share URLs, sitemap)
- [ ] Accounts/secrets: Resend **domain verified**; reCAPTCHA keys (**register the production domain** on the site key — and `localhost` for local verify; live verify fails with `browser-error` until the domain is allowed); Stripe **live** keys + live webhook endpoint + `STRIPE_LIVE_WEBHOOK_SECRET`; push to Cloudflare (`wrangler secret put`) + prod D1 binding
- [ ] **Flip contact recipient** → `CONTACT_TO_EMAIL=kevin@kcfilmsmedia.com` (testing uses `derrick@digitaldog.io` so delivery is verifiable). Set the Resend/contact envs (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`) as Cloudflare secrets + add to `.dev.vars` for preview. `TODO(launch)`
- [ ] `pnpm preview` (workerd) full pass → `pnpm deploy` → **live smoke test** (real $1 contribution in live mode → webhook → supporters-wall row → receipt email)

---

## Collect now — parallel asks that gate launch, not building

> Full, prioritized list with context + current placeholders: **`docs/decisions-for-kevin.md`**.

**From Kevin:** tier ladder + amounts · fundraising goal · release window · endorsements · trailer ·
imagery · phone/location/Facebook · legal entity state.

**Accounts/setup:** Resend sending-domain verification · reCAPTCHA keys · Stripe live keys + live
webhook · production domain.

## Sequencing note

Payments-first, per the locked primary goal (and doc 14's recommended slice order). Alternative: to
ship the **marketing** site live first and add payments later, move **Phase 4 ahead of Phase 1**.
