"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Copy, Download, X } from "lucide-react";
import Link from "next/link";
import type { AgentRecipe } from "@/lib/recipes-data";
import { createRecipeSample, recipePreviewPath, recipeSampleFilename } from "@/lib/recipe-sample";

type RecipePreviewProps = {
  recipe: AgentRecipe | null;
  onClose: () => void;
};

export function RecipePreview({ recipe, onClose }: RecipePreviewProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (recipe) {
      if (!element.open) element.showModal();
      element.scrollTop = 0;
    } else if (!recipe && element.open) {
      element.close();
    }
  }, [recipe]);

  function requestClose() {
    const element = dialog.current;
    if (!element?.open) return;
    // A queued native close event must not navigate a newly reopened preview.
    element.close();
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); requestClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled])",
        )).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) requestClose();
      }}
      className="recipe-preview m-auto max-h-[calc(100svh_-_2rem)] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-lg border border-white/20 bg-ink p-0 text-platinum shadow-2xl"
    >
      {recipe ? (
        <div>
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-ink/95 px-5 py-4 backdrop-blur sm:px-8">
            <p className="text-xs font-semibold uppercase text-ion">Sample recipe</p>
            <button type="button" autoFocus onClick={requestClose}
              aria-label="Close recipe preview" title="Close recipe preview"
              className="grid size-11 shrink-0 place-items-center rounded border border-white/15 text-platinum transition hover:bg-white/10">
              <X aria-hidden="true" className="size-5" />
            </button>
          </header>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            <p className="text-sm font-medium text-ion">{recipe.domain}</p>
            <h2 id={titleId} className="mt-3 text-balance text-2xl font-semibold leading-tight sm:text-3xl">{recipe.name}</h2>
            <p id={descriptionId} className="mt-4 max-w-3xl text-sm leading-7 text-steel">{recipe.longDescription}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded border border-white/15 px-2.5 py-1 text-steel">{recipe.maturityLevel}</span>
              <span className="rounded border border-ember/25 px-2.5 py-1 text-ember">Unverified sample</span>
              <span className="rounded border border-white/15 px-2.5 py-1 text-steel">Human review required</span>
            </div>
            <RecipeSampleActions key={recipe.slug} recipe={recipe} />

            <div className="mt-9 space-y-7">
              <section data-recipe-module="instruction" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">01 / System instruction</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-steel">{recipe.instruction}</p>
              </section>
              <section data-recipe-module="workflow" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">02 / Workflow</h3>
                <ol className="mt-4 space-y-3">
                  {recipe.workflowSteps.map((step, index) => (
                    <li key={step} className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm leading-7">
                      <span aria-hidden="true" className="font-medium text-ion">{index + 1}.</span>
                      <span className="text-steel">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
              <section data-recipe-module="input" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">03 / Input template</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-steel">
                  {recipe.inputExamples.map((input) => <li key={input}>{input}</li>)}
                </ul>
              </section>
              <section data-recipe-module="output" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">04 / Output format</h3>
                <p className="mt-3 text-sm leading-7 text-steel">{recipe.outputFormat}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-steel">
                  {recipe.outputExamples.map((output) => <li key={output}>{output}</li>)}
                </ul>
              </section>
              <section data-recipe-module="tools" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">05 / Required tools</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-steel">
                  {recipe.requiredTools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </section>
              <section data-recipe-module="evaluation" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">06 / Evaluation criteria</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-steel">
                  {recipe.evaluationCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
                </ul>
              </section>
              <section data-recipe-module="risk" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">07 / Risk boundary</h3>
                <p className="mt-3 text-sm leading-7 text-ember">{recipe.riskBoundary}</p>
              </section>
              <section data-recipe-module="deployment" className="border-t border-white/10 pt-6">
                <h3 className="text-base font-semibold">08 / Deployment option</h3>
                <p className="mt-3 text-sm leading-7 text-steel">{recipe.deploymentOption}</p>
                <p className="mt-3 text-sm leading-7 text-steel">Proposed deployment path. This sample is not connected to a live agent.</p>
              </section>
            </div>
          </div>

          <footer className="flex flex-col gap-4 border-t border-white/10 bg-carbon px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-sm text-steel">Interested in adapting this workflow?</p>
            <Link href={`/become-a-client?recipe=${encodeURIComponent(recipe.slug)}#client-access`}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition hover:bg-white">
              Request this workflow<ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </footer>
        </div>
      ) : null}
    </dialog>
  );
}

function RecipeSampleActions({ recipe }: { recipe: AgentRecipe }) {
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState("");
  const linkId = useId();
  const linkInput = useRef<HTMLInputElement>(null);
  const sample = JSON.stringify(createRecipeSample(recipe), null, 2);

  useEffect(() => {
    if (manualLink) linkInput.current?.focus();
  }, [manualLink]);

  async function copyLink() {
    const url = new URL(recipePreviewPath(recipe.slug), window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setManualLink("");
    } catch {
      setCopied(false);
      setManualLink(url);
      linkInput.current?.focus();
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Recipe sharing and sample package" className="flex gap-2">
          <button type="button" onClick={copyLink} aria-label="Copy recipe link" title="Copy recipe link"
            className="grid size-11 place-items-center rounded border border-white/20 text-platinum transition hover:bg-white/10">
            <Copy aria-hidden="true" className="size-4" />
          </button>
          <a href={`data:application/json;charset=utf-8,${encodeURIComponent(sample)}`}
            download={recipeSampleFilename(recipe)} aria-label="Download sample JSON" title="Download sample JSON"
            className="grid size-11 place-items-center rounded border border-white/20 text-platinum transition hover:bg-white/10">
            <Download aria-hidden="true" className="size-4" />
          </a>
        </div>
        <p className="text-xs leading-5 text-steel">Sample package / JSON / v1</p>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs leading-5 text-ion">
        {copied ? "Recipe link copied." : manualLink ? "Clipboard unavailable. Recipe link:" : ""}
      </p>
      {manualLink ? (
        <div className="mt-3 grid gap-2">
          <label htmlFor={linkId} className="text-sm font-medium text-platinum">Recipe link</label>
          <input ref={linkInput} id={linkId} type="url" readOnly value={manualLink}
            onFocus={(event) => event.currentTarget.select()}
            className="h-12 min-w-0 w-full rounded border border-white/20 bg-carbon px-3 text-sm text-platinum" />
        </div>
      ) : null}
    </div>
  );
}
