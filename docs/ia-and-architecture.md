# IA & Architecture — "The Silence Between Us" support site

Agreed build spec. Redesigns the JotForm (https://form.jotform.com/261476294934165) into a
conversion-focused **support landing page** for Kevin Cameron's film *The Silence Between Us*.

**Locked decisions (2026-06-03)**
- **Hosting/runtime:** **Cloudflare** via **OpenNext** (`@opennextjs/cloudflare`) + **Wrangler** — Workers
  runtime (not full Node); plan around it (see webhook note).
- **Package manager:** **pnpm**.
- **Payments:** Stripe **Checkout (hosted)**, `mode: "payment"` — **one-time only** (no subscriptions).
- **Giving:** preset tiers **+ a custom "any amount"** option.
- **Framing:** **rewards-style crowdfunding** — "Support / back the film / contribute." **Never** imply
  tax-deductibility (KC Films & Media is a for-profit LLC) and never imply financial return ("invest").
- **Email:** **Resend** (supporter confirmation; contact notify + auto-reply).
- **Contact spam:** **Google reCAPTCHA** (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY`).
- **UI:** shadcn + Base UI; pull premium blocks from **shadcnblocks / shadcn-studio Pro** where useful.
- Voice: [`docs/persona-kevin-cameron.md`](./persona-kevin-cameron.md). Portfolio data:
  [`content/portfolio.ts`](../content/portfolio.ts). Page plan: [`docs/portfolio-page-plan.md`](./portfolio-page-plan.md).

> ⚠️ Before writing any code, read the relevant guides in `node_modules/next/dist/docs/` (per
> `AGENTS.md`) — especially **Route Handlers**, **`next/image`** (v16 defaults changed), **metadata**,
> and **Server Actions**. Also review the **OpenNext → Cloudflare** docs (opennext.js.org/cloudflare)
> for the Workers runtime, `wrangler` config, and `next/image` handling on Cloudflare.

## Route map

```
app/
  layout.tsx                Header (logo + sticky "Support" CTA) + footer (+ crisis line) + base metadata
  page.tsx                  ★ LANDING — long-scroll persuasion → support
  thank-you/page.tsx        Stripe success_url. Verify session, confirm, set expectations, SHARE prompt
  support/
    page.tsx                (optional) focused, shareable tiers page Kevin can post/text
    canceled/page.tsx       Stripe cancel_url — soft "your contribution wasn't completed, try again"
  portfolio/page.tsx        Social proof (renders content/portfolio.ts) — see portfolio-page-plan.md
  contact/page.tsx          Contact form → Resend
  faq/page.tsx              Objection handling (also surfaced as a landing section)
  legal/
    terms/page.tsx
    privacy/page.tsx
    contributions/page.tsx  Contribution & refund policy (NOT a tax-receipt page)
  not-found.tsx             404
  error.tsx                 Client error boundary (unexpected app errors — NOT payment failures)
  global-error.tsx          Root error boundary
  api/
    checkout/route.ts         POST → create Stripe Checkout Session, return session.url
    webhooks/stripe/route.ts  POST → verify sig; on checkout.session.completed → Resend confirm + record
    contact/route.ts          POST → Resend (notify Kevin + auto-reply); reCAPTCHA + validation
```

Notes:
- **"Error" ≠ payment problem.** `error.tsx`/`global-error.tsx` handle app exceptions; a declined/abandoned
  payment goes to `/support/canceled`. Keep them distinct.
- `/support` page is optional; the primary flow is the tiers **section on the landing page**. Build the
  section first; promote to a standalone route only if Kevin wants a shareable link.

## Landing page sections (persuasion order)
1. Hero — title + one-line hook + emotional visual + primary **Become a Supporter** (+ "Watch the pitch")
2. The why — the silence between teens & parents; the stakes
3. The film — **teens first**: anxiety/depression in school + the silence with parents; raw, authentic, hopeful ("seen, heard, understood"). NOT "a movie about a teacher."
4. Meet the filmmaker — Kevin as trust/credibility (Prime feature, tour, youth/mental-health clients), **not** the protagonist; the teens stay the point
5. Proof — proof bar + partner wall (**lead with the mental-health orgs**) + Prime film → link to Portfolio
6. Where your support goes — transparency
7. **Support tiers** — presets + custom amount → Stripe Checkout
8. FAQ — objections (where it goes, security, is it tax-deductible [no], timeline, what you get)
9. Final emotional CTA
10. Footer — contact, portfolio, legal, socials, **crisis resources (988 Suicide & Crisis Lifeline)**

## Donation flow (Stripe Checkout, hosted, one-time)
1. User picks a tier or enters a custom amount on the landing tiers section.
2. Client `POST /api/checkout` with `{ tierId | amount }`.
3. Server validates amount server-side (never trust client price), creates a Checkout Session
   (`mode: "payment"`, line item, `metadata`, **custom field for "name in credits"**, collect email),
   `success_url = /thank-you?session_id={CHECKOUT_SESSION_ID}`, `cancel_url = /support/canceled`.
4. Redirect to `session.url`.
5. `/thank-you` retrieves the session (read-only display); **fulfillment is the webhook's job**.

**Webhook (`api/webhooks/stripe`)** — verify signature; on `checkout.session.completed`:
record the supporter (name, email, tier, amount, credit-name) and send the Resend confirmation.
Use the raw request body for signature verification. **On Cloudflare/Workers** there is no Node
`crypto`, so use **`stripe.webhooks.constructEventAsync(...)`** (Web Crypto) and instantiate the Stripe
SDK with the fetch HTTP client. Pick the live vs test keys/secret by environment.

### Proposed content model — `content/support.ts` (to add at build time)
```ts
export interface Tier {
  id: string;            // stable id used in checkout metadata
  name: string;          // "Founding Supporter"
  amount: number;        // cents, validated server-side
  perks: string[];
  highlight?: boolean;
}
export const tiers: Tier[] = [/* Tier 1 = $175 confirmed; rest TBD from Kevin */];
export const allowCustomAmount = true;
export const minCustomAmount = 1000; // $10
```
Known Tier 1 ($175) perks: on-screen "Supporter" credit · virtual meet & greet w/ director + principal
actors · Founding Supporters page listing · quarterly production updates · early/first-look trailer access.

## Email (Resend)
- **Supporter confirmation** (triggered by webhook): branded, in Kevin's voice, restates perks & next
  steps. Stripe's own receipt covers the financial record; ours is the human thank-you.
- **Contact form:** notify `CONTACT_TO_EMAIL` (kevin@kcfilmsmedia.com) + auto-reply to sender;
  Google reCAPTCHA + server-side validation for spam.

## Copy & framing rules
- Use **Support / Back the film / Contribute / Become a Supporter**. Avoid "Donate/Donation" as the
  primary verb and **never** "tax-deductible." Avoid "invest/return/equity."
- Treat perks as **rewards** (crowdfunding), framed as participation/belonging — not charity (per persona).
- Mental-health topic: respectful, hopeful tone; include the **988** crisis line in the footer.

## Environment variables (canonical names live in `.env.example`; real values only in `.env.local`)
```
# Site
NEXT_PUBLIC_SITE_URL=
# Stripe — test (dev) + live (launch). Publishable keys optional w/ hosted Checkout.
STRIPE_SECRET_KEY=                STRIPE_PUBLISHABLE_KEY=
STRIPE_LIVE_SECRET_KEY=           STRIPE_LIVE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=            STRIPE_LIVE_WEBHOOK_SECRET=   # ← ADD: required for fulfillment
# Resend
RESEND_API_KEY=   CONTACT_FROM_EMAIL=   CONTACT_TO_EMAIL=
# Contact spam — Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=   RECAPTCHA_SECRET_KEY=
# Cloudflare deploy (OpenNext + Wrangler)
CLOUDFLARE_ACCOUNT_ID=   CLOUDFLARE_API_TOKEN=
# Build/design tooling (already present): SHADCNBLOCKS_*, SHADCNSTUDIO_*, STITCH_WITHGOOGLE_API_KEY
```

## Suggested build order
0. **Tooling** — migrate npm → **pnpm**; add **OpenNext + Wrangler** (`@opennextjs/cloudflare`,
   `wrangler.jsonc`, `open-next.config.ts`); verify `pnpm dev` and the Cloudflare preview/deploy;
   update CLAUDE.md commands to pnpm.
1. **Foundation** — `layout.tsx` (header/footer, crisis line), design tokens already in `app/globals.css`;
   add shadcn `Card`, `Badge`, `Accordion`, `Input`, `Label` via CLI (+ shadcnblocks where useful).
2. **Landing** — sections 1–10 with static content (+ portfolio data) and CTA buttons (no payment yet).
3. **Stripe** — `api/checkout` + tiers UI + `/thank-you` + `/support/canceled` + `content/support.ts`.
4. **Webhook + Resend** — fulfillment + branded confirmation (Workers async verify).
5. **Contact + FAQ + legal** — Resend contact flow w/ reCAPTCHA; FAQ; Terms/Privacy/Contributions.
6. **Portfolio page** — from `content/portfolio.ts` (per `portfolio-page-plan.md`).
7. **Polish** — `not-found`/`error`/`global-error`, metadata + OG images, a11y, analytics.

## Open content gaps (need from Kevin — not blockers to start)
Full **tier ladder + amounts** (only Tier 1 = $175 known), **fundraising goal/deadline**, the
**name-in-credits** field timing (recommend Stripe Checkout custom field), and the verified **Resend
sending domain**. Also still owed: the two **`STRIPE_*_WEBHOOK_SECRET`** values once endpoints exist.
