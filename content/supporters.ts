/**
 * Founding Supporters roster — feeds the recognition wall (/supporters) and the
 * site's strongest social proof. Render this; never hardcode names in components.
 *
 * TODO(data): replace this placeholder roster with a real read from whatever
 * `recordSupporter()` writes in the Stripe webhook (handoff doc 08 §7 — on
 * Cloudflare that's likely D1/KV). The hero counts and the wall both derive
 * from this array, so swapping the source updates the whole page.
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

// ⚠️ Placeholder names — for design only, not real supporters. Replace via TODO(data) above.
const partnerNames = [
  "The Johnson Family",
  "Maranatha SDA Church",
  "R. & T. Okafor",
  "Deborah Whitfield",
  "Cornerstone Media Group",
  "James A. Sinclair",
  "The Reyes Household",
  "Pastor D. Snell",
];

const supporterNames = [
  "A. Rivera",
  "Grace Chapel Youth",
  "M. Thompson",
  "The Doe Family",
  "K. Patel",
  "Nathaniel Brooks",
  "Simone & Co.",
  "The Adeyemi Family",
  "L. Carter",
  "Hope Fellowship",
  "J. Nakamura",
  "Brianna Hughes",
  "The Mensah Family",
  "C. Daniels",
  "Olivia Grant",
  "T. Robinson",
  "Faith & Film Club",
  "D. Osei",
  "The Park Family",
  "Renee Coleman",
  "S. Abara",
  "Michael Tran",
  "The Lewis Family",
  "A. Fernández",
  "Gabriel Santos",
  "The Owusu Family",
  "P. Nguyen",
  "Hannah Bright",
  "J. Mbeki",
  "The Carter Twins",
  "Elaine Foster",
  "D. & M. Quaye",
  "Stephen Ade",
  "The Hill Family",
  "Yvonne Clarke",
  "R. Donovan",
];

export const supporters: Supporter[] = [
  // The Founding Circle — Patrons (featured)
  { name: "The Cameron Family", tier: "patron", since: `Founding Patron · ${FOUNDING_YEAR}` },
  { name: "Grace & Mercy Foundation", tier: "patron", since: `Founding Patron · ${FOUNDING_YEAR}` },
  { name: "Dr. Marcus & Lila Bennett", tier: "patron", since: `Founding Patron · ${FOUNDING_YEAR}` },

  ...partnerNames.map((name) => ({ name, tier: "partner" as const })),
  ...supporterNames.map((name) => ({ name, tier: "supporter" as const })),
];
