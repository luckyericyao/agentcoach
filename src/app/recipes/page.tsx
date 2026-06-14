import type { Metadata } from "next";
import { RecipeCatalog } from "@/components/recipes/RecipeCatalog";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { industries } from "@/lib/industries-data";
import { agentRecipes } from "@/lib/recipes-data";

export const metadata: Metadata = {
  title: "Agent Recipes | AgentCoach",
  description:
    "Browse reusable expert workflows that combine instruction, workflow, evaluation, risk boundaries, and deployment logic.",
};

export default function RecipesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(127,212,255,0.11),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase text-ion">Agent Recipes</p>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
            Reusable expert workflows for building useful AI agents.
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel sm:text-xl">
            Browse instruction systems that combine workflow, evaluation, risk
            boundaries, and deployment logic. This early catalog is static while the
            network forms.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <RecipeCatalog recipes={agentRecipes} industries={industries} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
