"use client";

import { useMemo, useState } from "react";
import type { AgentRecipe } from "@/lib/recipes-data";
import type { Industry } from "@/lib/industries-data";

type RecipeCatalogProps = {
  industries: Industry[];
  recipes: AgentRecipe[];
};

export function RecipeCatalog({ industries, recipes }: RecipeCatalogProps) {
  const [industrySlug, setIndustrySlug] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maturityLevel, setMaturityLevel] = useState("all");

  const maturityLevels = useMemo(
    () => Array.from(new Set(recipes.map((recipe) => recipe.maturityLevel))),
    [recipes],
  );

  const filteredRecipes = recipes.filter((recipe) => {
    if (industrySlug !== "all" && recipe.industrySlug !== industrySlug) {
      return false;
    }
    if (featuredOnly && !recipe.featured) {
      return false;
    }
    if (verifiedOnly && !recipe.verified) {
      return false;
    }
    if (maturityLevel !== "all" && recipe.maturityLevel !== maturityLevel) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-inner-line lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="grid gap-2 text-sm font-medium text-platinum" htmlFor="industry-filter">
          Industry
          <select
            id="industry-filter"
            value={industrySlug}
            onChange={(event) => setIndustrySlug(event.target.value)}
            className="h-11 rounded border border-white/[0.14] bg-carbon px-3 text-sm text-platinum outline-none focus:border-ion/[0.55]"
          >
            <option value="all">All industries</option>
            {industries.map((industry) => (
              <option key={industry.slug} value={industry.slug}>
                {industry.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-platinum" htmlFor="maturity-filter">
          Maturity
          <select
            id="maturity-filter"
            value={maturityLevel}
            onChange={(event) => setMaturityLevel(event.target.value)}
            className="h-11 rounded border border-white/[0.14] bg-carbon px-3 text-sm text-platinum outline-none focus:border-ion/[0.55]"
          >
            <option value="all">All levels</option>
            {maturityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="flex h-full min-h-11 items-center gap-3 rounded border border-white/[0.14] bg-black/20 px-3 text-sm font-medium text-platinum">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => setFeaturedOnly(event.target.checked)}
            className="size-4 accent-platinum"
          />
          Featured
        </label>

        <label className="flex h-full min-h-11 items-center gap-3 rounded border border-white/[0.14] bg-black/20 px-3 text-sm font-medium text-platinum">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => setVerifiedOnly(event.target.checked)}
            className="size-4 accent-platinum"
          />
          Verified
        </label>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <article
              key={recipe.slug}
              className="flex min-h-[28rem] flex-col rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-inner-line"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-ion">{recipe.domain}</p>
                <span className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-steel">
                  {recipe.maturityLevel}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-semibold leading-tight text-platinum">
                {recipe.name}
              </h2>
              <p className="mt-4 text-sm leading-6 text-steel">{recipe.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {recipe.modules.slice(0, 4).map((module) => (
                  <span
                    key={module}
                    className="rounded border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-platinum"
                  >
                    {module}
                  </span>
                ))}
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-platinum">Use case</p>
                <p className="mt-2 text-sm leading-6 text-steel">{recipe.useCase}</p>
              </div>
              <div className="mt-auto pt-7">
                <span className="inline-flex rounded border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-steel">
                  Detail page coming soon
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.045] p-8 shadow-inner-line">
          <p className="text-xl font-semibold text-platinum">No matching Agent Recipes yet.</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
            Try adjusting the filters, or join early access to help shape the recipe
            library for your industry.
          </p>
        </div>
      )}
    </div>
  );
}
