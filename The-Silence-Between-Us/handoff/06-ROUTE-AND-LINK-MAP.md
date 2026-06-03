# 06 · Route & Internal-Link Map

The mockups are standalone `.html` files that link to each other by filename (with spaces). In the
Next app these become clean App-Router routes. When you build each page, **rewrite cross-page links**
to the routes below (use `next/link`, `href` as shown). Match the route names already chosen in your
`docs/ia-and-architecture.md` (esp. `/support/canceled`, `/legal/{terms,privacy,contributions}`).

| Mockup file | Route | App file | Status this pass |
|-------------|-------|----------|------------------|
| `Home - The Silence Between Us.html` | `/` | `app/page.tsx` | **BUILD NOW** |
| `About Kevin Cameron - The Silence Between Us.html` | `/about` | `app/about/page.tsx` | Next (doc 07) |
| `Portfolio - The Silence Between Us.html` | `/portfolio` | `app/portfolio/page.tsx` | Later |
| `Supporters - The Silence Between Us.html` | `/supporters` | `app/supporters/page.tsx` | Later |
| `Contact - The Silence Between Us.html` | `/contact` | `app/contact/page.tsx` | Later |
| `Thank You - The Silence Between Us.html` | `/thank-you` | `app/thank-you/page.tsx` | Later |
| `Payment Canceled - The Silence Between Us.html` | `/support/canceled` | `app/support/canceled/page.tsx` | Later |
| `Give - The Silence Between Us.html` | *(no route)* | — | **Visual ref only** — hosted Checkout instead |
| `legal/Terms of Use.html` | `/legal/terms` | `app/legal/terms/page.tsx` | Later |
| `legal/Privacy Policy.html` | `/legal/privacy` | `app/legal/privacy/page.tsx` | Later |
| `legal/Contribution Terms.html` | `/legal/contributions` | `app/legal/contributions/page.tsx` | Later |

## Link rewrites (find → replace when porting any page)

```
href="Home - The Silence Between Us.html"               → href="/"
href="About Kevin Cameron - The Silence Between Us.html" → href="/about"
href="Portfolio - The Silence Between Us.html"           → href="/portfolio"
href="Supporters - The Silence Between Us.html"          → href="/supporters"
href="Contact - The Silence Between Us.html"             → href="/contact"
href="Give - The Silence Between Us.html"                → <SupportButton> (hosted Checkout), NOT a link
href="legal/Terms of Use.html"                           → href="/legal/terms"
href="legal/Privacy Policy.html"                         → href="/legal/privacy"
href="legal/Contribution Terms.html"                     → href="/legal/contributions"
#story / #support (same-page anchors)                    → keep as "/#story", "/#support"
```

## "Give" — important

`Give - The Silence Between Us.html` is a **design reference for tier/benefit content and the
checkout's trust framing only.** There is **no `/give` route** and **no on-page card form**. Anywhere
the mockups link to Give, wire a `<SupportButton>` that starts **hosted Stripe Checkout** (locked
decision). The tier ladder + benefit copy in that mockup feed `content/tiers.ts` and (later) the
Checkout line items / success page.

## Anchors on the home page

`/#story` and `/#support` resolve to the `id="story"` and `id="support"` sections built in doc 04.
The header "The Film" link and the hero "Read the story first" link use `/#story`; footer + tier CTAs
use `/#support`. These work as soon as the home page ships.

Next: **`07-ABOUT-PAGE-NEXT.md`** — read it, but **do not act** until the human says go.
