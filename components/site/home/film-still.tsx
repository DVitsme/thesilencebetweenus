import { BackgroundVideo } from "@/components/site/background-video";

export function FilmStill() {
  return (
    <div className="border-line relative aspect-[2263/1080] overflow-hidden border-y lg:aspect-auto lg:h-[440px]">
      <BackgroundVideo
        src="/videos/Kid-With-Basketball-24.mp4"
        poster="/images/thumbnail.png"
        priority
        className="absolute inset-0"
      />
      {/* bottom scrim keeps the teaser legible over the moving footage */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
      <p className="text-paper/90 absolute right-0 bottom-4 left-0 text-center font-serif text-[14px] italic">
        A first look is coming. Support the film to see it first.
      </p>
    </div>
  );
}
