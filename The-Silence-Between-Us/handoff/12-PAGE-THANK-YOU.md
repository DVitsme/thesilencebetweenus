# 12 · Thank-You Page (`/thank-you`)

Reference mockup: **`Thank You - The Silence Between Us.html`** → `app/thank-you/page.tsx`.

This is the **success `return_url`** from the Payment Element (doc 08). Stripe redirects here with
`?payment_intent=…&payment_intent_client_secret=…&redirect_status=succeeded`.

## Behavior

- **Display only — do NOT fulfill here.** Fulfillment (recording the supporter, receipt) happens in
  the **webhook** (doc 08 §7). The tab can be closed; never depend on this page running.
- Read `searchParams.redirect_status`:
  - `succeeded` → show the confirmation.
  - anything else (`processing`, `failed`) → show a softer "we're confirming / something went wrong"
    state, with a link back to `/give` and to `/support/canceled` guidance.
- **Optional, nice:** retrieve the PaymentIntent server-side to show a *real* receipt (id, tier from
  metadata, amount). Safe because it's read-only and verified by Stripe:
  ```ts
  import { stripe } from "@/lib/stripe/server";
  const pi = await stripe.paymentIntents.retrieve(searchParams.payment_intent!);
  // use pi.id, pi.amount, pi.metadata.tier
  ```
  If you skip this, the mockup's static "#SBU-0042 / Supporter / $175" is a placeholder — mark it
  `TODO(receipt)` so nobody ships a fake receipt number.

## Sections (from mockup)

1. **Confirmation** — gold seal, "You're a Founding Supporter," receipt chips (number, tier, amount,
   "paid via Stripe").
2. **What happens next** — timeline of benefits with *when* each arrives; lead with "Right now — your
   name joins the Supporters wall" → link `/supporters`.
3. **A word from the director** — short thank-you (tint band).
4. **Multiply your impact** — share buttons + a gentle Partner/Patron upgrade nudge → `/give`.

## Mechanics

- `metadata`: `title: "Thank You"`, and add `robots: { index: false }` (don't index a post-payment
  page).
- Server Component; reads `searchParams` (Next 16: `searchParams` is a prop — `async` page if you
  `await` the PI retrieve).
- Links rewritten per doc 06. Share buttons can be simple `mailto:`/`https://` share intents.
- `pnpm build` passes; visiting `/thank-you?redirect_status=succeeded` shows the success state.
