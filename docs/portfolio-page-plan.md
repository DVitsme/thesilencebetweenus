# Portfolio / Social-Proof Page — Information Architecture

Plan for the portfolio + credibility experience. Data: [`content/portfolio.ts`](../content/portfolio.ts).
Assets: `/public/portfolio/*`. Copy voice: [`docs/persona-kevin-cameron.md`](./persona-kevin-cameron.md).

**Goal:** turn a skeptical visitor into a confident donor by proving Kevin is a real, working,
trusted filmmaker — *before* the ask for *The Silence Between Us*.

## Section order (top → bottom)

1. **Proof bar** — 4 stats from `proofStats` (Prime · 9–10 cities · 400+ premiere · 500+ videos).
   Immediate, scannable credibility. Sticky-ish at top of the portfolio section.

2. **Featured film spotlight** — `featuredFilm` (*For His Name's Sake*).
   Poster/trailer thumbnail + "Now on Amazon Prime" badge + logline + synopsis + cast (link Romaine
   Waite → IMDb). Primary CTA: **Watch trailer**; secondary: **Watch on Prime**. This is the single
   most persuasive element — give it the most visual weight.

3. **Body of work** — grid of cards from `works`, filterable by `category`
   (Feature · Documentary · TV · Commercial · Music video · In development).
   Each card: thumbnail, title, year, role, blurb, badges; click → `videoUrl`/`externalUrl`.
   *In-development* cards (incl. **The Silence Between Us**) get an "In production" treatment that
   links into the support flow.

4. **The tour** — `tour` as a timeline or map of premiere cities/venues. Headline e.g.
   *"From Toronto to a sold-out theater in Atlanta."* Proof the work is in demand and travels.

5. **Trusted by** — `partners` logo wall, **grouped** with sub-labels:
   Education · Mental Health & Community · Faith Institutions · Businesses & Brands · Arts.
   Lead the grouping with **Mental Health & Community** (Murtis Taylor, ADAMHS, Cleveland Peacemakers)
   when the page sits near the *Silence Between Us* ask — it directly de-risks the film.

6. **Who is Kevin** — short bio strip: headshot (`/portfolio/team/kevin-cameron-headshot.jpg`) +
   `credentials` chips (Oakwood · ASI · Chief Content Officer · ex-principal · teaches the craft).
   Voice it in first person per the persona ("I'm not new to this — I'm true to this.").

7. **From the room** — `/portfolio/press/*` screening photos (Q&A, preshow) as authentic event proof.

8. **Bridge CTA** — hand off to the support flow: *"You've seen the work. Help build the next one →
   The Silence Between Us."* Frame as participation/belonging, never charity (per persona).

## Build notes
- **Read the Next.js 16 docs before coding** (`node_modules/next/dist/docs/`) — esp. `next/image`
  (defaults changed), Server Components, and metadata. Logos/thumbnails should use `next/image`.
- Components likely: `ProofBar`, `FeaturedFilm`, `WorkCard` + `WorkGrid` (client filter), `TourTimeline`,
  `PartnerWall`, `BioStrip`, `ScreeningGallery`. Reuse the shadcn/Base-UI `Button`; add `Card`/`Badge`/`Tabs` via the shadcn CLI.
- Thumbnails are 16:9 (YouTube). Partner logos vary in aspect/transparency — render in uniform padded
  tiles on a neutral background; some (SDA church, Naturally 7) are dark-on-transparent, so don't put them on a dark bg without a plate.
- Full 174-thumbnail archive + data live in `portfolio/`; only curated assets were promoted to `public/`.
