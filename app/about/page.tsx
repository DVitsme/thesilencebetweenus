import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow, SectionHeading, Rule } from "@/components/site/primitives";
import { SupportButton } from "@/components/site/support-button";

export const metadata: Metadata = {
  title: "About Kevin Cameron",
  description:
    "Kevin Cameron — author, educator, and filmmaker behind The Silence Between Us. A former school principal telling an honest, hopeful story about the anxiety and depression teenagers carry in silence.",
};

// Dark "record" band — same treatment as the home proof band (design system §5).
const RECORD_STATS = [
  { big: "500+", cap: "Films produced for brands, churches & nonprofits" },
  { big: "400+", cap: "At the sold-out Toronto premiere" },
  { big: "11", cap: "Cities on the premiere tour, US & Canada" },
  { big: "Amazon", cap: "A feature of his streaming on Prime today" },
];

const SIGNATURE_WORK = [
  {
    title: "For His Name Sake",
    note: "Feature film · premiered Toronto, 2024 · multi-city tour",
    year: "2024",
  },
  {
    title: "The Calling & documentary work",
    note: "Including community films on at-risk youth in Cleveland",
    year: "Docs",
  },
  { title: "Hush", note: "His first feature — where the climb began", year: "2009" },
];

const VALUES = [
  {
    h: "Excellence, always",
    p: "He has no patience for the idea that a faith-rooted or independent film has to look cheap. He wants a real movie in every way — one that hits every mark.",
  },
  {
    h: "Faith, woven in",
    p: "A devout Seventh-day Adventist and Oakwood alum, Kevin treats storytelling as calling and ministry — “for His glory, for our good, and for others” — never bolted on, never preachy.",
  },
  {
    h: "Support as participation",
    p: "When you back a film like this, you're not giving charity — you're producing. Good work happens when people participate with more than words of encouragement.",
  },
];

