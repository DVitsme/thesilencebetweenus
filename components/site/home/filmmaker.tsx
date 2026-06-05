import Link from "next/link";
import Image from "next/image";
import { Eyebrow, SectionHeading } from "../primitives";

const CHIPS = ["Former school principal", "Oakwood University", "500+ films produced", "Take 3 Media"];

export function Filmmaker() {
  return (
    <section className="bg-tint py-[72px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-[34px] md:grid-cols-[260px_1fr]">
        {/* aspect box gives the fill image a real height inside the items-center grid */}
        <div className="border-line relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-[4px] border">
          <Image
            src="/images/happy-kevin.jpg"
            alt="Kevin Cameron, writer and director"
            fill
            sizes="260px"
            className="object-cover"
          />
        </div>
        <div>
          <Eyebrow>Meet the filmmaker</Eyebrow>
          <SectionHeading className="mb-3.5">This story is in careful hands.</SectionHeading>
          <p className="mb-4 font-serif text-[21px] leading-[1.7]">
            &ldquo;Before film, I worked in education myself, so these young people are not strangers
            to me. My last feature is streaming on Amazon Prime today — but no story has mattered to
            me more than this one.&rdquo;
          </p>
          <div className="mb-5 flex flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="border-line bg-tint text-ink-soft rounded-full border px-3.5 py-1.5 font-serif text-[14px] italic"
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
  );
}
