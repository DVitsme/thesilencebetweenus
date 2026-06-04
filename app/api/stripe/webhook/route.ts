import type Stripe from "stripe";
import { getStripe, stripeWebhookSecret } from "@/lib/stripe/server";
import { recordSupporter } from "@/lib/db/supporters";

// Stripe SDK + webhook verification need the Node runtime (workerd + nodejs_compat).
export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("missing signature", { status: 400 });

  // Raw body is required for signature verification — never parse to JSON first.
  const body = await req.text();

  // Resolve client + secret outside the verify try so a config error surfaces as a
  // 500 (rather than masquerading as a bad signature).
  const stripe = getStripe();
  const secret = stripeWebhookSecret();

  let event: Stripe.Event;
  try {
    // Async variant — Workers' Web Crypto is async (NOT the sync constructEvent()).
    event = await stripe.webhooks.constructEventAsync(body, sig, secret);
  } catch {
    return new Response("invalid signature", { status: 400 });
  }

  // Fulfillment source of truth — never fulfill on the thank-you redirect.
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await recordSupporter({
      stripePaymentIntent: pi.id,
      tierId: pi.metadata?.tier ?? "custom",
      creditName: pi.metadata?.creditName ?? "",
      supporterName: pi.metadata?.supporterName ?? "",
      amountCents: pi.amount_received ?? pi.amount,
      email: pi.receipt_email ?? null,
      createdAt: new Date().toISOString(),
    });
    // TODO(email): send a confirmation via Resend (Phase 3). Stripe also emails the
    // receipt when receipt_email is set.
  }

  // Acknowledge everything else (e.g. payment_intent.payment_failed) with 200 so
  // Stripe doesn't retry events we don't act on.
  return new Response("ok");
}
