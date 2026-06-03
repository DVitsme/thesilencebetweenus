# 01 · Design System — Warm Literary

The whole site speaks one visual language: **a literary essay.** One serif (Newsreader) at every
size, warm paper, generous leading, hairline rules, and a single gold accent used sparingly. It
should feel like a well-set book or a serious long-form article — calm, credible, humane. The
subject is teenage mental health; the tone is honest but never bleak, restrained but warm.

This doc is the *vocabulary*. Docs 02–04 turn it into code.

---

## 1. Color

Canonical values are **hex** (the mockups are the source of truth). Doc 02 also gives oklch
equivalents so they sit naturally beside your existing shadcn oklch tokens — but if a conversion ever
looks off, the hex is authoritative.

| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#f7f3ea` | Page background — warm off-white |
| `card` | `#ffffff` | Raised surfaces (cards, inputs, table) |
| `ink` | `#2c2620` | Primary text, borders on emphasis, dark buttons |
| `ink-soft` | `#5e564a` | Secondary text, body in muted contexts |
| `muted` | `#9a8c6f` | Labels, captions, italic asides |
| `line` | `#e3dccb` | Default hairline borders |
| `line-soft` | `#ece5d6` | Inner dividers, lighter rules |
| `tint` | `#f1ebdd` | Alternating section background (warmer than paper) |
| `gold` | `#f3c33b` | THE accent — primary buttons, active states, the diamond mark |
| `gold-deep` | `#b98a14` | Accent text/hover, drop caps, numbered labels |
| `dark` | `#211d17` | Dark sections (proof band, footer, final CTA on About/Portfolio) |

**Usage discipline**
- Gold is a *highlighter*, not a flood. Primary CTA fills, the small rotated-square "diamond" mark,
  active filter/tier, hover accents. Never gold backgrounds for whole sections except the **one**
  final-CTA band on the home page.
- Dark bands (`dark`) are for *proof* and *footer* — moments that should feel weighty.
- Text on `dark`: headings `#ffffff`, body `#cfc4ac`, labels `#b9ad93`.
- Borders are 1px hairlines in `line`. Emphasis borders step up to `ink` (e.g. selected tier).

---

## 2. Typography — Newsreader, one family

Newsreader is an optical-size serif with real italics. We lean on **weight 400** almost everywhere
and use **italic** for labels, captions, asides, and pull quotes. This single-family discipline is
what makes it feel literary. Doc 03 loads it via `next/font/google`.

| Style | Size / line-height | Weight / style | Use |
|-------|--------------------|----------------|-----|
| Hero H1 | clamp ~46→68px / 1.03 | 400, tracking -1px | The one big statement per page |
| H2 section | 32–40px / 1.1 | 400, tracking -.4px | Section headings |
| H3 | 22–27px / 1.2 | 400 | Card titles, sub-headings |
| Pull quote | 28–38px / 1.3 | 400 **italic** | The emotional line on a tint band |
| Lede | 20–21px / 1.55 | 400 | Sub-hero paragraph, intro sentences |
| Body | 19–20px / 1.7–1.78 | 400 | Reading columns |
| UI / button | 16–17px | 400 **italic** | Buttons, nav links, chips |
| Label (eyebrow) | 15–16px | 400 **italic**, color `muted` | "The ones it's for", "Meet the filmmaker" |
| Caption | 13–15px | 400 italic, `muted` | Image tags, fine print |

**Type rules**
- Body copy lives in a **~680px measure** (`.read` in the mockup). Don't run prose full-bleed.
- Italics carry semantic weight here (labels/asides) — don't also italicize for random emphasis;
  use it consistently for the "voice-over" layer (eyebrows, captions, pull quotes, button text).
- Headlines use slight negative tracking; body uses default. `text-wrap: balance` on headlines,
  `pretty` on paragraphs.
- The **drop cap** (first paragraph of the story section): first-letter ~64px, float left, color
  `gold-deep`. One per page, max.

---

## 3. Spacing & rhythm

- **Section padding:** ~72px vertical on desktop (`py-[72px]`), tightening to ~44px on mobile.
  Dark bands and CTA bands can go a touch larger (~84px).
