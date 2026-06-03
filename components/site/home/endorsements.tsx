import { Eyebrow, SectionHeading, Placeholder } from "../primitives";

// ⚠️ PLACEHOLDER endorsements. Do NOT attribute invented quotes to real people.
// Replace with real, attributed endorsements when Kevin provides them. TODO(endorsements).
const ITEMS = [
  {
    q: "A real movie in every way — it hits all the marks. This is the quality our stories deserve.",
    name: "Endorsement name",
    role: "Title · organization",
  },
  {
    q: "Kevin tells the truth about young people without ever giving up on hope. That's rare, and it matters.",
    name: "Endorsement name",
    role: "Mental-health partner",
  },
];

export function Endorsements() {
  return (
    <section className="py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <Eyebrow className="text-center">Early word</Eyebrow>
        <SectionHeading className="text-center">What people say about Kevin&apos;s work.</SectionHeading>
        <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-1 gap-6 md:grid-cols-2">
          {ITEMS.map((it, i) => (
            <figure key={i} className="border-line bg-card-paper rounded-[10px] border p-8">
              <blockquote className="mb-4.5 font-serif text-[21px] leading-[1.55] italic">
                &ldquo;{it.q}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3.5">
                <Placeholder label="" className="h-11 w-11 rounded-full" />
                <div>
                  <div className="font-serif text-[16px]">{it.name}</div>
                  <div className="text-muted-warm font-serif text-[14px] italic">{it.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-muted-warm mt-4.5 text-center font-serif text-[15px] italic">
          Endorsements to be confirmed — placeholders shown.
        </p>
      </div>
    </section>
  );
}
