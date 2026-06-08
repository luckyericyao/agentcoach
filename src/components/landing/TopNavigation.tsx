"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/landing-data";

export function TopNavigation() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-carbon/[0.72] backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#hero"
          className="flex items-center gap-3 text-sm font-semibold text-platinum"
          aria-label="AgentCoach home"
        >
          <span className="grid size-7 place-items-center rounded border border-white/[0.18] bg-white/[0.08] shadow-inner-line">
            <span className="size-2 rounded-sm bg-ion" />
          </span>
          AgentCoach
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-steel transition-colors duration-200 hover:text-platinum"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#waitlist"
          className="inline-flex h-9 items-center gap-2 rounded border border-white/[0.16] bg-white/[0.08] px-3 text-sm font-medium text-platinum transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
        >
          Join
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      </nav>
    </motion.header>
  );
}
