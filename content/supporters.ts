/**
 * Founding Supporters — shared types + constants for the recognition wall
 * (/supporters) and its data layer (lib/db/supporters.ts).
 *
 * The roster itself now lives in Cloudflare D1 (task #12): the Stripe webhook
 * writes a row per contribution; the page reads the public columns. Sample names
 * for the v1 review seed live in `db/seed-supporters.sql` (each row tagged
 * `stripe_payment_intent = 'seed:…'`, cleared before go-live).
 *
 * PRIVACY: only ever expose the public credit name a supporter chose. Never
 * render an email, an amount, or any payment data on this page.
 */

export type SupporterTier = "patron" | "partner" | "supporter";

export interface Supporter {
  /** Public credit name the supporter chose — never their email. */
  name: string;
  tier: SupporterTier;
  /** Shown on Patron cards, e.g. "Founding Patron · 2026". */
  since?: string;
}

/** Year the Founding Supporters program opened (hero stat). */
export const FOUNDING_YEAR = 2026;
