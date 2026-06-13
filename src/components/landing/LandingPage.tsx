"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  channels,
  enterpriseCapabilities,
  enterpriseFlow,
  featuredRecipes,
  finalAudiencePaths,
  heroSignals,
  recipeParts,
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
        className="relative flex min-h-[100svh] items-center border-b border-white/10 px-5 pt-20 sm:px-8 sm:pt-24"
      >
        <OrbitalNetwork />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(215,180,106,0.12),transparent_34rem)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl py-16 sm:py-20 lg:py-24">
          <div className="max-w-6xl">
            <motion.p
              className="mb-7 text-sm font-semibold uppercase text-ion sm:text-base"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              AgentCoach
            </motion.p>
            <motion.h1
              className="max-w-6xl text-balance text-5xl font-semibold leading-none text-platinum sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Train the world&apos;s AI agents.
            </motion.h1>
            <motion.p
              className="mt-7 max-w-4xl text-pretty text-xl leading-8 text-platinum/90 sm:text-2xl sm:leading-9"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              Turn expert workflows into reusable, rankable, and deployable AI agents.
            </motion.p>
            <motion.p
              className="mt-5 max-w-3xl text-pretty text-base leading-7 text-steel sm:text-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            >
              Not prompts. Agent Recipes — complete instruction systems built for real
              workflows.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.54 }}
            >
              <a
                href="#recipes"
                className="inline-flex h-12 items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Explore Agent Recipes
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#enterprise"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-5 text-sm font-semibold text-platinum shadow-inner-line transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Request Enterprise Access
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </motion.div>

            <motion.div
              aria-label="Agent Recipe signals"
              className="mt-9 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-inner-line sm:mt-12 sm:grid-cols-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.64 }}
            >
              {heroSignals.map((signal) => (
                <div key={signal} className="bg-carbon/70 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
                  <p className="text-sm font-semibold text-platinum">{signal}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <SectionReveal
        id="recipes"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-36"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ion/50 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Agent Recipe System</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                Prompts are easy to copy. Expert workflows are the real asset.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              An Agent Recipe packages the judgment, sequence, tools, boundaries, and
              evaluation logic behind useful AI agents. It is designed to be improved,
              ranked, monetized, and deployed.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recipeParts.map((part, index) => {
              const Icon = part.icon;
              return (
                <motion.article
                  key={part.title}
                  className="min-h-64 rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line transition duration-200 hover:border-white/[0.2] hover:bg-white/[0.065]"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (index % 4) * 0.06 }}
                  viewport={{ once: true, amount: 0.28 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ion" />
                    </div>
                    <span className="text-xs font-semibold text-steel">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-10 text-xl font-semibold text-platinum">{part.title}</h3>
                  <p className="mt-4 text-pretty text-sm leading-6 text-steel">{part.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="channels"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-36"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:96px_96px] opacity-25" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ember">Industry Channels</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                A strategic map for where agent workflows will be deployed.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              Each channel defines the decisions, data sources, and professional outputs
              that future Agent Recipes can standardize.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <motion.article
                  key={channel.name}
                  className="flex min-h-[31rem] flex-col rounded-lg border border-white/10 bg-carbon/80 p-6 shadow-inner-line backdrop-blur transition duration-200 hover:border-white/[0.22] hover:bg-ink"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
                  viewport={{ once: true, amount: 0.22 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                      <Icon aria-hidden="true" className="size-5 text-ember" />
                    </div>
                    <span className="rounded border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-steel">
                      Channel
                    </span>
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold leading-tight text-platinum">
                    {channel.name}
                  </h3>
                  <div className="mt-7 grid gap-5 text-sm leading-6">
                    <div>
                      <p className="font-semibold text-platinum">Decisions</p>
                      <p className="mt-1 text-steel">{channel.decisions}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-platinum">Data</p>
                      <p className="mt-1 text-steel">{channel.data}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-platinum">Recipes produce</p>
                      <p className="mt-1 text-steel">{channel.produces}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="featured-recipes"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold text-ion">Featured Agent Recipes</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
              Preview expert systems before they become deployable agents.
            </h2>
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-steel">
              These are homepage previews only: examples of how AgentCoach will package
              domain expertise into reusable agent systems.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {featuredRecipes.map((recipe, index) => {
              const Icon = recipe.icon;
              return (
                <motion.article
                  key={recipe.name}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line transition duration-200 hover:border-white/[0.22] hover:bg-white/[0.065]"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}
                  viewport={{ once: true, amount: 0.24 }}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="grid size-10 shrink-0 place-items-center rounded border border-white/[0.12] bg-black/30">
                        <Icon aria-hidden="true" className="size-5 text-ember" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-steel">{recipe.domain}</p>
                        <h3 className="mt-2 text-2xl font-semibold leading-tight text-platinum">
                          {recipe.name}
                        </h3>
                      </div>
                    </div>
                    <span className="w-fit rounded border border-ion/20 bg-ion/[0.08] px-2.5 py-1 text-xs font-medium text-ion">
                      Preview
                    </span>
                  </div>
                  <div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1fr]">
                    <div>
                      <p className="text-sm font-semibold text-platinum">Use case</p>
                      <p className="mt-2 text-pretty text-sm leading-6 text-steel">
                        {recipe.useCase}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-platinum">Included modules</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.modules.map((module) => (
                          <span
                            key={module}
                            className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-7 border-t border-white/10 pt-5">
                    <p className="text-sm font-semibold text-platinum">Example output</p>
                    <p className="mt-2 text-pretty text-sm leading-6 text-steel">
                      {recipe.output}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal
        id="enterprise"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-36"
      >
        <div className="absolute inset-x-0 top-1/3 h-[28rem] bg-[radial-gradient(circle_at_70%_50%,rgba(127,212,255,0.1),transparent_32rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.84fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-ember">Enterprise Deployment</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                Convert proven public recipes into private enterprise agents.
              </h2>
              <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel">
                AgentCoach is built for organizations that need secure team workflows,
                governance, evaluation, local AI options, and controlled access before
                agent systems touch internal work.
              </p>
            </div>

            <div className="grid gap-8">
              <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
                {enterpriseCapabilities.map((capability) => (
                  <div key={capability} className="bg-ink p-5">
                    <p className="text-base font-medium leading-6 text-platinum">
                      {capability}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
                <p className="text-sm font-semibold text-ion">Enterprise path</p>
                <div className="mt-6 grid gap-4">
                  {enterpriseFlow.map((step, index) => (
                    <div key={step} className="flex gap-4">
                      <span className="grid size-7 shrink-0 place-items-center rounded border border-white/10 bg-black/30 text-xs font-semibold text-platinum">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-steel">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="waitlist" className="relative px-5 py-20 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.86fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Request Access</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl lg:text-6xl">
                Join the Agent Recipe network.
              </h2>
              <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel">
                Early access is for creators publishing expert systems, teams searching
                for reusable workflows, and enterprises preparing private agent
                deployment.
              </p>
            </div>
            <div>
              <div className="grid gap-3 sm:grid-cols-3">
                {finalAudiencePaths.map((path) => {
                  const Icon = path.icon;
                  return (
                    <article
                      key={path.title}
                      className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line"
                    >
                      <Icon aria-hidden="true" className="size-5 text-ember" />
                      <h3 className="mt-5 text-base font-semibold text-platinum">
                        {path.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-steel">{path.body}</p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-inner-line sm:p-6">
                <div className="flex gap-3 text-sm leading-6 text-steel">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-ion"
                  />
                  <p>
                    Version 1 is a static access form. Enterprise integrations and
                    account workflows can be connected after launch.
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </div>
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
