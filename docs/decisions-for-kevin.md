# Decisions to confirm with Kevin

> Running list of every open decision/input the site is waiting on from **Kevin**.
> Each item notes **why it matters / what it unblocks** so we can prioritize the
> conversation, plus the **current placeholder** so nothing ships as a guess.
>
> **How to use:** walk this top-to-bottom with Kevin. When an answer lands, check the
> box and write the answer inline (`→ ANSWER: …`), then clear the matching `TODO()` in code.
>
> **Priority:** 🔴 blocks launch · 🟡 needed to finish an already-built feature · 🟢 polish (can ship without)
>
> Companion to `docs/build-plan.md` (what *we* build) — this is **what we need from Kevin**.

---

## 1 · Payments & pricing

- [ ] 🔴 **Full tier ladder + amounts.** Only **Supporter = $175** is confirmed. **Partner ($500)**
  and **Patron ($1,500)** are *illustrative guesses*. Need: how many tiers, their names, exact
  prices, and the perks per tier.
  *Unblocks:* home tier table, `/give` checkout, contribution terms, the wall's tier buckets.
  *Code:* `content/tiers.ts` (`TODO(tiers)`).

- [ ] 🔴 **Which payment methods do we accept?**
  - One-time only, or also **recurring / monthly**? *(Recurring is currently turned off — the site
    refuses it; enabling it is additional build work.)*
  - Turn on **Apple Pay / Google Pay / Link** (one-tap wallets — easy to enable, lifts conversion)?
  - **Bank debit (ACH) / Cash App Pay**?
  - The old JotForm used **Zelle** (216-308-4427). Keep a Zelle / offline path, or **Stripe-only**?
  *Current:* card + whatever's enabled in the Stripe dashboard, one-time only.

- [ ] 🔴 **Whose Stripe account + what shows on the card statement?** Confirm contributions land in
  the correct account and that supporters see a **recognizable name** on their statement (the account
  currently reads **"Digital Dog"**). A confusing descriptor → chargebacks. Decide the business name /
  statement descriptor (e.g., *KC Films Media* / *The Silence Between Us*).

- [ ] 🟡 **Fundraising goal?** Is there a public target $ amount (for a progress bar on the home page)?
  If so, what number — and is it shown publicly?

- [ ] 🟢 **Custom "any amount" limits.** Currently **$1 min / $5,000 max**. OK, or raise the ceiling so
  a large one-off gift can go through? *Code:* `lib/stripe/tiers.ts`.

---

## 2 · The Supporter Wall (recognition)

- [ ] 🟡 **Who gets listed?** Every contributor (all tiers + custom amounts), or only certain tiers?
- [ ] 🟡 **What name do we publish?** We show **only the credit name** the supporter types at checkout —
  never their email or amount. If they leave it blank → **omit them**, or show a generic
  *"A Founding Supporter"*?
- [ ] 🟡 **Anonymous / opt-out?** Can a supporter choose **not** to appear on the wall? *(If yes, we add
  an opt-out checkbox to the `/give` form and store the preference.)*
- [ ] 🟡 **Where do custom / any-amount gifts appear?** Which tier label on the wall? *(Planned default:
  "Supporter.")*
- [ ] 🟢 **Edits / removal.** What's the process if someone later wants their listed name changed or removed?
- *Note:* the wall ships **empty** at launch (real names only, with a "Your name here" prompt). The demo
  names currently in the design are **invented** and will **not** be published.

---

## 3 · Contact details (`/contact`)

- [ ] 🟡 **Public phone number.** Publish **216-308-4427**? It came from the original form's **Zelle**
  number — confirm it's OK as a public contact line, or give a different one. *Code:* `app/contact` (`TODO(contact-confirm)`).
- [ ] 🟡 **Production location.** Show **Cleveland** or **Tampa**? *(persona/notes conflict.)*
- [ ] 🟡 **Facebook / socials.** Real URL(s) to link?
- [ ] 🟢 **Contact email.** Confirm **kevin@kcfilmsmedia.com** is correct and monitored.

---

## 4 · Copy & tone

- [ ] 🟡 **"Donations" wording.** The site deliberately avoids "donation / tax-deductible" (it's *rewards
  crowdfunding* — "support / back / contribute"). The footer + contact admin note still carry placeholder
  "Donations…" wording — confirm the exact phrasing Kevin is comfortable with.
- [ ] 🟡 **Endorsements.** Provide real endorsement quotes + names, or we cut the section. *Code:*
  `components/site/home/endorsements.tsx` (`TODO(endorsements)`).
- [ ] 🟢 **Faith dial.** Copy is currently **"crossover"** (faith-aware, not overtly religious). Confirm
  how faith-forward to go.
- [ ] 🟢 **Teens-first framing.** Confirm the film is pitched as **about the teens** (not "a movie about a teacher").

---

## 5 · Media & timing

- [ ] 🔴 **Trailer / pitch video.** Needed — the home hero and the thank-you page's "we'll send you the
  trailer" both reference it.
- [ ] 🟡 **Real imagery.** Portrait, classroom, and film stills to replace the placeholders on home/about.
- [ ] 🟡 **Release window.** When is the film expected? (Copy references timing.)

---

## 6 · Legal

- [ ] 🔴 **Legal entity / who is collecting.** The business name behind the contributions (for the terms
  pages + the Stripe account). Ties to the statement-descriptor item in §1.
- [ ] 🟡 **Governing-law state.** For the Terms / Privacy / Contribution-terms pages.
- [ ] 🟡 **Refund / cancellation policy.** Rewards-crowdfunding stance: what do we promise if the film is
  delayed or doesn't happen, and is there a refund window?

---

## 7 · Launch — accounts & domain

- [ ] 🔴 **Production domain.** The live URL (drives page metadata, share links, sitemap). *Code:*
  `app/layout.tsx`, `app/thank-you/page.tsx` (`TODO(domain)`).
- [ ] 🟡 **Email sending domain.** Which domain sends the contact-form emails (must be verified in **Resend**).
- [ ] 🟡 **reCAPTCHA.** We generate the keys (free) — no Kevin input needed; listed for awareness.
- [ ] 🔴 **Go-live.** Stripe **live** keys + live webhook endpoint, once tiers/payments are finalized.

---

### Resolved
*(Move answered items here with their answer + date, e.g. `✅ Supporter tier = $175 — 2026-05-xx`.)*
