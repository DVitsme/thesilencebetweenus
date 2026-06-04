import { getCloudflareContext } from "@opennextjs/cloudflare";
import { FOUNDING_YEAR, type Supporter, type SupporterTier } from "@/content/supporters";

/**
 * Founding Supporters data layer (Cloudflare D1, task #12). The Stripe webhook
 * writes one row per successful contribution; `/supporters` reads the public
 * columns for the recognition wall.
 *
 * `DB` is a D1Database — an OBJECT binding, so it lives on
 * `getCloudflareContext().env`, NOT `process.env` (which only holds string vars
 * + secrets). Available in dev (initOpenNextCloudflareForDev), preview, and prod.
 *
 * PRIVACY: only `credit_name` + `display_tier` are ever exposed. Email, amount,
 * and the billing name stay server-side for admin + dedupe — never queried here.
 */

function db(): D1Database {
  const binding = getCloudflareContext().env.DB;
  if (!binding) throw new Error("D1 binding `DB` is not configured (see wrangler.jsonc)");
  return binding;
}

/** Map a checkout tier id to a wall bucket. Custom / unknown -> supporter. */
export function displayTier(tierId: string): SupporterTier {
  return tierId === "patron" || tierId === "partner" ? tierId : "supporter";
}

export type NewSupporter = {
  stripePaymentIntent: string;
  tierId: string;
  creditName: string;
  supporterName: string;
  amountCents: number;
  email: string | null;
  createdAt: string; // ISO 8601
};

/**
 * Idempotent write from the webhook. A re-delivered PI is a no-op (UNIQUE
 * stripe_payment_intent + ON CONFLICT DO NOTHING). Throws if `DB` is missing so
 * a misconfig surfaces as a webhook 500 -> Stripe retries (never a silent loss).
 */
export async function recordSupporter(row: NewSupporter): Promise<void> {
  await db()
    .prepare(
      `INSERT INTO supporters
         (stripe_payment_intent, display_tier, tier_id, credit_name, supporter_name, amount_cents, email, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
       ON CONFLICT(stripe_payment_intent) DO NOTHING`,
    )
    .bind(
      row.stripePaymentIntent,
      displayTier(row.tierId),
      row.tierId || "custom",
      row.creditName.slice(0, 120),
      row.supporterName.slice(0, 120),
      Math.max(0, Math.round(row.amountCents || 0)),
      row.email,
      row.createdAt,
    )
    .run();
}

type PublicRow = { credit_name: string; display_tier: SupporterTier; created_at: string };

/**
 * Public roster for the wall — credit name + tier only, ordered patron -> partner
 * -> supporter, then oldest-first. A missing `DB` binding returns [] so the
 * marketing page renders its empty state instead of 500-ing.
 */
export async function listPublicSupporters(): Promise<Supporter[]> {
  const binding = getCloudflareContext().env.DB;
  if (!binding) return [];

  const { results } = await binding
    .prepare(
      `SELECT credit_name, display_tier, created_at
         FROM supporters
        WHERE credit_name <> ''
        ORDER BY CASE display_tier WHEN 'patron' THEN 0 WHEN 'partner' THEN 1 ELSE 2 END,
                 created_at ASC`,
    )
    .all<PublicRow>();

  return results.map((r) => ({
    name: r.credit_name,
    tier: r.display_tier,
    since: r.display_tier === "patron" ? `Founding Patron · ${yearOf(r.created_at)}` : undefined,
  }));
}

function yearOf(iso: string): number {
  const y = new Date(iso).getUTCFullYear();
  return Number.isFinite(y) ? y : FOUNDING_YEAR;
}
