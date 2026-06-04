# Build Plan — The Silence Between Us

> Ranked roadmap to finish the donation/marketing site. **Build top to bottom.**
> Last updated 2026-06-03 — keep in sync as items land (check the boxes).
> Companion to `CLAUDE.md` (build status) and the design handoff
> (`The-Silence-Between-Us/handoff/`, docs 08–14).

## Where it stands

**Built & verified (7 pages):** `/`, `/about`, `/portfolio`, `/supporters`, `/contact`, `/faq`,
`/thank-you`.

**Not yet wired:** no `app/api/*` routes; `lib/` has only `utils.ts`; payment/email/captcha deps
not installed; **no data binding** in `wrangler.jsonc` (only `ASSETS`/`IMAGES`/`WORKER_SELF_REFERENCE`).
The env *names* are ready in `.env.example`; the values + accounts are not. 15 `TODO()` markers are
open in code — most collapse the moment the payment slice lands.

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

## Phase 1 — Payment core *(keystone; clears 5 TODOs + activates 3 built pages)*

- [ ] Install deps: `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js` (+ `pnpm.onlyBuiltDependencies` if needed)
- [ ] `lib/stripe/server.ts` (mode-select, **Fetch httpClient** for Workers) + `lib/stripe/tiers.ts` (server-authoritative amount validation, single source)
- [ ] `/give` page + `<GiveForm>` client island — Payment Element, *deferred* mode (doc 08 §4–5)
- [ ] `app/api/payment-intent/route.ts` (validate amount server-side)
- [ ] `app/api/stripe/webhook/route.ts` — `constructEventAsync`, `payment_intent.succeeded` → `recordSupporter()` (stub the store)
- [ ] Flip `SupportButton` → `Link href="/give?tier=…"` (doc 08 §6); retire `/api/checkout` + `/#support` interims → clears `TODO(give)`/`TODO(checkout)`
- [ ] Wire thank-you receipt to the PI retrieve → clears `TODO(receipt)`
- [ ] Test end-to-end with Stripe **test** keys + `stripe listen`

## Phase 2 — Finish the designed pages

- [ ] `/support/canceled` (doc 13) — completes the payment trio + resolves thank-you's failed-state link
- [ ] Legal trio (doc 14) — shared `legal-layout.tsx`; keep the **"Draft for review"** banner; render $175 benefits from `content/tiers.ts`; `TODO(legal-confirm)` governing-law state

## Phase 3 — Contact + Supporters data

- [ ] reCAPTCHA (client token + server verify) — *needs site/secret keys (free)*
- [ ] `app/api/contact/route.ts` (Resend → `kevin@kcfilmsmedia.com`, category in subject) + flip contact-form stub → real POST → clears `TODO(contact-wiring)` — *needs Resend key*
- [ ] Supporters data layer — add **D1** binding (rec. over KV) in `wrangler.jsonc`; `recordSupporter()` writes; supporters page reads real rows → clears `TODO(data)`; run `pnpm cf-typegen`

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
- [ ] Accounts/secrets: Resend **domain verified**; reCAPTCHA keys; Stripe **live** keys + live webhook endpoint + `STRIPE_LIVE_WEBHOOK_SECRET`; push to Cloudflare (`wrangler secret put`) + prod D1 binding
- [ ] `pnpm preview` (workerd) full pass → `pnpm deploy` → **live smoke test** (real $1 contribution in live mode → webhook → supporters-wall row → receipt email)

---

## Collect now — parallel asks that gate launch, not building

**From Kevin:** tier ladder + amounts · fundraising goal · release window · endorsements · trailer ·
imagery · phone/location/Facebook · legal entity state.

**Accounts/setup:** Resend sending-domain verification · reCAPTCHA keys · Stripe live keys + live
webhook · production domain.

## Sequencing note

Payments-first, per the locked primary goal (and doc 14's recommended slice order). Alternative: to
ship the **marketing** site live first and add payments later, move **Phase 4 ahead of Phase 1**.
