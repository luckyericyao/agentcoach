import { ChevronDown } from "lucide-react";
import type { RecipeWorkedExample } from "@/lib/recipe-examples";

const findingLabels = {
  documented: "Documented in sample",
  hypothesis: "Working hypothesis",
  unknown: "Open question",
} as const;

export function RecipeWorkedExampleSection({ example }: { example: RecipeWorkedExample }) {
  return (
    <details className="group mt-6 border-y border-white/10">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span>Worked example</span>
          <span className="text-xs font-medium text-ember">Synthetic data</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-ion group-open:rotate-180" />
      </summary>
      <div className="space-y-7 border-t border-white/10 py-6 text-sm leading-7 text-steel">
        <div>
          <h3 className="text-lg font-semibold text-platinum">{example.title}</h3>
          <p className="mt-2">Illustrative scenario. No real company, live run, or expert verification.</p>
        </div>
        <section>
          <h4 className="font-semibold text-platinum">Meeting objective</h4>
          <p className="mt-2">{example.scenario}</p>
        </section>
        <section>
          <h4 className="font-semibold text-platinum">Sample source notes</h4>
          <ol className="mt-2 divide-y divide-white/10">
            {example.sources.map((source) => (
              <li key={source.id} className="py-3">
                <p className="flex flex-wrap gap-x-3 font-medium text-platinum">
                  <span className="text-ion">{source.id}</span>
                  <span>{source.label}</span>
                  <time className="text-steel" dateTime={source.date}>{source.date}</time>
                </p>
                <p className="mt-1">{source.excerpt}</p>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h4 className="font-semibold text-platinum">Draft meeting brief</h4>
          <p className="mt-2">{example.output.summary}</p>
          <ul className="mt-4 divide-y divide-white/10">
            {example.output.findings.map((finding) => (
              <li key={finding.text} className="py-3">
                <p className="font-medium text-platinum">
                  <span>{findingLabels[finding.status]}</span>
                  {finding.sourceIds.length ? <span className="ml-3 text-ion">{finding.sourceIds.join(", ")}</span> : null}
                </p>
                <p className="mt-1">{finding.text}</p>
              </li>
            ))}
          </ul>
          <h5 className="mt-4 font-medium text-platinum">Proposed agenda</h5>
          <ol className="mt-2 space-y-2">
            {example.output.agenda.map(({ minutes, topic }) => (
              <li key={topic} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3">
                <span className="text-ion">{minutes} min</span>
                <span>{topic}</span>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h4 className="font-semibold text-platinum">Human review</h4>
          <p className="mt-2">{example.output.handoff}</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {example.reviewChecklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>
    </details>
  );
}
