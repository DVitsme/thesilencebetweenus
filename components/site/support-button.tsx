"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  tier?: "supporter" | "partner" | "patron" | "custom";
  amount?: number; // cents; omit for "choose on checkout"
  className?: string;
  children: React.ReactNode;
};

export function SupportButton({ tier = "supporter", amount, className, children }: Props) {
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    try {
      // TODO(checkout): implement /api/checkout (Stripe Checkout, one-time) per docs/ia-and-architecture.md.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, amount }),
      });
      if (res.ok) {
        const { url } = (await res.json()) as { url?: string };
        if (url) {
          window.location.href = url;
          return;
        }
      }
      throw new Error("checkout not wired yet");
    } catch {
      // Safe fallback until /api/checkout exists: jump to the tier section.
      if (location.pathname === "/") location.hash = "support";
      else location.href = "/#support";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink bg-gold px-7 py-3",
        "font-serif text-[17px] text-ink italic transition-colors",
        "hover:border-gold-deep hover:bg-gold-deep hover:text-paper disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
