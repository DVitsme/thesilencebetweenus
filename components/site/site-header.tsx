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
          className="text-[13px] font-medium tracking-[0.1em] whitespace-nowrap uppercase sm:text-[15px] sm:tracking-[0.16em]"
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
          <SupportButton className="hidden px-5 py-2 text-[15px] lg:inline-flex">
            Support the film →
          </SupportButton>
          <button
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-line bg-paper border-t px-6 py-4 lg:hidden">
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
          <SupportButton
            className="mt-3 w-full justify-center px-5 py-3 text-[16px]"
            onClick={() => setOpen(false)}
          >
            Support the film →
          </SupportButton>
        </nav>
      )}
    </header>
  );
}
