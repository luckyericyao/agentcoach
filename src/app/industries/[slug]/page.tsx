import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionReveal } from "@/components/landing/SectionReveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { getIndustryBySlug, industries } from "@/lib/industries-data";
import { getRecipesByIndustrySlug } from "@/lib/recipes-data";
import { getUseCasesByIndustrySlug } from "@/lib/use-cases-data";

type IndustryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return industries.map((industry) => ({
    slug: industry.slug,
  }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return {};
  }

  return {
    title: `${industry.name} | AgentCoach`,
    description: industry.description,
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const useCases = getUseCasesByIndustrySlug(industry.slug);
  const recipes = getRecipesByIndustrySlug(industry.slug);

  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(127,212,255,0.11),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-steel transition duration-200 hover:text-platinum"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to AgentCoach
          </Link>
          <p className="mt-16 text-sm font-semibold uppercase text-ion">{industry.name}</p>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
            {industry.tagline}
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel sm:text-xl">
            {industry.description}
          </p>
        </div>
      </section>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.84fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-ember">Why This Industry Needs Agent Recipes</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Repeated high-value work needs structure, not generic prompts.
            </h2>
            <p className="mt-7 text-pretty text-lg leading-8 text-steel">
              {industry.whyItMatters}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
            <p className="text-sm font-semibold text-ion">Current AI failure modes</p>
            <div className="mt-6 grid gap-3">
              {[
                "Generic prompts",
                "Inconsistent research",
                "Fragmented knowledge",
                "No evaluation",
                "No risk boundaries",
                "No workflow ownership",
              ].map((problem) => (
                <p key={problem} className="flex gap-3 text-sm leading-6 text-steel">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ion" />
                  <span>{problem}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-ion">How AgentCoach Helps</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Expert workflows become reusable decision systems.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              { title: "Decisions supported", items: industry.decisionsSupported },
              { title: "Data used", items: industry.dataUsed },
              { title: "Agent outputs", items: industry.agentOutputs },
            ].map((group) => (
              <article key={group.title} className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
                <h3 className="text-xl font-semibold text-platinum">{group.title}</h3>
                <div className="mt-6 grid gap-3">
                  {group.items.map((item) => (
                    <p key={item} className="text-sm leading-6 text-steel">
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ember">Concrete Use Cases</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
                Where Agent Recipes improve efficiency.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              Each use case combines a workflow, example output, and explicit risk
              boundary so AI-assisted work stays reviewable.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((useCase) => (
              <article key={useCase.slug} className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
                <p className="text-sm font-semibold text-ion">{useCase.persona}</p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-platinum">
                  {useCase.title}
                </h3>
                <div className="mt-6 grid gap-4 text-sm leading-6 text-steel">
                  <p>
                    <span className="font-semibold text-platinum">Problem: </span>
                    {useCase.problem}
                  </p>
                  <p>
                    <span className="font-semibold text-platinum">Workflow: </span>
                    {useCase.agentWorkflow}
                  </p>
                  <p>
                    <span className="font-semibold text-platinum">Output: </span>
                    {useCase.exampleOutput}
                  </p>
                  <p>
                    <span className="font-semibold text-platinum">Boundary: </span>
                    {useCase.riskBoundary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-ion">Example Agent Recipes</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Recipe previews for {industry.shortName}.
            </h2>
            <p className="mt-7 text-pretty text-lg leading-8 text-steel">
              {industry.clientValue}
            </p>
            <p className="mt-5 text-pretty text-lg leading-8 text-steel">
              {industry.coachOpportunity}
            </p>
          </div>
          <div className="grid gap-4">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <article key={recipe.slug} className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
                  <p className="text-sm font-semibold text-ember">{recipe.domain}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-platinum">
                    {recipe.name}
                  </h3>
                  <p className="mt-4 text-pretty text-sm leading-6 text-steel">
                    {recipe.shortDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {recipe.modules.slice(0, 4).map((module) => (
                      <span key={module} className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum">
                        {module}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <article className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
                <p className="text-base leading-7 text-steel">
                  Agent Recipe previews for this industry are being shaped with early
                  coaches and clients.
                </p>
              </article>
            )}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-ember">{industry.name}</p>
              <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
                Build industry-grade AI workflows with AgentCoach.
              </h2>
              <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-steel">
                Become a client to deploy expert Agent Recipes, or become a coach to
                package your professional workflow for this industry.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/become-a-client"
                className="inline-flex h-12 items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Become a Client
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/become-a-coach"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-5 text-sm font-semibold text-platinum transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Become a Coach
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
