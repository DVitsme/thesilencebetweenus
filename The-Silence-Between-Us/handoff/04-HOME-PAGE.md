# 04 · Home Page

Build the home page as small section components composed in `app/page.tsx`. The reference is
`Home - The Silence Between Us.html` — keep it open; copy text comes from it close to verbatim (it's
already on-register: teens-first, serious, no catchphrases).

File targets:
```
app/page.tsx                              ← replace the Hero-30 landing
components/site/primitives.tsx            ← Eyebrow, Rule, Placeholder, SectionHeading
components/site/home/hero.tsx
components/site/home/film-still.tsx
components/site/home/film-story.tsx
components/site/home/pull-quote.tsx
components/site/home/teacher-split.tsx
components/site/home/filmmaker.tsx
components/site/home/proof-band.tsx
components/site/home/endorsements.tsx
components/site/home/tiers.tsx
components/site/home/final-cta.tsx
content/tiers.ts                          ← single source for tier data
content/proof.ts                          ← stats + partner wall data
```

All of these are **Server Components** except where noted. Brand colors via tokens (doc 02). Images
use `<Placeholder>` until real art lands.

---

## 1. Shared primitives

`components/site/primitives.tsx`
```tsx
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("mb-2 block font-serif text-[16px] italic text-muted-warm", className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  children, className, as: Tag = "h2",
}: { children: React.ReactNode; className?: string; as?: "h2" | "h3" }) {
  return (
    <Tag className={cn("font-serif text-[clamp(2rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.5px]", className)}>
      {children}
    </Tag>
  );
}

export function Rule({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-[760px] items-center gap-3.5 px-7", className)}>
      <span className="h-px flex-1 bg-line" />
      <span className="om-diamond" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Hatched fallback shown until real imagery is dropped in. Swap for <Image> when assets arrive. */
export function Placeholder({
  label, className, ratio,
}: { label: string; className?: string; ratio?: string }) {
  return (
    <div
      className={cn("om-hatch flex items-center justify-center border border-line", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <span className="rounded border border-muted-warm px-3 py-1 text-center font-serif text-[13.5px] italic text-muted-warm">
        {label}
      </span>
    </div>
  );
}
```

---

## 2. Data sources

`content/tiers.ts`
```ts
export type Tier = {
  id: "supporter" | "partner" | "patron" | "custom";
  name: string;
  amount: number | null;     // USD; null = custom/any amount
  amountLabel: string;       // what to render
  blurb: string;
  popular?: boolean;
  illustrative?: boolean;    // TODO(tiers): true = price NOT confirmed by Kevin
};

// ⚠️ Only $175 (Supporter) is confirmed. Partner/Patron amounts are ILLUSTRATIVE placeholders.
export const TIERS: Tier[] = [
  { id: "supporter", name: "Supporter", amount: 175, amountLabel: "$175", popular: true,
    blurb: "Credit · meet & greet · wall listing · updates · first trailer look" },
  { id: "partner", name: "Partner", amount: 500, amountLabel: "$500", illustrative: true,
    blurb: "Everything in Supporter, plus premiere access & special thanks" },
  { id: "patron", name: "Patron", amount: 1500, amountLabel: "$1,500", illustrative: true,
    blurb: "Everything in Partner, plus a producer credit & private screening" },
  { id: "custom", name: "Give any amount", amount: null, amountLabel: "from $1",
    blurb: "Every dollar helps this story get made" },
];
```

`content/proof.ts`
```ts
export const PROOF_STATS = [
  { big: "Prime", cap: "A feature streaming on Amazon today" },
  { big: "9–10",  cap: "Cities on the premiere tour, US & Canada" },
  { big: "400+",  cap: "At the sold-out Toronto premiere" },
  { big: "500+",  cap: "Films produced for brands & nonprofits" },
];

// Mental-health group LEADS (it de-risks this specific film). See design system §5.
export const PARTNER_GROUPS = [
  { label: "Trusted to tell their stories · mental health & community", lead: true,
    logos: ["Murtis Taylor\nHuman Services", "ADAMHS Board of\nCuyahoga County", "Cleveland Peacemakers\nAlliance"] },
  { label: "Education & faith", lead: false,
    logos: ["Cleveland Metropolitan\nSchool District", "Oakwood University", "SDA Conferences"] },
];
```

---

## 3. Section components

