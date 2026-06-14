"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

type AccountStatus = "loading" | "ready" | "signed-out" | "config" | "error";

const futureAreas = [
  {
    title: "Saved Agent Recipes",
    body: "Bookmark recipes and compare workflow systems as the catalog opens.",
  },
  {
    title: "Coach Studio",
    body: "Future tools for drafting, evaluating, and submitting Agent Recipes.",
  },
  {
    title: "Client Workspace",
    body: "Future private areas for team workflows, deployments, and review history.",
  },
];

export function AccountPanel() {
  const [status, setStatus] = useState<AccountStatus>(() =>
    hasSupabaseBrowserConfig() ? "loading" : "config",
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const supabaseClient = supabase;
    let active = true;

    async function loadSession() {
      const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();

      if (!active) {
        return;
      }

      if (sessionError) {
        setStatus("error");
        return;
      }

      if (!sessionData.session) {
        setStatus("signed-out");
        return;
      }

      const { data, error } = await supabaseClient.auth.getUser();

      if (!active) {
        return;
      }

      if (error || !data.user?.email) {
        setStatus("signed-out");
        return;
      }

      setEmail(data.user.email);
      setStatus("ready");
    }

    loadSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      if (session?.user.email) {
        setEmail(session.user.email);
        setStatus("ready");
      } else {
        setEmail("");
        setStatus("signed-out");
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("config");
      return;
    }

    await supabase.auth.signOut();
    setEmail("");
    setStatus("signed-out");
  }

  if (status === "loading") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
        <p className="flex items-center gap-3 text-sm font-semibold text-steel">
          <Loader2 aria-hidden="true" className="size-4 animate-spin text-ion" />
          Loading account...
        </p>
      </div>
    );
  }

  if (status === "config") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
        <p className="text-sm font-semibold text-ember">Supabase Auth is not configured yet.</p>
        <p className="mt-4 text-sm leading-6 text-steel">
          Add the public Supabase environment variables and enable email auth to use
          early access accounts.
        </p>
      </div>
    );
  }

  if (status === "signed-out" || status === "error") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
        <p className="text-sm font-semibold text-ember">Sign in required</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-platinum">
          Access your AgentCoach account.
        </h2>
        <p className="mt-4 text-base leading-7 text-steel">
          Accounts are for early access clients and coaches. Sign in with your email
          to view the workspace foundation.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded bg-platinum px-4 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50"
        >
          Go to Login
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ion">Signed in</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-platinum">{email}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
              Account status: early access foundation. Role management, saved recipes,
              and team workspaces will be added in future releases.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex h-10 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-4 text-sm font-semibold text-platinum transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign Out
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {futureAreas.map((area) => (
          <article
            key={area.title}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line"
          >
            <ShieldCheck aria-hidden="true" className="size-5 text-ember" />
            <h3 className="mt-5 text-lg font-semibold text-platinum">{area.title}</h3>
            <p className="mt-3 text-sm leading-6 text-steel">{area.body}</p>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase text-steel">
              <CheckCircle2 aria-hidden="true" className="size-4 text-ion" />
              Placeholder
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
