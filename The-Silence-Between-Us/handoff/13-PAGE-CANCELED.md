# 13 · Canceled / Payment-Not-Completed Page (`/support/canceled`)

Reference mockup: **`Payment Canceled - The Silence Between Us.html`** → `app/support/canceled/page.tsx`.
(Route name `/support/canceled` matches your `docs/ia-and-architecture.md`.)

The reassuring counterpart to thank-you. With the custom Payment Element flow (doc 08), a hard
"cancel" is less automatic than hosted Checkout — reach this page when:
- the user explicitly backs out of `/give`, or
- a redirect returns a non-success status you choose to route here, or
- you link here from the thank-you page's failure branch.

## Tone & sections (from mockup)

- **Reassure first:** soft "↻" seal (not an alarming red ✗), "No payment went through — and that's
  okay," and a prominent **"Your card was not charged"** pill.
- **Common reasons** — four no-blame items (typo, bank precaution, card limit, window closed), each
  with a one-line fix.
- **A gentle note from the team** — keeps their place among Founding Supporters open.
- **Two ways forward** — "Return to checkout" → `/give` (primary, gold) + a contact/email card.

## Mechanics

- `metadata`: `title: "Payment not completed"`, `robots: { index: false }`.
- Static Server Component. "Return to checkout" → `/give` (optionally preserve `?tier=` if you pass
  it through).
- Brand tokens only; reuse `Eyebrow`, buttons, the seal/pill patterns.
- `pnpm build` passes.
