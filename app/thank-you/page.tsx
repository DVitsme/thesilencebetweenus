import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, X } from "lucide-react";
import { Eyebrow, Rule } from "@/components/site/primitives";
import { getStripe } from "@/lib/stripe/server";
import { TIERS } from "@/content/tiers";

export const metadata: Metadata = {
  title: "Thank You",
  // Never index a post-payment page.
  robots: { index: false },
};

const GIVE_HREF = "/give";

// TODO(domain): confirm the production domain (matches layout.tsx metadataBase).
const SHARE_URL = "https://thesilencebetweenus.film";
const SHARE_TEXT =
  "I just became a Founding Supporter of The Silence Between Us — a film about the anxiety and depression teenagers carry in silence. Help tell this story:";
const X_SHARE = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
const EMAIL_SHARE = `mailto:?subject=${encodeURIComponent("A film worth supporting")}&body=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;

const GOLD_BTN =
  "border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[16.5px] italic transition-colors hover:text-white";
const OUTLINE_BTN =
  "border-ink hover:bg-ink hover:text-paper inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[16.5px] italic transition-colors";

const STEPS: { when: string; what: string; link?: { href: string; label: string } }[] = [
  {
    when: "Right now",
    what: "Your name joins the Founding Supporters wall — permanent, shareable recognition.",
    link: { href: "/supporters", label: "View the wall & find your name →" },
  },
  {
    when: "This week",
    what: "We'll email to schedule your virtual meet & greet with the director and principal cast.",
  },
  {
    when: "Every quarter",
    what: "Insider production updates — milestones, behind-the-scenes, and the road to release — land in your inbox.",
  },
  { when: "Before release", what: "Your first look at the trailer, ahead of the public." },
  { when: "In the film", what: "Your on-screen credit, listed the way you asked us to." },
];

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

type Receipt = { id: string; amountCents: number; tier: string };

function fmtUSD(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`;
}

function tierName(id: string): string | null {
  const t = TIERS.find((x) => x.id === id);
  return t && t.id !== "custom" ? t.name : null;
}

function shortRef(id: string): string {
  return `#${id.replace(/^pi_/, "").slice(-8).toUpperCase()}`;
}

// Read-only receipt lookup (handoff doc 12). Fulfillment still happens in the webhook;
// on any failure we fall back to a generic confirmation — never a fabricated receipt.
async function retrieveReceipt(paymentIntentId: string | undefined): Promise<Receipt | null> {
  if (!paymentIntentId) return null;
  try {
    const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
    const tier = typeof pi.metadata?.tier === "string" ? pi.metadata.tier : "custom";
    return { id: pi.id, amountCents: pi.amount_received || pi.amount, tier };
  } catch {
    return null;
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-line bg-card-paper text-ink-soft rounded-full border px-4 py-1.5 font-serif text-[15px] italic">
      {children}
    </span>
  );
}

function ReceiptChips({ receipt }: { receipt: Receipt | null }) {
  if (receipt) {
    const name = tierName(receipt.tier);
    return (
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <Chip>
          Receipt · <b className="font-medium not-italic">{shortRef(receipt.id)}</b>
        </Chip>
        {name && (
          <Chip>
            Tier · <b className="font-medium not-italic">{name}</b>
          </Chip>
        )}
        <Chip>
          Contribution · <b className="font-medium not-italic">{fmtUSD(receipt.amountCents)}</b>
        </Chip>
        <Chip>
          Paid securely via <b className="font-medium not-italic">Stripe</b>
        </Chip>
      </div>
    );
  }
  // No verified PaymentIntent (direct visit or lookup failed) — show only what's true.
  return (
    <div className="mt-7 flex flex-wrap justify-center gap-2.5">
      <Chip>
        Paid securely via <b className="font-medium not-italic">Stripe</b>
      </Chip>
    </div>
  );
}

