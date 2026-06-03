# 14 · Legal Pages (`/legal/terms`, `/legal/privacy`, `/legal/contributions`)

Reference mockups:
- `legal/Terms of Use.html` → `app/legal/terms/page.tsx`
- `legal/Privacy Policy.html` → `app/legal/privacy/page.tsx`
- `legal/Contribution Terms.html` → `app/legal/contributions/page.tsx`

All three share **one template** — build it once, feed content per page.

## Shared template

`components/site/legal/legal-layout.tsx` — props: `title`, `updated`, `toc` (array of
`{id,label}`), `current` ("terms"|"privacy"|"contributions"), and children (the document body).

It renders, from the mockup:
1. **Masthead** (or just the shared `<SiteHeader>` — pick one; the mockups use a centered masthead,
   but using the site header is more consistent now that there's a navbar).
2. **Header** — "Legal" eyebrow, page `title`, "Last updated" date.
3. **Pill nav** across the three legal routes (current highlighted gold).
4. **Rule** (gold diamond).
5. **Two-column body** — sticky **numbered Table of Contents** (left) + the **auto-numbered document
   sections** (right). Section headings use the counter style; gold-diamond list bullets.
6. **Footer** — the shared `<SiteFooter>` (with 988).

Section content is just semantic markup (`<section id> <h2> <p> <ul>`); the numbering is CSS
counters (carry over the mockup's `.doc` counter styles into a scoped module or globals).

## Content

Port the body copy verbatim from each mockup. **Keep the "Draft for review" banner on every page** —
these are plain-language starting points and must be reviewed by counsel. Do not quietly delete it.

Key cross-links already in the copy: terms ↔ privacy ↔ contributions, and "contact page" →
`/contact`. Rewrite per doc 06.

## ⚠️ Must stay consistent with locked decisions

- **Contribution Terms** frames contributions as **gifts / rewards crowdfunding** — *not* investments,
  *not* tax-deductible. Keep the highlighted tax callout ("consult your advisor; KC Films
  administers"). This matches the locked "rewards crowdfunding" framing — don't soften it into
  "donation to a cause."
- Governing law shows **Ohio** (inferred from Cleveland). `TODO(legal-confirm)`: confirm the
  registered entity's state.
- The $175 Supporter benefits listed in Contribution Terms must match `content/tiers.ts`
  (single source). If you change tier copy, change it here too — or better, render the benefit list
  from the same data.

## Mechanics

- Each page: `metadata.title` = "Terms of Use" / "Privacy Policy" / "Contribution Terms".
- Static Server Components.
- `pnpm build` passes; the pill nav highlights the current page; TOC anchors scroll to sections.

---

## That's the full set

With docs **08–14** you can build every remaining route. Recommended order after the home page is
approved: **About (07) → Give + Stripe (08) → Thank-You (12) → Canceled (13) → Supporters (10) →
Portfolio (09) → Contact (11) → Legal (14).** Build Give/Thank-You/Canceled as one slice since they
share the payment flow. Stop after each page and let the human review, per their working style.
