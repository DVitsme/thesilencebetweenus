# Stripe payment test runbook (task #8 — Phase 1 end-to-end, test mode)

Verifies the **`/give` → PaymentIntent → `/thank-you` → webhook** flow in Stripe **test** mode.

Most of the data path is already automated-verified (lib → `/api/payment-intent` → real PI →
`/thank-you` receipt). What remains needs a human/CLI and can't be curl'd: the **in-browser card
confirmation** and the **webhook firing**.

## Prerequisites
- `.env.local` has the **test** keys (`STRIPE_TEST_PUBLISHABLE_KEY`, `STRIPE_TEST_SECRET_KEY`) — ✅
  present (the `/give` page renders and PaymentIntents create).
- Dev server: `pnpm dev` → http://localhost:3000.
- Webhook half only: the **Stripe CLI** (⚠️ not installed yet — see Part B).

---

## Part A — Browser checkout (no Stripe CLI needed)
Validates the whole user-facing flow: form → PaymentIntent → confirm → thank-you receipt.

1. `pnpm dev`, open http://localhost:3000/give
2. Pick a tier (or **Give any amount** + type a number), fill First/Last, "How your name appears in
   the credits", and a valid-format Email.
3. In the Payment Element, enter the **success** test card:
   - `4242 4242 4242 4242` · any future expiry (`12/34`) · any CVC (`123`) · any ZIP (`42424`)
4. Click **Contribute $X securely →**.
   - ✅ redirect to `/thank-you?…&redirect_status=succeeded` showing **Tier · …**, **Contribution ·
     $X**, **Receipt · #…**.
5. **Decline** — repeat with `4000 0000 0000 0002`:
   - ✅ inline error under the Payment Element, **no** redirect, no charge.
6. *(Optional)* **3D Secure** — `4000 0025 0000 3155`: ✅ auth modal → complete = success, fail =
   inline error.

Test-card reference: https://docs.stripe.com/testing#cards

---

## Part B — Webhook (needs the Stripe CLI)
Validates signature verification (`constructEventAsync`) + the `payment_intent.succeeded` handler
(`recordSupporter`, currently a `TODO(data)` log stub).

> ⚠️ Without `stripe listen`, Stripe does **not** deliver webhooks to `localhost` — so Part A
> confirms the user flow but will **not** fire the local webhook.

1. **Install the Stripe CLI** (Linux): https://docs.stripe.com/stripe-cli#install
   (download the latest `stripe_*_linux_x86_64.tar.gz`, or use a package manager).
2. `stripe login` (one-time browser auth).
3. Start the forwarder — it prints a signing secret:
   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # → Ready! Your webhook signing secret is whsec_xxxxxxxx…
   ```
4. ⚠️ **Swap the secret for local testing:** put that `whsec_…` into `.env.local` as
   `STRIPE_WEBHOOK_SECRET=whsec_…` (the `stripe listen` secret differs from your dashboard one),
   then restart `pnpm dev`. Swap back / keep them separate afterward.
5. Fire an event — either complete a Part A payment, or:
   ```
   stripe trigger payment_intent.succeeded
   ```
6. ✅ In the **dev server** log, expect:
   ```
   [stripe webhook] payment_intent.succeeded (stub — not yet persisted): { tier: …, amountCents: …, … }
   ```
   and `stripe listen` shows the event forwarded with **200**.

---

## Done-criteria (doc 08 §8) — ✅ all verified 2026-06-04 (dev + workerd preview)
- [x] `4242…` → lands on `/thank-you` with a real receipt (PI `pi_3Tebn…` retrieved + rendered, incl. on workerd).
- [x] `4000…0002` → inline decline, no redirect (Stripe `confirm` → **402**, red inline error, no `/thank-you` nav — verified 2026-06-04).
- [x] Tampered amount → `invalid_amount` (verified via `/api/payment-intent`, dev + workerd → 400).
- [x] Webhook verified via `constructEventAsync`; `payment_intent.succeeded` → `recordSupporter` logs (Part B: all events `[200]` via `stripe listen`).
- [x] `pnpm build` + `pnpm preview` (workerd runtime) pass (+ Stripe PI create/retrieve work on the CF runtime).

## Notes
- `recordSupporter` is a **log stub** (`TODO(data)`) until the D1 data layer (Phase 3, task #12) — the
  webhook proves the *path*, not persistence yet.
- The **live** webhook (dashboard endpoint + `STRIPE_LIVE_WEBHOOK_SECRET`) is wired at launch (Phase 6).
- Already auto-verified (no browser/CLI): PI creation, the `/thank-you` retrieve/receipt, amount
  validation (`recurring_not_enabled`, `invalid_amount`), and webhook signature **rejection** (no-sig → 400).
