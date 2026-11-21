import type { AgentRecipe } from "./recipes-data";
import { getRecipeWorkedExample } from "./recipe-examples";

export function recipePreviewPath(slug: string, filterQuery = "") {
  const params = new URLSearchParams(filterQuery);
  params.set("recipe", slug);
  return `/recipes?${params}`;
}

export type RecipeSampleFormat = "json" | "markdown";

export function recipeSampleFilename(recipe: AgentRecipe, format: RecipeSampleFormat = "json") {
  return `agentcoach-${recipe.slug}-sample-v1.${format === "markdown" ? "md" : "json"}`;
}

export function recipeSamplePath(slug: string, format: RecipeSampleFormat = "json") {
  return `/recipes/samples/${encodeURIComponent(slug)}${format === "markdown" ? "/brief" : ""}`;
}

export function createRecipeSample(recipe: AgentRecipe) {
  const workedExample = getRecipeWorkedExample(recipe.slug);
  // Project public blueprint fields only; never export component or visitor state.
  return {
    kind: "agentcoach.sample-recipe",
    schemaVersion: 1,
    slug: recipe.slug,
    name: recipe.name,
    domain: recipe.domain,
    useCase: recipe.useCase,
    description: recipe.longDescription,
    sourcePath: recipePreviewPath(recipe.slug),
    review: {
      status: "unverified",
      humanReviewRequired: true,
      executionAvailable: false,
      note: "Illustrative workflow blueprint. Adaptation and qualified human review are required before use. This sample is not connected to a live agent.",
    },
    modules: {
      systemInstruction: recipe.instruction,
      workflow: [...recipe.workflowSteps],
      inputTemplate: [...recipe.inputExamples],
      outputFormat: { contract: recipe.outputFormat, examples: [...recipe.outputExamples] },
      requiredTools: [...recipe.requiredTools],
      evaluationCriteria: [...recipe.evaluationCriteria],
      riskBoundary: recipe.riskBoundary,
      deploymentOption: { description: recipe.deploymentOption, status: "proposed", runtimeConnected: false },
    },
    ...(workedExample ? { workedExample: structuredClone(workedExample) } : {}),
  } as const;
}
