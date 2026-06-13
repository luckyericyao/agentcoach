"use client";

import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";

export function WaitlistForm() {
  return (
    <motion.form
      onSubmit={(event) => event.preventDefault()}
      className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-[1fr_auto]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      <label className="sr-only" htmlFor="email">
        Email address
      </label>
      <div className="flex h-[3.25rem] items-center gap-3 rounded border border-white/[0.14] bg-white/[0.07] px-4 shadow-inner-line transition duration-200 focus-within:border-ion/[0.55] focus-within:bg-white/10">
        <Send aria-hidden="true" className="size-4 shrink-0 text-steel" />
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="h-full w-full min-w-0 bg-transparent text-base text-platinum outline-none placeholder:text-steel/70"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded border border-platinum bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50 sm:w-auto"
      >
        Request Access
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </motion.form>
  );
}
