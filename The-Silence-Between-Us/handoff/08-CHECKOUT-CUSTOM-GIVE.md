# 08 · CHECKOUT CHANGE — Build the custom `/give` page (supersedes hosted Checkout)

> **Decision change from the human (2026-06-03):** Do **not** use hosted Stripe Checkout. Build the
> custom **`/give`** page we designed (`Give - The Silence Between Us.html`) as a real on-site
> checkout, and point the home page **"Become a Founding Supporter"** (and every tier CTA) at it.
>
> **This doc supersedes:**
> - `00-START-HERE.md` Rule #1 (hosted Checkout)
> - `03-LAYOUT-HEADER-FOOTER.md` §2 — `SupportButton` now **navigates to `/give`** (see §6 below)
> - `04-HOME-PAGE.md` — tier CTAs + final CTA link to `/give` (carry the chosen tier as a query param)
> - `06-ROUTE-AND-LINK-MAP.md` — `/give` **is now a real route**

---

## TL;DR of the new flow

```
Home / any "Support" CTA ──▶ /give?tier=supporter
        (our warm-literary checkout page; pick tier / any amount / details)
   │
   ├─ Stripe Payment Element (card fields, Stripe-hosted iframes) mounts in step 03
   │
   ▼  user confirms
POST /api/payment-intent  ──▶ creates PaymentIntent (server)  ──▶ clientSecret
   │
   ▼  stripe.confirmPayment(return_url=/thank-you)
Stripe processes ──▶ redirect to /thank-you?payment_intent=…&redirect_status=succeeded
   │                                  └─ (on bail/decline → /support/canceled)
   ▼  asynchronously, source of truth:
POST /api/stripe/webhook  ──▶ payment_intent.succeeded ──▶ recordSupporter() + receipt
```

---

## My recommendation (read before coding)

**Use Stripe Elements (Payment Element) + PaymentIntents in *deferred* mode — not hosted Checkout,
not a raw card form.** Rationale:

1. **Keeps our design.** The Payment Element renders inside our warm-literary `/give` layout; we
   control everything around it. A raw `<input>` card form would be a PCI nightmare — never do that.
2. **PCI-light.** Card data is entered in **Stripe-hosted iframes** (the Payment Element). Your
   server/Worker never touches a card number → you stay **PCI SAQ-A**, the easiest tier.
3. **Variable amounts are first-class.** Our page has tiers **+ "any amount" + monthly**. *Deferred*
   mode lets Elements initialize with `{ mode: 'payment', amount, currency }`, update the amount live
   as the user changes tiers (`elements.update({ amount })`), and only create the PaymentIntent at
   confirm — so you never spawn PaymentIntents for abandoned forms.
4. **One integration, every method.** `automatic_payment_methods: { enabled: true }` lets the same
   Element offer cards, Apple/Google Pay, Link, etc. with no extra UI work.

**Phasing I recommend:**
- **Phase 1 (ship this):** one-time contributions (PaymentIntent). Wire tiers + any-amount. For the
  **monthly** toggle, either hide it or have it route to "contact us" — recurring needs Customers +
  Prices + Subscriptions and is more than a toggle. Don't block launch on it.
- **Phase 2:** recurring via `mode: 'subscription'` + a Customer + preconfigured Prices. Notes in §7.

---

## Env keys (you already have these)

Your `.env` has test + live, publishable + secret:
```
STRIPE_TEST_PUBLISHABLE_KEY=   STRIPE_TEST_SECRET_KEY=
STRIPE_LIVE_PUBLISHABLE_KEY=   STRIPE_LIVE_SECRET_KEY=
```
You'll **also** need a webhook signing secret per mode (add these):
```
STRIPE_TEST_WEBHOOK_SECRET=    STRIPE_LIVE_WEBHOOK_SECRET=
# optional explicit switch; otherwise we infer from NODE_ENV
STRIPE_MODE=test               # "test" | "live"
```

**Publishable key → browser:** the publishable key is safe to expose, but your var isn't prefixed
`NEXT_PUBLIC_`. **Don't rename it** — instead read it in a Server Component and pass it to the client
`<GiveForm>` as a prop (§4). That keeps your env names and avoids leaking the secret. (If you'd
rather, add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and skip the prop — your call. Prop is cleaner.)

---

## ⚠️ Cloudflare Workers / OpenNext gotchas (your runtime — important)

Your CLAUDE.md says deploy target is **OpenNext on Cloudflare**. The Stripe Node SDK and webhook
verification behave differently on the Workers runtime. Get these right or payments fail in prod:

1. **Use the Fetch HTTP client.** The default Node http client isn't available on Workers:
   ```ts
   new Stripe(secret, { httpClient: Stripe.createFetchHttpClient(), apiVersion: "2025-05-28.basil" });
   ```
