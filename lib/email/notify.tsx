import { Resend } from "resend";
import type Stripe from "stripe";
import { TIERS } from "@/content/tiers";
import { getStripe } from "@/lib/stripe/server";
import SupporterConfirmation, { subject as supporterSubject } from "@/emails/supporter-confirmation";
import InternalNewContribution, { subject as internalSubject } from "@/emails/internal-new-contribution";
import RefundConfirmation, { subject as refundSubject } from "@/emails/refund-confirmation";

/**
 * Best-effort contribution notifications (Phase 3, task #1). Called from the Stripe
 * webhook AFTER recordSupporter(). Per-send failures are logged, never thrown — the
 * D1 record is the source of truth and must not depend on a notification send.
 *
 * Two sends per successful payment:
 *  - supporter-confirmation → the supporter (branded "human thank-you"; Stripe sends the receipt)
 *  - internal-new-contribution → the team (CONTACT_TO_EMAIL)
 */

function fromAddress(): string {
  const addr = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
  return `The Silence Between Us <${addr}>`;
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thesilencebetweenus.film").replace(/\/$/, "");
}

function tierDisplayName(tierId: string | undefined): string {
  const t = TIERS.find((x) => x.id === tierId);
  return t && t.id !== "custom" ? t.name : "Founding Supporter";
}

function firstNameOf(fullName: string | undefined): string {
  return (fullName ?? "").trim().split(/\s+/)[0] || "friend";
}

function fmtAmount(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Short, human receipt ref from the PI id (matches the /thank-you page style). */
function shortReceiptRef(piId: string): string {
  return piId.replace(/^pi_/, "").slice(-8).toUpperCase();
}

/** Tier-aware to-do for the internal alert so the team knows what to fulfill. */
function fulfillmentNote(tierId: string | undefined): string {
  switch (tierId) {
    case "patron":
      return "Patron: schedule the personal call with Kevin + the private cast & crew screening; confirm the associate-producer credit.";
    case "partner":
      return "Partner: send premiere-tour screening tickets; confirm the Special Thanks credit.";
    case "supporter":
      return "Supporter: schedule the virtual meet & greet; confirm the on-screen credit name.";
    default:
      return "Confirm the Founding Supporters wall listing.";
  }
}

export async function sendContributionEmails(pi: Stripe.PaymentIntent): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[webhook email] RESEND_API_KEY missing — skipping notifications");
    return;
  }
  const resend = new Resend(apiKey);
  const from = fromAddress();
  const teamTo = process.env.CONTACT_TO_EMAIL;

  const tierId = pi.metadata?.tier;
  const tierName = tierDisplayName(tierId);
  const amountFormatted = fmtAmount(pi.amount_received ?? pi.amount);
  const supporterName = pi.metadata?.supporterName ?? "";
  const creditName = pi.metadata?.creditName ?? "";
  const receiptRef = shortReceiptRef(pi.id);
  const supporterEmail = pi.receipt_email ?? null;

  // 1) Supporter confirmation — only if we have somewhere to send it.
  if (supporterEmail) {
    const props = {
      firstName: firstNameOf(supporterName),
      creditName: creditName || "A Founding Supporter",
      tierName,
      amountFormatted,
      receiptRef,
      wallUrl: `${siteUrl()}/supporters`,
    };
    try {
      const { error } = await resend.emails.send({
        from,
        to: supporterEmail,
        subject: supporterSubject(props),
        react: <SupporterConfirmation {...props} />,
      });
      if (error) console.error("[webhook email] supporter-confirmation:", error);
    } catch (e) {
      console.error("[webhook email] supporter-confirmation threw:", e);
    }
  }

  // 2) Internal team alert.
  if (teamTo) {
    const props = {
      creditName: creditName || "(none)",
      supporterName: supporterName || "(unknown)",
      tierName,
      amountFormatted,
      email: supporterEmail ?? "(none)",
      receiptRef: pi.id,
      createdAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      fulfillmentNote: fulfillmentNote(tierId),
    };
    try {
      const { error } = await resend.emails.send({
        from,
        to: teamTo,
        subject: internalSubject(props),
        react: <InternalNewContribution {...props} />,
      });
      if (error) console.error("[webhook email] internal-new-contribution:", error);
    } catch (e) {
      console.error("[webhook email] internal-new-contribution threw:", e);
    }
  }
}

/**
 * Best-effort refund confirmation (Phase 3, task #4). Called from the Stripe webhook on a
 * FULLY-refunded charge — the template copy says "refunded in full," so the webhook gates on
 * charge.refunded and partial refunds are handled manually. Failures are logged, never thrown.
 */
export async function sendRefundEmail(charge: Stripe.Charge): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[webhook email] RESEND_API_KEY missing — skipping refund email");
    return;
  }

  // Recipient: the receipt email carried from the PaymentIntent, then the card's billing email.
  const supporterEmail = charge.receipt_email ?? charge.billing_details?.email ?? null;
  if (!supporterEmail) {
    console.error(`[webhook email] refund: no recipient email on charge ${charge.id} — skipping`);
    return;
  }

  // First name: prefer the supporterName stored on the PaymentIntent metadata (so it matches the
  // confirmation email); fall back to the cardholder name on the charge.
  let supporterName = charge.billing_details?.name ?? "";
  const piId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (piId) {
    try {
      const pi = await getStripe().paymentIntents.retrieve(piId);
      if (pi.metadata?.supporterName) supporterName = pi.metadata.supporterName;
    } catch (e) {
      console.error("[webhook email] refund: PaymentIntent retrieve failed:", e);
    }
  }

  const props = {
    firstName: firstNameOf(supporterName),
    amountFormatted: fmtAmount(charge.amount_refunded || charge.amount),
    // Real Stripe reference, never fabricated: the latest refund id if present, else the charge id.
    refundRef: charge.refunds?.data?.[0]?.id ?? charge.id,
    // Public support inbox shown in the email (matches the contact page + auto-reply).
    contactEmail: "kevin@kcfilmsmedia.com",
  };

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: supporterEmail,
      subject: refundSubject(props),
      react: <RefundConfirmation {...props} />,
    });
    if (error) console.error("[webhook email] refund-confirmation:", error);
  } catch (e) {
    console.error("[webhook email] refund-confirmation threw:", e);
  }
}
