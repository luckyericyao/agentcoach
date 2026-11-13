import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountPanel } from "@/components/auth/AccountPanel";
import { SectionReveal } from "@/components/landing/SectionReveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account | AgentCoach",
  description: "AgentCoach account foundation for early access clients and coaches.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?error=unavailable");
  let email: string | undefined;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) email = data.user?.email;
  } catch {
    redirect("/login?error=unavailable");
  }
  if (!email) redirect("/login");

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_16%,rgba(215,180,106,0.11),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase text-ion">Account</p>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
            Your AgentCoach account.
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel sm:text-xl">
            Early access for clients and coaches.
          </p>
        </div>
      </section>

      <SectionReveal className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <AccountPanel email={email} />
        </div>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
