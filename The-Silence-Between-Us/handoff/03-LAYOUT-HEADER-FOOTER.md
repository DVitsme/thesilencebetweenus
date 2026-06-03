# 03 · Layout, Header & Footer

This builds the chrome that wraps every page: `app/layout.tsx` (fonts + metadata + header/footer),
`<SiteHeader>` (the sticky navbar), and `<SiteFooter>` (with the required **988** line). Your current
`app/layout.tsx` is still the `create-next-app` scaffold — you are replacing it.

File targets:
```
app/layout.tsx                      ← replace scaffold
components/site/site-header.tsx     ← new ("use client" — scroll shadow + mobile menu)
components/site/site-footer.tsx     ← new (server component)
components/site/support-button.tsx  ← new ("use client" — initiates checkout; safe TODO fallback)
components/site/nav-links.ts        ← new (single source for nav items)
```

> All code below is paste-ready for Next 16 + React 19 + your token setup. Brand colors come from the
> tokens added in doc 02 — no hex. Adjust import paths only if your alias differs (`@/*` → repo root).

---

## 1. Nav links (single source)

`components/site/nav-links.ts`
```ts
export type NavItem = { label: string; href: string };

// Only / exists this pass. The rest are built later; links are correct targets now.
export const NAV_ITEMS: NavItem[] = [
  { label: "The Film", href: "/#story" },
  { label: "The Work", href: "/portfolio" },
  { label: "About Kevin", href: "/about" },
  { label: "Supporters", href: "/supporters" },
  { label: "Contact", href: "/contact" },
];

export const SITE = {
  name: "The Silence Between Us",
  tagline: "A feature film by Kevin Cameron",
  email: "kevin@kcfilmsmedia.com",
  production: "Take 3 Media",
  admin: "KC Films & Media",
} as const;
```

---

## 2. Support button (hosted Stripe Checkout — with safe fallback)

The mockup's inline card form is **not** built. Every "Support / Choose / Contribute" CTA routes to
**hosted Stripe Checkout** (locked decision). The checkout API doesn't exist yet, so this ships a
button that POSTs to `/api/checkout` when present and otherwise no-ops to `/#support` with a console
note — so the home page builds and is navigable now.

`components/site/support-button.tsx`
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  tier?: "supporter" | "partner" | "patron" | "custom";
  amount?: number;           // cents; omit for "choose on checkout"
  className?: string;
  children: React.ReactNode;
};

export function SupportButton({ tier = "supporter", amount, className, children }: Props) {
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    try {
      // TODO(checkout): implement /api/checkout (Stripe Checkout, one-time) per docs/ia-and-architecture.md.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, amount }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) { window.location.href = url; return; }
      }
      throw new Error("checkout not wired yet");
    } catch {
      // Safe fallback until /api/checkout exists: jump to the tier section.
      if (location.pathname === "/") location.hash = "support";
      else location.href = "/#support";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink bg-gold px-7 py-3",
        "font-serif italic text-[17px] text-ink transition-colors",
        "hover:bg-gold-deep hover:text-paper hover:border-gold-deep disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
```

> When `/api/checkout` lands, nothing here changes — it already calls it. Until then the page works.

---

## 3. Site header (sticky navbar)

`components/site/site-header.tsx`
```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE } from "./nav-links";
import { SupportButton } from "./support-button";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md transition-shadow",
        scrolled && "shadow-[0_6px_24px_-18px_rgba(0,0,0,0.5)]",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3.5 md:px-[34px]">
        <Link href="/" className="whitespace-nowrap text-[15px] font-medium uppercase tracking-[0.16em]">
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="font-serif text-[16px] italic text-ink-soft transition-colors hover:text-ink"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SupportButton className="px-5 py-2 text-[15px]">Support the film →</SupportButton>
          <button
            className="lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-6 py-4 lg:hidden">
          {NAV_ITEMS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className="block py-2 font-serif text-[17px] italic text-ink-soft"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

---

## 4. Site footer (with the required 988 line)

`components/site/site-footer.tsx`
```tsx
import Link from "next/link";
import { SITE } from "./nav-links";

const COLS = [
  {
    h: "The film",
    links: [
      { label: "The story", href: "/#story" },
      { label: "The work", href: "/portfolio" },
      { label: "About Kevin", href: "/about" },
      { label: "Supporters", href: "/supporters" },
    ],
  },
  {
    h: "Support",
    links: [
      { label: "Become a Supporter", href: "/#support" },
      { label: "Founding Supporters", href: "/supporters" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    h: "Legal",
    links: [
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Contribution Terms", href: "/legal/contributions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#15140f] px-6 pb-9 pt-14 text-[#c9bfa9] md:px-[34px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-9 md:grid-cols-4 md:gap-[38px]">
        <div className="col-span-2 md:col-span-1">
          <div className="text-[15px] font-medium uppercase tracking-[0.13em] text-on-dark">
            {SITE.name}
          </div>
          <p className="mt-3.5 max-w-[280px] font-serif text-[15px] italic leading-relaxed text-[#a59d8c]">
            A feature film about what our young people carry in silence — and what happens when
            somebody finally listens. A {SITE.production} production.
          </p>
        </div>

        {COLS.map((c) => (
          <div key={c.h}>
            <h4 className="mb-3.5 font-serif text-[15px] italic text-on-dark-muted">{c.h}</h4>
            {c.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="mb-2.5 block text-[15.5px] text-[#c9bfa9] transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* 988 crisis line — REQUIRED (locked decision). Keep visible site-wide. */}
      <div className="mx-auto mt-11 max-w-[1120px] border-t border-[#2c2a22] pt-5">
        <p className="font-serif text-[14.5px] italic text-on-dark-soft">
          If you or a teen you love is struggling, you are not alone. Call or text{" "}
          <a href="tel:988" className="border-b border-[#3a352b] not-italic font-medium text-on-dark">
            988
          </a>{" "}
          — the Suicide &amp; Crisis Lifeline, free and confidential, 24/7.
        </p>
      </div>

      <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap justify-between gap-4 font-serif text-[13.5px] italic text-[#85806f]">
        <span>© 2026 {SITE.name} · {SITE.production}. Donations administered by {SITE.admin}.</span>
        <span>
          Secure payments via Stripe ·{" "}
          <a href={`mailto:${SITE.email}`} className="border-b border-[#3a352b] text-[#a59d8c]">
            {SITE.email}
          </a>
        </span>
      </div>
    </footer>
  );
}
```

---

## 5. Root layout (fonts + metadata + chrome)

`app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thesilencebetweenus.film"), // TODO(domain): confirm production domain
  title: {
    default: "The Silence Between Us — A film by Kevin Cameron",
    template: "%s — The Silence Between Us",
  },
  description:
    "A feature film about the anxiety and depression teenagers carry in silence — and the teacher who helps them be seen. Become a Founding Supporter.",
  openGraph: {
    type: "website",
    siteName: "The Silence Between Us",
    title: "The Silence Between Us",
    description:
      "Some battles a teenager fights are completely silent. Help tell this story.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

> **Next 16 note:** `RootLayout` stays sync here (no request APIs). If you later add `cookies()`/
> `headers()` in layout, it must become `async` and you `await` them. Run `npx next typegen` if you
> add typed `params`.

Next: **`04-HOME-PAGE.md`** — the page itself.
