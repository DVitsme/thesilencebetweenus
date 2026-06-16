import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Eyebrow, Rule } from "@/components/site/primitives";
import { MoreWaysToGive } from "@/components/site/more-ways-to-give";

export const metadata: Metadata = {
  title: "Payment not completed",
  // A canceled-checkout page should never be indexed.
  robots: { index: false },
};

const GIVE_HREF = "/give";

const GOLD_BTN =
  "border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[16.5px] italic transition-colors hover:text-white";
const OUTLINE_BTN =
  "border-ink hover:bg-ink hover:text-paper inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[16.5px] italic transition-colors";

// Four no-blame reasons a checkout can stall, each with a one-line fix (mockup: "common reasons").
const REASONS: { reason: string; fix: string }[] = [
  {
    reason: "A typo in the card number, expiry date, or security code.",
    fix: "Re-entering it carefully usually does the trick.",
  },
  {
    reason: "Your bank paused the charge as a precaution.",
    fix: "A quick approval text or call to your bank usually clears it.",
  },
  {
    reason: "A daily limit or a temporary hold on the card.",
    fix: "Trying a different card often works right away.",
  },
  {
    reason: "The window closed before checkout finished.",
    fix: "You can simply start again below.",
  },
];

// The reassuring counterpart to /thank-you (handoff doc 13). Reached when a supporter backs out of
// /give, or from the thank-you failure branch. Static + display-only: it never touches Stripe.
export default function CanceledPage() {
  return (
    <>
      {/* Reassure first — a soft "again" mark, never an alarming red X; the card was not charged. */}
      <section className="px-[28px] pt-[70px] pb-[50px] text-center">
        <span className="border-ink bg-card-paper text-ink mx-auto mb-[26px] flex size-[74px] items-center justify-center rounded-full border-[1.5px]">
          <RotateCcw size={32} aria-hidden />
        </span>
        <Eyebrow>Your contribution wasn&apos;t completed</Eyebrow>
        <h1 className="mx-auto mt-1 max-w-[660px] font-serif text-[clamp(2.25rem,5.5vw,3.375rem)] leading-[1.07] tracking-[-0.5px]">
          No payment went through, and that&apos;s okay.
        </h1>
        <p className="text-ink-soft mx-auto mt-[18px] max-w-[540px] font-serif text-[20px] leading-[1.55]">
          Something interrupted the checkout before it finished. It happens often, and it&apos;s
          usually a quick fix.
        </p>
        <div className="border-line bg-tint text-ink-soft mt-6 inline-flex items-center gap-[9px] rounded-full border px-5 py-[9px] font-serif text-[16px] italic">
          <span className="om-diamond" aria-hidden />
          Your card was not charged.
        </div>
      </section>

      <Rule />

      {/* Common reasons — four no-blame items, each with a one-line fix. */}
      <section className="px-[28px] py-[54px]">
        <span className="text-muted-warm mb-2 block text-center font-serif text-[16px] italic">
          A few things that can cause this
        </span>
        <h2 className="mx-auto max-w-[620px] text-center font-serif text-[clamp(1.9rem,4vw,2.125rem)] leading-[1.12] tracking-[-0.3px]">
          Most of the time, it&apos;s small.
        </h2>
        <div className="mx-auto mt-[32px] flex max-w-[660px] flex-col">
          {REASONS.map((r, i) => (
            <div
              key={r.reason}
              className={`border-line grid grid-cols-[34px_1fr] items-start gap-[18px] border-t py-[20px] ${
                i === REASONS.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="border-muted-warm text-gold-deep mt-0.5 flex size-[22px] items-center justify-center rounded-full border font-serif text-[14px] italic">
                i
              </span>
              <div className="text-ink font-serif text-[18px]">
                {r.reason}
                <small className="text-ink-soft mt-[3px] block font-serif text-[15px] italic">
                  {r.fix}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* A gentle note from the team — their place among the Founding Supporters stays open. */}
      <section className="bg-tint px-[28px] py-[54px]">
        <div className="mx-auto max-w-[640px] text-center">
          <span className="text-muted-warm mb-2 block font-serif text-[16px] italic">
            From the team
          </span>
          <p className="font-serif text-[clamp(1.5rem,3.5vw,1.75rem)] leading-[1.42] tracking-[-0.2px] italic">
            &ldquo;Your support still means the world. There&apos;s no rush, and your place among the
            Founding Supporters is still open whenever you&apos;re ready.&rdquo;
          </p>
          <p className="text-muted-warm mt-4 font-serif text-[16px] italic">The Silence Between Us</p>
        </div>
      </section>

      {/* Two ways forward — return to checkout (primary) + a personal hand if needed. */}
      <section className="px-[28px] py-[54px]">
        <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border-line bg-card-paper rounded-[6px] border p-[26px]">
            <h3 className="font-serif text-[24px] tracking-[-0.2px]">Try your contribution again</h3>
            <p className="text-ink-soft mt-1 mb-[18px] font-serif text-[16px]">
              Pick up where you left off. It only takes a moment.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href={GIVE_HREF} className={`${GOLD_BTN} w-full`}>
                Return to checkout →
              </Link>
              <Link href="/give?tier=custom" className={`${OUTLINE_BTN} w-full`}>
                Choose a different amount
              </Link>
            </div>
          </div>
          <div className="border-line bg-card-paper rounded-[6px] border p-[26px]">
            <h3 className="font-serif text-[24px] tracking-[-0.2px]">Need a hand?</h3>
            <p className="text-ink-soft mt-1 mb-[18px] font-serif text-[16px]">
              If it still won&apos;t go through, we&apos;re glad to help you sort it out personally.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href="/contact" className={`${OUTLINE_BTN} w-full`}>
                Contact us
              </Link>
              <a href="mailto:kevin@take3mediallc.com" className={`${OUTLINE_BTN} w-full`}>
                Email kevin@take3mediallc.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* If the card itself is the problem, these rails work without one. */}
      <section className="px-[28px] pb-[58px]">
        <MoreWaysToGive />
      </section>
    </>
  );
}
