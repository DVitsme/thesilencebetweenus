import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/site/primitives";
import { SupportButton } from "@/components/site/support-button";
import { WorkGrid } from "@/components/site/portfolio/work-grid";
import { works, partners, tour, featuredFilm, type PartnerGroup } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "The Work",
  description:
    "Features, documentaries, a TV pilot, and 500+ brand films from Kevin Cameron — including a feature now streaming on Amazon Prime. The track record behind The Silence Between Us.",
};

const PROOF = [
  { big: "Prime", cap: "A feature streaming on Amazon today" },
  { big: "9–10", cap: "Cities on the premiere tour, US & Canada" },
  { big: "400+", cap: "At the sold-out Toronto premiere" },
  { big: "500+", cap: "Films produced for brands & nonprofits" },
];

const PARTNER_DISPLAY: { label: string; lead: boolean; groups: PartnerGroup[] }[] = [
  { label: "Mental health & community", lead: true, groups: ["mental-health"] },
  { label: "Education & faith", lead: false, groups: ["education", "faith"] },
  { label: "Businesses & brands", lead: false, groups: ["business", "arts"] },
];

const BIO_CHIPS = [
  "Oakwood University",
  "Former school principal",
  "Take 3 Media",
  "Seventh-day Adventist filmmaker",
  "Teaches the craft",
];

