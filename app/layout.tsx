import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // domain via NEXT_PUBLIC_SITE_URL (lib/site.ts); set per environment
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:border focus:border-ink focus:bg-paper focus:px-5 focus:py-2.5 focus:font-serif focus:text-[15px] focus:text-ink focus:italic focus:shadow-lg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
