import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { SectionReveal } from "@/components/landing/SectionReveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";

export const metadata: Metadata = {
  title: "Login | AgentCoach",
  description: "Sign in to the AgentCoach early access account foundation.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(127,212,255,0.11),transparent_34rem)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-ion">AgentCoach Login</p>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
              Early access for clients and coaches.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-steel sm:text-xl">
              Sign in with a secure email link. Accounts are the foundation for saved
              Agent Recipes, Coach Studio, and private client workspaces.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>

      <SectionReveal className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            "Saved Agent Recipes",
            "Coach Studio foundation",
            "Client Workspace foundation",
          ].map((item) => (
            <article
              key={item}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line"
            >
              <p className="text-sm font-semibold text-platinum">{item}</p>
              <p className="mt-3 text-sm leading-6 text-steel">
                Account infrastructure only. Full dashboard features will be added later.
              </p>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
