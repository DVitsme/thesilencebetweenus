export type Benefit = { text: string; muted?: boolean };

export type Tier = {
  id: "supporter" | "partner" | "patron" | "custom";
  name: string;
  amount: number | null; // USD; null = custom/any amount
  amountLabel: string; // what to render
  blurb: string; // one-line description (home tier table + /give tier card)
  benefits: Benefit[]; // order-summary "what you'll receive" list (/give, handoff doc 08)
  popular?: boolean;
};

/**
 * Hosted PayPal donate button (Kevin's account) — the alternative to the Stripe /give flow.
 * ⚠️ PayPal gifts bypass Stripe entirely: no webhook, no Supporters-wall row, no receipt
 * email, and no credit-name capture. Those are fulfilled manually from the PayPal dashboard.
 */
export const PAYPAL_DONATE_URL = "https://www.paypal.com/donate/?hosted_button_id=EKZZN8ES99D4J";

// Tier amounts confirmed by Kevin (2026-06-20). Single source for the home table, /give, and legal.
export const TIERS: Tier[] = [
  {
    id: "supporter",
    name: "Supporter",
    amount: 175,
    amountLabel: "$175",
    blurb: "On-screen credit · meet & greet · wall listing",
    benefits: [
      { text: `On-screen "Supporter" credit in the film` },
      { text: "Virtual meet & greet with the director & cast" },
      { text: "A permanent listing on the Founding Supporters page" },
      { text: "Quarterly production updates from set" },
      { text: "First look at the trailer, before public release" },
    ],
  },
  {
    id: "partner",
    name: "Partner",
    amount: 500,
    amountLabel: "$500",
    popular: true,
    blurb: "Everything in Supporter, plus premiere access",
    benefits: [
      { text: "Everything in Supporter, plus —" },
      { text: "Two tickets to a premiere-tour screening" },
      { text: `Your name in the film's "Special Thanks"` },
      { text: "A behind-the-scenes set update reel" },
    ],
  },
  {
    id: "patron",
    name: "Patron",
    amount: 1500,
    amountLabel: "$1,500",
    blurb: "Everything in Partner, plus a producer credit",
    benefits: [
      { text: "Everything in Partner, plus —" },
      { text: "An associate producer credit on the film" },
      { text: "An invitation to a private cast & crew screening" },
      { text: "A personal call with Kevin about the project" },
    ],
  },
  {
    id: "custom",
    name: "Give any amount",
    amount: null,
    amountLabel: "from $1",
    blurb: "Every dollar helps this story get made",
    benefits: [
      { text: "Our heartfelt thanks — every dollar helps" },
      { text: "A listing on the Founding Supporters page" },
      { text: "Quarterly production updates from set" },
      { text: "Unlock full Supporter benefits at $175", muted: true },
    ],
  },
];
