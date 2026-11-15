import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isEarlyAccessOpen } from "@/lib/server/early-access";
import { getSupabasePublicConfig } from "./config";

export async function createSupabaseServerClient() {
  if (!isEarlyAccessOpen()) return null;
  const config = getSupabasePublicConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient(config.url, config.key, {
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        signal: init?.signal
          ? AbortSignal.any([init.signal, AbortSignal.timeout(8_000)])
          : AbortSignal.timeout(8_000),
      }),
    },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; the account proxy refreshes them.
        }
      },
    },
  });
}