- **Container widths:** `wide` = max 1120px; reading column `read` = max 680px. Side padding 34px
  desktop / 28px tighter screens.
- **Alternation:** sections alternate `paper` and `tint` to create rhythm. Never two `tint` in a
  row. The two `dark` bands (proof, footer) are punctuation, not alternation.
- **Gaps:** grids use `gap` (no margin hacks). Card grids 14–26px; two-up splits 0 (they share a
  hairline border).

---

## 4. Shape, line, motion

- **Radius:** cards/inputs `6–10px`; pills & buttons fully round (`border-radius: 30px`); the
  proof/patron cards `10px`. No heavy rounding anywhere.
- **Borders:** 1px hairlines everywhere; this is a line-driven design, not a shadow-driven one.
- **Shadows:** almost none. Only soft lift on hover (`0 10–14px 30px -18px rgba(0,0,0,.4)`) and the
  navbar's scroll shadow. No drop shadows on type or flat elements.
- **The diamond mark:** a 6–7px square rotated 45° in `gold` — used as a divider centerpiece and as
  list bullets. It's the one recurring ornament. (See `.rule .d` and `ul li::before` in any mockup.)
- **Motion:** restrained. Hover color/transform 120–160ms. Nav underline wipes in on hover. Cards
  lift 2–3px on hover. No parallax, no autoplay loops, no entrance animations on the home page.

---

## 5. Component vocabulary (what recurs, so you can componentize)

These appear across pages — build them once, reuse them. Doc 04 gives the home-page subset as code.

- **`<Eyebrow>`** — italic muted label above a heading.
- **`<Button>`** variants: `gold` (primary), `outline` (ink border, fills ink on hover),
  `link` (underline only), `ghost-d` (for dark bands: light border, inverts on hover). *Prefer
  extending your shadcn `Button` with these variants over a new component — doc 02 remaps the theme
  so `default`/`outline` already land close.*
- **`<Rule>`** — centered hairline with the gold diamond in the middle.
- **`<PullQuote>`** — big italic line, centered, on a `tint` band.
- **`<StatGrid>`** — 4 big italic-captioned numbers (the proof bar): `Prime / 9–10 / 400+ / 500+`.
- **`<LogoWall>`** — grouped partner tiles with an italic group label; **the mental-health group
  always leads** when the wall sits near the film's ask.
- **`<Card>`** — white, hairline border, 6–10px radius; hover lift. Used for endorsements, names,
  works.
- **`<SplitSection>`** — half image / half text, sharing a vertical hairline; alternates side.
- **Tier row** — name + description + price + round "Choose" button; the popular one gets a faint
  `#fffdf4` fill and a "Most popular" gold tag.
- **Sticky chrome** — navbar (logo + links + gold Support) and the dark footer.

---

## 6. Imagery

All images in the mockups are **placeholders** (hatched boxes with italic captions). Real assets
aren't in yet. When you build:
- Use `next/image` (remember Next 16 defaults: `qualities` is `[75]`, use `remotePatterns`).
- Keep the placeholder *as a styled fallback* until real art lands — a hatched box with an italic
  caption naming what goes there (hero still, teacher still, Kevin portrait, endorsement avatars).
  Doc 04 ships a `<Placeholder>` component for exactly this so the page never shows a broken `<img>`.
- Aspect ratios from the mockup: hero still ~`21/9` band (fixed 440px tall, full-bleed); teacher
  split min 380px; Kevin portrait `4/5`; endorsement avatars 44px circle.

---

## 7. Accessibility & polish

- Contrast: `ink` on `paper` and white on `dark` are strong. `muted` is for non-essential text only
  — never body copy at small sizes on `paper` below ~15px.
- Focus states: inputs get a gold ring (`box-shadow: 0 0 0 3px rgba(243,195,59,.22)`) — doc 02
  includes it. Keep visible focus on all interactive elements.
- Respect `prefers-reduced-motion`: gate the few hover transforms; never required for comprehension.
- Hit targets ≥ 44px on touch (buttons already are).

Next: **`02-GLOBALS-CSS-PATCH.md`** — turn these tokens into real CSS in your Tailwind v4 setup.
