# 00 · START HERE — Design Handoff for *The Silence Between Us*

> **You are the local Claude Code instance working in the `silence-between-us` repo.**
> This folder is a **design handoff** produced from approved HTML mockups (the warm-literary
> direction). Your job for this pass: **replace the placeholder landing with the real, designed
> home page — and stop there.** Do not build other routes yet. The human will tell you when to
> build About (see `07-ABOUT-PAGE-NEXT.md`).

---

## How to use this folder

Read these docs **in order**, top to bottom. Each builds on the last. Don't skip ahead.

| # | File | What it gives you |
|---|------|-------------------|
| 00 | **`00-START-HERE.md`** (this file) | Rules of engagement, scope, success criteria |
| 01 | `01-DESIGN-SYSTEM.md` | The warm-literary visual language: color, type, spacing, component vocabulary |
| 02 | `02-GLOBALS-CSS-PATCH.md` | Exact CSS to merge into `app/globals.css` (brand tokens + shadcn remap + font) |
| 03 | `03-LAYOUT-HEADER-FOOTER.md` | `app/layout.tsx`, `<SiteHeader>` (navbar), `<SiteFooter>` (incl. **988** line), metadata, fonts |
| 04 | `04-HOME-PAGE.md` | Paste-ready section components + `app/page.tsx` that composes them |
| 05 | `05-DIFF-CURRENT-REPO.md` | Current repo state → target. What to overwrite, what to delete, how to verify |
| 06 | `06-ROUTE-AND-LINK-MAP.md` | Which mockup file maps to which route; how to rewrite internal links |
| 07 | `07-ABOUT-PAGE-NEXT.md` | **Do not act on this yet.** The next milestone, for when the human says go |
| 08 | `08-CHECKOUT-CUSTOM-GIVE.md` | **Checkout change** + Stripe recommendation, `/give` build, PaymentIntent route, webhook, Cloudflare gotchas |
| 09 | `09-PAGE-PORTFOLIO.md` | `/portfolio` build notes |
| 10 | `10-PAGE-SUPPORTERS.md` | `/supporters` build notes (reads webhook data) |
| 11 | `11-PAGE-CONTACT.md` | `/contact` build notes (Resend + reCAPTCHA wiring) |
| 12 | `12-PAGE-THANK-YOU.md` | `/thank-you` — Stripe success `return_url` |
| 13 | `13-PAGE-CANCELED.md` | `/support/canceled` build notes |
| 14 | `14-PAGES-LEGAL.md` | `/legal/{terms,privacy,contributions}` shared template |

> **Docs 08–14 are for later milestones**, not the home-page pass. They exist so each subsequent
> page is a short, clean task when the human points you at it. Build the home page first (docs
> 00–06), stop, and hand back.

The **mockup HTML files** (the source of truth for layout and copy) sit alongside these docs:

```
Home - The Silence Between Us.html          ← THIS pass: becomes app/page.tsx
About Kevin Cameron - The Silence Between Us.html
Portfolio - The Silence Between Us.html
Give - The Silence Between Us.html           ← visual ref only — see note below
Supporters - The Silence Between Us.html
Thank You - The Silence Between Us.html
Payment Canceled - The Silence Between Us.html
Contact - The Silence Between Us.html
legal/Terms of Use.html
legal/Privacy Policy.html
legal/Contribution Terms.html
```

Open `Home - The Silence Between Us.html` in your reader now and keep it open — it is the
**pixel + copy reference** for everything in docs 03–04. The handoff docs translate it into your
stack; when in doubt, the HTML wins on *layout and copy*, these docs win on *stack mechanics*.

---

## Scope of THIS pass (do exactly this, then stop)

✅ **In scope**
1. Merge the design tokens + font into `app/globals.css` (doc 02).
2. Write the real `app/layout.tsx` with `<SiteHeader>` + `<SiteFooter>` + metadata + fonts (doc 03).
3. Build the home page as composed section components and wire them into `app/page.tsx` (doc 04).
4. Delete the placeholder Hero 30 block and the leftover demo route (doc 05).
5. Verify: `pnpm dev` renders the designed home page; `pnpm build` passes.