const FACTS = [
  { b: "Roots", v: "Toronto, Canada" },
  { b: "Based", v: "Tampa, Florida" },
  { b: "Studied", v: "Oakwood University" },
  { b: "Before film", v: "school principal & teacher" },
  { b: "Labels", v: "Take 3 Media · KC Films & Media" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[34px] pt-10 pb-6 text-center sm:pt-20">
        <Eyebrow>The filmmaker behind the film</Eyebrow>
        <h1 className="mx-auto mt-3 max-w-[720px] font-serif text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.05] tracking-[-0.6px]">
          Kevin Cameron has been telling stories his whole life.
        </h1>
        <p className="text-ink-soft mx-auto mt-4 max-w-[560px] font-serif text-[19px] italic">
          Author, educator, producer, director, writer — but above all, a storyteller.{" "}
          <em className="not-italic">The Silence Between Us</em> is the one he can&apos;t stay quiet
          about.
        </p>
      </section>

      {/* Intro two-up */}
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <div className="grid items-center gap-11 py-12 md:grid-cols-[1fr_1.25fr]">
          <div className="border-line relative aspect-[4/5] w-full overflow-hidden rounded-[4px] border">
            <Image
              src="/images/kevin-speaking.jpg"
              alt="Kevin Cameron, filmmaker and former educator"
              fill
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-cover"
            />
          </div>
          <div className="font-serif text-[20px] leading-[1.7]">
            <p className="mb-4">
              He&apos;s been telling stories for as long as he can remember — long before independent
              film was something people talked about. He was the kid performing skits at school
              assemblies, and later the educator always making videos.
            </p>
            <p>
              Canadian-born, Oakwood University&ndash;educated, and now based in Tampa, he left a
              career as a school principal and teacher to answer a clear call: to tell stories that
              matter. He&apos;s been building toward that ever since.
            </p>
          </div>
        </div>
      </div>

      <Rule className="my-12" />

      {/* The long climb */}
      <section className="mx-auto max-w-[680px] px-[34px] py-2">
        <Eyebrow>The long climb</Eyebrow>
        <SectionHeading className="mb-5">From good to great — the hard way.</SectionHeading>
        <div className="font-serif text-[19px] leading-[1.78]">
          <p className="mb-5">
            <span className="text-gold-deep italic">
              It didn&apos;t come easy, and he&apos;d be the first to tell you so.
            </span>{" "}
            His first feature, <em>Hush</em>, came out in 2009. He looks back at it now and laughs
            &mdash; &ldquo;when I look back, it was trash.&rdquo; The growth is the whole point. He
            paid his dues making documentaries, commercials, and promos for businesses, churches, and
            nonprofits &mdash; more than five hundred productions over the years &mdash; sharpening
            his craft on other people&apos;s stories until he knew it was time to tell his own.
          </p>
          <p className="mb-5">
            His feature <em>For His Name Sake</em> was first conceived in Cleveland back in
            2013 &mdash; cast, table-read, ready to go. Then the funding fell through, and it sat on a
            shelf for nearly a decade. Most people would have let it die there. In December 2023,
            rather than wait any longer for permission or funding, Kevin and his creative partner Roma
            decided to make it themselves &mdash; and shot it in a matter of weeks.
          </p>
          <p>
            He didn&apos;t wait for anyone&apos;s permission; he and Roma funded the film themselves.
            That instinct &mdash; to own the work, to finish what he starts, and to refuse to take a
            closed door as the final word &mdash; is the engine behind everything he makes.
          </p>
        </div>
      </section>

      {/* Pull quote */}
      <div className="bg-tint my-10 px-[34px] py-10 text-center sm:my-14 sm:py-16">
        <p className="mx-auto max-w-[760px] font-serif text-[clamp(1.6rem,4vw,2.0625rem)] leading-[1.34] tracking-[-0.3px] italic">
          &ldquo;God put the burden on me to tell stories.&rdquo;
        </p>
        <p className="text-muted-warm mt-5 font-serif text-[16px] italic">&mdash; Kevin Cameron</p>
      </div>

      {/* The record — dark band */}
      <section className="bg-dark text-on-dark my-10 py-10 sm:my-14 sm:py-[72px]">
        <div className="mx-auto max-w-[1120px] px-[34px]">
          <span className="text-on-dark-muted mb-2 block text-center font-serif text-[16px] italic">
            Why you can trust the work
          </span>
          <h2 className="mx-auto mb-9 max-w-[620px] text-center font-serif text-[clamp(1.9rem,4vw,2.125rem)] leading-[1.12] tracking-[-0.3px] text-white">
            A track record of meaningful storytelling
          </h2>

          <div className="mx-auto mb-11 grid max-w-[840px] grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {RECORD_STATS.map((s) => (
              <div key={s.big} className="text-center">
                <div className="font-serif text-[44px] leading-[0.9]">{s.big}</div>
                <div className="text-on-dark-muted mt-2 font-serif text-[14.5px] leading-[1.35] italic">
                  {s.cap}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-[840px] border-t border-[#3a352b]">
            {SIGNATURE_WORK.map((w) => (
              <div
                key={w.title}
                className="grid grid-cols-[1fr_auto] items-baseline gap-5 border-b border-[#3a352b] py-[18px]"
              >
                <div className="font-serif text-[21px]">
                  {w.title}
                  <em className="text-on-dark-soft mt-0.5 block text-[15px] italic">{w.note}</em>
                </div>
                <div className="text-on-dark-muted font-serif text-[16px] whitespace-nowrap italic">
                  {w.year}
                </div>
              </div>
            ))}
          </div>

          <p className="text-on-dark-soft mt-8 text-center font-serif text-[16px] italic">
            A fuller look at his work is coming soon —{" "}
            <Link href="/portfolio" className="border-b border-[#6a6151] not-italic">
              view the portfolio →
            </Link>
          </p>
        </div>
      </section>

      {/* Why this story, why now */}
      <section className="mx-auto max-w-[1120px] px-[34px] py-2">
        <div className="grid items-center gap-11 md:grid-cols-[1.25fr_1fr]">
          <div>
            <Eyebrow>Why this story, why now</Eyebrow>
            <SectionHeading className="mb-5">Before film, these kids were his students.</SectionHeading>
            <div className="font-serif text-[19px] leading-[1.78]">
              <p className="mb-5">
                Kevin didn&apos;t come to <em>The Silence Between Us</em> as an outsider. He spent
                years inside the school system as a principal and a teacher &mdash; which means the
                teenagers at the heart of this film aren&apos;t strangers to him. He has sat across
                from them. He has watched bright, hurting kids carry anxiety and depression in total
                silence, afraid to open up to the very people who love them most.
              </p>
              <p>
                His documentary work has long centered on young people at risk. This film sits right
                where his heart and his history meet: honest about the struggle, never hopeless. A
                hard truth, told with hope &mdash; and the quiet, enormous importance of being seen,
                heard, and understood.
              </p>
            </div>
          </div>
          <div className="border-line relative aspect-[5/4] w-full overflow-hidden rounded-[4px] border">
            <Image
              src="/images/teacher-at-school.jpg"
              alt="A teacher with students in a classroom"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Rule className="my-12" />

      {/* What he believes */}
      <section className="px-[34px] py-2">
        <div className="mx-auto max-w-[1120px] text-center">
          <Eyebrow>What he believes</Eyebrow>
          <SectionHeading>The values behind the work.</SectionHeading>
        </div>
        <div className="mx-auto mt-9 grid max-w-[1000px] gap-9 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.h} className="border-line border-t pt-[18px]">
              <h3 className="mb-2 flex items-baseline gap-2.5 font-serif text-[22px] tracking-[-0.2px]">
                <span className="om-diamond mt-[0.4rem] shrink-0" />
                {v.h}
              </h3>
              <p className="text-ink-soft font-serif text-[16.5px] leading-[1.6]">{v.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick facts */}
      <section className="px-[34px] pt-12">
        <div className="mx-auto flex max-w-[820px] flex-wrap justify-center gap-2.5">
          {FACTS.map((f) => (
            <span
              key={f.b}
              className="border-line bg-card-paper text-ink-soft rounded-full border px-[18px] py-2 font-serif text-[15px] italic"
            >
              <b className="text-ink font-medium not-italic">{f.b}</b> · {f.v}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className=" my-8 px-[34px] pt-16 pb-4 text-center">
        <Eyebrow>Be part of it</Eyebrow>
        <h2 className="mx-auto mb-3 max-w-[600px] font-serif text-[clamp(2rem,4.5vw,2.375rem)] leading-[1.1] tracking-[-0.4px]">
          Help Kevin tell the one he can&apos;t stay quiet about.
        </h2>
        <p className="text-ink-soft mx-auto mb-7 max-w-[520px] font-serif text-[19px]">
          Back <em>The Silence Between Us</em> and join the Founding Supporters behind the film.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <SupportButton>Become a Supporter →</SupportButton>
          <Link
            href="/contact"
            className="border-ink hover:bg-ink hover:text-paper inline-flex items-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