`components/site/home/hero.tsx`
```tsx
import Link from "next/link";
import { Eyebrow } from "../primitives";
import { SupportButton } from "../support-button";

export function Hero() {
  return (
    <section className="px-[34px] pb-14 pt-[84px] text-center">
      <Eyebrow className="text-[17px]">A feature film by Kevin Cameron · in production</Eyebrow>
      <h1 className="mx-auto mt-4 max-w-[880px] font-serif text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.03] tracking-[-1px]">
        Some battles a teenager fights are completely silent.
      </h1>
      <p className="mx-auto mt-5 max-w-[560px] font-serif text-[21px] leading-[1.55] text-ink-soft">
        <em>The Silence Between Us</em> gives that silence a voice — and you can help tell it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <SupportButton className="text-[19px] px-8 py-3.5">Become a Founding Supporter</SupportButton>
        <Link href="/#story" className="border-b border-line font-serif text-[17px] italic text-ink-soft hover:border-muted-warm hover:text-ink">
          Read the story first ↓
        </Link>
      </div>
    </section>
  );
}
```

`components/site/home/film-still.tsx`
```tsx
export function FilmStill() {
  return (
    <div className="om-hatch relative flex h-[440px] items-center justify-center border-y border-line">
      <div className="grid h-[76px] w-[76px] cursor-pointer place-items-center rounded-full border border-ink bg-paper/60 backdrop-blur-[2px] transition-transform hover:scale-105">
        <span className="ml-1.5 border-y-[12px] border-l-[20px] border-y-transparent border-l-ink" />
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center font-serif text-[14px] italic text-ink-soft">
        A first look is coming — support the film to see it first.
      </p>
      <span className="absolute left-3.5 top-3.5 rounded border border-muted-warm bg-paper/70 px-3 py-1.5 font-serif text-[13px] italic text-muted-warm">
        Full-bleed cinematic still
      </span>
    </div>
  );
}
```

`components/site/home/film-story.tsx`
```tsx
import { Eyebrow, SectionHeading } from "../primitives";

export function FilmStory() {
  return (
    <section id="story" className="py-[72px]">
      <div className="mx-auto max-w-[680px] px-[34px] text-center">
        <Eyebrow>The ones it's for</Eyebrow>
        <SectionHeading>A story our young people need told.</SectionHeading>
      </div>
      <div className="mx-auto mt-2 max-w-[680px] px-[34px] font-serif text-[20px] leading-[1.78]">
        <p className="om-dropcap mb-5">
          The Silence Between Us explores the anxiety and depression so many teenagers silently carry
          inside the school system — and the fear and uncertainty that keep them from opening up to
          the very people who love them most.
        </p>
        <p>
          As the pressure builds and communication breaks down, one compassionate teacher becomes a
          guiding light, helping his students through some of the hardest moments of their young
          lives. It's an honest film about a hard truth — told with hope, never despair.
        </p>
      </div>
    </section>
  );
}
```

`components/site/home/pull-quote.tsx`
```tsx
export function PullQuote() {
  return (
    <div className="bg-tint px-[34px] py-20 text-center">
      <p className="mx-auto max-w-[820px] font-serif text-[clamp(1.75rem,4vw,2.375rem)] italic leading-[1.3] tracking-[-0.4px]">
        “It shines a light on trauma, isolation, and healing — and the simple, enormous importance of
        being seen, heard, and understood.”
      </p>
    </div>
  );
}
```

`components/site/home/teacher-split.tsx`
```tsx
import { Eyebrow, SectionHeading, Placeholder } from "../primitives";

export function TeacherSplit() {
  return (
    <section className="grid items-stretch md:grid-cols-2">
      <div className="order-1 min-h-[280px] md:order-2 md:min-h-[380px]">
        <Placeholder label="Still — the teacher" className="h-full border-0 border-b border-line md:border-b-0 md:border-l" />
      </div>
      <div className="flex flex-col justify-center px-[34px] py-12 md:px-14">
        <Eyebrow>A guiding light</Eyebrow>
        <SectionHeading className="mb-4">One teacher decides to really see them.</SectionHeading>
        <p className="mb-4 font-serif text-[19px] leading-[1.7]">
          When the adults in their lives are too busy, too tired, or too afraid to ask the hard
          questions, one teacher refuses to look away. He becomes the steady presence these students
          didn't know they needed — proof that being noticed can change everything.
        </p>
        <p className="font-serif text-[19px] leading-[1.7]">
          It's the kind of relationship that saves lives quietly, every day, in real schools. This
          film honors it.
        </p>
      </div>
    </section>
  );
}
```

