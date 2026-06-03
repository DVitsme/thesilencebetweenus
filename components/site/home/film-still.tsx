export function FilmStill() {
  return (
    <div className="om-hatch border-line relative flex h-[440px] items-center justify-center border-y">
      <div className="border-ink bg-paper/60 grid h-[76px] w-[76px] cursor-pointer place-items-center rounded-full border backdrop-blur-[2px] transition-transform hover:scale-105">
        <span className="border-l-ink ml-1.5 border-y-[12px] border-l-[20px] border-y-transparent" />
      </div>
      <p className="text-ink-soft absolute right-0 bottom-4 left-0 text-center font-serif text-[14px] italic">
        A first look is coming — support the film to see it first.
      </p>
      <span className="border-muted-warm bg-paper/70 text-muted-warm absolute top-3.5 left-3.5 rounded border px-3 py-1.5 font-serif text-[13px] italic">
        Full-bleed cinematic still
      </span>
    </div>
  );
}
