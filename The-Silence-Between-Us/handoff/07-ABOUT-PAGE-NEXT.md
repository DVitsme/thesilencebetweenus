# 07 · About Page — The Next Step (DO NOT BUILD YET)

> **Stop.** This is the *next* milestone, not part of the home-page pass. Build it only when the
> human says so, after they've reviewed the home page. This doc tells you how to approach it so the
> human's instruction ("build the About page from your design") is a short, clean task.

Reference mockup: **`About Kevin Cameron - The Silence Between Us.html`** → route **`/about`** →
`app/about/page.tsx`.

---

## What the design contains (sections, top → bottom)

1. **Hero** — eyebrow, big statement, role line ("Author, educator, producer, director, writer — but
   above all, a storyteller").
2. **Intro two-up** — portrait + the "true to this" opener and the principal→filmmaker pivot.
3. **The long climb** — the arc: *Hush* ("it was trash") → 500+ dues → *For His Name's Sake* funding
   collapse → self-funded revival.
4. **Pull quote** (tint band) — faith-woven line.
5. **The record** (dark band) — 4 stats + a short signature-work list + a "portfolio coming soon"
   tease.
6. **Why this story, why now** — split: *before film, these kids were his students.*
7. **What he believes** — 3 values (excellence, faith woven in, support-as-participation).
8. **Quick facts strip** + CTA back to support.

Most of this **reuses components you already built** for the home page: `Eyebrow`,
`SectionHeading`, `Rule`, `Placeholder`, the dark **proof/record band** pattern, the **stat grid**,
the **split section**, chips, and the gold/outline buttons. Porting About is mostly *composition*,
not new primitives. Factor shared bits out of `components/site/home/` into `components/site/` if you
find yourself copying them (e.g. a generic `<StatGrid>`, `<SplitSection>`, `<DarkBand>`).

---

## ⚠️ Copy register fix — REQUIRED before shipping About

The About mockup leans on Kevin's **spoken catchphrases**, which your guide bans on-site
(`docs/persona-kevin-cameron.md` → "serious sales register — no spoken catchphrases"; catchphrases
are for social/video). **Adapt these lines** when porting — keep the *meaning and warmth*, drop the
catchphrase cadence:

| Mockup line (catchphrase) | On-site adaptation (keep meaning, lose the catchphrase) |
|---|---|
| “I am not new to this. I am *true* to this.” | “He's been telling stories for as long as he can remember — long before independent film was something people talked about.” |
| “…the question is simple: *what are we waiting for?*” | “Rather than wait any longer for permission or funding, he and his partner decided to make it themselves.” |
| Any “yes sir / let's go / come on” cadence | Remove; state it plainly. |

Keep the *documented facts* (Hush 2009; conceived in Cleveland 2013; funding fell through ~10 yrs;
Dec 2023 revival with Roma; self-funded; shot in weeks; Toronto premiere 400+; 9–10 city tour;
streaming on Prime; former principal/teacher; Oakwood; Take 3 Media / KC Films). **Do not invent**
films, dates, family details, or quotes. The persona doc is the voice source; the mockup is the
layout source.

Also: lead **teens-first**, not "a movie about a teacher" (locked framing). The "Why this story"
section already does this — keep that emphasis.

---

## Mechanics

- **Metadata:** add a `metadata` export — `title: "About Kevin Cameron"` (the layout template appends
  "— The Silence Between Us"), with a description drawn from the credibility framing.
- **Links:** rewrite per `06-ROUTE-AND-LINK-MAP.md`. The "portfolio coming soon" tease → `/portfolio`.
  The closing CTA → `<SupportButton>` (hosted Checkout) + a link to `/contact`.
- **Images:** portrait + classroom still as `<Placeholder>` until real assets land.
- **Server Component** by default; no client interactivity needed on About.
- **Verify:** `pnpm build` passes; `/about` matches the mockup's order and the dark "record" band
  matches the home proof band's treatment.

When the human says "build the About page," your steps are: read the About mockup → reuse/extract
shared components → apply the copy-register fixes above → ship `app/about/page.tsx` → `pnpm build`.

---

That's the whole handoff. **For now: build the home page (docs 00–06), then stop and hand back.**
