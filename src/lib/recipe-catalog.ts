import type { AgentRecipe } from "./recipes-data";

export type RecipeFilters = {
  query: string;
  industry: string;
  maturity: string;
  featured: boolean;
  verified: boolean;
};

export const defaultRecipeFilters: RecipeFilters = {
  query: "", industry: "all", maturity: "all", featured: false, verified: false,
};

export function readRecipeSelection(params: Pick<URLSearchParams, "getAll">, recipes: AgentRecipe[]) {
  const slugs = params.getAll("recipe");
  return slugs.length === 1 ? recipes.find((recipe) => recipe.slug === slugs[0]) ?? null : null;
}

export function readRecipeFilters(params: Pick<URLSearchParams, "get">, recipes: AgentRecipe[]): RecipeFilters {
  const industry = params.get("industry");
  const maturity = params.get("maturity");
  return {
    query: (params.get("q") || "").slice(0, 120),
    industry: recipes.some((recipe) => recipe.industrySlug === industry) ? industry! : "all",
    maturity: recipes.some((recipe) => recipe.maturityLevel.toLowerCase() === maturity) ? maturity! : "all",
    featured: params.get("featured") === "1",
    verified: params.get("verified") === "1",
  };
}

export function recipeFiltersQuery(filters: RecipeFilters) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query);
  if (filters.industry !== "all") params.set("industry", filters.industry);
  if (filters.maturity !== "all") params.set("maturity", filters.maturity);
  if (filters.featured) params.set("featured", "1");
  if (filters.verified) params.set("verified", "1");
  return params.toString();
}

function normalizeRecipeSearch(value: string) {
  return value.normalize("NFKC").toLowerCase()
    .replace(/[\p{Pd},;:()"\u201c\u201d]+/gu, " ")
    .replace(/[\u2018\u2019]/g, "'");
}

export function filterRecipes(recipes: AgentRecipe[], filters: RecipeFilters) {
  const query = filters.query.trim();
  const terms = normalizeRecipeSearch(query).split(/\s+/).filter(Boolean);
  if (query && !terms.length) return [];
  return recipes.filter((recipe) => {
    if (filters.industry !== "all" && recipe.industrySlug !== filters.industry) return false;
    if (filters.maturity !== "all" && recipe.maturityLevel.toLowerCase() !== filters.maturity) return false;
    if (filters.featured && !recipe.featured) return false;
    if (filters.verified && !recipe.verified) return false;
    const searchable = normalizeRecipeSearch([recipe.name, recipe.domain, recipe.useCase, recipe.shortDescription,
      ...recipe.inputExamples, ...recipe.outputExamples, ...recipe.requiredTools].join(" "));
    return terms.every((term) => searchable.includes(term));
  });
}

export function recipeFilterRecoveries(recipes: AgentRecipe[], filters: RecipeFilters) {
  const keys = ["query", "industry", "maturity", "featured", "verified"] as const;
  return keys.flatMap((key) => {
    if (filters[key] === defaultRecipeFilters[key]) return [];
    const relaxed = { ...filters, [key]: defaultRecipeFilters[key] };
    const query = recipeFiltersQuery(relaxed);
    if (!query) return []; // Clear all filters already reaches the same results.
    const count = filterRecipes(recipes, relaxed).length;
    return count > 0 ? [{ key, query, count }] : [];
  });
}
