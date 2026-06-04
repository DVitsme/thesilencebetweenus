# Email program + design brief — *The Silence Between Us*

This file is **two things**:
1. The complete **inventory** of every email the site sends (grounded in the codebase).
2. A **design brief for claude.ai** — hand it this whole file; it designs the templates and gives
   the files back; we then wire each into its trigger here. **Deliverable format is below — please
   read "Deliverable format" + "Email technical constraints" before designing.**

> Sources: `docs/ia-and-architecture.md` §Email · `app/thank-you/page.tsx` ("what happens next") ·
> `content/tiers.ts` (perks) · `app/api/stripe/webhook/route.ts` (`TODO(email)`) · `app/api/contact/route.ts` ·
> `app/faq/page.tsx` · brand tokens from `app/globals.css` · voice from `docs/persona-kevin-cameron.md`.

---

## How emails are sent (two mechanisms)

- **Transactional** — one recipient, triggered by an event. Sent with Resend `emails.send` (already
  proven by the contact route). No unsubscribe needed.
- **Broadcast** — all supporters, a campaign (quarterly updates, trailer). Needs an **audience/list +
  unsubscribe + a physical mailing address** (CAN-SPAM). Mechanism = **Resend Audiences/Broadcasts**.
  The recipient list already exists: the D1 `supporters` table stores each supporter's `email`.

---

## Brand & voice (must match the site)

- **Register:** warm-literary, **serious & credible** — *not* the spoken catchphrases ("true to this,"
  "yes sir" — those are for social/video, never the site or email).
- **Framing:** **rewards crowdfunding** — "support / back / contribute / Founding Supporter." **Never**
  "donation," "tax-deductible," or "invest/return."
- **Subject:** the film is about **the teens** carrying anxiety/depression in silence (a teacher is the
  guiding light) — *not* "a movie about a teacher."
- **Sensitivity:** mental-health topic → hopeful, respectful. Include the **988** crisis line in the
  footer of every email: *"If you or someone you know is struggling, call or text 988."*
- **Belonging, not charity:** supporters are **co-producers** earning permanent recognition.

---

## Visual system (email-safe values)

Site uses oklch; **email clients need hex** — use these:

| Token | Hex | Use |
| --- | --- | --- |
| paper | `#f7f3ea` | page background |
| card / white | `#ffffff` | content cards |
| tint | `#f1ebdd` | quote/aside bands |
| ink | `#2c2620` | body text / headings |
| ink-soft | `#5e564a` | secondary text |
| muted-warm | `#9a8c6f` | captions, eyebrows |
| **gold** | `#f3c33b` | primary buttons, seals, accents |
| **gold-deep** | `#b98a14` | links, button hover, "since" labels |
| line | `#e3dccb` | hairline borders / rules |
| dark | `#211d17` | dark CTA band background |
| on-dark | `#efe9da` | text on the dark band |
| on-dark-muted | `#b9ad93` | muted text on dark |

- **Type:** the site font is **Newsreader** (serif), but custom fonts don't load reliably in email →
  use the email-safe fallback **`Georgia, 'Times New Roman', serif`** everywhere (keeps the literary
  feel). Headings serif, larger, tight tracking; body ~16–18px, line-height ~1.55.
- **Layout:** single column, **600px max**, centered on `paper`, generous whitespace. A small serif
  **wordmark** "The Silence Between Us" as the header (no logo asset exists — text wordmark is fine).
  Confirmations use a **gold circular "seal"/checkmark** motif (mirrors `/thank-you`).
- **Buttons:** pill-shaped, `gold` bg / `ink` text (primary); outline `ink` (secondary). Must be
  "bulletproof" (table/VML-safe) — React Email's `<Button>` handles this.
- **Footer (every email):** wordmark · contact `kevin@kcfilmsmedia.com` · the **988** line ·
  "© KC Films & Media." **Broadcasts also need:** unsubscribe link + physical mailing address.

---

## Email technical constraints (email ≠ web — please honor)

