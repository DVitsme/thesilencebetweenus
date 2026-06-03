# 05 · Diff the Current Repo → Target

Per your CLAUDE.md "Build status", here's the current landing state and exactly what to change.
**Overwrite the placeholder design; don't preserve it.**

---

## Current state (from your CLAUDE.md, 2026-06-03)

- `app/page.tsx` renders the **Hero 30** Shadcn Studio block
  (`components/shadcn-studio/blocks/hero-section-30/`) with **placeholder freelancer copy**
  ("Connecting You to the Right Talent", email-capture CTA, fake testimonial marquee, "5,000+
  clients"). → **Replace entirely.**
- `app/layout.tsx` is still the **`create-next-app` scaffold** — nothing wraps pages. → **Replace**
  with doc 03's layout (header + footer + fonts + metadata).
- The block vendor CLI also left a **throwaway demo route** `app/<id>/page.tsx` (e.g.
  `app/hero-section-30/page.tsx`). → **Delete it.**
- `/faq` exists (provisional). → **Leave it alone** this pass.

---

## Change list (do in this order)

### 1. Tokens & font — `app/globals.css`
Apply doc 02 (brand tokens, shadcn remap, Newsreader base, two utilities). Verify a `components/ui`
button looks warm-ink and a card sits on white with a `line` border.

### 2. Layout — `app/layout.tsx`
Replace the scaffold with doc 03's version. Create:
- `components/site/nav-links.ts`
- `components/site/support-button.tsx` ("use client")
- `components/site/site-header.tsx` ("use client")
- `components/site/site-footer.tsx` (server, includes **988**)

### 3. Home page — `app/page.tsx`
Replace the Hero-30 import/usage with doc 04's composition. Create the `components/site/home/*`
section files, `components/site/primitives.tsx`, `content/tiers.ts`, `content/proof.ts`.

### 4. Remove the placeholder block
```bash
# delete the demo route the vendor CLI created (name may vary)
rm -rf app/hero-section-30        # or whatever <id> route exists

# remove the Hero 30 block ONLY if nothing else imports it:
grep -rn "shadcn-studio/blocks/hero-section-30" app components
# if the only hit was app/page.tsx (now changed), delete the block:
rm -rf components/shadcn-studio/blocks/hero-section-30
```
> If `grep` shows other importers, leave the block and just stop importing it from `page.tsx`. Don't
> break an unrelated import.

### 5. Verify
```bash
pnpm dev      # open / — compare to Home - The Silence Between Us.html
pnpm lint
pnpm build    # ~3 min TS step is normal (per your CLAUDE.md). Must pass.
```

---

## How to "spot diffs" while you work

- **Color drift:** if anything renders in a blue/zinc default, you used a raw Tailwind color instead
  of a brand token. Grep components for hex and for non-brand color classes:
  ```bash
  grep -rnE "#[0-9a-fA-F]{6}" components/site            # expect only the few dark-band hexes from doc 03/04
  grep -rnE "(bg|text|border)-(slate|zinc|gray|blue|neutral)-" components/site app/page.tsx
  ```
  The only intentional raw hexes are the dark-band shades (`#15140f`, `#2a251d`, `#3a352b`,
  `#6b5409`, `#fffdf4`) — everything else should be a token.
- **Font drift:** if headings look like a system serif, `--font-newsreader` isn't reaching `<body>`
  — confirm `newsreader.variable` is on `<html>` and doc 02's base layer sets `font-family`.
- **Layout order:** the section order in `app/page.tsx` must match doc 04 §4 and the mockup.
- **Footer 988:** confirm the 988 line is present and links `tel:988`. Required.
- **No new routes:** `git status` should show changes only under `app/page.tsx`, `app/layout.tsx`,
  `app/globals.css`, `components/site/**`, `content/**`, and the deletions above. If other routes
  appear, you've over-built — revert them.

---

## Guardrails (from locked decisions — don't violate)

- ❌ No on-page card form. ✅ CTAs use `<SupportButton>` → hosted Checkout (TODO until `/api/checkout`).
- ❌ No "donate / tax-deductible / invest" language. ✅ "support / back / contribute / Supporter".
- ❌ No spoken catchphrases on-site. ✅ Home copy as written in doc 04.
- ✅ 988 in footer.
- ❌ Don't commit. Your CLAUDE.md says commit only when asked. Summarize and hand back.

Next: **`06-ROUTE-AND-LINK-MAP.md`**.
