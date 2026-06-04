import type { Metadata } from "next";
import { connection } from "next/server";
import { Lock } from "lucide-react";
import { Eyebrow } from "@/components/site/primitives";
import { stripePublishableKey } from "@/lib/stripe/server";
import { GiveForm } from "@/components/site/give/give-form";
import type { Tier } from "@/content/tiers";

export const metadata: Metadata = {
  title: "Become a Founding Supporter",
  description: "Support The Silence Between Us. Secure checkout powered by Stripe.",
};

type TierId = Tier["id"];

function normalizeTier(t: string | undefined): TierId {
  return t === "partner" || t === "patron" || t === "custom" ? t : "supporter";
}

export default async function GivePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  // Opt out of static prerender so the publishable key is read at request time.
  await connection();
  const { tier } = await searchParams;
  const publishableKey = stripePublishableKey();

  return (
    <>
      <section className="px-7 pt-[50px] pb-2 text-center">
        <Eyebrow>Be part of the film</Eyebrow>
        <h1 className="mx-auto mt-3 max-w-[620px] font-serif text-[clamp(2.25rem,5vw,2.875rem)] leading-[1.07] tracking-[-0.5px]">
          Become a Founding Supporter.
        </h1>
        <p className="text-ink-soft mx-auto mt-3.5 max-w-[540px] font-serif text-[19px]">
          You&apos;re not donating — you&apos;re producing. Choose your part below; it takes about a
          minute.
        </p>
        <div className="text-ink-soft mt-4 inline-flex items-center gap-2 font-serif text-[14.5px] italic">
          <Lock size={14} aria-hidden /> Secure checkout · powered by Stripe
        </div>
      </section>

      <div className="mx-auto max-w-[1080px] px-7 pt-10 pb-[70px]">
        <GiveForm publishableKey={publishableKey} initialTier={normalizeTier(tier)} />
      </div>
    </>
  );
}
