"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Eyebrow, Rule } from "@/components/site/primitives";

// Error boundary for the route segments below the root layout (handoff: "Error" mockup). Must be a
// Client Component. Renders inside the root layout, so the header/footer stay; content only here.
// v16.2 passes unstable_retry() to re-render the failed segment (preferred over the old reset()).

const GOLD_BTN =
  "border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors hover:text-white";
const OUTLINE_BTN =
  "border-ink hover:bg-ink hover:text-paper inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Surface the error for the console / any reporting hook.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-7 py-[70px] text-center">
      {/* Calm "again" mark, not an alarming red X. */}
      <span className="border-ink bg-card-paper text-ink mx-auto mb-7 flex size-[78px] items-center justify-center rounded-full border-[1.5px]">
        <RotateCcw size={34} aria-hidden />
      </span>
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="mx-auto max-w-[560px] font-serif text-[clamp(2rem,5vw,2.875rem)] leading-[1.08] tracking-[-0.5px]">
        That didn&apos;t go as planned.
      </h1>
      <p className="text-ink-soft mx-auto mt-4 max-w-[500px] font-serif text-[20px] leading-[1.55]">
        An unexpected error interrupted the page. It&apos;s on our end, not yours, and trying again
        usually clears it.
      </p>

      <div className="border-line bg-tint text-ink-soft mt-6 inline-flex items-center gap-[9px] rounded-full border px-5 py-[9px] font-serif text-[16px] italic">
        <span className="om-diamond" aria-hidden />
        If you were making a contribution, your card was not charged.
      </div>

      <div className="mt-[30px] flex flex-wrap justify-center gap-3.5">
        <button type="button" onClick={() => unstable_retry()} className={GOLD_BTN}>
          Try again →
        </button>
        <Link href="/" className={OUTLINE_BTN}>
          Back to home
        </Link>
      </div>

      <Rule className="mt-[44px] max-w-[520px]" />

      <p className="text-ink-soft mx-auto mt-6 max-w-[460px] font-serif text-[16px] italic">
        If it keeps happening, we&apos;d genuinely like to know.{" "}
        <Link href="/contact" className="border-muted-warm border-b not-italic">
          Get in touch
        </Link>{" "}
        or email{" "}
        <a href="mailto:kevin@take3mediallc.com" className="border-muted-warm border-b not-italic">
          kevin@take3mediallc.com
        </a>{" "}
        and we&apos;ll help personally.
      </p>

      {error.digest && (
        <div className="text-muted-warm border-line bg-card-paper mt-[22px] inline-block rounded-[6px] border border-dashed px-[13px] py-[7px] font-mono text-[12.5px]">
          Reference: {error.digest} · share this if you contact us
        </div>
      )}
    </section>
  );
}
