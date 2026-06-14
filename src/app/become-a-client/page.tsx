import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ClientLeadForm } from "@/components/forms/ClientLeadForm";
import { SectionReveal } from "@/components/landing/SectionReveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { clientPersonas } from "@/lib/personas-data";

const clientAudiences = [
  "Individuals improving AI workflows",
  "Startup teams",
  "BD and sales teams",
  "Research teams",
  "Biotech and pharma teams",
  "Finance and market research teams",
  "Engineering teams",
  "Enterprise operations teams",
];

const problems = [
  "Repeated manual research",
  "Unstructured AI usage",
  "Inconsistent outputs",
  "Weak prompt quality",
  "Poor workflow standardization",
  "Lack of evaluation",
  "Lack of risk boundaries",
  "No deployment path",
];

const benefits = [
  "Faster research",
  "Better meeting prep",
  "Standardized analysis",
  "Repeatable workflows",
  "Higher-quality outputs",
  "Team-level knowledge reuse",
  "Safer AI usage with risk boundaries",
];

export default function BecomeAClientPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(215,180,106,0.12),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-steel transition duration-200 hover:text-platinum"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to AgentCoach
          </Link>
          <p className="mt-16 text-sm font-semibold uppercase text-ion">Become a Client</p>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl">
            Use expert-built Agent Recipes to improve high-value work.
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel sm:text-xl">
            AgentCoach helps individuals, teams, and organizations turn repeated
            knowledge work into structured AI-assisted workflows.
          </p>
        </div>
      </section>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-ember">Who This Is For</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Clients who need repeatable work, not one-off AI chats.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {clientAudiences.map((audience) => (
              <div key={audience} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm font-semibold text-platinum">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-ion">Problems AgentCoach Solves</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              AI usage becomes unreliable when the workflow is missing.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {problems.map((problem) => (
                <p key={problem} className="rounded border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-steel">
                  {problem}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
            <p className="text-sm font-semibold text-ember">How Agent Recipes Help</p>
            <div className="mt-8 grid gap-4">
              {benefits.map((benefit) => (
                <p key={benefit} className="flex gap-3 text-base leading-7 text-steel">
                  <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-ion" />
                  <span>{benefit}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="border-b border-white/10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {clientPersonas.map((persona) => (
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
            <p className="text-sm font-semibold text-ion">Client Access</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
              Tell us which workflow should become an agent.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-steel">
              Early client access is for people and teams with repeated research,
              decision, operations, or implementation workflows that need structure.
            </p>
          </div>
          <ClientLeadForm />
        </div>
      </SectionReveal>

      <SiteFooter />
    </main>
  );
}
