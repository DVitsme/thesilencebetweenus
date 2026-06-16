import Image from "next/image";
import { Eyebrow } from "../primitives";
import { featuredFilm } from "@/content/portfolio";

// Official platform wordmarks (rendered from the Wikimedia Commons brand SVGs),
// each linking to the film's listing on that platform.
export function NowStreaming() {
  return (
    <section className="border-line bg-tint border-t px-[34px] py-10 text-center sm:py-12">
      <Eyebrow>Now streaming</Eyebrow>
      <h2 className="mx-auto max-w-[620px] font-serif text-[clamp(1.4rem,3vw,1.75rem)] leading-[1.25] tracking-[-0.3px]">
        Kevin Cameron&apos;s previous feature film is now streaming on:
      </h2>

      <div className="mt-7 flex items-center justify-center gap-6 sm:gap-8">
        {/* The Prime mark carries its smile below the text; the taller box keeps the
            two wordmarks optically the same size. */}
        <a
          href={featuredFilm.streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch For His Name Sake on Prime Video"
          className="transition-opacity hover:opacity-75"
        >
          <Image
            src="/images/streaming/prime-video.png"
            alt="Prime Video"
            width={960}
            height={302}
            className="h-9 w-auto sm:h-10"
          />
        </a>
        <span className="bg-line h-9 w-px sm:h-10" aria-hidden />
        <a
          href={featuredFilm.tubiUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch For His Name Sake free on Tubi"
          className="transition-opacity hover:opacity-75"
        >
          <Image
            src="/images/streaming/tubi.png"
            alt="Tubi"
            width={960}
            height={432}
            className="h-[22px] w-auto sm:h-6"
          />
        </a>
      </div>

      <p className="text-ink-soft mx-auto mt-7 max-w-[560px] font-serif text-[17px] leading-[1.6]">
        <em>For His Name Sake</em> premiered in multiple cities across the U.S. and Canada and is
        now available worldwide on Prime Video and Tubi.
      </p>

      <a
        href={featuredFilm.trailerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-ink hover:bg-ink hover:text-paper mt-7 inline-flex items-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors"
      >
        ▶ Watch the trailer
      </a>
    </section>
  );
}