`components/site/home/filmmaker.tsx`
```tsx
import Link from "next/link";
import { Eyebrow, SectionHeading, Placeholder } from "../primitives";

const CHIPS = ["Former school principal", "Oakwood University", "500+ films produced", "Take 3 Media"];

export function Filmmaker() {
  return (
    <section className="bg-tint py-[72px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-[34px] md:grid-cols-[260px_1fr]">
        <Placeholder label="Portrait — Kevin Cameron" ratio="4 / 5" className="mx-auto w-full max-w-[260px]" />
        <div>
          <Eyebrow>Meet the filmmaker</Eyebrow>
          <SectionHeading className="mb-3.5">This story is in careful hands.</SectionHeading>
          <p className="mb-4 font-serif text-[21px] leading-[1.7]">
            “Before film, I worked in education myself, so these young people are not strangers to me.
            My last feature is streaming on Amazon Prime today — but no story has mattered to me more
            than this one.”
          </p>
          <div className="mb-5 flex flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <span key={c} className="rounded-full border border-line bg-tint px-3.5 py-1.5 font-serif text-[14px] italic text-ink-soft">
                {c}
              </span>
            ))}
          </div>
          <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-3 font-serif text-[17px] italic transition-colors hover:bg-ink hover:text-paper">
            Read Kevin's full story →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

`components/site/home/proof-band.tsx`
```tsx
import Link from "next/link";
import { PROOF_STATS, PARTNER_GROUPS } from "@/content/proof";

