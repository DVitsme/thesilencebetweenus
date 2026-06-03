"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE } from "./nav-links";
import { SupportButton } from "./support-button";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "border-line bg-paper/90 sticky top-0 z-50 border-b backdrop-blur-md transition-shadow",
        scrolled && "shadow-[0_6px_24px_-18px_rgba(0,0,0,0.5)]",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3.5 md:px-[34px]">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[0.16em] whitespace-nowrap uppercase"
        >
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="text-ink-soft hover:text-ink font-serif text-[16px] italic transition-colors"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SupportButton className="px-5 py-2 text-[15px]">Support the film →</SupportButton>
          <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-line bg-paper border-t px-6 py-4 lg:hidden">
          {NAV_ITEMS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className="text-ink-soft block py-2 font-serif text-[17px] italic"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
