import { describe, expect, it } from "vitest";
import { agentRecipes } from "@/lib/recipes-data";
import { createRecipeSample, recipePreviewPath, recipeSampleFilename } from "@/lib/recipe-sample";

describe("portable public sample contract", () => {
  it.each(agentRecipes)("exports all eight modules and boundaries for $name", (recipe) => {
    const sample = JSON.parse(JSON.stringify(createRecipeSample(recipe)));
    expect(sample).toMatchObject({ kind: "agentcoach.sample-recipe", schemaVersion: 1, slug: recipe.slug,
      review: { status: "unverified", humanReviewRequired: true, executionAvailable: false } });
    expect(Object.keys(sample.modules)).toHaveLength(8);
    expect(sample.modules).toEqual({
      systemInstruction: recipe.instruction,
      workflow: recipe.workflowSteps,
      inputTemplate: recipe.inputExamples,
      outputFormat: { contract: recipe.outputFormat, examples: recipe.outputExamples },
      requiredTools: recipe.requiredTools,
      evaluationCriteria: recipe.evaluationCriteria,
      riskBoundary: recipe.riskBoundary,
      deploymentOption: { description: recipe.deploymentOption, status: "proposed", runtimeConnected: false },
    });
    expect(sample.sourcePath).toBe(`/recipes?recipe=${recipe.slug}`);
    expect(recipeSampleFilename(recipe)).toBe(`agentcoach-${recipe.slug}-sample-v1.json`);
  });

  it("projects only public fields even when its input gains private or presentation fields", () => {
    const extended = { ...agentRecipes[0], email: "private@example.test", access_token: "private-token",
      query: "private search", icon: "presentation-only", verified: true };
    const sample = JSON.stringify(createRecipeSample(extended));
    for (const marker of [extended.email, extended.access_token, extended.query, extended.icon]) {
      expect(sample).not.toContain(marker);
    }
    expect(JSON.parse(sample).review.status).toBe("unverified");
  });

  it("does not alias mutable catalog arrays or embed additional URL parameters", () => {
    const recipe = agentRecipes[0];
    const sample = createRecipeSample(recipe);
    expect(sample.modules.workflow).not.toBe(recipe.workflowSteps);
    expect(sample.modules.inputTemplate).not.toBe(recipe.inputExamples);
    expect(sample.modules.outputFormat.examples).not.toBe(recipe.outputExamples);
    const path = recipePreviewPath("known&unexpected=1");
    expect(new URLSearchParams(path.split("?")[1]).getAll("recipe")).toEqual(["known&unexpected=1"]);
    expect(new URLSearchParams(path.split("?")[1]).size).toBe(1);
  });
});
