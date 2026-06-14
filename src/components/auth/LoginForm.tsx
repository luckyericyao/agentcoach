"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type LoginStatus = "idle" | "loading" | "success" | "error" | "config";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading" || status === "success") {
      return;
    }

    if (!emailPattern.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("config");
      setMessage("Login is ready, but Supabase Auth is not configured in this environment.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage("We could not send the login link. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("Check your email for a secure AgentCoach login link.");
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line sm:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <label className="grid gap-2 text-sm font-medium text-platinum" htmlFor="login-email">
        Email
        <div className="flex h-12 items-center gap-3 rounded border border-white/[0.14] bg-white/[0.06] px-4 transition duration-200 focus-within:border-ion/[0.55] focus-within:bg-white/[0.09]">
          <Mail aria-hidden="true" className="size-4 shrink-0 text-steel" />
          <input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "loading") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="you@company.com"
            className="h-full w-full min-w-0 bg-transparent text-base font-normal text-platinum outline-none placeholder:text-steel/60"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {status === "loading" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
        {status === "success" ? "Link Sent" : "Send Magic Link"}
        {status !== "loading" && status !== "success" ? (
          <ArrowRight aria-hidden="true" className="size-4" />
        ) : null}
      </button>

      {message ? (
        <p
          className={`mt-4 text-sm leading-6 ${
            status === "success" ? "text-ion" : "text-ember"
          }`}
        >
          {message}
        </p>
      ) : null}
    </motion.form>
  );
}
