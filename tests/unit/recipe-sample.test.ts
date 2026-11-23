import { describe, expect, it } from "vitest";
import { getRecipeWorkedExample } from "@/lib/recipe-examples";
import { createRecipeMarkdown } from "@/lib/recipe-markdown";
import { agentRecipes } from "@/lib/recipes-data";
import { createRecipeSample, recipePreviewPath, recipeSampleFilename, recipeSamplePath } from "@/lib/recipe-sample";

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

  it.each(agentRecipes)("creates a readable review brief with the same modules for $name", (recipe) => {
    const sample = createRecipeSample(recipe);
    const { modules, workedExample } = sample;
    const brief = createRecipeMarkdown(recipe);
    expect(brief.split("\n").filter((line) => line.startsWith("## "))).toEqual([
      "## System instruction", "## Workflow", "## Input template", "## Output format",
      "## Required tools", "## Evaluation criteria", "## Risk boundary", "## Deployment option",
      ...(workedExample ? ["## Worked example (synthetic data)"] : []),
    ]);
    for (const line of [
      `# ${recipe.name}`, `> **Unverified sample.** ${sample.review.note}`, sample.useCase,
      `https://agentcoach-three.vercel.app${sample.sourcePath}`,
      modules.systemInstruction, ...modules.workflow.map((step, index) => `${index + 1}. ${step}`),
      ...modules.inputTemplate, modules.outputFormat.contract, ...modules.outputFormat.examples,
      ...modules.requiredTools, ...modules.evaluationCriteria, modules.riskBoundary,
      `**Proposed only.** ${modules.deploymentOption.description}`,
    ]) expect(brief).toContain(line);
    expect(recipeSamplePath(recipe.slug, "markdown")).toBe(`/recipes/samples/${recipe.slug}/brief`);
    expect(recipeSampleFilename(recipe, "markdown")).toBe(`agentcoach-${recipe.slug}-sample-v1.md`);
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

  it("exports a separately labeled, traceable synthetic example on the matching recipe only", () => {
    const recipe = agentRecipes.find(({ slug }) => slug === "biotech-bd-meeting-prep-agent")!;
    const example = getRecipeWorkedExample(recipe.slug)!;
    const sample = createRecipeSample(recipe);
    expect(sample.workedExample).toEqual(example);
    expect(sample.workedExample).not.toBe(example);
    expect(sample.workedExample?.sources).not.toBe(example.sources);
    expect(example.kind).toBe("synthetic");
    const sourceIds = example.sources.map(({ id }) => id);
    expect(new Set(sourceIds).size).toBe(sourceIds.length);
    const cited = new Set<string>();
    for (const finding of example.output.findings) {
      expect(finding.sourceIds.length > 0).toBe(finding.status !== "unknown");
      for (const id of finding.sourceIds) {
        expect(sourceIds).toContain(id);
        cited.add(id);
      }
    }
    expect(cited).toEqual(new Set(sourceIds));
    expect(example.output.agenda.reduce((total, step) => total + step.minutes, 0)).toBe(20);
    for (const other of agentRecipes.filter(({ slug }) => slug !== recipe.slug)) {
      expect(createRecipeSample(other)).not.toHaveProperty("workedExample");
    }
  });

  it("preserves the worked example's claims, references and handoff in the offline brief", () => {
    const recipe = agentRecipes.find(({ slug }) => slug === "biotech-bd-meeting-prep-agent")!;
    const example = getRecipeWorkedExample(recipe.slug)!;
    const [, appendix] = createRecipeMarkdown(recipe).split("\n## Worked example (synthetic data)\n");
    expect(appendix).toContain("> Illustrative scenario. No real company, live run, or expert verification.");
    expect(appendix).toContain(`### ${example.title}`);
    expect(appendix).toContain(example.scenario);
    for (const { id, label, date, excerpt } of example.sources) {
      expect(appendix).toContain(`- **${id} | ${label} (${date})**: ${excerpt}`);
    }
    expect(appendix).toContain(example.output.summary);
    const statusLabels = { documented: "Documented in sample", hypothesis: "Working hypothesis", unknown: "Open question" };
    for (const { status, sourceIds, text } of example.output.findings) {
      const references = sourceIds.length ? ` (${sourceIds.join(", ")})` : "";
      expect(appendix).toContain(`- **${statusLabels[status]}${references}:** ${text}`);
    }
    for (const { minutes, topic } of example.output.agenda) {
      expect(appendix).toContain(`- ${minutes} min: ${topic}`);
    }
    expect(appendix).toContain(example.output.handoff);
    for (const item of example.reviewChecklist) expect(appendix).toContain(`- ${item}`);
  });
});
