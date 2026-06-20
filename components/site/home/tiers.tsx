import { Eyebrow, SectionHeading } from "../primitives";
import { SupportButton } from "../support-button";
import { MoreWaysToGive } from "../more-ways-to-give";
import { TIERS, PAYPAL_DONATE_URL } from "@/content/tiers";

export function Tiers() {
  return (
    <section id="support" className="bg-tint py-10 sm:py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <div className="text-center">
          <Eyebrow>Be part of it</Eyebrow>
          <SectionHeading>Become a Founding Supporter.</SectionHeading>
          <p className="text-ink-soft mx-auto mt-2 max-w-[540px] font-serif text-[19px]">
            You&apos;re not donating — you&apos;re producing. Choose your part, or give any amount.
          </p>
        </div>

        <div className="border-ink bg-card-paper mx-auto mt-8 max-w-[760px] overflow-hidden rounded-[12px] border">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className={`border-line grid grid-cols-1 gap-3 border-b px-6 py-5.5 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5 ${t.popular ? "bg-[#fffdf4]" : ""} ${t.id === "custom" ? "bg-paper" : ""}`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2.5 font-serif text-[23px]">
                  {t.name}
                  {t.popular && (
                    <span className="border-line bg-tint text-gold-deep rounded-full border px-2.5 py-0.5 font-serif text-[12.5px] italic">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="text-muted-warm mt-1 font-serif text-[14.5px] italic">{t.blurb}</div>
              </div>
              <div className="font-serif text-[27px] whitespace-nowrap sm:text-right">{t.amountLabel}</div>
              <SupportButton
                tier={t.id}
                className={`w-full justify-center sm:w-auto ${
                  t.popular ? "" : "border-ink hover:bg-ink hover:text-paper bg-transparent text-ink"
                }`}
              >
                {t.id === "custom" ? "Contribute →" : "Choose →"}
              </SupportButton>
            </div>
          ))}

          {/* PayPal alternative — external hosted button (PayPal gifts are fulfilled manually). */}
          <div className="bg-tint grid grid-cols-1 gap-3 px-6 py-5.5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-5">
            <div>
              <div className="font-serif text-[23px]">Prefer PayPal?</div>
              <div className="text-muted-warm mt-1 font-serif text-[14.5px] italic">
                Give securely through your PayPal account instead
              </div>
            </div>
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-ink text-ink hover:bg-ink hover:text-paper inline-flex w-full items-center justify-center gap-2 rounded-full border bg-transparent px-7 py-3 font-serif text-[17px] italic transition-colors sm:w-auto"
            >
              Pay with PayPal →
            </a>
          </div>
        </div>

        <MoreWaysToGive className="mt-10" />

        <p className="text-muted-warm mt-6 text-center font-serif text-[15px] italic">
          Secure checkout via Stripe or PayPal · administered by KC Films &amp; Media.
        </p>
      </div>
    </section>
  );
}
