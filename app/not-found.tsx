import Link from "next/link";
import { Eyebrow, Rule } from "@/components/site/primitives";

// Rendered inside the root layout (header + footer wrap it), so this is content only.
// The root app/not-found also catches every unmatched URL site-wide; Next returns a 404 + noindex.

const GOLD_BTN =
  "border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors hover:text-white";
const OUTLINE_BTN =
  "border-ink hover:bg-ink hover:text-paper inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors";

const FIND = [
  { href: "/portfolio", label: "The Work" },
  { href: "/about", label: "About Kevin" },
  { href: "/supporters", label: "Supporters" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-7 py-[70px] text-center">
      {/* Big, quiet 404 with a gold-diamond center. */}
      <div
        aria-hidden
        className="text-ink flex items-center justify-center font-serif text-[clamp(110px,22vw,170px)] leading-[0.86] tracking-[-4px]"
      >
        4
        <span className="border-ink bg-gold mx-3 inline-block size-[clamp(18px,4vw,26px)] rotate-45 border" />
        4
      </div>
      <Eyebrow className="mt-4">Page not found</Eyebrow>
      <h1 className="mx-auto max-w-[560px] font-serif text-[clamp(2rem,5vw,2.875rem)] leading-[1.08] tracking-[-0.5px]">
        This page is one of our quieter ones.
      </h1>
      <p className="text-ink-soft mx-auto mt-4 max-w-[480px] font-serif text-[20px] leading-[1.55]">
        The link may be old, or the page may have moved. Nothing&apos;s lost. Let&apos;s get you back
        to the story.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3.5">
        <Link href="/" className={GOLD_BTN}>
          Back to home →
        </Link>
        <Link href="/give" className={OUTLINE_BTN}>
          Support the film
        </Link>
      </div>

      <Rule className="mt-[46px] max-w-[520px]" />

      <div className="mt-7">
        <span className="text-muted-warm mb-3.5 block font-serif text-[15px] italic">
          Or find your way from here
        </span>
        <div className="flex flex-wrap justify-center gap-2.5">
          {FIND.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-line bg-card-paper text-ink-soft hover:border-muted-warm hover:text-ink rounded-full border px-[18px] py-[9px] font-serif text-[16px] italic transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