2. **Verify webhooks with the *async* method.** Workers' Web Crypto is async:
   ```ts
   await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);  // NOT constructEvent()
   ```
3. **Read the raw body** for signature verification: `const body = await req.text();` (never parse to
   JSON before verifying).
4. **Node APIs:** if you hit "module not found: node:crypto/stream", set `nodejs_compat` in
   `wrangler.toml` compatibility flags (OpenNext usually enables this — confirm).
5. Pin `apiVersion` once in `lib/stripe/server.ts` and don't scatter it.

---

## 1. Server Stripe client + mode selection

`lib/stripe/server.ts`
```ts
import Stripe from "stripe";

const mode =
  process.env.STRIPE_MODE ??
  (process.env.NODE_ENV === "production" ? "live" : "test");
const live = mode === "live";

export const STRIPE_SECRET = live
  ? process.env.STRIPE_LIVE_SECRET_KEY!
  : process.env.STRIPE_TEST_SECRET_KEY!;

export const STRIPE_PUBLISHABLE = live
  ? process.env.STRIPE_LIVE_PUBLISHABLE_KEY!
  : process.env.STRIPE_TEST_PUBLISHABLE_KEY!;

export const STRIPE_WEBHOOK_SECRET = live
  ? process.env.STRIPE_LIVE_WEBHOOK_SECRET!
  : process.env.STRIPE_TEST_WEBHOOK_SECRET!;

export const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: "2025-05-28.basil",            // pin to your installed SDK's version
  httpClient: Stripe.createFetchHttpClient(), // REQUIRED on Cloudflare Workers
});
```

---

## 2. Amount validation (server-authoritative — never trust the client amount)

`lib/stripe/tiers.ts` — shared by the API and the UI so prices live in ONE place.
```ts
export const CURRENCY = "usd";
export const MIN_CENTS = 100;          // $1 floor for "any amount"
export const MAX_CENTS = 5_000_00;     // sane ceiling; adjust

// Only $175 is confirmed. Partner/Patron illustrative — TODO(tiers) confirm with Kevin.
export const TIER_AMOUNTS: Record<string, number | null> = {
  supporter: 175_00,
  partner: 500_00,
  patron: 1_500_00,
  custom: null, // any amount
};

/** Resolve a trustworthy amount in cents from a tier + optional custom amount. */
export function resolveAmountCents(tier: string, customCents?: number): number {
  const fixed = TIER_AMOUNTS[tier];
  if (fixed != null) return fixed;
  const c = Math.round(Number(customCents));
  if (!Number.isFinite(c) || c < MIN_CENTS || c > MAX_CENTS) {
    throw new Error("invalid_amount");
  }
  return c;
}
```

---

## 3. Create-PaymentIntent route (deferred — called at confirm)

`app/api/payment-intent/route.ts`
```ts
import { stripe } from "@/lib/stripe/server";
import { resolveAmountCents, CURRENCY } from "@/lib/stripe/tiers";

export const runtime = "nodejs"; // OpenNext maps to Workers; keep Node semantics for the SDK

export async function POST(req: Request) {
  try {
    const { tier, customCents, name, email, creditName, recurring } = await req.json();

    if (recurring) {
      // Phase 2 — see §7. For now, refuse so we don't half-charge.
      return Response.json({ error: "recurring_not_enabled" }, { status: 400 });
    }

    const amount = resolveAmountCents(tier, customCents);

    const pi = await stripe.paymentIntents.create({
      amount,
      currency: CURRENCY,
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      // metadata fuels the Supporters wall + the thank-you receipt. Keep it lean & PII-aware.
      metadata: {
        tier: String(tier),
        supporterName: (name ?? "").slice(0, 120),
        creditName: (creditName ?? "").slice(0, 120),
      },
    });

    return Response.json({ clientSecret: pi.client_secret });
  } catch (e: any) {
    const msg = e?.message === "invalid_amount" ? "invalid_amount" : "server_error";
    return Response.json({ error: msg }, { status: 400 });
  }
}
```

---

## 4. The `/give` page — wire our design to the Payment Element

Port `Give - The Silence Between Us.html` to `app/give/page.tsx`. Keep the **two-column layout**
(left: steps 01 tier / 02 details / 03 payment; right: sticky order summary with live benefits + the
Kevin quote + trust row). Steps 01–02 and the summary are exactly the mockup's interactive JS,
re-expressed in React state. **Step 03's fake card fields are replaced by `<PaymentElement>`.**

