import Link from "next/link";
import { Eyebrow } from "../primitives";
import { SupportButton } from "../support-button";

export function Hero() {
  return (
    <section className="px-[34px] pt-[84px] pb-14 text-center">
      <Eyebrow className="text-[17px]">A feature film by Kevin Cameron · in production</Eyebrow>
      <h1 className="mx-auto mt-4 max-w-[880px] font-serif text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.03] tracking-[-1px]">
        Some battles a teenager fights are completely silent.
      </h1>
      <p className="text-ink-soft mx-auto mt-5 max-w-[560px] font-serif text-[21px] leading-[1.55]">
        <em>The Silence Between Us</em> gives that silence a voice — and you can help tell it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <SupportButton className="px-8 py-3.5 text-[19px]">
          Become a Founding Supporter
        </SupportButton>
        <Link
          href="/#story"
          className="border-line text-ink-soft hover:border-muted-warm hover:text-ink border-b font-serif text-[17px] italic"
        >
          Read the story first ↓
        </Link>
      </div>
    </section>
  );
}
