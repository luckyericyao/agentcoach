"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    const { data } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && !locked.current) { router.replace("/login"); router.refresh(); }
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  async function signOut() {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError("");
    try {
      const client = createSupabaseBrowserClient();
      if (!client) throw new Error("unavailable");
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) {
        const local = await client.auth.getSession();
        // SDK versions may clear local cookies even when remote revocation fails.
        if (!local.error && !local.data.session) {
          router.replace("/login?notice=signed-out-locally");
          router.refresh();
          return;
        }
        throw error;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setError("We could not sign you out. Please try again.");
      locked.current = false;
      setPending(false);
    }
  }

  return (
    <div className="shrink-0">
      <button type="button" onClick={signOut} disabled={pending} aria-busy={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-4 text-sm font-semibold text-platinum transition hover:bg-white/[0.12] disabled:opacity-65">
        {pending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <LogOut aria-hidden="true" className="size-4" />}
        {pending ? "Signing out..." : "Sign Out"}
      </button>
      {error ? <p role="alert" className="mt-3 max-w-xs text-sm leading-6 text-ember">{error}</p> : null}
    </div>
  );
}