const GALLERY = [
  { src: "/portfolio/press/reno-screening-preshow.jpg", label: "Red carpet / preshow" },
  { src: "/portfolio/press/reno-screening-qanda.jpg", label: "Q&A with the director" },
  { src: "/images/kevin-in-director-shirt-working-on-shoot.jpg", label: "The director working" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

// Lead the grid with the film this site is funding.
const silence = works.find((w) => w.slug === "the-silence-between-us");
const orderedWorks = silence
  ? [silence, ...works.filter((w) => w.slug !== "the-silence-between-us")]
  : works;

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[34px] pt-14 pb-3 text-center">
        <Eyebrow>The work behind the film</Eyebrow>
        <h1 className="mx-auto mt-3 max-w-[700px] font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.5px]">
          Before you back the next one, see the last ten years.
        </h1>
        <p className="text-ink-soft mx-auto mt-4 max-w-[560px] font-serif text-[20px] leading-[1.55]">
          Kevin Cameron isn&apos;t a first-timer with a dream and a camera. Here&apos;s the proof —
          the films, the tour, and the people who&apos;ve trusted him to tell their stories.
        </p>
      </section>

      {/* Proof bar */}
      <div className="border-line bg-card-paper mt-8 border-y">
        <div className="mx-auto grid max-w-[1080px] grid-cols-2 md:grid-cols-4">
          {PROOF.map((s, i) => (
            <div
              key={s.big}
              className={`border-line px-4 py-[26px] text-center ${i % 2 === 0 ? "border-r" : ""
                } ${i < 2 ? "border-b md:border-b-0" : ""} ${i !== PROOF.length - 1 ? "md:border-r" : ""}`}
            >
              <div className="font-serif text-[38px] leading-[0.9]">{s.big}</div>
              <div className="text-ink-soft mt-1.5 font-serif text-[14px] leading-[1.35] italic">
                {s.cap}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured film spotlight */}
      <section className="bg-dark text-on-dark py-[60px]">
        <div className="mx-auto max-w-[1080px] px-[34px]">
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
            {/* wrapper is the grid item (centered); the aspect box has a definite width
                (w-full) so aspect-ratio resolves a real height for the fill image */}
            {/* wrapper is the grid item (centered); the <a> below is the aspect box
                with a definite width (w-full) so aspect-ratio resolves a real height
                for the fill image — and it doubles as the trailer link + play affordance */}
            <div>
              <a
                href={featuredFilm.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch the ${featuredFilm.title} trailer`}
                className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-[#3a352b]"
              >
                <Image
                  src={featuredFilm.image}
                  alt={`${featuredFilm.title} — trailer still`}
                  fill
                  sizes="(max-width: 820px) 100vw, 560px"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
                {/* gentle scrim so the play button + badge read on any still */}
                <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
                {/* play affordance — decoration + function (links to the trailer) */}
                <span className="absolute top-1/2 left-1/2 grid size-[62px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-[#efe9da] bg-black/25 backdrop-blur-[1px] transition-colors group-hover:bg-black/40">
                  <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-[#efe9da]" />
                </span>
                <span className="bg-on-dark text-dark absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-serif text-[12.5px] italic">
                  <span className="bg-gold-deep size-1.5 rounded-full" />
                  Now on Amazon Prime
                </span>
              </a>
            </div>
            <div>
              <span className="text-on-dark-muted mb-1 block font-serif text-[16px] italic">
                Featured film
              </span>
              <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.04] tracking-[-0.5px] text-white">
                {featuredFilm.title}
              </h2>
              <p className="mt-2 mb-4 font-serif text-[20px] text-[#d8cdb4] italic">
                The film he waited ten years — and then refused to wait any longer — to make.
              </p>
              <p className="text-on-dark-soft mb-4 font-serif text-[17px] leading-[1.7]">
                Conceived in Cleveland in 2013, shelved when the funding fell through, and finally
                self-funded and shot in a matter of weeks in 2024. It premiered in Toronto to a
                sold-out house of 400+, then toured churches and theaters across the US and Canada.
                Today it streams on Amazon Prime.
              </p>
              <p className="text-on-dark-muted mb-6 font-serif text-[15.5px] italic">
                Written by &amp; starring{" "}
                <a
                  href={featuredFilm.cast[0].imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-dark border-b border-[#6a6151] not-italic"
                >
                  {featuredFilm.cast[0].name}
                </a>{" "}
                · directed &amp; produced by Kevin Cameron
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={featuredFilm.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-ink hover:bg-gold-deep inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 font-serif text-[16.5px] italic transition-colors hover:border-gold-deep hover:text-white"
                >
                  ▶ Watch the trailer
                </a>
                <a
                  href={featuredFilm.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-dark hover:bg-on-dark hover:text-dark inline-flex items-center gap-2 rounded-full border border-[#6a6151] px-6 py-3 font-serif text-[16.5px] italic transition-colors"
                >
                  Watch on Prime
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body of work */}
      <section id="work" className="px-[34px] py-[60px]">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <Eyebrow>A decade of work</Eyebrow>
            <SectionHeading>Real films. Real range.</SectionHeading>
          </div>
          <WorkGrid works={orderedWorks} />
          <p className="text-muted-warm mt-7 text-center font-serif text-[15px] italic">
            A selection. Hundreds more productions across fifteen years of work.
          </p>
        </div>
      </section>

      {/* The tour */}
      <section className="bg-tint px-[34px] py-10 sm:py-20">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <Eyebrow>The tour</Eyebrow>
            <SectionHeading>From Toronto to sold-out rooms across the country.</SectionHeading>
            <p className="text-ink-soft mx-auto mt-2 max-w-[560px] font-serif text-[18px]">
              <em>For His Name&apos;s Sake</em> didn&apos;t just get made — it traveled, city to
              city, to audiences who showed up dressed up.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-[840px]">
            {tour.map((s, i) => (
              <div
                key={s.city}
                className={`border-line grid grid-cols-1 items-baseline gap-x-6 gap-y-1 border-t py-5 md:grid-cols-[170px_1fr] ${i === tour.length - 1 ? "border-b" : ""
                  }`}
              >
                <div className="font-serif text-[23px]">
                  {s.city}
                  <em className="text-muted-warm mt-0.5 block font-serif text-[14px] italic">
                    {s.venue} · {fmtDate(s.date)}
                  </em>
                </div>
                <div className="text-ink-soft font-serif text-[16px]">
                  {s.note ?? "A stop on the multi-city premiere tour."}
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted-warm mt-5 text-center font-serif text-[15px] italic">
            Stops from the multi-city premiere tour.
          </p>
        </div>
      </section>

      {/* Trusted by */}
      <section className="px-[34px] py-[60px]">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <Eyebrow>Trusted to tell their stories</Eyebrow>
            <SectionHeading>Organizations that put their name beside his.</SectionHeading>
          </div>
          <div className="mt-9">
            {PARTNER_DISPLAY.map((grp) => {
              const logos = partners.filter((p) => grp.groups.includes(p.group));
              if (!logos.length) return null;
              return (
                <div key={grp.label} className="mb-8">
                  <div
                    className={`mb-3.5 text-center font-serif text-[15.5px] italic ${grp.lead ? "text-gold-deep" : "text-muted-warm"
                      }`}
                  >
                    {grp.label}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {logos.map((p) => (
                      <div
                        key={p.name}
                        title={p.name}
                        className="border-line bg-card-paper relative h-[64px] w-[160px] rounded-[5px] border"
                      >
                        <Image
                          src={p.logo}
                          alt={p.name}
                          fill
                          sizes="160px"
                          className="object-contain p-3.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-muted-warm mt-1 text-center font-serif text-[15px] italic">
            The mental-health and community partners above know this terrain — the same ground{" "}
            <em>The Silence Between Us</em> walks.
          </p>
        </div>
      </section>

      {/* Who is Kevin (links to /about) */}
      <section className="bg-tint px-[34px] py-[60px]">
        <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-10 md:grid-cols-[200px_1fr]">
          <div className="border-line relative mx-auto h-[200px] w-[200px] overflow-hidden rounded-full border">
            <Image
              src="/portfolio/team/kevin-cameron-headshot.jpg"
              alt="Kevin Cameron"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          <div>
            <Eyebrow>Who&apos;s behind the camera</Eyebrow>
            <p className="mb-3.5 font-serif text-[27px] leading-[1.34] tracking-[-0.2px] italic">
              He&apos;s been telling stories his whole life — long before independent film was
              something people talked about.
            </p>
            <div className="mb-5 flex flex-wrap gap-2.5">
              {BIO_CHIPS.map((c) => (
                <span
                  key={c}
                  className="border-line bg-card-paper text-ink-soft rounded-full border px-3.5 py-1.5 font-serif text-[14px] italic"
                >
                  {c}
                </span>
              ))}
            </div>
            <Link
              href="/about"
              className="border-ink hover:bg-ink hover:text-paper inline-flex items-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors"
            >
              Read Kevin&apos;s full story →
            </Link>
          </div>
        </div>
      </section>

      {/* From the room */}
      <section className="px-[34px] py-[60px]">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <Eyebrow>From the room</Eyebrow>
            <SectionHeading>What it looks like when the work lands.</SectionHeading>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {GALLERY.map((g) => (
              <div
                key={g.label}
                title={g.label}
                className="border-line relative aspect-[4/3] overflow-hidden rounded-[5px] border"
              >
                <Image
                  src={g.src}
                  alt={g.label}
                  fill
                  sizes="(max-width: 820px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div
              title="Toronto premiere"
              className="border-line relative aspect-[4/3] overflow-hidden rounded-[5px] border"
            >
              <Image
                src="/images/shooting-client-on-set.jpg"
                alt="shooting client on set"
                fill
                sizes="(max-width: 820px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-muted-warm mt-4 text-center font-serif text-[15px] italic">
            Screening photos from the premiere tour.
          </p>
        </div>
      </section>

      {/* Bridge CTA → support */}
      <section className="bg-dark text-on-dark px-[34px] py-10 text-center sm:py-[72px]">
        <div className="mx-auto max-w-[760px]">
          <span className="text-on-dark-muted block font-serif text-[16px] italic">
            You&apos;ve seen the work
          </span>
          <h2 className="mx-auto mt-3 mb-3 max-w-[680px] font-serif text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.06] tracking-[-0.5px] text-white">
            Now help build the next one.
          </h2>
          <p className="text-on-dark-soft mx-auto mb-7 max-w-[560px] font-serif text-[19px]">
            When you back <em>The Silence Between Us</em>, you&apos;re not donating — you&apos;re
            producing. A front-row seat to the journey, your name in the credits, and a story that
            matters. Let&apos;s build it together.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <SupportButton>Become a Founding Supporter →</SupportButton>
            <Link
              href="/about"
              className="text-on-dark hover:bg-on-dark hover:text-dark inline-flex items-center gap-2 rounded-full border border-[#6a6151] px-7 py-3 font-serif text-[16.5px] italic transition-colors"
            >
              Meet the filmmaker
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
