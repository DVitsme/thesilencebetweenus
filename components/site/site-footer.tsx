import Link from "next/link";
import { SITE } from "./nav-links";

const COLS = [
  {
    h: "The film",
    links: [
      { label: "The story", href: "/#story" },
      { label: "The work", href: "/portfolio" },
      { label: "About Kevin", href: "/about" },
      { label: "Supporters", href: "/supporters" },
    ],
  },
  {
    h: "Support",
    links: [
      { label: "Become a Supporter", href: "/give" },
      { label: "Founding Supporters", href: "/supporters" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    h: "Legal",
    links: [
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Contribution Terms", href: "/legal/contributions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#15140f] px-6 pt-14 pb-9 text-[#c9bfa9] md:px-[34px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-9 md:grid-cols-4 md:gap-[38px]">
        <div className="col-span-2 md:col-span-1">
          <div className="text-on-dark text-[15px] font-medium tracking-[0.13em] uppercase">
            {SITE.name}
          </div>
          <p className="mt-3.5 max-w-[280px] font-serif text-[15px] leading-relaxed text-[#a59d8c] italic">
            A feature film about what our young people carry in silence — and what happens when
            somebody finally listens. A {SITE.production} production.
          </p>
        </div>

        {COLS.map((c) => (
          <div key={c.h}>
            <h2 className="text-on-dark-muted mb-3.5 font-serif text-[15px] italic">{c.h}</h2>
            {c.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="mb-2.5 block text-[15.5px] text-[#c9bfa9] transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* 988 crisis line — REQUIRED (locked decision). Keep visible site-wide. */}
      <div className="mx-auto mt-11 max-w-[1120px] border-t border-[#2c2a22] pt-5">
        <p className="text-on-dark-soft font-serif text-[14.5px] italic">
          If you or a teen you love is struggling, you are not alone. Call or text{" "}
          <a
            href="tel:988"
            className="text-on-dark border-b border-[#3a352b] font-medium not-italic"
          >
            988
          </a>{" "}
          — the Suicide &amp; Crisis Lifeline, free and confidential, 24/7.
        </p>
      </div>

      <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap justify-between gap-4 font-serif text-[13.5px] text-[#85806f] italic">
        <span>
          © 2026 {SITE.name} · {SITE.production}. Donations administered by {SITE.admin}.
        </span>
        <span>
          Secure payments via Stripe ·{" "}
          <a href={`mailto:${SITE.email}`} className="border-b border-[#3a352b] text-[#a59d8c]">
            {SITE.email}
          </a>
        </span>
      </div>
    </footer>
  );
}
