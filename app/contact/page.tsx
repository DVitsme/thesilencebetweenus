import type { Metadata } from "next";
import { Eyebrow, Rule } from "@/components/site/primitives";
import { ContactForm } from "@/components/site/contact/contact-form";
import { SITE } from "@/components/site/nav-links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about The Silence Between Us, becoming a Partner or Patron, press, or partnering with us — start a conversation with Kevin Cameron's team.",
};

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/kcfilmsmedia" },
  { label: "YouTube", href: "https://www.youtube.com/@KevinCameronFilms" },
  // TODO(contact-confirm): real Facebook URL — the mockup left socials unlinked.
  { label: "Facebook", href: "#" },
];

function ContactItem({
  k,
  children,
  last,
}: {
  k: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`border-line border-t py-[18px] ${last ? "border-b" : ""}`}>
      <div className="text-muted-warm font-serif text-[15px] italic">{k}</div>
      <div className="mt-1 font-serif text-[18px]">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[28px] pt-[70px] pb-[18px] text-center">
        <Eyebrow>We&apos;d love to hear from you</Eyebrow>
        <h1 className="mx-auto mt-3.5 max-w-[680px] font-serif text-[clamp(2.5rem,5.5vw,3.5rem)] leading-[1.04] tracking-[-0.5px]">
          Start a conversation.
        </h1>
        <p className="text-ink-soft mx-auto mt-[18px] max-w-[540px] font-serif text-[20px] leading-[1.55]">
          Questions about the film, becoming a Partner or Patron, press, or partnering with us —
          write a few words and we&apos;ll get back to you personally.
        </p>
      </section>

      <Rule className="mt-[46px] max-w-[1000px]" />

      {/* Form + direct details */}
      <div className="mx-auto max-w-[1000px] px-[28px] pt-[54px] pb-[60px]">
        <div className="grid grid-cols-1 items-start gap-[58px] md:grid-cols-[1.25fr_1fr]">
          {/* Left — the form (client island) */}
          <ContactForm />

          {/* Right — other ways to reach us */}
          <aside>
            <h2 className="font-serif text-[27px] tracking-[-0.2px]">Other ways to reach us</h2>
            <p className="text-ink-soft mt-1.5 mb-6 font-serif text-[16px]">
              Prefer to write directly? We&apos;re a small team and we answer personally.
            </p>

            <div>
              <ContactItem k="Email">
                <a href={`mailto:${SITE.email}`} className="border-muted-warm border-b">
                  {SITE.email}
                </a>
              </ContactItem>
              <ContactItem k="Production" last>
                {SITE.production}
              </ContactItem>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line bg-card-paper text-ink-soft hover:border-muted-warm rounded-full border px-4 py-1.5 font-serif text-[15px] italic transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <p className="bg-tint text-ink-soft mt-6 rounded-[6px] px-5 py-[18px] font-serif text-[15px] leading-[1.5] italic">
              Donations and contributions for this film are administered by {SITE.admin}, the parent
              company of {SITE.production}.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
