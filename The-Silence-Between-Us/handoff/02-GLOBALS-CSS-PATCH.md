# 02 · globals.css Patch — Brand Tokens + shadcn Remap + Font

Goal: make the warm-literary palette the **theme**, so existing shadcn `new-york` components inherit
the look and you author with semantic Tailwind classes (`bg-paper`, `text-ink`, `border-line`, etc.).
Your `app/globals.css` is Tailwind **v4 CSS-first** — tokens live in `@theme inline`, colors in
`:root` as oklch (matching your current shadcn vars). There is **no `tailwind.config.js`**.

> **Read your current `app/globals.css` first.** It already defines the shadcn token set
> (`--background`, `--foreground`, `--primary`, `--border`, `--muted-foreground`, …) in oklch plus an
> `@theme inline` mapping and a `.dark` block. You are going to (a) **add brand tokens**, (b)
> **repoint the light-mode shadcn tokens** to warm-literary values, and (c) **register the font**.
> Keep the structure that's there; change values, don't rip it out.

---

## Step 1 — Add the brand tokens

Add this block to `app/globals.css`. The oklch values are conversions of the canonical hex from
`01-DESIGN-SYSTEM.md` (hex shown in comments as the source of truth).

```css
:root {
  /* ── Warm Literary brand tokens (canonical hex in comments) ── */
  --paper:      oklch(0.965 0.012 86);   /* #f7f3ea */
  --card-paper: oklch(1 0 0);            /* #ffffff */
  --ink:        oklch(0.258 0.013 70);   /* #2c2620 */
  --ink-soft:   oklch(0.435 0.018 73);   /* #5e564a */
  --muted-warm: oklch(0.625 0.030 84);   /* #9a8c6f */
  --line:       oklch(0.888 0.018 85);   /* #e3dccb */
  --line-soft:  oklch(0.916 0.015 84);   /* #ece5d6 */
  --tint:       oklch(0.935 0.016 85);   /* #f1ebdd */
  --gold:       oklch(0.823 0.142 86);   /* #f3c33b */
  --gold-deep:  oklch(0.635 0.118 80);   /* #b98a14 */
  --dark:       oklch(0.220 0.011 74);   /* #211d17 */

  /* dark-band on-color text */
  --on-dark:        oklch(0.93 0.012 86); /* #efe9da */
  --on-dark-soft:   oklch(0.82 0.018 84); /* #cfc4ac */
  --on-dark-muted:  oklch(0.74 0.022 84); /* #b9ad93 */
}
```

> If any oklch reads visibly off against the mockup, replace that one line with the hex directly —
> Tailwind v4 accepts `--paper: #f7f3ea;`. Don't chase perfection in oklch; match the mockup.

---

## Step 2 — Repoint the shadcn light-mode tokens

So that buttons, cards, inputs, borders, and muted text from `components/ui/` come out warm-literary
by default. **Edit the existing `:root` shadcn assignments** to reference the brand tokens:

```css
:root {
  --background: var(--paper);
  --foreground: var(--ink);

  --card: var(--card-paper);
  --card-foreground: var(--ink);
  --popover: var(--card-paper);
  --popover-foreground: var(--ink);

  --primary: var(--ink);            /* default buttons = ink; we add a 'gold' variant separately */
  --primary-foreground: var(--paper);

  --secondary: var(--tint);
  --secondary-foreground: var(--ink);

  --muted: var(--tint);
  --muted-foreground: var(--muted-warm);

  --accent: var(--gold);
  --accent-foreground: var(--ink);

  --border: var(--line);
  --input: var(--line);
  --ring: var(--gold-deep);

  --destructive: oklch(0.55 0.16 28);
  --destructive-foreground: var(--paper);

  --radius: 0.625rem; /* keep; pills override locally to 30px */
}
```

> **Dark mode:** this site is light-only by design (the "dark" look is *section bands*, not a theme).
> Leave the `.dark` block as-is; we never toggle it. If a stray `.dark` leaks in, the site should
> still render — but don't spend time on it this pass.

---

## Step 3 — Expose brand tokens to Tailwind utilities

In the existing `@theme inline` block, **add** these so `bg-paper`, `text-ink`, `border-line`,
`bg-tint`, `text-gold-deep`, `bg-dark`, etc. become real utilities:

```css
@theme inline {
  /* …keep the existing shadcn mappings (--color-background, --color-primary, …)… */

  --color-paper: var(--paper);
  --color-card-paper: var(--card-paper);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-muted-warm: var(--muted-warm);
  --color-line: var(--line);
  --color-line-soft: var(--line-soft);
  --color-tint: var(--tint);
  --color-gold: var(--gold);
  --color-gold-deep: var(--gold-deep);
  --color-dark: var(--dark);
  --color-on-dark: var(--on-dark);
  --color-on-dark-soft: var(--on-dark-soft);
  --color-on-dark-muted: var(--on-dark-muted);

  /* font families (registered in Step 4 / doc 03) */
  --font-serif: var(--font-newsreader), Georgia, 'Times New Roman', serif;
}
```

After this, `class="bg-paper text-ink border-line"` works, and `class="bg-dark text-on-dark"` styles
a dark band. Use these everywhere — **no hard-coded hex in components.**

---

## Step 4 — Make Newsreader the body font

The font is loaded in `app/layout.tsx` via `next/font/google` (doc 03), which exposes
`--font-newsreader`. Wire the base layer here so the **whole site** is Newsreader:

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    @apply bg-paper text-ink;
    font-family: var(--font-serif);
    font-size: 18px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  h1,h2,h3 { font-weight: 400; text-wrap: balance; }
  p { text-wrap: pretty; }

  /* gold focus ring for text inputs (design system §7) */
  input:focus-visible, textarea:focus-visible {
    outline: none;
    border-color: var(--gold-deep);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--gold) 28%, transparent);
  }
}
```

---

## Step 5 — Two small utilities used by the home page

Add these (plain CSS is fine in v4; or express inline in components). Doc 04 references them:

```css
@layer components {
  /* the gold diamond divider mark */
  .om-diamond { width: 7px; height: 7px; background: var(--gold); rotate: 45deg; }

  /* drop cap for the story section's first paragraph */
  .om-dropcap::first-letter {
    font-size: 64px; line-height: 0.78; float: left;
    padding: 9px 13px 0 0; color: var(--gold-deep);
  }

  /* hatched placeholder fill (until real imagery lands) */
  .om-hatch {
    background-image: repeating-linear-gradient(
      45deg, transparent, transparent 12px,
      color-mix(in oklch, var(--ink) 5%, transparent) 12px,
      color-mix(in oklch, var(--ink) 5%, transparent) 13px);
  }
}
```

---

## Verify Step

After editing, run `pnpm dev` and check a `components/ui/button` renders with an ink fill and a
`card` renders on white with a `line` border. If the page is suddenly very dark or very bright, you
likely edited the `.dark` block instead of `:root` — double-check.

Next: **`03-LAYOUT-HEADER-FOOTER.md`**.
