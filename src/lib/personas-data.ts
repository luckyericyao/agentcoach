export type Persona = {
  slug: string;
  name: string;
  type: "coach" | "client";
  description: string;
  needs: string[];
  valueProposition: string;
  exampleActions: string[];
};

export const personas: Persona[] = [
  {
    slug: "domain-expert-coach",
    name: "Domain Expert Coach",
    type: "coach",
    description:
      "Scientists, analysts, consultants, operators, and specialists with repeatable professional workflows.",
    needs: [
      "A way to package tacit knowledge",
      "A credible format beyond prompts",
      "A path to reach users and teams",
      "Future monetization and enterprise adaptation opportunities",
    ],
    valueProposition:
      "Turn expert judgment into reusable Agent Recipes that can be discovered, evaluated, and deployed.",
    exampleActions: [
      "Publish a workflow playbook",
      "Define evaluation criteria",
      "Create a risk boundary",
      "Support private enterprise adaptation",
    ],
  },
  {
    slug: "implementation-coach",
    name: "Implementation Coach",
    type: "coach",
    description:
      "Engineers, automation builders, and workflow architects who help turn messy processes into agent systems.",
    needs: [
      "Structured recipe templates",
      "A way to explain deployment options",
      "Reusable validation patterns",
      "Enterprise-ready workflow language",
    ],
    valueProposition:
      "Package implementation expertise into Agent Recipes that make AI agents more reliable in real teams.",
    exampleActions: [
      "Design a private deployment pattern",
      "Translate an SOP into an agent workflow",
      "Create QA checklists",
      "Document tool requirements",
    ],
  },
  {
    slug: "individual-client",
    name: "Individual Client",
    type: "client",
    description:
      "Professionals who want better AI workflows for repeated research, planning, and decision support.",
    needs: [
      "Higher-quality AI outputs",
      "Less repeated manual research",
      "Clear risk boundaries",
      "Workflow templates that can be reused",
    ],
    valueProposition:
      "Use expert-built Agent Recipes to improve repeated knowledge work without inventing the workflow from scratch.",
    exampleActions: [
      "Use a meeting prep recipe",
      "Generate a source-linked research brief",
      "Create a decision checklist",
      "Track repeated workflow outputs",
    ],
  },
  {
    slug: "team-client",
    name: "Team Client",
    type: "client",
    description:
      "Startups, research groups, revenue teams, and engineering teams that need repeatable AI-assisted work.",
    needs: [
      "Standardized workflows",
      "Shared output quality",
      "Team-level reuse",
      "Evaluation and review gates",
    ],
    valueProposition:
      "Standardize high-value work with Agent Recipes that make team AI usage more consistent and reviewable.",
    exampleActions: [
      "Adopt a team workflow",
      "Customize output formats",
      "Review evaluation criteria",
      "Deploy a private version",
    ],
  },
  {
    slug: "enterprise-client",
    name: "Enterprise Client",
    type: "client",
    description:
      "Organizations that need governed, private, role-aware AI workflows connected to internal knowledge.",
    needs: [
      "Private deployment",
      "Security and governance",
      "Role-based access",
      "Internal knowledge integration",
      "Auditability and risk controls",
    ],
    valueProposition:
      "Convert proven public Agent Recipes into private enterprise agents with governance and evaluation.",
    exampleActions: [
      "Adapt a public recipe",
      "Connect approved knowledge sources",
      "Define role-based access",
      "Create governance and evaluation gates",
    ],
  },
];

export const coachPersonas = personas.filter((persona) => persona.type === "coach");
export const clientPersonas = personas.filter((persona) => persona.type === "client");
