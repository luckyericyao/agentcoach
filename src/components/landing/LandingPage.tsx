"use client";

import {
  ArrowRight,
  BadgeDollarSign,
  Blocks,
  CheckCircle2,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  channels,
  creatorBullets,
  enterpriseCapabilities,
  finalAudiencePaths,
  pillars,
  promptComparison,
  recipeExamples,
} from "@/lib/landing-data";
import { OrbitalNetwork } from "./OrbitalNetwork";
import { SectionReveal } from "./SectionReveal";
import { TopNavigation } from "./TopNavigation";
import { WaitlistForm } from "./WaitlistForm";

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section
        id="hero"
        className="relative flex min-h-screen items-center border-b border-white/10 px-5 pt-24 sm:px-8"
      >
        <OrbitalNetwork />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 py-16 lg:grid-cols-[1fr_0.68fr] lg:items-end">
          <div className="max-w-5xl">
            <motion.p
              className="mb-6 inline-flex rounded border border-white/[0.14] bg-white/[0.07] px-3 py-1.5 text-sm text-steel shadow-inner-line"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              AgentCoach turns high-value decision workflows into reusable AI agent recipes.
            </motion.p>
            <motion.h1
              className="text-balance text-6xl font-semibold leading-none text-platinum sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              AgentCoach
            </motion.h1>
            <motion.p
              className="mt-6 max-w-4xl text-balance text-3xl font-medium leading-tight text-platinum sm:text-4xl lg:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              Agent recipes for data-heavy decisions.
            </motion.p>
            <motion.p
              className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-steel sm:text-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              AgentCoach turns expert decision-making into reusable AI workflows for
              finance, BD, healthcare, sourcing, contracts, and enterprise operations.
            </motion.p>
            <motion.p
              className="mt-4 max-w-3xl text-pretty text-base leading-7 text-steel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Not prompts. Repeatable agent systems built around data, workflow,
              evaluation, and deployment.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58 }}
            >
              <a
                href="#recipes"
                className="inline-flex h-12 items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Explore Agent Recipes
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#creator"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-5 text-sm font-semibold text-platinum shadow-inner-line transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Become a Creator
                <UserRoundPlus aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#enterprise"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/[0.16] px-5 text-sm font-semibold text-platinum transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Request Enterprise Access
                <ShieldCheck aria-hidden="true" className="size-4" />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-3 border-l border-white/10 pl-5 sm:grid-cols-3 lg:grid-cols-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.66 }}
          >
            {[
              ["Marketplace", "Reusable agent recipes"],
              ["Data", "Fragmented sources to structured decisions"],
              ["Slogan", "Train the world's AI agents."],
            ].map(([label, value]) => (
              <div key={label} className="py-4">
                <p className="text-sm text-steel">{label}</p>
                <p className="mt-2 text-xl font-semibold text-platinum">{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionReveal
        id="vision"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.74fr_1fr] lg:items-start">
          <p className="text-sm font-semibold text-ion">Vision</p>
          <div>
            <h2 className="max-w-5xl text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Make AI equally accessible and effectively usable for every individual,
              business, and institution.
            </h2>
            <p className="mt-8 max-w-3xl text-pretty text-lg leading-8 text-steel">
              AgentCoach turns fragmented professional data and expert decision logic
              into deployable agent systems. The goal is not more noise. It is a
              trusted network of workflows that can be inspected, improved, ranked,
              licensed, and deployed.
            </p>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="recipes"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-ember">What is an Agent Recipe</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Not prompts. Agent Recipes.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-8 text-steel">
              A complete instruction system for automating data-heavy professional
              workflows with repeatable inputs, evaluation, and deployment patterns.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-[0.72fr_1fr]">
            <article className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
              <p className="text-sm font-semibold text-steel">{promptComparison.prompt.title}</p>
              <p className="mt-5 text-2xl font-semibold leading-snug text-platinum">
                {promptComparison.prompt.example}
              </p>
              <p className="mt-6 text-base leading-7 text-steel">
                {promptComparison.prompt.point}
              </p>
            </article>

            <article className="rounded-lg border border-ion/[0.28] bg-ion/[0.055] p-6 shadow-inner-line">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ion">
                    {promptComparison.recipe.title}
                  </p>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-steel">
                    {promptComparison.recipe.point}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum">
                  Repeatable workflow
                </span>
              </div>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                {promptComparison.recipe.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-steel">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded border border-white/10 bg-black/25 text-xs font-semibold text-platinum">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.title}
                  className="min-h-64 rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <div className="grid size-10 place-items-center rounded border border-white/[0.12] bg-black/30">
                    <Icon aria-hidden="true" className="size-5 text-ion" />
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold text-platinum">{pillar.title}</h3>
                  <p className="mt-4 text-pretty text-base leading-7 text-steel">
                    {pillar.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="data-heavy-work"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Agent Recipes for Data-Heavy Work</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
                Turn fragmented professional data into repeatable decision workflows.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              Built for industries where fragmented data, frequent decisions, and manual
              research slow down execution.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recipeExamples.map((recipe, index) => {
              const Icon = recipe.icon;
              return (
                <motion.article
                  key={recipe.name}
                  className="flex min-h-[34rem] flex-col rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line transition duration-200 hover:border-white/[0.2] hover:bg-white/[0.065]"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
                  viewport={{ once: true, amount: 0.22 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ember" />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {recipe.badges.slice(0, 2).map((badge) => (
                        <span
                          key={badge}
                          className="rounded border border-white/10 bg-black/25 px-2 py-1 text-xs font-medium text-steel"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="mt-7 text-2xl font-semibold leading-tight text-platinum">
                    {recipe.name}
                  </h3>
                  <p className="mt-4 text-pretty text-base leading-7 text-steel">
                    {recipe.description}
                  </p>

                  <div className="mt-7 grid gap-4 text-sm leading-6">
                    <div>
                      <p className="font-semibold text-platinum">Data inputs</p>
                      <p className="mt-1 text-steel">{recipe.data}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-platinum">Workflow</p>
                      <p className="mt-1 text-steel">{recipe.workflow}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-platinum">Output</p>
                      <p className="mt-1 text-steel">{recipe.output}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-platinum">Business value</p>
                      <p className="mt-1 text-steel">{recipe.value}</p>
                    </div>
                  </div>

                  {recipe.disclaimer ? (
                    <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-steel/80">
                      {recipe.disclaimer}
                    </p>
                  ) : null}

                  <a
                    href="#waitlist"
                    className="mt-auto inline-flex h-10 w-fit items-center gap-2 pt-6 text-sm font-semibold text-platinum transition duration-200 hover:text-ion"
                  >
                    {index % 2 === 0 ? "View Recipe" : "Preview Recipe"}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="channels"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Channels</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
                Workflow channels organized around data, decisions, and outputs.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              Each channel makes discovery practical by showing what data the agent uses,
              what decision it supports, and what deliverable it produces.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <article
                  key={channel.title}
                  className="min-h-80 bg-ink p-6 transition duration-200 hover:bg-graphite"
                >
                  <Icon aria-hidden="true" className="size-6 text-ember" />
                  <h3 className="mt-10 text-xl font-semibold text-platinum">
                    {channel.title}
                  </h3>
                  <div className="mt-5 grid gap-3 text-sm leading-6 text-steel">
                    <p>
                      <span className="font-semibold text-platinum">Data: </span>
                      {channel.data}
                    </p>
                    <p>
                      <span className="font-semibold text-platinum">Decision: </span>
                      {channel.decisions}
                    </p>
                    <p>
                      <span className="font-semibold text-platinum">Output: </span>
                      {channel.output}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="creator"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-ember">Creator Network</p>
            <h2 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Publish your best professional workflow once.
            </h2>
            <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel">
              Earn from recipe access, paid packs, and enterprise adaptation requests.
            </p>
            <div className="mt-9 grid gap-3">
              {creatorBullets.map((bullet) => (
                <p key={bullet} className="flex gap-3 text-base leading-7 text-steel">
                  <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-ion" />
                  <span>{bullet}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Reputation",
                body: "Ranked recipes show proof of useful professional systems.",
                icon: Blocks,
              },
              {
                title: "Monetization",
                body: "Pro Recipes, paid packs, and enterprise licensing paths for high-value expertise.",
                icon: BadgeDollarSign,
              },
              {
                title: "Operationalization",
                body: "Recipes designed to become dependable team workflows, not disposable snippets.",
                icon: ShieldCheck,
              },
            ].map((item, index) => {
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
        id="enterprise"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-ion">Enterprise Deployment</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                From community-tested recipes to enterprise-ready agents.
              </h2>
            </div>
            <div>
              <p className="text-pretty text-lg leading-8 text-steel">
                Built for teams that cannot rely on random prompts, screenshots, or
                undocumented AI usage.
              </p>
              <p className="mt-5 text-pretty text-lg leading-8 text-steel">
                AgentCoach helps organizations adapt, secure, evaluate, and deploy proven
                agent workflows inside their teams.
              </p>
              <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
                {enterpriseCapabilities.map((capability) => (
                  <div key={capability} className="bg-ink p-5">
                    <p className="text-base font-medium text-platinum">{capability}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="waitlist" className="relative px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-ember">Waitlist / Contact</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Choose the AgentCoach path for your work.
            </h2>
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-3">
              {finalAudiencePaths.map((path) => {
                const Icon = path.icon;
                return (
                  <article
                    key={path.title}
                    className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-inner-line"
                  >
                    <Icon aria-hidden="true" className="size-5 text-ion" />
                    <h3 className="mt-5 text-base font-semibold text-platinum">{path.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-steel">{path.body}</p>
                  </article>
                );
              })}
            </div>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-steel">
              Join the early network for usable recipes, creator access, and private
              enterprise deployment conversations.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </SectionReveal>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>AgentCoach</p>
          <p>Train the world&apos;s AI agents.</p>
        </div>
      </footer>
    </main>
  );
}