🚫 **Out of scope (do NOT do now)**
- `/about`, `/portfolio`, `/supporters`, `/contact`, `/thank-you`, `/support/canceled`, `/legal/*`
- Stripe checkout API, webhooks, Resend, reCAPTCHA wiring
- Committing (your CLAUDE.md says commit only when asked)

When the home page renders and builds clean, **summarize what changed and hand back to the human.**
Then wait. The human will review the home page and then point you at `07-ABOUT-PAGE-NEXT.md`.

---

## Rules of engagement (reconcile design ↔ your locked decisions)

These mockups were designed before some of your locked decisions were finalized. Where they
conflict, **your CLAUDE.md / `docs/` decisions win on behavior; the mockups win on look & copy.**
Specific reconciliations — apply these, don't re-litigate them:

1. **Custom `/give` page (UPDATED 2026-06-03), not hosted Checkout.** `Give - The Silence Between
   Us.html` is now the **real checkout** we build with Stripe **Elements** — see
   `08-CHECKOUT-CUSTOM-GIVE.md`. For the home page, all "Support / Choose tier / Contribute" CTAs are
   `<SupportButton>`s that **link to `/give?tier=…`** (doc 08 §6). No checkout API and no on-page card
   form are built in the home pass; you only build `/give` + Stripe when you reach doc 08.

2. **988 in the footer (required).** The mockup footer omits it. Doc 03's `<SiteFooter>` **adds the
   988 Suicide & Crisis Lifeline line** — keep it. This is non-negotiable per your guide.

3. **Copy register: serious sales, teens-first, no spoken catchphrases.** The *home* copy in the
   mockup is already on-register (it leads with the teenagers, no catchphrases) — use it close to
   verbatim. ⚠️ Other pages (esp. About) use Kevin's spoken catchphrases ("true to this", "what are
   we waiting for") — those are flagged for adaptation in doc 07. Not your problem this pass.

4. **Framing = rewards crowdfunding.** Keep "support / back / contribute / become a Supporter."
   Never introduce "donate to a cause," "tax-deductible," or "invest." The mockup already follows this.

5. **Partner/Patron amounts are placeholders.** The mockup shows **$175 (confirmed)**, plus
   **$500 / $1,500 illustrative**. Render them as data from a single source (doc 04 puts them in one
   `TIERS` array) and leave a `TODO(tiers)` note. Only $175 is real.

6. **Fonts.** The mockups use **Newsreader** (Google). Doc 03 wires it via `next/font/google` and
   makes it the body font. Don't hand-link Google Fonts in HTML.

7. **Next.js 16 reality.** Per your CLAUDE.md, read
   `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` first. The home page is a
   static Server Component (no async request APIs needed). Client interactivity (sticky-nav shadow,
   mobile menu, support button) goes in small `"use client"` leaf components — doc 03/04 mark them.

---

## Success criteria (how you know you're done with this pass)

- [ ] `pnpm dev` → `/` shows the warm-literary home page matching `Home - The Silence Between Us.html`
      (hero, full-bleed still, story w/ drop cap, pull quote, teacher split, filmmaker, dark proof
      band, endorsements, tier table, gold final CTA, 4-col footer **+ 988 line**).
- [ ] Sticky navbar: logo left, links + gold **Support** button right; gains shadow on scroll;
      collapses to a menu under ~880px.
- [ ] All brand colors come from CSS tokens (no hard-coded hex in components).
- [ ] Newsreader renders site-wide via `next/font`.
- [ ] The old **Hero 30** block and its demo route are deleted; nothing imports them.
- [ ] `pnpm build` passes (allow ~3 min TS step per your CLAUDE.md).
- [ ] No new routes created. No checkout/email/captcha code added.

Now go to **`01-DESIGN-SYSTEM.md`**.
