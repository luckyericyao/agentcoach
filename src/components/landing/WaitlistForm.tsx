"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useLeadSubmission } from "../forms/useLeadSubmission";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const { status, message, warning, submit, clearError } = useLeadSubmission();
  const disabled = status === "loading" || status === "success";
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status === "success") feedback.current?.focus({ preventScroll: true });
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit({ lead_type: "waitlist", email, source: "homepage" });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      method="post"
      aria-busy={status === "loading"}
      aria-describedby="waitlist-feedback"
      className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-[1fr_auto]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      <div className="flex h-[3.25rem] items-center gap-3 rounded border border-white/[0.14] bg-white/[0.07] px-4 shadow-inner-line transition duration-200 focus-within:border-ion/[0.55] focus-within:bg-white/10">
        <label className="sr-only" htmlFor="waitlist-email">Email address</label>
        <Send aria-hidden="true" className="size-4 shrink-0 text-steel" />
        <input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          required
          disabled={disabled}
          placeholder="you@company.com"
          value={email}
          onChange={(event) => { setEmail(event.target.value); clearError(); }}
          className="h-full w-full min-w-0 bg-transparent text-base text-platinum outline-none placeholder:text-steel/70 disabled:opacity-70"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded border border-platinum bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {status === "loading" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
        {status === "success" ? "Received" : "Request Access"}
        {!disabled ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
      </button>
      <div id="waitlist-feedback" ref={feedback} tabIndex={-1} aria-live="polite" aria-atomic="true" className="sm:col-span-2">
        {status === "success" ? <p className="text-sm leading-6 text-ion">You&apos;re on the list. We&apos;ll reach out when AgentCoach opens early access.</p> : null}
        {warning ? <p className="mt-3 text-sm leading-6 text-ember">{warning}</p> : null}
        {message ? <p role="alert" className="text-sm leading-6 text-ember">{message}</p> : null}
      </div>
    </motion.form>
  );
}