function SuccessState({ receipt }: { receipt: Receipt | null }) {
  return (
    <>
      {/* Confirmation */}
      <section className="px-[28px] pt-[70px] pb-[52px] text-center">
        <span className="border-ink bg-gold text-ink mx-auto mb-[26px] flex size-[74px] items-center justify-center rounded-full border-[1.5px]">
          <Check size={34} strokeWidth={2.5} aria-hidden />
        </span>
        <Eyebrow>Your contribution is received</Eyebrow>
        <h1 className="mx-auto mt-1 max-w-[660px] font-serif text-[clamp(2.25rem,5.5vw,3.375rem)] leading-[1.06] tracking-[-0.5px]">
          Thank you. You&apos;re a Founding Supporter.
        </h1>
        <p className="text-ink-soft mx-auto mt-[18px] max-w-[520px] font-serif text-[20px] leading-[1.55]">
          You&apos;ve helped give a silent story a voice. A receipt is on its way to your email — and
          your name is already part of this film.
        </p>
        <ReceiptChips receipt={receipt} />
      </section>

      <Rule />

      {/* What happens next */}
      <section className="px-[28px] py-[54px]">
        <span className="text-muted-warm mb-2 block text-center font-serif text-[16px] italic">
          What happens next
        </span>
        <h2 className="mx-auto max-w-[620px] text-center font-serif text-[clamp(1.9rem,4vw,2.125rem)] leading-[1.12] tracking-[-0.3px]">
          Here&apos;s everything your support unlocks.
        </h2>
        <div className="mx-auto mt-[34px] flex max-w-[660px] flex-col">
          {STEPS.map((s, i) => (
            <div
              key={s.when}
              className={`border-line grid grid-cols-1 gap-x-6 gap-y-1 border-t py-[22px] md:grid-cols-[130px_1fr] ${
                i === STEPS.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="text-gold-deep font-serif text-[17px] italic">{s.when}</div>
              <div className="text-ink font-serif text-[18px]">
                {s.what}
                {s.link && (
                  <Link
                    href={s.link.href}
                    className="border-muted-warm text-ink mt-1 block w-fit border-b font-serif text-[15px] italic"
                  >
                    {s.link.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* A word from the director */}
      <section className="bg-tint px-[28px] py-[54px]">
        <div className="mx-auto max-w-[660px] text-center">
          <span className="text-muted-warm mb-2 block font-serif text-[16px] italic">
            A word from the director
          </span>
          <p className="font-serif text-[clamp(1.5rem,3.5vw,1.75rem)] leading-[1.4] tracking-[-0.2px] italic">
            &ldquo;These teenagers deserve to be seen, heard, and understood — and today you helped
            make sure they will be. Thank you for standing with this story.&rdquo;
          </p>
          <p className="text-muted-warm mt-[18px] font-serif text-[16px] italic">
            — Kevin Cameron, writer &amp; director
          </p>
        </div>
      </section>

      {/* Multiply your impact — share + upgrade */}
      <section className="px-[28px] py-[54px]">
        <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border-line bg-card-paper rounded-[6px] border p-[26px]">
            <h3 className="font-serif text-[24px] tracking-[-0.2px]">
              Help one more person hear about it.
            </h3>
            <p className="text-ink-soft mt-1 mb-[18px] font-serif text-[16px]">
              The more people who see this story, the further it travels. Share it with someone
              who&apos;d care.
            </p>
            <div className="flex flex-col gap-2.5">
              {/* mockup said "send the trailer," but TSBU has no public trailer yet — share the film page */}
              <a href={X_SHARE} target="_blank" rel="noopener noreferrer" className={`${OUTLINE_BTN} w-full`}>
                ↗ Share the film
              </a>
              <a href={EMAIL_SHARE} className={`${OUTLINE_BTN} w-full`}>
                Email a friend
              </a>
            </div>
          </div>
          <div className="border-line bg-card-paper rounded-[6px] border p-[26px]">
            <h3 className="font-serif text-[24px] tracking-[-0.2px]">Felt led to do more?</h3>
            <p className="text-ink-soft mt-1 mb-[18px] font-serif text-[16px]">
              Becoming a Partner or Patron expands the film&apos;s reach and adds benefits for you.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href="/give?tier=partner" className={`${GOLD_BTN} w-full`}>
                Explore Partner &amp; Patron →
              </Link>
              <Link href="/" className={`${OUTLINE_BTN} w-full`}>
                Return home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProcessingState() {
  return (
    <section className="mx-auto max-w-[760px] px-[28px] pt-[70px] pb-[60px] text-center">
      <span className="border-ink bg-tint text-ink mx-auto mb-[26px] flex size-[74px] items-center justify-center rounded-full border-[1.5px]">
        <Clock size={32} aria-hidden />
      </span>
      <Eyebrow>Almost there</Eyebrow>
      <h1 className="mx-auto mt-1 max-w-[620px] font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.06] tracking-[-0.5px]">
        We&apos;re confirming your contribution.
      </h1>
      <p className="text-ink-soft mx-auto mt-4 max-w-[520px] font-serif text-[20px] leading-[1.55]">
        Your payment is still processing — this can take a moment. We&apos;ll email your receipt the
        instant it clears; there&apos;s nothing more you need to do.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3.5">
        <Link href="/supporters" className={GOLD_BTN}>
          See the Supporters wall →
        </Link>
        <Link href="/" className={OUTLINE_BTN}>
          Return home
        </Link>
      </div>
    </section>
  );
}

function FailedState() {
  return (
    <section className="mx-auto max-w-[760px] px-[28px] pt-[70px] pb-[60px] text-center">
      <span className="border-ink bg-paper text-ink mx-auto mb-[26px] flex size-[74px] items-center justify-center rounded-full border-[1.5px]">
        <X size={34} strokeWidth={2.5} aria-hidden />
      </span>
      <Eyebrow>That didn&apos;t go through</Eyebrow>
      <h1 className="mx-auto mt-1 max-w-[620px] font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.06] tracking-[-0.5px]">
        We couldn&apos;t confirm your payment.
      </h1>
      <p className="text-ink-soft mx-auto mt-4 max-w-[520px] font-serif text-[20px] leading-[1.55]">
        No charge was completed. You&apos;re welcome to try again — and if you stopped on purpose, no
        worries at all.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3.5">
        <Link href={GIVE_HREF} className={GOLD_BTN}>
          Try again →
        </Link>
        {/* /support/canceled — the reassuring canceled-checkout page (handoff doc 13). */}
        <Link href="/support/canceled" className={OUTLINE_BTN}>
          What happened?
        </Link>
      </div>
    </section>
  );
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = first(sp.redirect_status);
  const paymentIntent = first(sp.payment_intent);

  // Display only — fulfillment (recording the supporter + receipt) happens in the Stripe
  // webhook (doc 08 §7), never here. This page may never run; never depend on it.
  if (status === "failed") return <FailedState />;
  if (status === "processing") return <ProcessingState />;

  const receipt = await retrieveReceipt(paymentIntent);
  return <SuccessState receipt={receipt} />;
}