`app/give/page.tsx` (Server Component — reads publishable key, passes to client form)
```tsx
import type { Metadata } from "next";
import { STRIPE_PUBLISHABLE } from "@/lib/stripe/server";
import { GiveForm } from "@/components/site/give/give-form";

export const metadata: Metadata = {
  title: "Become a Founding Supporter",
  description: "Support The Silence Between Us. Secure checkout powered by Stripe.",
};

export default function GivePage({
  searchParams,
}: { searchParams: { tier?: string } }) {
  const initialTier = searchParams.tier ?? "supporter";
  return (
    <GiveForm publishableKey={STRIPE_PUBLISHABLE} initialTier={initialTier} />
  );
}
```

`components/site/give/give-form.tsx` (Client — the whole interactive checkout)
```tsx
"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { TIERS } from "@/content/tiers";          // from doc 04
import { CURRENCY } from "@/lib/stripe/tiers";

export function GiveForm({ publishableKey, initialTier }:{
  publishableKey: string; initialTier: string;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const [tier, setTier] = useState(initialTier);
  const [customDollars, setCustomDollars] = useState("");
  const [details, setDetails] = useState({ name: "", creditName: "", email: "" });

  const amountCents = useMemo(() => {
    const t = TIERS.find((x) => x.id === tier);
    if (t && t.amount != null) return t.amount * 100;
    const n = parseInt((customDollars || "").replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n * 100 : 0;
  }, [tier, customDollars]);

  // Elements needs a positive amount to init; default to $1 until the user picks.
  const elementsOptions = {
    mode: "payment" as const,
    amount: Math.max(amountCents, 100),
    currency: CURRENCY,
    appearance: WARM_APPEARANCE, // §5
  };

  return (
    <div className="mx-auto max-w-[1080px] px-7 py-10 md:py-[70px]">
      {/* … the mockup's header + two-column grid …
          LEFT: <TierPicker value={tier} onChange={setTier} custom={customDollars} onCustom={setCustomDollars} />
                <DetailsFields value={details} onChange={setDetails} />
                step 03 ↓ */}
      <Elements stripe={stripePromise} options={elementsOptions}>
        <PaymentStep
          tier={tier}
          amountCents={amountCents}
          details={details}
          customCents={amountCents}
        />
      </Elements>
      {/* RIGHT: <OrderSummary tier={tier} amountCents={amountCents} /> — live benefits + Kevin quote + trust row */}
    </div>
  );
}

function PaymentStep({ tier, amountCents, details, customCents }:{
  tier: string; amountCents: number; details: { name:string; creditName:string; email:string }; customCents: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pay() {
    if (!stripe || !elements || amountCents <= 0) return;
    setSubmitting(true); setErr(null);

    // 1) validate the Element
    const { error: submitErr } = await elements.submit();
    if (submitErr) { setErr(submitErr.message ?? "Check your details."); setSubmitting(false); return; }

    // 2) create the PaymentIntent now (deferred)
    const res = await fetch("/api/payment-intent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tier,
        customCents: tier === "custom" ? customCents : undefined,
        name: details.name, email: details.email, creditName: details.creditName,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.clientSecret) {
      setErr(data.error === "invalid_amount" ? "Please enter a valid amount." : "Something went wrong.");
      setSubmitting(false); return;
    }

    // 3) confirm → Stripe redirects to return_url
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: data.clientSecret,
      confirmParams: { return_url: `${window.location.origin}/thank-you` },
    });
    if (error) { setErr(error.message ?? "Payment could not be completed."); setSubmitting(false); }
  }

  return (
    <div>
      <PaymentElement options={{ layout: "tabs" }} />
      {err && <p className="mt-3 font-serif text-[15px] italic text-[#a23b2e]">{err}</p>}
      <button onClick={pay} disabled={submitting || amountCents <= 0}
        className="mt-4 w-full rounded-full border border-ink bg-gold py-4 font-serif text-[20px] italic text-ink hover:bg-gold-deep hover:text-paper disabled:opacity-60">
        {amountCents > 0 ? `Contribute $${(amountCents/100).toLocaleString()} securely →` : "Enter an amount to continue"}
      </button>
      <p className="mt-3 text-center font-serif text-[13.5px] italic text-muted-warm">
        Encrypted &amp; processed by Stripe. We never see your full card number.
      </p>
    </div>
  );
}
```

> **Amount changes:** `<Elements>` receives `options.amount`; when the user switches tier or types an
> "any amount", the option changes and the React wrapper calls `elements.update()` for you. No PI is
> created until `pay()`. Clean for variable amounts.

