import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CoachLeadForm } from "@/components/forms/CoachLeadForm";
import { SectionReveal } from "@/components/landing/SectionReveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { coachPersonas } from "@/lib/personas-data";

const coachAudiences = [
  "Scientists",
  "BD professionals",
  "Market researchers",
  "Engineers",
  "Consultants",
  "Operators",
  "Healthcare researchers",
  "Finance analysts",
  "Enterprise workflow experts",
];

const creationTypes = [
  "Agent Recipes",
  "Workflow playbooks",
  "System instructions",
  "Research agents",
  "Meeting prep agents",
  "Review agents",
  "Automation agents",
  "Enterprise deployment templates",
];

const whyItMatters = [
  "Prompts are easy to copy.",
  "Expert workflows are scarce.",
  "AI needs domain-specific structure.",
  "Professionals can turn tacit knowledge into reusable systems.",
];

const futureMonetization = [
  "Paid recipes",
  "Verified recipes",
  "Enterprise licensing",
  "Consulting and implementation opportunities",
  "Creator revenue share experiments",
];

export default function BecomeACoachPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(127,212,255,0.11),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-steel transition duration-200 hover:text-platinum"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to AgentCoach
          </Link>
          <p className="mt-16 text-sm font-semibold uppercase text-ion">Become a Coach</p>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
            Turn your expertise into reusable Agent Recipes.
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel sm:text-xl">
            Package your workflows, judgment, and domain knowledge into AI agent
            systems that others can discover, reuse, and eventually deploy.
          </p>
        </div>
      </section>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-ember">Who This Is For</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Experts who know how real work gets done.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {coachAudiences.map((audience) => (
              <div key={audience} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm font-semibold text-platinum">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-ion">What Coaches Can Create</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              More than advice. Complete workflow systems.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {creationTypes.map((item) => (
              <article key={item} className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line">
                <CheckCircle2 aria-hidden="true" className="size-5 text-ion" />
                <h3 className="mt-5 text-lg font-semibold text-platinum">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-ember">Why It Matters</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              The scarce asset is the expert workflow.
            </h2>
            <div className="mt-8 grid gap-3">
              {whyItMatters.map((item) => (
                <p key={item} className="flex gap-3 text-base leading-7 text-steel">
                  <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-ion" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
            <p className="text-sm font-semibold text-ion">Future Monetization</p>
            <p className="mt-5 text-pretty text-base leading-7 text-steel">
              AgentCoach is designed for future creator monetization, including paid
              recipes, verified recipes, enterprise licensing, implementation work, and
              creator revenue share experiments. Income is not guaranteed.
            </p>
            <div className="mt-8 grid gap-3">
              {futureMonetization.map((item) => (
                <p key={item} className="rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-platinum">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
          {coachPersonas.map((persona) => (
            <article key={persona.slug} className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
              <p className="text-sm font-semibold text-ember">{persona.name}</p>
              <p className="mt-4 text-pretty text-base leading-7 text-steel">
                {persona.valueProposition}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {persona.exampleActions.map((action) => (
                  <span key={action} className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum">
                    {action}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-ion">Coach Application</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Tell us what expert workflow you want to package.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-steel">
              Early coach access is for people who can turn real professional judgment
              into complete Agent Recipes with workflow, evaluation, and risk boundaries.
            </p>
          </div>
          <CoachLeadForm />
        </div>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
