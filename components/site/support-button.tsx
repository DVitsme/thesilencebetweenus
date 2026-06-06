import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Primary "Support" CTA. Links to the custom /give checkout (handoff doc 08 §6),
 * carrying the chosen tier as a query param. No client JS — it's just a Link.
 */
export function SupportButton({
  tier = "supporter",
  className,
  children,
  onClick,
}: {
  tier?: "supporter" | "partner" | "patron" | "custom";
  className?: string;
  children: React.ReactNode;
  /** Optional click handler — e.g. to close the mobile menu after navigating. */
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/give?tier=${tier}`}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink bg-gold px-7 py-3",
        "font-serif text-[17px] text-ink italic transition-colors",
        "hover:border-gold-deep hover:bg-gold-deep hover:text-paper",
        className,
      )}
    >
      {children}
    </Link>
  );
}
