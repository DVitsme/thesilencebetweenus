"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Work, WorkCategory } from "@/content/portfolio";

const LABELS: Record<WorkCategory, string> = {
  feature: "Feature",
  documentary: "Documentary",
  tv: "TV pilot",
  commercial: "Commercial",
  "music-video": "Music video",
  "in-development": "In production",
};

const FILTER_ORDER: WorkCategory[] = [
  "feature",
  "documentary",
  "tv",
  "commercial",
  "music-video",
  "in-development",
];

function cardCta(w: Work): { href: string; label: string; external: boolean } {
  if (w.slug === "the-silence-between-us")
    return { href: "/#support", label: "Become a Founding Supporter →", external: false };
  if (w.videoUrl) return { href: w.videoUrl, label: "Watch →", external: true };
  if (w.externalUrl) return { href: w.externalUrl, label: "Watch on Prime →", external: true };
  return { href: "/#support", label: "Learn more →", external: false };
}

function WorkCard({ work }: { work: Work }) {
  const isProd = work.category === "in-development";
  const cta = cardCta(work);
  const goClass =
    "text-gold-deep border-line-soft hover:border-gold-deep self-start border-b pb-px font-serif text-[15px] italic";

  return (
    <article className="border-line bg-card-paper flex flex-col overflow-hidden rounded-[6px] border transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.4)]">
      <div className="border-line relative aspect-[16/9] border-b">
        <Image
          src={work.image}
          alt={work.title}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 820px) 50vw, 33vw"
          className="object-cover"
        />
        <span
          className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 font-serif text-[11.5px] italic ${
            isProd ? "bg-gold text-ink" : "bg-ink text-paper"
          }`}
        >
          {LABELS[work.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-[18px] pb-5">
        <h3 className="font-serif text-[21px] leading-[1.2]">{work.title}</h3>
        <div className="text-muted-warm mt-0.5 mb-2.5 font-serif text-[14.5px] italic">
          {LABELS[work.category]}
          {work.year ? ` · ${work.year}` : ""} · {work.role}
        </div>
        <p className="text-ink-soft mb-3.5 flex-1 font-serif text-[15.5px] leading-[1.55]">
          {work.blurb}
        </p>
        {cta.external ? (
          <a href={cta.href} target="_blank" rel="noopener noreferrer" className={goClass}>
            {cta.label}
          </a>
        ) : (
          <Link href={cta.href} className={goClass}>
            {cta.label}
          </Link>
        )}
      </div>
    </article>
  );
}

export function WorkGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<WorkCategory | "all">("all");
  const present = FILTER_ORDER.filter((c) => works.some((w) => w.category === c));
  const shown = filter === "all" ? works : works.filter((w) => w.category === filter);

  const chip = (active: boolean) =>
    `cursor-pointer rounded-full border px-[18px] py-2 font-serif text-[15px] italic transition-colors ${
      active
        ? "border-ink bg-gold text-ink"
        : "border-line bg-card-paper text-ink-soft hover:border-muted-warm"
    }`;

  return (
    <>
      <div className="my-9 flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={() => setFilter("all")} className={chip(filter === "all")}>
          All work
        </button>
        {present.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={chip(filter === c)}>
            {LABELS[c]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((w) => (
          <WorkCard key={w.slug} work={w} />
        ))}
      </div>
    </>
  );
}
