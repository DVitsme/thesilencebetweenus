import { Eyebrow, SectionHeading } from "../primitives";

export function FilmStory() {
  return (
    <section id="story" className="py-[72px]">
      <div className="mx-auto max-w-[680px] px-[34px] text-center">
        <Eyebrow>The ones it&apos;s for</Eyebrow>
        <SectionHeading>A story our young people need told.</SectionHeading>
      </div>
      <div className="mx-auto mt-2 max-w-[680px] px-[34px] font-serif text-[20px] leading-[1.78]">
        <p className="om-dropcap mb-5">
          The Silence Between Us explores the anxiety and depression so many teenagers silently carry
          inside the school system — and the fear and uncertainty that keep them from opening up to
          the very people who love them most.
        </p>
        <p>
          As the pressure builds and communication breaks down, one compassionate teacher becomes a
          guiding light, helping his students through some of the hardest moments of their young
          lives. It&apos;s an honest film about a hard truth — told with hope, never despair.
        </p>
      </div>
    </section>
  );
}
