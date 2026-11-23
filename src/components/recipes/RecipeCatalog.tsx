"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, RotateCcw, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { recipeSummaryModules, type AgentRecipe } from "@/lib/recipes-data";
import type { Industry } from "@/lib/industries-data";
import { defaultRecipeFilters, filterRecipes, readRecipeFilters, readRecipeSelection, recipeFilterRecoveries, recipeFiltersQuery, type RecipeFilters } from "@/lib/recipe-catalog";
import { recipePreviewPath } from "@/lib/recipe-sample";
import { RecipeDownloadLink } from "./RecipeDownloadLink";
import { RecipePreview } from "./RecipePreview";

type RecipeCatalogProps = { industries: Industry[]; recipes: AgentRecipe[] };

const recoveryLabels: Record<keyof RecipeFilters, string> = {
  query: "Clear search",
  industry: "Any industry",
  maturity: "Any maturity",
  featured: "Include non-featured samples",
  verified: "Include unverified samples",
};

export function RecipeCatalog({ industries, recipes }: RecipeCatalogProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [previousQuery, setPreviousQuery] = useState(query);
  const [filters, setFilters] = useState(() => readRecipeFilters(searchParams, recipes));
  // Update controls immediately; reconcile URL changes from back/forward navigation.
  if (previousQuery !== query) {
    setPreviousQuery(query);
    setFilters(readRecipeFilters(searchParams, recipes));
  }
  const selectedRecipe = readRecipeSelection(searchParams, recipes);
  const search = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const maturityLevels = Array.from(new Set(recipes.map((recipe) => recipe.maturityLevel)));
  const filteredRecipes = filterRecipes(recipes, filters);
  const filterQuery = recipeFiltersQuery(filters);
  const hasFilters = Boolean(filterQuery);
  const resultsPath = `/recipes${filterQuery ? `?${filterQuery}` : ""}`;
  const resetForm = "reset-recipe-filters";

  function updateFilters(changes: Partial<RecipeFilters>, replace = false) {
    const next = { ...filters, ...changes };
    setFilters(next);
    const nextQuery = recipeFiltersQuery(next);
    const url = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }

  function closeRecipe() {
    if (!selectedRecipe) return;
    const params = new URLSearchParams(searchParams);
    params.delete("recipe");
    const origin = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    if (window.history.state?.agentcoachPreviewOrigin === origin) {
      window.history.back();
    } else {
      window.history.replaceState(null, "", origin);
      search.current?.focus({ preventScroll: true });
      search.current?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }

  return (
    <div>
      <form id={resetForm} action="/recipes#recipe-results" method="get" onSubmit={(event) => {
        event.preventDefault();
        updateFilters(defaultRecipeFilters);
      }} />
      <form action="/recipes#recipe-results" method="get" role="search" aria-label="Recipe filters"
        className="border-y border-white/10 py-5" onSubmit={(event) => {
          event.preventDefault();
          results.current?.focus();
        }}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_10rem]">
          <label className="grid gap-2 text-sm font-medium text-platinum md:col-span-2 lg:col-span-1" htmlFor="recipe-search">
            Search recipes
            <span className="flex h-12 min-w-0 items-center gap-3 rounded border border-white/15 bg-white/[0.04] px-3 focus-within:border-ion/55">
              <Search aria-hidden="true" className="size-4 shrink-0 text-steel" />
              <input ref={search} id="recipe-search" name="q" type="search" value={filters.query} maxLength={120}
                onChange={(event) => updateFilters({ query: event.target.value }, true)}
                placeholder="Search by name, data, or output"
                className="h-full w-full min-w-0 bg-transparent text-base text-platinum outline-none placeholder:text-steel/65" />
            </span>
          </label>
          <div className="grid gap-2 text-sm font-medium text-platinum">
            <label htmlFor="industry-filter">Industry</label>
            <select id="industry-filter" name="industry" value={filters.industry}
              onChange={(event) => updateFilters({ industry: event.target.value })}
              className="h-12 min-w-0 w-full rounded border border-white/15 bg-carbon px-3 text-sm text-platinum outline-none focus:border-ion/55">
              <option value="all">All industries</option>
              {industries.map((industry) => <option key={industry.slug} value={industry.slug}>{industry.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2 text-sm font-medium text-platinum">
            <label htmlFor="maturity-filter">Maturity</label>
            <select id="maturity-filter" name="maturity" value={filters.maturity}
              onChange={(event) => updateFilters({ maturity: event.target.value })}
              className="h-12 min-w-0 w-full rounded border border-white/15 bg-carbon px-3 text-sm text-platinum outline-none focus:border-ion/55">
              <option value="all">All levels</option>
              {maturityLevels.map((level) => <option key={level} value={level.toLowerCase()}>{level}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-platinum">
            <input type="checkbox" name="featured" value="1" checked={filters.featured} onChange={(event) => updateFilters({ featured: event.target.checked })}
              className="size-4 accent-platinum" />Featured
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-platinum">
            <input type="checkbox" name="verified" value="1" checked={filters.verified} onChange={(event) => updateFilters({ verified: event.target.checked })}
              className="size-4 accent-platinum" />Verified
          </label>
          <button type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-white/20 bg-white/[0.05] px-3 text-sm font-semibold text-platinum transition hover:bg-white/10">
            Show results<ArrowDown aria-hidden="true" className="size-4" />
          </button>
          <button type="submit" form={resetForm} disabled={!hasFilters}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded px-2 text-sm font-medium text-steel transition hover:text-platinum disabled:opacity-40 sm:ml-auto">
            <RotateCcw aria-hidden="true" className="size-4" />Reset filters
          </button>
        </div>
      </form>

      <RecipePreview recipe={selectedRecipe} onClose={closeRecipe} returnToResults={`${resultsPath}#recipe-results`} />

      <div id="recipe-results" ref={results} tabIndex={-1} role="region" aria-label="Recipe results"
        className="mt-7 flex scroll-mt-24 flex-col gap-2 text-sm text-steel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ion sm:flex-row sm:items-center sm:justify-between">
        <p role="status" aria-live="polite" aria-atomic="true" className="font-medium text-platinum">
          {filteredRecipes.length} sample {filteredRecipes.length === 1 ? "recipe" : "recipes"}
        </p>
        <p>Illustrative previews. No independently verified recipes yet.</p>
      </div>

      {filteredRecipes.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <article key={recipe.slug} aria-labelledby={`catalog-recipe-${recipe.slug}`}
              className="flex min-h-[28rem] flex-col rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-ion">{recipe.domain}</p>
                <span className="shrink-0 rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-steel">{recipe.maturityLevel}</span>
              </div>
              <h2 id={`catalog-recipe-${recipe.slug}`} className="mt-6 text-2xl font-semibold leading-tight text-platinum">{recipe.name}</h2>
              <p className="mt-4 text-sm leading-6 text-steel">{recipe.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {recipeSummaryModules.map((module) => (
                  <span key={module} className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum">{module}</span>
                ))}
              </div>
              <dl className="mt-6 grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2 border-t border-white/10 pt-5 text-sm leading-6">
                <dt className="font-medium text-platinum">Input</dt>
                <dd className="text-steel [overflow-wrap:anywhere]">{recipe.inputExamples[0]}</dd>
                <dt className="font-medium text-platinum">Output</dt>
                <dd className="text-steel [overflow-wrap:anywhere]">{recipe.outputExamples[0]}</dd>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                <a href={`${recipePreviewPath(recipe.slug, filterQuery)}#recipe-preview`} aria-label={`Preview ${recipe.name}`}
                  onClick={(event) => {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    window.history.pushState({ agentcoachPreviewOrigin: resultsPath }, "", recipePreviewPath(recipe.slug, filterQuery));
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-white/20 bg-white/[0.05] px-4 text-sm font-semibold text-platinum transition hover:border-ion/50 hover:bg-white/10">
                  Preview recipe<ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
                <RecipeDownloadLink recipe={recipe} includeRecipeName />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-b border-white/10 py-16">
          <h2 className="text-2xl font-semibold text-platinum">
            {filters.verified ? "No verified recipes available yet." : "No matching sample recipes."}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
            {filters.verified ? "The current catalog contains unverified, illustrative samples." : "There are no samples for this combination of search and filters."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {recipeFilterRecoveries(recipes, filters).map(({ key, query, count }) => (
              <a key={key} href={`/recipes?${query}#recipe-results`}
                className="inline-flex min-h-11 items-center gap-2 rounded border border-ion/40 px-4 text-sm font-semibold text-platinum transition hover:bg-white/10">
                {recoveryLabels[key]} <span className="text-steel">({count})</span>
              </a>
            ))}
            <button type="submit" form={resetForm}
              className="inline-flex min-h-11 items-center gap-2 rounded border border-white/20 px-4 text-sm font-semibold text-platinum transition hover:bg-white/10">
              <RotateCcw aria-hidden="true" className="size-4" />Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
