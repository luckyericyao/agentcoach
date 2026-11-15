import type { AgentRecipe } from "./recipes-data";

export function recipePreviewPath(slug: string) {
  return `/recipes?${new URLSearchParams({ recipe: slug })}`;
}

export function recipeSampleFilename(recipe: AgentRecipe) {
  return `agentcoach-${recipe.slug}-sample-v1.json`;
}

export function createRecipeSample(recipe: AgentRecipe) {
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
  } as const;
}
