"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Eyebrow, SectionHeading } from "@/components/site/primitives";
import type { Supporter, SupporterTier } from "@/content/supporters";

type FilterKey = "all" | SupporterTier;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "patron", label: "Patron" },
  { key: "partner", label: "Partner" },
  { key: "supporter", label: "Supporter" },
];

const PAGE = 16;

// Support CTAs link to the custom /give checkout (handoff doc 08).
const GIVE_HREF = "/give";

const HEADING = "text-[clamp(1.75rem,3.4vw,2rem)]";

export function SupportersWall({ supporters }: { supporters: Supporter[] }) {
  const patrons = useMemo(() => supporters.filter((s) => s.tier === "patron"), [supporters]);
  const people = useMemo(
    () => supporters.filter((s) => s.tier === "partner" || s.tier === "supporter"),
    [supporters],
  );

  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  const q = query.trim().toLowerCase();

  // Patrons hide entirely under the Partner/Supporter filters; otherwise they
  // narrow with the search. (Behavior ported verbatim from the mockup.)
  const patronsShown = useMemo(() => {
    if (filter === "partner" || filter === "supporter") return [];
    return patrons.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [patrons, filter, q]);

  // The "all" view shows every partner + supporter; "patron" empties this grid
  // (the Founding Circle above carries it); the tier filters narrow to one tier.
  const peopleFiltered = useMemo(() => {
    return people.filter((p) => {
      const okTier = filter === "all" ? true : filter === "patron" ? false : p.tier === filter;
      const okQ = !q || p.name.toLowerCase().includes(q);
      return okTier && okQ;
    });
  }, [people, filter, q]);

  const slice = peopleFiltered.slice(0, shown);
  const showAddTile = shown >= peopleFiltered.length;
  const showMore = shown < peopleFiltered.length;
  const showEmpty = peopleFiltered.length === 0 && patronsShown.length === 0;

  const restLabel =
    filter === "partner"
      ? "Partners"
      : filter === "supporter"
        ? "Supporters"
        : "Partners & Supporters";

  function pick(key: FilterKey) {
    setFilter(key);
    setShown(PAGE);
  }
  function onSearch(value: string) {
    setQuery(value);
    setShown(PAGE);
  }

  const chip = (active: boolean) =>
    `cursor-pointer rounded-full border px-4 py-2 font-serif text-[15px] italic whitespace-nowrap transition-colors ${
      active
        ? "border-ink bg-gold text-ink"
        : "border-line bg-paper text-ink-soft hover:border-muted-warm"
    }`;

  return (
    <>
      {/* Sticky controls — tucks just under the ~67px <SiteHeader>; static on mobile. */}
      <div className="border-line bg-card-paper static z-40 border-y md:sticky md:top-16">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-4 px-[28px] py-3.5">
          <label className="border-line bg-paper flex min-w-[200px] flex-1 items-center gap-2.5 rounded-full border px-4 py-2.5">
            <Search className="text-muted-warm size-3.5 shrink-0" aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search for a name…"
              aria-label="Search supporters by name"
              className="text-ink placeholder:text-muted-warm w-full border-none bg-transparent font-serif text-[16px] italic outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => pick(f.key)}
                className={chip(filter === f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Link
            href={GIVE_HREF}
            className="border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center gap-2 rounded-full border px-[18px] py-2 font-serif text-[15px] italic transition-colors hover:text-white"
          >
            + Add your name
          </Link>
        </div>
      </div>

      {/* The Founding Circle — Patrons */}
      {patronsShown.length > 0 && (
        <section className="px-[28px] pt-12 pb-2.5">
          <div className="mx-auto max-w-[1080px]">
            <Eyebrow>The Founding Circle</Eyebrow>
            <SectionHeading className={`mb-[22px] ${HEADING}`}>Patrons</SectionHeading>
            <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
              {patronsShown.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="bg-dark relative overflow-hidden rounded-[10px] px-6 py-[26px] text-center"
                >
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-gold" />
                  <div className="text-on-dark-muted font-serif text-[13px] tracking-[1px] italic">
                    ✦ Patron
                  </div>
                  <div className="mt-2 font-serif text-[27px] leading-[1.15] text-white">
                    {p.name}
                  </div>
                  {p.since && (
                    <div className="mt-2 font-serif text-[13.5px] text-[#9a8f78] italic">
                      {p.since}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners & Supporters */}
      <section className="px-[28px] pt-2.5 pb-12">
        <div className="mx-auto max-w-[1080px]">
          <Eyebrow>{restLabel}</Eyebrow>
          <SectionHeading className={`mb-[22px] ${HEADING}`}>With gratitude</SectionHeading>

          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {slice.map((p, i) => {
              const partner = p.tier === "partner";
              return (
                <div
                  key={`${p.name}-${i}`}
                  className={`flex min-h-[78px] flex-col justify-center gap-1.5 rounded-[7px] border px-[18px] py-4 transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_10px_22px_-16px_rgba(0,0,0,0.4)] ${
                    partner ? "border-[#dfd3b0] bg-[#fffdf4]" : "border-line bg-card-paper"
                  }`}
                >
                  <div className="font-serif text-[19px] leading-[1.2]">{p.name}</div>
                  <div
                    className={`inline-flex items-center gap-1.5 font-serif text-[13px] italic ${
                      partner ? "text-gold-deep" : "text-muted-warm"
                    }`}
                  >
                    <span
                      className={`size-[7px] rotate-45 ${partner ? "bg-gold-deep" : "bg-muted-warm"}`}
                    />
                    {partner ? "Partner" : "Supporter"}
                  </div>
                </div>
              );
            })}

            {showAddTile && (
              <Link
                href={GIVE_HREF}
                className="group border-ink bg-gold text-ink hover:bg-gold-deep flex min-h-[78px] flex-col items-center justify-center gap-1 rounded-[7px] border px-[18px] py-4 text-center transition-colors hover:text-white"
              >
                <div className="font-serif text-[19px] italic">Your name here</div>
                <div className="text-gold-deep font-serif text-[13px] italic group-hover:text-white">
                  Join from $175 →
                </div>
              </Link>
            )}
          </div>

          {showEmpty && (
            <p className="text-muted-warm py-10 text-center font-serif text-[16px] italic">
              No supporters match that search — but there&apos;s always room for one more.
            </p>
          )}

          {showMore && (
            <div className="mt-[30px] text-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="border-ink hover:bg-ink hover:text-paper inline-flex items-center gap-2 rounded-full border px-[26px] py-3 font-serif text-[16.5px] italic transition-colors"
              >
                Show more supporters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