export function ProofBand() {
  return (
    <section className="bg-dark py-[72px] text-on-dark">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <span className="mb-2 block text-center font-serif text-[16px] italic text-on-dark-muted">
          Why you can trust this
        </span>
        <h2 className="mx-auto mb-9 max-w-[620px] text-center font-serif text-[clamp(1.9rem,4vw,2.25rem)] leading-[1.1] tracking-[-0.3px] text-white">
          This isn't a first-timer with a dream and a camera.
        </h2>

        <div className="mx-auto mb-12 grid max-w-[920px] grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {PROOF_STATS.map((s) => (
            <div key={s.big} className="text-center">
              <div className="font-serif text-[46px] leading-[0.9]">{s.big}</div>
              <div className="mt-2 font-serif text-[14.5px] italic leading-[1.35] text-on-dark-muted">{s.cap}</div>
            </div>
          ))}
        </div>

        {PARTNER_GROUPS.map((g) => (
          <div key={g.label} className="mb-6">
            <div className={`mb-3 text-center font-serif text-[15px] italic ${g.lead ? "text-gold" : "text-on-dark-muted"}`}>
              {g.label}
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {g.logos.map((l) => (
                <div key={l} className="flex h-[50px] min-w-[148px] items-center justify-center whitespace-pre-line rounded border border-[#3a352b] bg-[#2a251d] px-5 text-center font-serif text-[13.5px] italic leading-[1.25] text-on-dark-soft">
                  {l}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-7 text-center">
          <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-[#6a6151] px-7 py-3 font-serif text-[16.5px] italic text-on-dark transition-colors hover:bg-on-dark hover:text-dark">
            See the full body of work →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

`components/site/home/endorsements.tsx`
```tsx
import { Eyebrow, SectionHeading, Placeholder } from "../primitives";

// ⚠️ PLACEHOLDER endorsements. Do NOT attribute invented quotes to real people.
// Replace with real, attributed endorsements when Kevin provides them. TODO(endorsements).
const ITEMS = [
  { q: "A real movie in every way — it hits all the marks. This is the quality our stories deserve.",
    name: "Endorsement name", role: "Title · organization" },
  { q: "Kevin tells the truth about young people without ever giving up on hope. That's rare, and it matters.",
    name: "Endorsement name", role: "Mental-health partner" },
];

export function Endorsements() {
  return (
    <section className="py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <Eyebrow className="text-center">Early word</Eyebrow>
        <SectionHeading className="text-center">What people say about Kevin's work.</SectionHeading>
        <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-1 gap-6 md:grid-cols-2">
          {ITEMS.map((it, i) => (
            <figure key={i} className="rounded-[10px] border border-line bg-card-paper p-8">
              <blockquote className="mb-4.5 font-serif text-[21px] italic leading-[1.55]">“{it.q}”</blockquote>
              <figcaption className="flex items-center gap-3.5">
                <Placeholder label="" className="h-11 w-11 rounded-full" />
                <div>
                  <div className="font-serif text-[16px]">{it.name}</div>
                  <div className="font-serif text-[14px] italic text-muted-warm">{it.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4.5 text-center font-serif text-[15px] italic text-muted-warm">
          Endorsements to be confirmed — placeholders shown.
        </p>
      </div>
    </section>
  );
}
```

`components/site/home/tiers.tsx`
```tsx
import { Eyebrow, SectionHeading } from "../primitives";
import { SupportButton } from "../support-button";
import { TIERS } from "@/content/tiers";

export function Tiers() {
  return (
    <section id="support" className="bg-tint py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <div className="text-center">
          <Eyebrow>Be part of it</Eyebrow>
          <SectionHeading>Become a Founding Supporter.</SectionHeading>
          <p className="mx-auto mt-2 max-w-[540px] font-serif text-[19px] text-ink-soft">
            You're not donating — you're producing. Choose your part, or give any amount.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] overflow-hidden rounded-[12px] border border-ink bg-card-paper">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-5 border-b border-line px-6 py-5.5 last:border-b-0 ${t.popular ? "bg-[#fffdf4]" : ""} ${t.id === "custom" ? "bg-paper" : ""}`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2.5 font-serif text-[23px]">
                  {t.name}
                  {t.popular && (
                    <span className="rounded-full border border-line bg-tint px-2.5 py-0.5 font-serif text-[12.5px] italic text-gold-deep">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="mt-1 font-serif text-[14.5px] italic text-muted-warm">{t.blurb}</div>
              </div>
              <div className="whitespace-nowrap text-right font-serif text-[27px]">{t.amountLabel}</div>
              <SupportButton
                tier={t.id}
                amount={t.amount ? t.amount * 100 : undefined}
                className={t.popular ? "" : "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper"}
              >
                {t.id === "custom" ? "Contribute →" : "Choose →"}
              </SupportButton>
            </div>
          ))}
        </div>

        <p className="mt-4.5 text-center font-serif text-[15px] italic text-muted-warm">
          Secure checkout via Stripe · administered by KC Films &amp; Media. Partner &amp; Patron pricing illustrative.
        </p>
      </div>
    </section>
  );
}
```

`components/site/home/final-cta.tsx`
```tsx
import { SupportButton } from "../support-button";

export function FinalCta() {
  return (
    <div className="bg-gold px-[34px] py-[84px] text-center">
      <h2 className="mx-auto mb-3.5 max-w-[680px] font-serif text-[clamp(2.1rem,5vw,2.875rem)] leading-[1.07] tracking-[-0.6px] text-ink">
        Help this story be told.
      </h2>
      <p className="mx-auto mb-7 max-w-[540px] font-serif text-[20px] text-[#6b5409]">
        Join the Founding Supporters behind <em>The Silence Between Us</em>. Your name becomes part of
        the film, forever.
      </p>
      <SupportButton className="border-dark bg-dark text-[19px] text-on-dark hover:bg-black hover:text-white hover:border-black">
        Make a contribution →
      </SupportButton>
    </div>
  );
}
```

---

## 4. Compose the page

`app/page.tsx`
```tsx
import { Hero } from "@/components/site/home/hero";
import { FilmStill } from "@/components/site/home/film-still";
import { FilmStory } from "@/components/site/home/film-story";
import { PullQuote } from "@/components/site/home/pull-quote";
import { TeacherSplit } from "@/components/site/home/teacher-split";
import { Filmmaker } from "@/components/site/home/filmmaker";
import { ProofBand } from "@/components/site/home/proof-band";
import { Endorsements } from "@/components/site/home/endorsements";
import { Tiers } from "@/components/site/home/tiers";
import { FinalCta } from "@/components/site/home/final-cta";
import { Rule } from "@/components/site/primitives";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FilmStill />
      <FilmStory />
      <PullQuote />
      <TeacherSplit />
      <Filmmaker />
      <ProofBand />
      <Endorsements />
      <Tiers />
      <FinalCta />
    </>
  );
}
```

> The mockup has a `<Rule>` divider between a couple of sections — add `<Rule className="my-2" />`
> wherever the HTML shows the centered diamond rule if you want the exact rhythm; it's optional.

---

## 5. Sanity pass against the mockup

Open `Home - The Silence Between Us.html` side-by-side and confirm, top to bottom: hero → still →
story (drop cap) → pull quote (tint) → teacher split (image right) → filmmaker (tint) → proof (dark)
→ endorsements → tiers (tint, popular row tinted) → final CTA (gold) → footer (dark + 988). Spacing
won't be pixel-identical; **rhythm and order must match.** Tailwind arbitrary values like
`py-[72px]` are fine; prefer tokens for color always.

Next: **`05-DIFF-CURRENT-REPO.md`** to clean up the old landing.
