import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { isEmailConfirmationId } from "@/lib/supabase/email-confirmation";

export const metadata: Metadata = {
  title: "Login | AgentCoach",
  description: "Sign in to the AgentCoach early access account foundation.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ error?: string | string[]; notice?: string; confirm?: string | string[] }>;
}) {
  const { error, notice, confirm } = await searchParams;
  const confirmation = !error && isEmailConfirmationId(confirm) ? confirm : null;
  const initialError = error === "invalid-link"
    ? "This login link is invalid or has expired. Request a new link below."
    : error === "unavailable" ? "Sign-in is temporarily unavailable. Please try again later." : "";
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(127,212,255,0.11),transparent_34rem)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-ion">AgentCoach Login</p>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
              {confirmation ? "Confirm your sign-in." : "Early access for clients and coaches."}
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-steel sm:text-xl">
              {confirmation ? "Continue with the email link you opened." : "Sign in with a secure email link to access your early access account."}
            </p>
          </div>
          {confirmation ? (
            <form action={`/auth/callback?confirm=${confirmation}`} method="post"
              className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line sm:p-6">
              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition hover:bg-white">
                Confirm sign-in<ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <Link href="/login" className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-steel underline underline-offset-4 hover:text-platinum">
                Request a new link
              </Link>
            </form>
          ) : <LoginForm initialError={initialError} notice={notice === "signed-out-locally"
            ? "Signed out on this browser. The service could not confirm the sign-out." : ""} />}
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-steel">New to AgentCoach? Tell us how you would like to take part.</p>
          <div className="flex flex-wrap gap-x-7 gap-y-4">
            <Link className="font-semibold text-platinum hover:text-ion" href="/become-a-client">Become a Client</Link>
            <Link className="font-semibold text-platinum hover:text-ion" href="/become-a-coach">Become a Coach</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
