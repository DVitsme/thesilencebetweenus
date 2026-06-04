import { getStripe } from "@/lib/stripe/server";
import { resolveAmountCents, CURRENCY } from "@/lib/stripe/tiers";

// The Stripe Node SDK needs the Node runtime (OpenNext runs it on workerd with
// nodejs_compat). Edge is not supported here.
export const runtime = "nodejs";

type Body = {
  tier?: string;
  customCents?: number;
  name?: string;
  email?: string;
  creditName?: string;
  recurring?: boolean;
};

export async function POST(req: Request) {
  try {
    const {
      tier = "custom",
      customCents,
      name,
      email,
      creditName,
      recurring,
    } = (await req.json()) as Body;

    if (recurring) {
      // Recurring is Phase 2 (Customers + Prices + Subscriptions). Refuse here so
      // we never silently take a one-time charge for a "monthly" request.
      return Response.json({ error: "recurring_not_enabled" }, { status: 400 });
    }

    // Server-authoritative amount — never trust a client amount for a fixed tier.
    const amount = resolveAmountCents(tier, customCents);

    const pi = await getStripe().paymentIntents.create({
      amount,
      currency: CURRENCY,
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      // Metadata fuels the webhook → Supporters wall + the thank-you receipt.
      // Keep it lean and PII-aware.
      metadata: {
        tier: String(tier),
        supporterName: (name ?? "").slice(0, 120),
        creditName: (creditName ?? "").slice(0, 120),
      },
    });

    return Response.json({ clientSecret: pi.client_secret });
  } catch (e: unknown) {
    const invalid = e instanceof Error && e.message === "invalid_amount";
    return Response.json(
      { error: invalid ? "invalid_amount" : "server_error" },
      { status: invalid ? 400 : 500 },
    );
  }
}
