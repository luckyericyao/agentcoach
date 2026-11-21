import { publicSiteOrigin } from "./public-site";
import { createRecipeSample } from "./recipe-sample";
import type { AgentRecipe } from "./recipes-data";

// Only code-authored catalog text is formatted as Markdown; requests cannot add content.
export function createRecipeMarkdown(recipe: AgentRecipe) {
  const { name, domain, useCase, description, sourcePath, review, modules } = createRecipeSample(recipe);
  const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");
  const workflow = modules.workflow.map((step, index) => `${index + 1}. ${step}`).join("\n");

  return [
    `# ${name}`,
    `**AgentCoach sample review brief | ${domain}**`,
    `> **Unverified sample.** ${review.note}`,
    `[View the sample in AgentCoach](${new URL(sourcePath, publicSiteOrigin)})`,
    `**Use case:** ${useCase}`,
    description,
    `## System instruction\n\n${modules.systemInstruction}`,
    `## Workflow\n\n${workflow}`,
    `## Input template\n\n${bullets(modules.inputTemplate)}`,
    `## Output format\n\n${modules.outputFormat.contract}\n\n${bullets(modules.outputFormat.examples)}`,
    `## Required tools\n\n${bullets(modules.requiredTools)}`,
    `## Evaluation criteria\n\n${bullets(modules.evaluationCriteria)}`,
    `## Risk boundary\n\n${modules.riskBoundary}`,
    `## Deployment option\n\n**Proposed only.** ${modules.deploymentOption.description}`,
  ].join("\n\n") + "\n";
}
