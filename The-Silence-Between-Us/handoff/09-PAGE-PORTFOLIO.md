# 09 · Portfolio Page (`/portfolio`)

Reference mockup: **`Portfolio - The Silence Between Us.html`** → `app/portfolio/page.tsx`.

This is a **social-proof page whose job is to convert** — it proves Kevin is the real deal, then
pushes to `/give`. Keep the payment goal present throughout (sticky Support button in the header
already does this site-wide; plus an in-grid "In production" card and a closing bridge CTA).

## Sections (top → bottom)

1. **Hero** — eyebrow, "Before you back the next one, see the last ten years," lede.
2. **Proof bar** — the 4 stats (`Prime / 9–10 / 400+ / 500+`) as a bordered 4-up strip on white.
   Reuse the `PROOF_STATS` data from `content/proof.ts`.
3. **Featured film spotlight** (dark band) — *For His Name's Sake*: poster placeholder w/ play +
   "Now on Amazon Prime" badge, the 10-years-shelved → self-funded story, Romaine Waite credited,
   trailer/Prime CTAs. Most visual weight on the page.
4. **Body of work** — a **filterable grid** (All / Features / Documentary / TV / Commercial / In
   production). The first card is *The Silence Between Us* tagged "In production" linking to `/give`.
5. **The tour** — a timeline of premiere stops.
6. **Trusted by** — partner wall, **mental-health group leads** (reuse `PARTNER_GROUPS` + the brand
   groups). 3 groups here (mental health, education/faith, brands).
7. **Who's Kevin** — short strip → links to `/about` (don't duplicate the About page).
8. **From the room** — screening-photo gallery (placeholders).
9. **Bridge CTA** — "You've seen the work. Now help build the next one." → `/give`.

## Components to reuse / build

- Reuse: `Eyebrow`, `SectionHeading`, `Placeholder`, the dark-band treatment, `StatGrid`, `LogoWall`,
  buttons (`gold`, `outline`, `ghost-d`), `SupportButton`.
- **New, small client island:** the **filter** for the body-of-work grid. Make a
  `components/site/portfolio/work-grid.tsx` ("use client") holding the works array + active filter
  state. Everything else on the page is a Server Component.

## Data

Put the works in `content/works.ts` so it's editable in one place:
```ts
export type Work = {
  id: string; title: string; sub: string; cat: "feature"|"documentary"|"tv"|"commercial"|"dev";
  blurb: string; cta: { label: string; href: string }; badge?: string; badgeProd?: boolean;
};
```
Seed it from the mockup's cards. ⚠️ Mark the ones that need confirmation:
- *The Silence Between Us* (dev) → cta `/give`.
- *For His Name's Sake* (feature, Prime) → trailer link **TODO(asset)**.
- *Hush* (2009), *The Calling*, *Cleveland Peacemakers* doc, *first TV pilot*, brand/institutional
  reels — all **real per persona but need real thumbnails/links/years** → `TODO(portfolio)`.

## Copy-register & honesty notes

- **Tour cities** (Toronto / Cleveland / Orlando / Atlanta) in the mockup are **representative** —
  the mockup labels them as such. Keep that "representative stops" caption until the real itinerary
  is provided. **Don't present them as confirmed.**
- No spoken catchphrases. The "Who's Kevin" strip in the mockup quotes "not new to this, true to
  this" — **adapt it** like doc 07 (e.g. "Telling stories long before independent film was popular").
- Lead the partner wall with mental-health orgs; keep the line tying them to this film.

## Mechanics

- `metadata`: `title: "The Work"`, description on the credibility angle.
- Rewrite links per doc 06. Featured/grid/bridge CTAs → `/give?tier=supporter` via `SupportButton`
  (or `Link` for non-primary).
- Images via `<Placeholder>` until assets land; keep the play-button affordance on the featured
  poster as pure decoration until a trailer URL exists.
- `pnpm build` passes; grid filter works; matches mockup order.
