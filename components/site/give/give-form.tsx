"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Check, Lock, RotateCcw, Star } from "lucide-react";
import { TIERS, PAYPAL_DONATE_URL, type Tier } from "@/content/tiers";
import { CURRENCY } from "@/lib/stripe/tiers";

type TierId = Tier["id"];
type Details = { first: string; last: string; creditName: string; email: string };

const FIELD =
  "w-full rounded-[6px] border border-line bg-card-paper px-[15px] py-[13px] font-serif text-[17px] text-ink placeholder:text-[#bcae93] placeholder:italic";
const LABEL = "text-muted-warm mb-[7px] block font-serif text-[15.5px] italic";

function fmtUSD(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`;
}

function StepHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-[18px] flex items-baseline gap-2.5">
      <span className="text-gold-deep font-serif text-[16px] italic">{n}</span>
      <h2 className="font-serif text-[26px] tracking-[-0.2px]">{title}</h2>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={FIELD}
      />
    </div>
  );
}

function TierCard({
  t,
  selected,
  onSelect,
  custom,
  onCustom,
}: {
  t: Tier;
  selected: boolean;
  onSelect: (id: TierId) => void;
  custom: string;
  onCustom: (v: string) => void;
}) {
  const base =
    "grid cursor-pointer grid-cols-[26px_1fr_auto] items-center gap-3.5 rounded-[8px] border px-5 py-[18px] transition-all";
  const state = selected
    ? "border-ink bg-[#fffdf6] ring-1 ring-ink"
    : "border-line bg-card-paper hover:border-muted-warm";

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onSelect(t.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(t.id);
        }
      }}
      className={`${base} ${state}`}
    >
      <span
        className={`relative mt-[3px] size-5 rounded-full border-[1.5px] ${selected ? "border-ink" : "border-muted-warm"}`}
      >
        {selected && <span className="border-ink bg-gold absolute inset-[3px] rounded-full border" />}
      </span>

      <span>
        <span className="font-serif text-[21px]">
          {t.name}
          {t.popular && (
            <span className="border-line bg-tint text-gold-deep ml-2 rounded-full border px-2.5 py-0.5 align-middle font-serif text-[13px] italic">
              Most popular
            </span>
          )}
        </span>
        <span className="text-muted-warm mt-0.5 block font-serif text-[14.5px] italic">{t.blurb}</span>
      </span>

      {t.id === "custom" ? (
        <span
          className={`flex items-center gap-1.5 rounded-[6px] border bg-white px-3 py-1 ${selected ? "border-ink" : "border-line"}`}
        >
          <span className="text-muted-warm text-[20px]">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={custom}
            onChange={(e) => onCustom(e.target.value.replace(/[^0-9]/g, ""))}
            onFocus={() => onSelect("custom")}
            placeholder="100"
            aria-label="Custom amount in US dollars"
            className="text-ink w-[84px] border-none bg-transparent font-serif text-[22px] outline-none"
          />
        </span>
      ) : (
        <span className="text-right font-serif text-[26px] whitespace-nowrap">{t.amountLabel}</span>
      )}
    </div>
  );
}

function Trust({ icon: Icon, gold, children }: { icon: typeof Star; gold?: boolean; children: React.ReactNode }) {
  return (
    <div className="text-ink-soft flex items-center gap-2.5 font-serif text-[14.5px] italic">
      <span
        className={`grid size-6 flex-none place-items-center rounded-full border ${
          gold ? "border-gold-deep bg-tint text-gold-deep" : "border-[#5a7d4f] bg-[#e9efe3] text-[#5a7d4f]"
        }`}
      >
        <Icon size={12} aria-hidden />
      </span>
      {children}
    </div>
  );
}

function OrderSummary({ tier, amountCents }: { tier: TierId; amountCents: number }) {
  const t = TIERS.find((x) => x.id === tier) ?? TIERS[0];
  return (
    <>
      <div className="border-line bg-card-paper overflow-hidden rounded-[10px] border">
        <div className="bg-dark text-on-dark px-6 py-[22px]">
          <span className="text-on-dark-muted mb-1 block font-serif text-[16px] italic">
            Your contribution
          </span>
          <div className="flex items-baseline justify-between gap-3.5">
            <span className="font-serif text-[24px] text-white">
              {t.id === "custom" ? "Your gift" : t.name}
            </span>
            <span className="font-serif text-[30px] whitespace-nowrap text-white">
              {amountCents > 0 ? fmtUSD(amountCents) : "—"}
            </span>
          </div>
          <div className="text-on-dark-muted mt-0.5 font-serif text-[14px] italic">
            One-time contribution
          </div>
        </div>

        <div className="px-6 py-[22px]">
          <span className="text-muted-warm mb-3 block font-serif text-[16px] italic">
            What you&apos;ll receive
          </span>
          <ul className="flex flex-col gap-[11px]">
            {t.benefits.map((b) => (
              <li
                key={b.text}
                className={`flex items-start gap-2.5 font-serif text-[16px] leading-[1.45] ${b.muted ? "text-muted-warm italic" : "text-ink"}`}
              >
                <span
                  className={`mt-0.5 grid size-[19px] flex-none place-items-center rounded-full border ${
                    b.muted ? "border-line bg-card-paper text-muted-warm" : "border-ink bg-gold text-ink"
                  }`}
                >
                  <Check size={11} strokeWidth={3} aria-hidden />
                </span>
                {b.text}
              </li>
            ))}
          </ul>

          <div className="border-line-soft mt-5 flex flex-col gap-2.5 border-t pt-[18px]">
            <Trust icon={Star} gold>
              Your name joins the Founding Supporters wall
            </Trust>
            <Trust icon={RotateCcw}>Refundable within 14 days if made in error</Trust>
            <Trust icon={Lock}>Secured &amp; encrypted by Stripe</Trust>
          </div>
        </div>
      </div>

      <div className="bg-tint text-ink-soft mt-[18px] rounded-[10px] px-[22px] py-5 font-serif text-[16px] leading-[1.5] italic">
        &ldquo;Good work like this only happens when we participate — with more than words. When you
        back this film, you join the family behind it.&rdquo;
        <span className="text-muted-warm mt-2 block text-[14.5px]">
          — Kevin Cameron, writer &amp; director
        </span>
      </div>
    </>
  );
}

function PaymentStep({
  tier,
  amountCents,
  details,
}: {
  tier: TierId;
  amountCents: number;
  details: Details;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pay() {
    if (!stripe || !elements) return;
    setErr(null);

    if (amountCents <= 0) {
      setErr("Choose a tier or enter an amount to continue.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      setErr("Add a valid email so we can send your receipt.");
      return;
    }

    setSubmitting(true);

    // Validate the Payment Element first.
    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setErr(submitErr.message ?? "Please check your card details.");
      setSubmitting(false);
      return;
    }

    try {
      // Create the PaymentIntent now (deferred mode) — amount is re-validated server-side.
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier,
          customCents: tier === "custom" ? amountCents : undefined,
          name: `${details.first} ${details.last}`.trim(),
          email: details.email.trim(),
          creditName: (details.creditName || `${details.first} ${details.last}`).trim(),
        }),
      });
      const data = (await res.json()) as { clientSecret?: string; error?: string };

      if (!res.ok || !data.clientSecret) {
        setErr(
          data.error === "invalid_amount"
            ? "Please enter a valid amount."
            : "Something went wrong starting your payment. Please try again.",
        );
        setSubmitting(false);
        return;
      }

      // Confirm → Stripe redirects to the return_url on success.
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: { return_url: `${window.location.origin}/thank-you` },
      });
      // Reaching here means confirm returned an error (success redirects away).
      if (error) {
        setErr(error.message ?? "Your payment could not be completed.");
        setSubmitting(false);
      }
    } catch {
      setErr("Network error — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <StepHeader n="03" title="Payment" />
      <PaymentElement options={{ layout: "tabs" }} />

      <p className="text-muted-warm mt-2.5 flex items-center justify-end gap-1.5 font-serif text-[14px] italic">
        <Lock size={12} aria-hidden /> Encrypted &amp; processed by{" "}
        <b className="text-ink-soft font-medium not-italic">Stripe</b>. We never see your full card
        number.
      </p>

      {err && (
        <p role="alert" className="text-destructive mt-3 font-serif text-[15px] italic">
          {err}
        </p>
      )}

      <button
        type="button"
        onClick={pay}
        disabled={submitting || amountCents <= 0}
        className="border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep mt-3 w-full rounded-full border px-4 py-4 font-serif text-[20px] italic transition-colors hover:text-white disabled:opacity-55"
      >
        {submitting
          ? "Processing…"
          : amountCents > 0
            ? `Contribute ${fmtUSD(amountCents)} securely →`
            : "Enter an amount to continue"}
      </button>

      <p className="text-muted-warm mt-3 text-center font-serif text-[13.5px] leading-[1.5] italic">
        By contributing you agree to our{" "}
        <Link href="/legal/contributions" className="border-line border-b not-italic">
          Contribution Terms
        </Link>
        . Administered by KC Films &amp; Media. A receipt is emailed instantly.
      </p>
      <p className="text-muted-warm mt-2 text-center font-serif text-[13.5px] italic">
        Prefer to give monthly?{" "}
        <Link href="/contact" className="border-line border-b not-italic">
          Get in touch
        </Link>{" "}
        and we&apos;ll set it up.
      </p>
    </div>
  );
}

export function GiveForm({
  publishableKey,
  initialTier,
}: {
  publishableKey: string;
  initialTier: TierId;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const [tier, setTier] = useState<TierId>(initialTier);
  const [customDollars, setCustomDollars] = useState("");
  const [details, setDetails] = useState<Details>({
    first: "",
    last: "",
    creditName: "",
    email: "",
  });

  const updateDetail = (key: keyof Details, value: string) =>
    setDetails((d) => ({ ...d, [key]: value }));

  const amountCents = useMemo(() => {
    const t = TIERS.find((x) => x.id === tier);
    if (t && t.amount != null) return t.amount * 100;
    const n = parseInt(customDollars.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n * 100 : 0;
  }, [tier, customDollars]);

  // Deferred mode: Elements initializes with an amount and updates live as the user
  // changes tier/amount; the PaymentIntent is only created at confirm.
  const elementsOptions = useMemo(
    () =>
      ({
        mode: "payment" as const,
        amount: Math.max(amountCents, 100), // Elements needs a positive amount to init
        currency: CURRENCY,
        appearance: {
          theme: "flat" as const,
          variables: {
            fontFamily: "Newsreader, Georgia, serif",
            colorPrimary: "#b98a14",
            colorBackground: "#ffffff",
            colorText: "#2c2620",
            colorTextSecondary: "#9a8c6f",
            borderRadius: "6px",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": { border: "1px solid #e3dccb", boxShadow: "none", padding: "12px 14px" },
            ".Input:focus": { border: "1px solid #b98a14", boxShadow: "0 0 0 3px rgba(243,195,59,.22)" },
            ".Label": { color: "#9a8c6f", fontStyle: "italic" },
          },
        },
      }) as const,
    [amountCents],
  );

  return (
    <div className="grid grid-cols-1 items-start gap-[46px] md:grid-cols-[1.5fr_1fr]">
      {/* LEFT — the form */}
      <div>
        <div className="mb-[38px]">
          <StepHeader n="01" title="Choose your contribution" />
          <div role="radiogroup" aria-label="Contribution tier" className="flex flex-col gap-3">
            {TIERS.map((t) => (
              <TierCard
                key={t.id}
                t={t}
                selected={tier === t.id}
                onSelect={setTier}
                custom={customDollars}
                onCustom={setCustomDollars}
              />
            ))}
          </div>

          {/* PayPal alternative — leaves for PayPal's hosted page; those gifts are fulfilled manually. */}
          <div className="border-line bg-tint mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border px-5 py-4">
            <span>
              <span className="font-serif text-[19px]">Prefer PayPal?</span>
              <span className="text-muted-warm mt-0.5 block font-serif text-[14.5px] italic">
                Give securely through your PayPal account instead
              </span>
            </span>
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-ink text-ink hover:bg-ink hover:text-paper inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-serif text-[15.5px] italic transition-colors"
            >
              Pay with PayPal →
            </a>
          </div>
        </div>

        <div className="mb-[38px]">
          <StepHeader n="02" title="Your details" />
          <div className="space-y-[18px]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id="first"
                label="First name"
                value={details.first}
                onChange={(v) => updateDetail("first", v)}
                placeholder="Your first name"
                autoComplete="given-name"
              />
              <Field
                id="last"
                label="Last name"
                value={details.last}
                onChange={(v) => updateDetail("last", v)}
                placeholder="Your last name"
                autoComplete="family-name"
              />
            </div>
            <Field
              id="credit"
              label={
                <>
                  How your name appears in the credits{" "}
                  <span className="opacity-80">— this is the name we&apos;ll list</span>
                </>
              }
              value={details.creditName}
              onChange={(v) => updateDetail("creditName", v)}
              placeholder="e.g. The Cameron Family"
            />
            <Field
              id="email"
              type="email"
              label={
                <>
                  Email <span className="opacity-80">— for your receipt &amp; production updates</span>
                </>
              }
              value={details.email}
              onChange={(v) => updateDetail("email", v)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
        </div>

        <Elements stripe={stripePromise} options={elementsOptions}>
          <PaymentStep tier={tier} amountCents={amountCents} details={details} />
        </Elements>
      </div>

      {/* RIGHT — sticky order summary (above the form on mobile) */}
      <aside className="order-first md:order-none md:sticky md:top-24">
        <OrderSummary tier={tier} amountCents={amountCents} />
      </aside>
    </div>
  );
}
