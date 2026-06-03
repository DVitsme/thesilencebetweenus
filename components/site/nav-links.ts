export type NavItem = { label: string; href: string };

// Only / exists this pass. The rest are built later; links are correct targets now.
export const NAV_ITEMS: NavItem[] = [
  { label: "The Film", href: "/#story" },
  { label: "The Work", href: "/portfolio" },
  { label: "About Kevin", href: "/about" },
  { label: "Supporters", href: "/supporters" },
  { label: "Contact", href: "/contact" },
];

export const SITE = {
  name: "The Silence Between Us",
  tagline: "A feature film by Kevin Cameron",
  email: "kevin@kcfilmsmedia.com",
  production: "Take 3 Media",
  admin: "KC Films & Media",
} as const;
