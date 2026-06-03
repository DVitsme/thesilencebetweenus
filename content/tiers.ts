export type Tier = {
  id: "supporter" | "partner" | "patron" | "custom";
  name: string;
  amount: number | null; // USD; null = custom/any amount
  amountLabel: string; // what to render
  blurb: string;
  popular?: boolean;
  illustrative?: boolean; // TODO(tiers): true = price NOT confirmed by Kevin
};

// ⚠️ Only $175 (Supporter) is confirmed. Partner/Patron amounts are ILLUSTRATIVE placeholders.
export const TIERS: Tier[] = [
  {
    id: "supporter",
    name: "Supporter",
    amount: 175,
    amountLabel: "$175",
    popular: true,
    blurb: "Credit · meet & greet · wall listing · updates · first trailer look",
  },
  {
    id: "partner",
    name: "Partner",
    amount: 500,
    amountLabel: "$500",
    illustrative: true,
    blurb: "Everything in Supporter, plus premiere access & special thanks",
  },
  {
    id: "patron",
    name: "Patron",
    amount: 1500,
    amountLabel: "$1,500",
    illustrative: true,
    blurb: "Everything in Partner, plus a producer credit & private screening",
  },
  {
    id: "custom",
    name: "Give any amount",
    amount: null,
    amountLabel: "from $1",
    blurb: "Every dollar helps this story get made",
  },
];
