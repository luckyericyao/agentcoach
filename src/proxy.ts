import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const config = getSupabasePublicConfig();
  if (!config) return response;

  const supabase = createServerClient(config.url, config.key, {
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        signal: init?.signal
          ? AbortSignal.any([init.signal, AbortSignal.timeout(8_000)])
          : AbortSignal.timeout(8_000),
      }),
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });
  try {
    await supabase.auth.getClaims();
  } catch {
    // Account access is independently verified by getUser() in the server page.
  }
  return response;
}

export const config = { matcher: ["/account/:path*"] };
