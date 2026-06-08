"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  coachBenefits,
  heroIndustryTags,
  industries,
  trustPrinciples,
  userBenefits,
} from "@/lib/landing-data";
import { OrbitalNetwork } from "./OrbitalNetwork";
import { SectionReveal } from "./SectionReveal";
import { TopNavigation } from "./TopNavigation";
import { WaitlistForm } from "./WaitlistForm";

function industryId(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section
        id="hero"
        className="relative flex min-h-[100svh] items-center border-b border-white/10 px-5 pt-20 sm:px-8 sm:pt-24"
      >
        <OrbitalNetwork />
        <div className="relative z-10 mx-auto w-full max-w-7xl py-14 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <motion.p
              className="mb-6 text-base font-semibold text-platinum sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              AgentCoach
            </motion.p>
            <motion.h1
              className="max-w-5xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Professional coaches for better decisions.
            </motion.h1>
            <motion.p
              className="mt-7 max-w-3xl text-pretty text-base leading-7 text-steel sm:text-xl sm:leading-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              AI coaches built by industry professionals — starting with Biotech &
              Pharma, Finance, Tax & Accounting, and Technology.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
            >
              <a
                href="#industries"
                className="inline-flex h-12 items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Explore Industries
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#coaches"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-5 text-sm font-semibold text-platinum shadow-inner-line transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Become a Coach
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </motion.div>

            <motion.div
              aria-label="Initial AgentCoach industries"
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-steel sm:mt-12"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58 }}
            >
              {heroIndustryTags.map((tag, index) => (
                <span key={tag} className="inline-flex items-center gap-3">
                  <span>{tag}</span>
                  {index < heroIndustryTags.length - 1 ? (
                    <span className="size-1 rounded-full bg-steel/50" />
                  ) : null}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <SectionReveal
        id="industries"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Explore by Industry</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                Start with the field. Then choose the coach.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              AgentCoach organizes professional AI coaches by industry first, so each
              coach starts from the language, constraints, and decisions of the field it
              serves.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.article
                  id={industryId(industry.name)}
                  key={industry.name}
                  className="flex min-h-[24rem] flex-col rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line transition duration-200 hover:border-white/[0.2] hover:bg-white/[0.065]"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
                  viewport={{ once: true, amount: 0.28 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ion" />
                    </div>
                    <span className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-steel">
                      Industry
                    </span>
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold leading-tight text-platinum">
                    {industry.name}
                  </h3>
                  <p className="mt-4 text-pretty text-base leading-7 text-steel">
                    {industry.description}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {industry.coachTypes.map((coachType) => (
                      <span
                        key={coachType}
                        className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum"
                      >
                        {coachType}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="coach-examples"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-ember">Selected Coach Examples</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Industry professionals define the coach types.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-steel">
              Each category can contain multiple professional coaches, with the specific
              questions, source expectations, and review boundaries handled inside the
              industry context.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.article
                  key={industry.name}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}
                  viewport={{ once: true, amount: 0.24 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ember" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-steel">Industry</p>
                      <h3 className="mt-1 text-2xl font-semibold text-platinum">
                        {industry.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-8 divide-y divide-white/10">
                    {industry.examples.map((example) => (
                      <div key={example.name} className="py-5 first:pt-0 last:pb-0">
                        <p className="text-lg font-semibold text-platinum">{example.name}</p>
                        <p className="mt-2 text-pretty text-sm leading-6 text-steel">
                          {example.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="users"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-ion">For Users</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Find a coach built for your field.
            </h2>
            <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel">
              AgentCoach gives professionals a cleaner way to move from scattered
              context to structured guidance, without losing the human judgment that
              serious decisions require.
            </p>
          </div>

          <div className="grid gap-4">
            {userBenefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ion" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-platinum">{item.title}</h3>
                      <p className="mt-2 text-pretty text-base leading-7 text-steel">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="coaches"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-ember">For Coaches</p>
            <h2 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Become the professional behind the coach.
            </h2>
            <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel">
              Industry professionals can package repeatable judgment into AI coaches
              that users and teams can discover, evaluate, and adapt.
            </p>
          </div>

          <div className="grid gap-4">
            {coachBenefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ember" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-platinum">{item.title}</h3>
                      <p className="mt-2 text-pretty text-base leading-7 text-steel">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="trust" className="relative px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Trust / Privacy</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                Built for professional standards.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              AgentCoach is designed for teams and individuals who need privacy,
              clear boundaries, and accountable review around AI-assisted decisions.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {trustPrinciples.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  className="min-h-64 rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.36 }}
                >
                  <div className="grid size-10 place-items-center rounded border border-white/[0.12] bg-black/30">
                    <Icon aria-hidden="true" className="size-5 text-ion" />
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold text-platinum">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-pretty text-base leading-7 text-steel">
                    {item.body}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div
            id="waitlist"
            className="mt-16 grid gap-10 border-t border-white/10 pt-12 lg:grid-cols-[0.86fr_1fr] lg:items-end"
          >
            <div>
              <p className="text-sm font-semibold text-ember">Request Access</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
                Explore the first professional AI coaches.
              </h2>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-steel">
                Join as a user, an industry professional, or a team preparing private AI
                coach deployments.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </SectionReveal>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>AgentCoach</p>
          <p>Professional coaches built by industry professionals.</p>
        </div>
      </footer>
    </main>
  );
}
