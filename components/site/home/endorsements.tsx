import { Eyebrow, SectionHeading } from "../primitives";

// Real video testimonials from Kevin's channel (@KevinCameronFilms), embedded with
// YouTube's privacy-enhanced player. They are vertical Shorts, hence the 9:16 frames.
const ITEMS = [
  { id: "MK396rY7krY", name: "Dr. Sandra Doran", role: "Educator" },
  { id: "6KaM1fShcpE", name: "Dr. Astian Ayoola", role: "Psychiatrist" },
];

export function Endorsements() {
  return (
    <section className="py-10 sm:py-[72px]">
      <div className="mx-auto max-w-[1120px] px-[34px]">
        <Eyebrow className="text-center">Early word</Eyebrow>
        <SectionHeading className="text-center">
          What people say about Kevin&apos;s past works.
        </SectionHeading>
        <div className="mx-auto mt-9 grid max-w-[720px] grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-6">
          {ITEMS.map((it) => (
            <figure key={it.id} className="mx-auto w-full max-w-[320px]">
              <div className="border-line aspect-[9/16] overflow-hidden rounded-[10px] border bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${it.id}`}
                  title={`${it.name} — video testimonial`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full"
                />
              </div>
              <figcaption className="mt-3.5 text-center">
                <div className="font-serif text-[17px]">{it.name}</div>
                <div className="text-muted-warm font-serif text-[14.5px] italic">{it.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
