import Stripe from "stripe";

/**
 * Server-side Stripe client + key resolution, tuned for the Cloudflare Workers
 * runtime (OpenNext). See handoff doc 08 §1, with two reconciliations:
 *
 *  1. ACTUAL env names — the test-mode webhook signing secret is
 *     `STRIPE_WEBHOOK_SECRET` (not `STRIPE_TEST_WEBHOOK_SECRET`); live is
 *     `STRIPE_LIVE_WEBHOOK_SECRET`. (Matches .env.example.)
 *  2. LAZY init — keys are read inside getters and the client is built on first
 *     use, so importing this module never reads `process.env` or constructs a
 *     Stripe client at build / prerender time (when secrets may be absent).
 *
 * Mode is `STRIPE_MODE` ("test" | "live") when set, else inferred from NODE_ENV
 * (production → live, otherwise test).
 */

export type StripeMode = "test" | "live";

export function stripeMode(): StripeMode {
  const explicit = process.env.STRIPE_MODE;
  if (explicit === "test" || explicit === "live") return explicit;
  return process.env.NODE_ENV === "production" ? "live" : "test";
}

const isLive = () => stripeMode() === "live";

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function stripeSecretKey(): string {
  return isLive()
    ? required("STRIPE_LIVE_SECRET_KEY", process.env.STRIPE_LIVE_SECRET_KEY)
    : required("STRIPE_TEST_SECRET_KEY", process.env.STRIPE_TEST_SECRET_KEY);
}

export function stripePublishableKey(): string {
  return isLive()
    ? required("STRIPE_LIVE_PUBLISHABLE_KEY", process.env.STRIPE_LIVE_PUBLISHABLE_KEY)
    : required("STRIPE_TEST_PUBLISHABLE_KEY", process.env.STRIPE_TEST_PUBLISHABLE_KEY);
}

export function stripeWebhookSecret(): string {
  // NB: the test secret is STRIPE_WEBHOOK_SECRET (no _TEST_) in this project.
  return isLive()
    ? required("STRIPE_LIVE_WEBHOOK_SECRET", process.env.STRIPE_LIVE_WEBHOOK_SECRET)
    : required("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET);
}

let client: Stripe | null = null;

/** The shared server Stripe client. Lazy — created on first use, never at build. */
export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(stripeSecretKey(), {
      // Pinned to the installed SDK's version (stripe@22 → 2026-05-27.dahlia),
      // which also matches the Stripe account's default API version.
      apiVersion: "2026-05-27.dahlia",
      httpClient: Stripe.createFetchHttpClient(), // REQUIRED on Cloudflare Workers
    });
  }
  return client;
}
