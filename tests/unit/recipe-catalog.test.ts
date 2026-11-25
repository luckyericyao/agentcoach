import { describe, expect, it } from "vitest";
import { agentRecipes } from "@/lib/recipes-data";
import { getIndustryBySlug } from "@/lib/industries-data";
import { defaultRecipeFilters, filterRecipes, readRecipeFilters, readRecipeSelection, recipeFilterRecoveries, recipeFiltersQuery } from "@/lib/recipe-catalog";

describe("sample recipe contract", () => {
  it("keeps every sample complete and explicitly unverified", () => {
    expect(new Set(agentRecipes.map((recipe) => recipe.slug)).size).toBe(agentRecipes.length);
    for (const recipe of agentRecipes) {
      expect(getIndustryBySlug(recipe.industrySlug)).toBeDefined();
      expect(recipe.modules).toEqual([
        "Instruction", "Workflow", "Input Template", "Output Format", "Required Tools", "Evaluation", "Risk Boundary", "Deployment",
      ]);
      expect(recipe.instruction.length).toBeGreaterThan(80);
      expect(recipe.workflowSteps.length).toBeGreaterThanOrEqual(5);
      expect(recipe.outputFormat.length).toBeGreaterThan(80);
      expect(recipe.inputExamples[0]?.trim()).toBeTruthy();
      expect(recipe.outputExamples[0]?.trim()).toBeTruthy();
      expect(recipe.requiredTools.length).toBeGreaterThan(0);
      expect(recipe.evaluationCriteria.length).toBeGreaterThan(0);
      expect(recipe.riskBoundary).not.toBe("");
      expect(recipe.verified).toBe(false);
    }
  });
});

describe("recipe search and URL filters", () => {
  it("opens only a known single recipe slug", () => {
    expect(readRecipeSelection(new URLSearchParams({ recipe: agentRecipes[0].slug }), agentRecipes)).toBe(agentRecipes[0]);
    for (const query of ["", "recipe=", "recipe=unknown", "recipe=biotech-bd-meeting-prep-agent&recipe=biotech-bd-meeting-prep-agent"]) {
      expect(readRecipeSelection(new URLSearchParams(query), agentRecipes)).toBeNull();
    }
  });
  it("finds source/tool context as well as recipe names", () => {
    const results = filterRecipes(agentRecipes, { ...defaultRecipeFilters, query: "  crm  " });
    expect(results.map((recipe) => recipe.slug)).toEqual(["biotech-bd-meeting-prep-agent", "sales-outreach-agent"]);
  });
  it("matches all search words without interpreting regular expressions", () => {
    expect(filterRecipes(agentRecipes, { ...defaultRecipeFilters, query: "EARNINGS transcript" })).toHaveLength(1);
    expect(filterRecipes(agentRecipes, { ...defaultRecipeFilters, query: "[.*]" })).toHaveLength(0);
  });
  it("promotes complete title matches while preserving the order of other matches", () => {
    const filters = { ...defaultRecipeFilters, query: "workflow" };
    expect(filterRecipes(agentRecipes, filters).map(({ slug }) => slug)).toEqual([
      "enterprise-workflow-architect-agent",
      "finance-earnings-call-analyst",
      "codex-full-stack-builder-agent",
      "healthcare-evidence-review-agent",
      "sales-outreach-agent",
    ]);
    expect(filterRecipes(agentRecipes, defaultRecipeFilters)).toEqual(agentRecipes);
    expect(filterRecipes(agentRecipes, { ...filters, featured: true }).map(({ slug }) => slug)).toEqual([
      "finance-earnings-call-analyst", "codex-full-stack-builder-agent", "healthcare-evidence-review-agent",
    ]);
  });
  it.each([
    ["earnings, call", "finance-earnings-call-analyst"],
    ["full\u2011stack", "codex-full-stack-builder-agent"],
    ["\uff45arnings\uff0c call", "finance-earnings-call-analyst"],
  ])("matches pasted search text %s without changing the search URL", (query, slug) => {
    const filters = { ...defaultRecipeFilters, query };
    expect(filterRecipes(agentRecipes, filters).map((recipe) => recipe.slug)).toEqual([slug]);
    expect(new URLSearchParams(recipeFiltersQuery(filters)).get("q")).toBe(query);
  });
  it("does not treat nonempty separator-only queries as an empty search", () => {
    expect(filterRecipes(agentRecipes, { ...defaultRecipeFilters, query: ", \u2013 ()" })).toEqual([]);
    expect(filterRecipes(agentRecipes, { ...defaultRecipeFilters, query: " " })).toHaveLength(agentRecipes.length);
  });
  it("combines industry, featured, and maturity filters", () => {
    const filters = { ...defaultRecipeFilters, industry: "finance-market-research", featured: true, maturity: "preview" };
    expect(filterRecipes(agentRecipes, filters).map((recipe) => recipe.slug)).toEqual(["finance-earnings-call-analyst"]);
    expect(filterRecipes(agentRecipes, { ...filters, maturity: "concept" })).toHaveLength(0);
  });
  it("does not fabricate verified results", () => {
    expect(filterRecipes(agentRecipes, { ...defaultRecipeFilters, verified: true })).toHaveLength(0);
  });
  it("recommends only single-filter changes that return actual samples", () => {
    const filters = { ...defaultRecipeFilters, query: "earnings", industry: "biotech-pharma", featured: true };
    expect(recipeFilterRecoveries(agentRecipes, filters)).toEqual([
      { key: "query", query: "industry=biotech-pharma&featured=1", count: 1 },
      { key: "industry", query: "q=earnings&featured=1", count: 1 },
    ]);
    const verified = { ...filters, industry: "finance-market-research", verified: true };
    expect(recipeFilterRecoveries(agentRecipes, verified)).toEqual([
      { key: "verified", query: "q=earnings&industry=finance-market-research&featured=1", count: 1 },
    ]);
  });
  it("omits recovery links that still fail or duplicate clear-all", () => {
    expect(recipeFilterRecoveries(agentRecipes, { ...defaultRecipeFilters, query: "not a matching term" })).toEqual([]);
    expect(recipeFilterRecoveries(agentRecipes, { ...defaultRecipeFilters, query: "not a matching term", verified: true })).toEqual([]);
  });
  it("restores valid filters from a shareable URL", () => {
    const filters = { query: "earnings call", industry: "finance-market-research", maturity: "preview", featured: true, verified: false };
    expect(readRecipeFilters(new URLSearchParams(recipeFiltersQuery(filters)), agentRecipes)).toEqual(filters);
  });
  it("falls back safely for unknown categories and limits search length", () => {
    const filters = readRecipeFilters(new URLSearchParams({ industry: "unknown", maturity: "made-up", featured: "true", q: "x".repeat(300) }), agentRecipes);
    expect(filters).toMatchObject({ industry: "all", maturity: "all", featured: false });
    expect(filters.query).toHaveLength(120);
  });
  it("preserves spaces during multi-word input and removes defaults from URLs", () => {
    const filters = { ...defaultRecipeFilters, query: "earnings " };
    expect(readRecipeFilters(new URLSearchParams(recipeFiltersQuery(filters)), agentRecipes).query).toBe("earnings ");
    expect(recipeFiltersQuery(defaultRecipeFilters)).toBe("");
  });
});
