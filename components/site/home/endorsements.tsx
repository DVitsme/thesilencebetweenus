import { Eyebrow, SectionHeading, Placeholder } from "../primitives";

// ⚠️ PLACEHOLDER endorsements. Do NOT attribute invented quotes to real people.
// Replace with real, attributed endorsements when Kevin provides them. TODO(endorsements).
const ITEMS = [
  {
    q: "it was a great story line a little plot twist I was like wait a minute have me on the edge of my seat so definitely a watch go and see for his name's sake.",
    name: "From Movie Screening in Sacramento",
    role: "Title · organization",
  },
  {
    q: "Okay I was really impressed by quite a few things in the movie it looks very expensive and it is a family friendly movie I hope to see more from you and that be praised.",
    name: "From Movie Screening in Sacramento",
    role: "Mental-health partner",
  },
];

export function Endorsements() {
  return (
    <section className="py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <Eyebrow className="text-center">Early word</Eyebrow>
        <SectionHeading className="text-center">What people say about Kevin&apos;s Past works.</SectionHeading>
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
