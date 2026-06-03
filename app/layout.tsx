import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thesilencebetweenus.film"), // TODO(domain): confirm production domain
  title: {
    default: "The Silence Between Us — A film by Kevin Cameron",
    template: "%s — The Silence Between Us",
  },
  description:
    "A feature film about the anxiety and depression teenagers carry in silence — and the teacher who helps them be seen. Become a Founding Supporter.",
  openGraph: {
    type: "website",
    siteName: "The Silence Between Us",
    title: "The Silence Between Us",
    description: "Some battles a teenager fights are completely silent. Help tell this story.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      {/*
       * suppressHydrationWarning is scoped to <body> only. Browser extensions
       * (ColorZilla, password managers, dark-mode forcers, Grammarly) inject
       * attributes like `cz-shortcut-listen="true"` on <body> before React
       * hydrates — a benign mismatch. This flag silences that one node; it does
       * NOT hide real hydration bugs inside the tree.
       */}
      <body suppressHydrationWarning>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
