# 10 · Supporters Wall (`/supporters`)

Reference mockup: **`Supporters - The Silence Between Us.html`** → `app/supporters/page.tsx`.

Double duty: it's the **permanent recognition** every tier was promised **and** the strongest social
proof on the site. It reads from the same data the checkout webhook writes (doc 08 §7).

## Sections

1. **Hero** — eyebrow, "Our Founding Supporters," lede, + **live counts** (total, patrons+partners,
   founding year). Counts are **computed from the data**, not hard-coded.
2. **Sticky controls** — search box + tier filters (All / Patron / Partner / Supporter) + an
   always-visible **"+ Add your name"** button → `/give`.
3. **The Founding Circle** — Patrons as featured dark cards (gold top-rule).
4. **Partners & Supporters grid** — name cards; Partners subtly distinguished (warm tint + gold
   marker). A gold **"Your name here"** tile appears at the end → `/give`. "Show more" paginates.
5. **Bridge CTA** (dark) — "Join the Founding Supporters." → `/give`.

## Data — wire to real supporters when available

```ts
// content/supporters.ts  (or fetch from your data layer)
export type Supporter = { name: string; tier: "patron"|"partner"|"supporter"; since?: string };
```
- **Source of truth:** the rows `recordSupporter()` writes in the webhook (doc 08). On Cloudflare
  that's likely **D1/KV** — read them in the page (Server Component, `async`).
- **Privacy:** only show the **`creditName`** the supporter chose (or a generic label), never email.
  If a supporter left credit blank, fall back to a tasteful default or omit. **Never** display raw
  payment data.
- Until the data layer exists, keep the mockup's **placeholder array** so the page renders — mark it
  `TODO(data): replace with real query`. The counts derive from whatever array/query feeds it.

## Components

- The whole filtering/search/pagination block is a **client island**:
  `components/site/supporters/wall.tsx` ("use client") receives the full list as a prop from the
  Server Component page and handles filter + search + "show more" in state (port the mockup JS).
- Patron cards, name cards, the add-tile → small presentational components; brand tokens only.

## Mechanics

- `metadata`: `title: "Founding Supporters"`.
- The filter logic in the mockup has the patron section hide under partner/supporter filters and the
  search narrow across both sections — preserve that behavior (it was verified in the mockup).
- `Link`/`SupportButton` → `/give`. Header is the shared `<SiteHeader>` (already sticky w/ Support).
- `pnpm build` passes; filters + search + counts work against whatever data feeds it.
