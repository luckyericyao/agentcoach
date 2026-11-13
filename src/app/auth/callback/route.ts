import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requestOrigin } from "@/lib/server/requests";
import { emailConfirmationCookie, isEmailConfirmationId } from "@/lib/supabase/email-confirmation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
const invalidLink = "/login?error=invalid-link";
const tokenHashPattern = /^[A-Za-z0-9_-]{1,2048}$/;

function destination(path: string) {
  return new NextResponse(null, { status: 303, headers: { ...headers, Location: path } });
}

function pendingCookieOptions(request: Request) {
  const loopbackHttp = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(requestOrigin(request));
  return { path: "/auth/callback", httpOnly: true, sameSite: "lax" as const, secure: !loopbackHttp };
}

async function completeSignIn(credential: { code: string } | { tokenHash: string }) {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return destination("/login?error=unavailable");
    const { error } = "code" in credential
      ? await supabase.auth.exchangeCodeForSession(credential.code)
      : await supabase.auth.verifyOtp({ token_hash: credential.tokenHash, type: "email" });
    return destination(error ? invalidLink : "/account");
  } catch {
    return destination("/login?error=unavailable");
  }
}

export function HEAD() {
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (params.has("error") || params.getAll("code").length + params.getAll("token_hash").length !== 1) {
    return destination(invalidLink);
  }

  const tokenHash = params.get("token_hash");
  if (tokenHash !== null) {
    if (!tokenHashPattern.test(tokenHash) || params.getAll("type").length !== 1 || params.get("type") !== "email") {
      return destination(invalidLink);
    }
    const confirmation = randomUUID();
    const response = destination(`/login?confirm=${confirmation}`);
    // Link scanners can follow the redirect without spending the one-time token.
    response.cookies.set(emailConfirmationCookie, `${confirmation}:${tokenHash}`, {
      ...pendingCookieOptions(request), maxAge: 300,
    });
    return response;
  }

  const code = params.get("code");
  return code && code.length <= 2048 ? completeSignIn({ code }) : destination(invalidLink);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  // A privacy-restricted form may send a null Origin; require same-origin Fetch Metadata in that case.
  const sameOrigin = origin && origin !== "null" ? origin === requestOrigin(request) : site === "same-origin";
  if (!sameOrigin || (site && site !== "same-origin")) return new NextResponse(null, { status: 403, headers });

  const params = request.nextUrl.searchParams;
  const confirmation = params.get("confirm");
  const pending = request.cookies.get(emailConfirmationCookie)?.value;
  if (params.getAll("confirm").length !== 1 || !isEmailConfirmationId(confirmation) ||
    !pending?.startsWith(`${confirmation}:`)) return destination(invalidLink);

  const tokenHash = pending.slice(confirmation.length + 1);
  if (!tokenHashPattern.test(tokenHash)) return destination(invalidLink);
  const response = await completeSignIn({ tokenHash });
  // Next's cookie merge can drop a zero Max-Age when adding session cookies.
  response.cookies.set(emailConfirmationCookie, "", {
    ...pendingCookieOptions(request), maxAge: 0, expires: new Date(0),
  });
  return response;
}
