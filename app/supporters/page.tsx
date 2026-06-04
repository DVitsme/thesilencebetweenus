import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/site/primitives";
import { SupportButton } from "@/components/site/support-button";
import { SupportersWall } from "@/components/site/supporters/wall";
import { FOUNDING_YEAR } from "@/content/supporters";
import { listPublicSupporters } from "@/lib/db/supporters";

export const metadata: Metadata = {
  title: "Founding Supporters",
  description:
    "The people making The Silence Between Us possible. Every Founding Supporter's place on the wall is permanent.",
};

// Reads the live roster from D1 per request (handoff doc 10).
export const dynamic = "force-dynamic";

export default async function SupportersPage() {
  const supporters = await listPublicSupporters();

  // Counts are computed from the data, not hard-coded (handoff doc 10).
  const total = supporters.length;
  const patronsAndPartners = supporters.filter(
    (s) => s.tier === "patron" || s.tier === "partner",
  ).length;

  const counts = [
    { big: String(total), cap: "Founding Supporters" },
    { big: String(patronsAndPartners), cap: "Patrons & Partners" },
    { big: String(FOUNDING_YEAR), cap: "Founding year" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="px-[28px] pt-[60px] pb-[30px] text-center">
        <Eyebrow>Permanent recognition</Eyebrow>
        <h1 className="mx-auto mt-3 max-w-[660px] font-serif text-[clamp(2.25rem,5.5vw,3.375rem)] leading-[1.05] tracking-[-0.6px]">
          Our Founding Supporters.
        </h1>
        <p className="text-ink-soft mx-auto mt-4 max-w-[560px] font-serif text-[20px] leading-[1.55]">
          The people making <em>The Silence Between Us</em> possible. Every name here chose to help
          tell a story that matters — and their place is permanent.
        </p>
        <div className="mt-[30px] flex flex-wrap justify-center gap-10">
          {counts.map((c) => (
            <div key={c.cap}>
              <div className="font-serif text-[42px] leading-[0.9]">{c.big}</div>
              <div className="text-muted-warm mt-1.5 font-serif text-[14.5px] italic">{c.cap}</div>
            </div>
          ))}
        </div>
      </section>

      <SupportersWall supporters={supporters} />

      {/* Bridge CTA */}
      <section className="bg-dark text-on-dark px-[28px] py-[72px] text-center">
        <div className="mx-auto max-w-[760px]">
          <span className="text-on-dark-muted block font-serif text-[16px] italic">
            There&apos;s room for your name
          </span>
          <h2 className="mx-auto mt-3 mb-3 max-w-[640px] font-serif text-[clamp(2rem,4.5vw,2.625rem)] leading-[1.07] tracking-[-0.5px] text-white">
            Join the Founding Supporters.
          </h2>
          <p className="text-on-dark-soft mx-auto mb-7 max-w-[540px] font-serif text-[19px]">
            Your name belongs on this wall — permanent, shareable, and part of the film forever.
            You&apos;re not donating; you&apos;re producing.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <SupportButton>Become a Founding Supporter →</SupportButton>
            <Link
              href="/portfolio"
              className="text-on-dark hover:bg-on-dark hover:text-dark inline-flex items-center gap-2 rounded-full border border-[#6a6151] px-7 py-3 font-serif text-[16.5px] italic transition-colors"
            >
              See the work first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
