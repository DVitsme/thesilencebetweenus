"use client";

import { useEffect } from "react";
import "./globals.css";

// Last-resort boundary for when the ROOT LAYOUT itself throws (handoff: "Error" mockup). Must be a
// Client Component and render its own <html>/<body> — it replaces the root layout, so there is no
// SiteHeader/footer and no next/font here. globals.css supplies the brand tokens; --font-serif falls
// back to Georgia when the layout's Newsreader is not loaded, so the page still reads on-brand.

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-paper text-ink font-serif">
        <title>Something went wrong</title>
        <main className="flex min-h-screen flex-col items-center justify-center px-7 py-20 text-center">
          <span className="border-ink bg-card-paper text-ink mx-auto mb-7 flex size-[78px] items-center justify-center rounded-full border-[1.5px] text-[34px] leading-none">
            ↻
          </span>
          <span className="text-muted-warm mb-2 block font-serif text-[16px] italic">
            Something went wrong
          </span>
          <h1 className="mx-auto max-w-[540px] font-serif text-[clamp(2rem,5vw,2.75rem)] leading-[1.08] tracking-[-0.5px]">
            The site hit an unexpected error.
          </h1>
          <p className="text-ink-soft mx-auto mt-4 max-w-[460px] font-serif text-[19px] leading-[1.55]">
            Please try again in a moment. If you were making a contribution, your card was not
            charged.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors hover:text-white"
            >
              Try again →
            </button>
            <a
              href="mailto:kevin@kcfilmsmedia.com"
              className="border-ink hover:bg-ink hover:text-paper inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors"
            >
              Email us
            </a>
          </div>
          {error.digest && (
            <div className="text-muted-warm border-line bg-card-paper mt-[22px] inline-block rounded-[6px] border border-dashed px-[13px] py-[7px] font-mono text-[12.5px]">
              Reference: {error.digest}
            </div>
          )}
        </main>
      </body>
    </html>
  );
}