- **Inline styles only**; no external/`<style>`-dependent CSS, no JS, no web fonts assumed.
- **No fl/grid** (Outlook/Windows) — use tables / React Email `<Section>`/`<Row>`/`<Column>`.
- **Images:** absolute `https://` URLs + **alt text**; never rely on images loading (no image-only text).
- **600px** container; mobile-friendly (single column scales down).
- **Dark-mode aware** (don't put dark text on a transparent bg that inverts badly).
- Provide a **plain-text version** for each (deliverability) — React Email can auto-generate, or write one.
- **Accessible:** real text, alt text, AA contrast, semantic headings, `lang`, preview text.

---

## Deliverable format (so the files drop straight into our stack)

We send via **Resend**, so the ideal output is **React Email** (`@react-email/components`) — Resend
renders it natively with `resend.emails.send({ react: <Template {...props} /> })`.

**Please deliver:**
1. One component per template in an **`emails/`** folder, e.g. `emails/supporter-confirmation.tsx`.
2. A **default export** + a **typed `Props` interface** whose fields match the "Merge fields" listed
   per template (these are what we'll populate from the data).
3. A shared **`emails/components/shell.tsx`** (brand header wordmark + footer, incl. the 988 line and
   a slot for the broadcast unsubscribe/address) reused by every template — so the look stays consistent.
4. For each template, also give us the **subject line** + **preview text** (and a plain-text fallback if
   not auto-generated). Put example/`PreviewProps` data on each component so the react-email preview
   server renders it.
5. Use `@react-email/components` primitives: `Html, Head, Preview, Body, Container, Section, Row,
   Column, Heading, Text, Button, Link, Hr, Img`.

*Acceptable alternative if you'd rather design in plain HTML:* responsive **table-based HTML** with
inline styles and `{{merge_field}}` placeholders (same field names) — we'll convert it to a render
function. React Email is strongly preferred.

**Hand-back:** drop the `emails/` files into the repo (or share them) and ping me — I'll wire each
template to its trigger (webhook / route / broadcast), pass the real data into its props, add the
subject + plain-text, and test a live send to `derrick@digitaldog.io`.

---

## Templates to design

Priority: **P1** build now · **P2** soon · **P3** broadcast (after consent decided) · **Ops** low-volume,
design only if quick · **Conditional** only if recurring is enabled.

### P1 · Supporter confirmation — the "human thank-you"  `emails/supporter-confirmation.tsx`
- **Trigger:** Stripe webhook `payment_intent.succeeded` (transactional). This is the warm, branded
  thank-you — **Stripe sends the separate financial receipt**; ours restates perks + next steps.
- **Recipient:** the supporter.
- **Subject (example):** *"You're a Founding Supporter of The Silence Between Us"*
- **Preview text:** *"Your name is already part of this film — here's what comes next."*
- **Content:** gold seal/check → "Thank you, **{firstName}** — you're a Founding Supporter." → a small
  receipt-confirm block (**Tier {tierName} · {amountFormatted} · credit name "{creditName}" · ref
  {receiptRef}**) → **"What happens next"** timeline (Right now → your name joins the wall; This week →
  we email to schedule your meet & greet; Every quarter → production updates; Before release → first
  look at the trailer; In the film → your on-screen credit) → primary CTA **"Find your name on the
  wall →"** ({wallUrl}) → a one-line note from Kevin → footer. Tier governs which perks appear.
- **Merge fields (props):** `firstName, creditName, tierName, amountFormatted, receiptRef, wallUrl`.

### P1 · Contact auto-reply  `emails/contact-autoreply.tsx`
- **Trigger:** `/api/contact` (transactional) — sent to the person who used the form, alongside the
  existing team notification.
- **Subject (example):** *"We got your message — The Silence Between Us"*
- **Preview text:** *"Thanks, {firstName} — we read every note and reply personally."*
- **Content:** "Thanks for reaching out, **{firstName}**." → we received your **{inquiryLabel}** message
  and reply personally (usually within a few days) → if it's urgent, email **{contactEmail}** → warm
  sign-off → footer. (Optional: echo their message in a quoted block.)
- **Merge fields:** `firstName, inquiryLabel, contactEmail` (optional `messageQuote`).

### P2 · Internal "new contribution" alert  `emails/internal-new-contribution.tsx`
- **Trigger:** same webhook, sent **to the team** (`CONTACT_TO_EMAIL`) so Kevin can fulfill perks
  (Patron call, screening invites, etc.). Utility email — scannable, not marketing.
- **Subject (example):** *"New contribution: {tierName} — {amountFormatted} ({creditName})"*
- **Content:** a tidy key/value block: credit name, full name, tier, amount, email, receipt ref, time.
- **Merge fields:** `creditName, supporterName, tierName, amountFormatted, email, receiptRef, createdAt`.

### P2 · Refund / cancellation confirmation  `emails/refund-confirmation.tsx`
- **Trigger:** a refund is issued (transactional). There is a Contribution & refund policy page.
- **Subject (example):** *"Your contribution has been refunded"*
- **Content:** confirm **{amountFormatted}** refunded to the original method (ref **{refundRef}**,
  5–10 business days) → warm, no-hard-feelings note → contact for questions → footer.
- **Merge fields:** `firstName, amountFormatted, refundRef, contactEmail`.

### P3 · Quarterly production update  `emails/production-update.tsx`  **[BROADCAST]**
- **Trigger:** a campaign to **all supporters**. Reusable editorial layout with content slots.
- **Subject (example):** *"From the set: {title}"*  · **Preview:** *"Dispatch {dispatchLabel} from production."*
- **Content:** hero image → "**Dispatch {dispatchLabel} from production**" → headline {title} →
  editorial body (headings, paragraphs, inline images — design flexible content blocks) → a milestone
  highlight or two → optional CTA → **footer with unsubscribe + mailing address**.
- **Merge fields:** `firstName, dispatchLabel, title, heroImageUrl, bodyBlocks, ctaUrl?, ctaLabel?,
  unsubscribeUrl, mailingAddress`.

### P3 · Trailer first-look  `emails/trailer-first-look.tsx`  **[BROADCAST]**
- **Trigger:** one-time broadcast to all supporters, before public release.
- **Subject (example):** *"Watch first: the trailer for The Silence Between Us"*
- **Content:** thumbnail with a play affordance → "As a Founding Supporter, you see it **first**." →
  **"Watch the trailer →"** ({trailerUrl}) → a line inviting them to share → unsubscribe footer.
- **Merge fields:** `firstName, trailerUrl, thumbnailUrl, unsubscribeUrl, mailingAddress`.

### Ops · low-volume fulfillment (design only if quick — otherwise hand-sent)
Simple branded layouts sharing the shell; mostly `{firstName, tierName, …}`:
- **Meet & greet invite** — `schedulingUrl`, date options.
- **Screening invite + tickets** (Partner premiere-tour / Patron private screening) — `eventDetails, ticketUrl`.
- **Credit confirmation** — confirm `{creditName}` as it'll appear in the film.
- **Patron call scheduling** — `schedulingUrl`.

### Conditional · only if monthly/recurring is enabled (currently OFF)
Out of scope unless Kevin turns on recurring (a decisions-for-kevin item): per-charge **subscription
receipt**, **renewal reminder**, **card-expiring** notice, **failed-payment dunning**, **cancellation**.

---

## Open decisions that affect these (tracked in `docs/decisions-for-kevin.md` §8)
1. Keep Stripe's receipt + our branded confirmation, or also send our own itemized receipt?
2. Consent + unsubscribe + mailing address for broadcasts (quarterly/trailer).
3. Sender addresses — transactional `hello@…` vs broadcast `updates@`/`kevin@` (verified domain).
4. Automate vs hand-send the Ops fulfillment perks.

## Wiring map (for me, once templates return)
| Template | Wired into |
| --- | --- |
| supporter-confirmation | `app/api/stripe/webhook/route.ts` (`TODO(email)`) → `resend.emails.send({ react })` |
| contact-autoreply | `app/api/contact/route.ts` (2nd send, to the submitter) |
| internal-new-contribution | same webhook, `to: CONTACT_TO_EMAIL` |
| refund-confirmation | a `charge.refunded` webhook branch (to add) |
| production-update / trailer-first-look | Resend Broadcast over the D1 supporter audience |
