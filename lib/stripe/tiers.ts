import { TIERS } from "@/content/tiers";

/**
 * Stripe charge config + server-authoritative amount validation.
 *
 * Prices derive from `content/tiers.ts` (the single source of tier dollar
 * amounts) so the checkout UI and the server can never drift. This module is
 * safe to import from client code too (no server-only deps) — e.g. the GiveForm
 * reads CURRENCY here.
 *
 * ⚠️ Only $175 (Supporter) is confirmed. Partner/Patron are illustrative until
 * Kevin confirms — see TODO(tiers) in content/tiers.ts.
 */

export const CURRENCY = "usd";
export const MIN_CENTS = 100; // $1 floor for "any amount"
export const MAX_CENTS = 5_000_00; // $5,000 ceiling — raise if a confirmed tier exceeds it

/** tier id → fixed amount in cents (null = custom / any amount). */
export const TIER_AMOUNTS: Record<string, number | null> = Object.fromEntries(
  TIERS.map((t) => [t.id, t.amount == null ? null : Math.round(t.amount * 100)]),
);

/**
 * Resolve a trustworthy amount in cents from a tier id (+ an optional custom
 * amount). NEVER trust a client-supplied amount for a fixed tier. An unknown
 * tier id falls through to the custom/any-amount path. Throws "invalid_amount"
 * when the custom amount is out of range.
 */
export function resolveAmountCents(tier: string, customCents?: number): number {
  const fixed = TIER_AMOUNTS[tier];
  if (fixed != null) return fixed;

  const cents = Math.round(Number(customCents));
  if (!Number.isFinite(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
    throw new Error("invalid_amount");
  }
  return cents;
}
