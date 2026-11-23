import { publicSiteOrigin } from "./public-site";
import { recipeExampleDisclosure, recipeFindingLabels, type RecipeWorkedExample } from "./recipe-examples";
import { createRecipeSample } from "./recipe-sample";
import type { AgentRecipe } from "./recipes-data";

const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

function workedExampleSections(example: RecipeWorkedExample) {
  const { sources, output } = example;
  return [
    "## Worked example (synthetic data)",
    `> ${recipeExampleDisclosure}`,
    `### ${example.title}`,
    `**Meeting objective:** ${example.scenario}`,
    `### Sample source notes\n\n${bullets(sources.map(({ id, label, date, excerpt }) => `**${id} | ${label} (${date})**: ${excerpt}`))}`,
    `### Draft meeting brief\n\n${output.summary}`,
    bullets(output.findings.map(({ status, sourceIds, text }) => {
      const references = sourceIds.length ? ` (${sourceIds.join(", ")})` : "";
      return `**${recipeFindingLabels[status]}${references}:** ${text}`;
    })),
    `### Proposed agenda\n\n${bullets(output.agenda.map(({ minutes, topic }) => `${minutes} min: ${topic}`))}`,
    `### Human review\n\n${output.handoff}\n\n${bullets(example.reviewChecklist)}`,
  ];
}

// Only code-authored catalog text is formatted as Markdown; requests cannot add content.
export function createRecipeMarkdown(recipe: AgentRecipe) {
  const { name, domain, useCase, description, sourcePath, review, modules, workedExample } = createRecipeSample(recipe);
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
    ...(workedExample ? workedExampleSections(workedExample) : []),
  ].join("\n\n") + "\n";
}
