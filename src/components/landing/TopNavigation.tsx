"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { navItems } from "@/lib/landing-data";

export function TopNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <motion.header
      ref={header}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-carbon/[0.72] backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold text-platinum"
          aria-label="AgentCoach home"
        >
          <span className="grid size-7 place-items-center rounded border border-white/[0.18] bg-white/[0.08] shadow-inner-line">
            <span className="size-2 rounded-sm bg-ion" />
          </span>
          AgentCoach
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-steel transition-colors duration-200 hover:text-platinum"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
          href="/#waitlist"
          className="inline-flex h-9 items-center gap-2 rounded border border-white/[0.16] bg-white/[0.08] px-3 text-sm font-medium text-platinum transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
        >
          Join
          <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <button ref={menuButton} type="button" onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen} aria-controls="mobile-navigation"
            className="grid size-11 place-items-center rounded border border-white/15 bg-white/[0.06] text-platinum transition hover:bg-white/10 lg:hidden">
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </nav>
      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen}
        className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-carbon px-5 py-3 sm:px-8 lg:hidden">
        {[{ label: "Home", href: "/" }, ...navItems].map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
            className="flex min-h-12 items-center justify-between border-b border-white/[0.06] py-3 text-sm font-medium text-platinum transition hover:text-ion">
            {item.label}<ArrowRight aria-hidden="true" className="size-4 text-steel" />
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
