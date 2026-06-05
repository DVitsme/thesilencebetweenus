export const PROOF_STATS = [
  { big: "Amazon", cap: "A feature of his streaming on Prime today" },
  { big: "9–10", cap: "Cities on the premiere tour, US & Canada" },
  { big: "400+", cap: "At the sold-out Toronto premiere" },
  { big: "500+", cap: "Films produced for brands & nonprofits" },
];

export type PartnerLogo = { name: string; src: string };

// Mental-health group LEADS (it de-risks this specific film). See design system §5.
// Logos live in public/images/partners-logos/. This is a curated subset of what Kevin provided
// (the brand logos are held back for the portfolio) — swap or extend freely.
export const PARTNER_GROUPS: { label: string; lead: boolean; logos: PartnerLogo[] }[] = [
  {
    label: "Trusted to tell their stories · mental health & community",
    lead: true,
    logos: [
      {
        name: "Murtis Taylor Human Services",
        src: "/images/partners-logos/Murtis-Taylor-Human-Services-Logo.png",
      },
      {
        name: "Cleveland Peacemakers Alliance",
        src: "/images/partners-logos/Cleveland-peacemakers-allience-logo.png",
      },
      {
        name: "Homewatch CareGivers",
        src: "/images/partners-logos/homewatch-care-givers-logo.png",
      },
    ],
  },
  {
    label: "Education & faith",
    lead: false,
    logos: [
      {
        name: "Cleveland Metropolitan School District",
        src: "/images/partners-logos/CMSDLogoHorizontal-RGB.jpg",
      },
      {
        name: "Adam High School",
        src: "/images/partners-logos/adam-high-school-logo.jpg",
      },
      {
        name: "Southeastern Conference of Seventh-day Adventists",
        src: "/images/partners-logos/Southeastern-Converence-Seveth-Day-Advententist-Logo.jpg",
      },
    ],
  },
];
