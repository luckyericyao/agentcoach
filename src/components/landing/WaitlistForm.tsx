"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { submitLead } from "@/lib/lead-submission";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "config">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading" || status === "success") {
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    const result = await submitLead({
      lead_type: "waitlist",
      email: email.trim(),
      source: "homepage",
    });

    if (result.ok) {
      setStatus("success");
      setMessage("You're on the list. We'll reach out when AgentCoach opens early access.");
      return;
    }

    if (result.reason === "missing-config") {
      setStatus("config");
      setMessage(result.message);
      return;
    }

    setStatus("error");
    setMessage(result.message);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
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
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "loading") {
              setStatus("idle");
              setMessage("");
            }
          }}
          className="h-full w-full min-w-0 bg-transparent text-base text-platinum outline-none placeholder:text-steel/70"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded border border-platinum bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {status === "loading" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
        {status === "success" ? "Received" : "Request Access"}
        {status !== "loading" && status !== "success" ? (
          <ArrowRight aria-hidden="true" className="size-4" />
        ) : null}
      </button>
      {message ? (
        <p
          className={`text-sm leading-6 sm:col-span-2 ${
            status === "success" ? "text-ion" : "text-ember"
          }`}
        >
          {message}
        </p>
      ) : null}
    </motion.form>
  );
}
