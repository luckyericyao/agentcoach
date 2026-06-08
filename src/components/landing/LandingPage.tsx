"use client";

import { ArrowRight, BadgeDollarSign, Blocks, ShieldCheck, UserRoundPlus } from "lucide-react";
import { motion } from "framer-motion";
import { channels, enterpriseCapabilities, pillars } from "@/lib/landing-data";
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
          <div className="max-w-4xl">
            <motion.p
              className="mb-6 inline-flex rounded border border-white/[0.14] bg-white/[0.07] px-3 py-1.5 text-sm text-steel shadow-inner-line"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              Public agent infrastructure for serious work
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
              className="mt-6 max-w-3xl text-balance text-3xl font-medium leading-tight text-platinum sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              Train the world&apos;s AI agents.
            </motion.p>
            <motion.p
              className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-steel sm:text-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              Expert-built workflows for every individual, business, and institution.
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
                href="#creator"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/[0.16] bg-white/[0.07] px-5 text-sm font-semibold text-platinum shadow-inner-line transition duration-200 hover:border-white/[0.28] hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-ion/50"
              >
                Become a Creator
                <UserRoundPlus aria-hidden="true" className="size-4" />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-3 border-l border-white/10 pl-5 sm:grid-cols-3 lg:grid-cols-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.62 }}
          >
            {[
              ["Network", "Expert-built recipes"],
              ["Marketplace", "Rank, share, monetize"],
              ["Enterprise", "Deploy privately"],
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
              AgentCoach turns hard-won professional expertise into deployable agent
              systems. The goal is not more noise. It is a trusted network of workflows
              that can be inspected, improved, ranked, licensed, and deployed.
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
              A complete instruction system for building useful AI agents.
            </p>
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
        id="channels"
        className="relative border-b border-white/10 px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-ion">Channels</p>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight text-platinum sm:text-5xl">
                Expert workflows organized by the work they actually perform.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel lg:ml-auto">
              AgentCoach channels make discovery practical across high-value industries,
              from research and software to regulated enterprise operations.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <article
                  key={channel.title}
                  className="min-h-60 bg-ink p-6 transition duration-200 hover:bg-graphite"
                >
                  <Icon aria-hidden="true" className="size-6 text-ember" />
                  <h3 className="mt-12 text-xl font-semibold text-platinum">
                    {channel.title}
                  </h3>
                  <p className="mt-4 text-pretty text-base leading-7 text-steel">
                    {channel.detail}
                  </p>
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
              Turn expertise into deployable AI workflows.
            </h2>
            <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-steel">
              Share your best agent recipes, build reputation, and monetize through
              Pro Recipes, paid packs, and enterprise licensing.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Reputation",
                body: "Ranked recipes and public proof of useful professional systems.",
                icon: Blocks,
              },
              {
                title: "Monetization",
                body: "Paid packs, Pro Recipes, and enterprise licensing paths.",
                icon: BadgeDollarSign,
              },
              {
                title: "Deployment",
                body: "Recipes designed to become operational agents, not disposable snippets.",
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
                AgentCoach helps organizations adapt, secure, and deploy proven agent
                workflows inside their teams.
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
              Build the agent layer with people who know the work.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-steel">
              Join the early network for creator access, recipe channel launches, and
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