The **TierPicker**, **DetailsFields**, and **OrderSummary** are a direct React port of the mockup's
`#tiers`, fields, and `#benefits`/summary JS (tier → updates name, amount, benefit list, button
label; "any amount" focuses its input; monthly toggle — see §7). All styling uses the brand tokens
from doc 02. Pull the benefit lists + tier data from `content/tiers.ts` (extend it with the
per-tier benefit arrays shown in the mockup's `benefitSets`).

---

## 5. Make the Payment Element match the warm-literary look

Pass an `appearance` so Stripe's iframe fields feel native:
```ts
export const WARM_APPEARANCE = {
  theme: "flat" as const,
  variables: {
    fontFamily: "Newsreader, Georgia, serif",
    colorPrimary: "#b98a14",      // gold-deep
    colorBackground: "#ffffff",
    colorText: "#2c2620",         // ink
    colorTextSecondary: "#9a8c6f",// muted
    borderRadius: "6px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid #e3dccb", boxShadow: "none", padding: "12px 14px" },
    ".Input:focus": { border: "1px solid #b98a14", boxShadow: "0 0 0 3px rgba(243,195,59,.22)" },
    ".Label": { color: "#9a8c6f", fontStyle: "italic" },
  },
};
```

---

## 6. Update `SupportButton` → navigate to `/give`

Replace the doc 03 `SupportButton` body. It's now a **link** that carries the tier:
```tsx
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SupportButton({ tier = "supporter", className, children }:{
  tier?: "supporter"|"partner"|"patron"|"custom"; className?: string; children: React.ReactNode;
}) {
  return (
    <Link href={`/give?tier=${tier}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink bg-gold px-7 py-3",
        "font-serif italic text-[17px] text-ink transition-colors",
        "hover:bg-gold-deep hover:text-paper hover:border-gold-deep", className,
      )}>
      {children}
    </Link>
  );
}
```
No more `/api/checkout`, no fallback hash. The home tier rows pass `tier={t.id}`; the hero/final CTA
default to `supporter`. The home **`#support` anchor section can stay** as a secondary in-page recap,
but the primary CTAs now go to `/give`.

---

## 7. Webhook = source of truth (record supporters, send receipt)

Never fulfill on the thank-you redirect (users can close the tab). Fulfill in the webhook.

`app/api/stripe/webhook/route.ts`
```ts
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();                       // raw body — required
  if (!sig) return new Response("no sig", { status: 400 });

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET); // async on Workers
  } catch {
    return new Response("bad signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as any;
    await recordSupporter({               // TODO(data): persist to your store (D1/KV/Postgres)
      tier: pi.metadata?.tier ?? "custom",
      name: pi.metadata?.supporterName ?? "",
      creditName: pi.metadata?.creditName ?? "",
      amountCents: pi.amount_received ?? pi.amount,
      email: pi.receipt_email ?? null,
      stripePaymentIntent: pi.id,
      createdAt: new Date().toISOString(),
    });
    // TODO(email): send confirmation via Resend (locked stack). Stripe also emails the receipt if receipt_email set.
  }

  return new Response("ok");
}

async function recordSupporter(_row: unknown) { /* implement against your data layer */ }
```

- **Local testing:** `stripe listen --forward-to localhost:3000/api/stripe/webhook` → put the printed
  `whsec_…` in `STRIPE_TEST_WEBHOOK_SECRET`.
- **Prod:** add the endpoint in the Stripe Dashboard (live mode) → copy its signing secret to
  `STRIPE_LIVE_WEBHOOK_SECRET`. Subscribe to at least `payment_intent.succeeded` and
  `payment_intent.payment_failed`.
- The **Supporters wall** (doc 10) reads from whatever `recordSupporter` writes. Until the data layer
  exists, the wall uses placeholder data (already in its mockup) — wire it to real rows when ready.

**Monthly (Phase 2):** switch the toggle to create a `Customer`, attach a `Price` (preconfigured per
tier in the Dashboard), and a `Subscription` via `mode: "subscription"` Elements. Until then, keep
the toggle **hidden** or label it "Monthly giving — contact us" → `/contact`. Don't ship a toggle
that silently does nothing.

---

## 8. Done-criteria for the checkout slice

- [ ] `/give` renders our two-column design; tier/any-amount/summary update live (brand tokens only).
- [ ] Payment Element mounts, themed warm; test card `4242 4242 4242 4242` completes → lands on
      `/thank-you` with `redirect_status=succeeded`.
- [ ] Declined card (`4000 0000 0000 0002`) shows the inline error and does **not** redirect.
- [ ] Server validates amount (tamper a request → `invalid_amount`).
- [ ] Webhook verified with `constructEventAsync`; `payment_intent.succeeded` calls `recordSupporter`.
- [ ] `SupportButton` everywhere links to `/give?tier=…`; no `/api/checkout` references remain.
- [ ] `pnpm build` passes on the Workers target.

This is the one slice with real money + runtime-specific footguns — get §“Cloudflare gotchas” and the
**server-side amount validation** right before anything else.
