import Link from "next/link";
import { Eyebrow, Rule } from "@/components/site/primitives";
import styles from "./legal.module.css";

export type LegalPage = "terms" | "privacy" | "contributions";
type TocItem = { id: string; label: string };

const NAV: { id: LegalPage; href: string; label: string }[] = [
  { id: "terms", href: "/legal/terms", label: "Terms of Use" },
  { id: "privacy", href: "/legal/privacy", label: "Privacy Policy" },
  { id: "contributions", href: "/legal/contributions", label: "Contribution Terms" },
];

/**
 * Shared chrome for the three legal pages (handoff doc 14): header + pill nav across the
 * legal routes + a sticky numbered TOC alongside the auto-numbered document body. The site
 * header/footer come from app/layout.tsx, so this renders page content only.
 *
 * The "Draft for review" banner is baked in here so it can never be quietly dropped from a page.
 */
export function LegalLayout({
  title,
  updated,
  toc,
  current,
  intro,
  reviewedBy = "qualified legal counsel",
  children,
}: {
  title: string;
  updated: string;
  toc: TocItem[];
  current: LegalPage;
  intro: React.ReactNode;
  reviewedBy?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="px-7 pt-[58px] pb-[30px] text-center">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="font-serif text-[clamp(2.375rem,5vw,3.125rem)] leading-[1.06] tracking-[-0.5px]">
          {title}
        </h1>
        <p className="text-muted-warm mt-3 font-serif text-[15px] italic">Last updated: {updated}</p>
        <nav className="mt-6 flex flex-wrap justify-center gap-2">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              aria-current={n.id === current ? "page" : undefined}
              className={`rounded-full border px-[18px] py-[7px] font-serif text-[15px] italic transition-colors ${
                n.id === current
                  ? "border-ink bg-gold text-ink"
                  : "border-line bg-card-paper text-ink-soft hover:border-muted-warm"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </section>

      <Rule className="mt-[34px] max-w-[1000px]" />

      <div className="mx-auto max-w-[1000px] px-7 pt-[46px] pb-[64px]">
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-[230px_1fr] md:items-start md:gap-[54px]">
          <aside className="md:sticky md:top-[30px]">
            <span className="text-muted-warm mb-3 block font-serif text-[15px] italic">
              On this page
            </span>
            <ol className={styles.toc}>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.label}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className={styles.doc}>
            <div className={styles.editorNote}>
              Draft for review. This document is a plain-language starting point for The Silence
              Between Us and should be reviewed by {reviewedBy} before publication.
            </div>
            <p className={styles.intro}>{intro}</p>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

/** One numbered document section. The number comes from the CSS counter on the heading. */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** Muted caption-sized note inside the document body. */
export function LegalSmall({ children }: { children: React.ReactNode }) {
  return <p className={styles.small}>{children}</p>;
}

/** Highlighted callout (gold left rule) for an emphasized passage, e.g. the tax note. */
export function LegalCallout({ children }: { children: React.ReactNode }) {
  return <div className={styles.callout}>{children}</div>;
}

/** Inline link in the legal serif style; routes internally, opens mailto/external as a plain anchor. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a className={styles.inline} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className={styles.inline} href={href}>
      {children}
    </Link>
  );
}
