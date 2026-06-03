import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-muted-warm mb-2 block font-serif text-[16px] italic", className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-serif text-[clamp(2rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.5px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Rule({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-[760px] items-center gap-3.5 px-7", className)}>
      <span className="bg-line h-px flex-1" />
      <span className="om-diamond" />
      <span className="bg-line h-px flex-1" />
    </div>
  );
}

/** Hatched fallback shown until real imagery is dropped in. Swap for <Image> when assets arrive. */
export function Placeholder({
  label,
  className,
  ratio,
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn("om-hatch border-line flex items-center justify-center border", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {label ? (
        <span className="border-muted-warm text-muted-warm rounded border px-3 py-1 text-center font-serif text-[13.5px] italic">
          {label}
        </span>
      ) : null}
    </div>
  );
}
