import {
  Activity,
  Binary,
  BriefcaseBusiness,
  ClipboardCheck,
  Cpu,
  Database,
  FileText,
  HeartPulse,
  Landmark,
  LineChart,
  LockKeyhole,
  Search,
  ShieldCheck,
  Stethoscope,
  Truck,
  Users,
  Workflow,
} from "lucide-react";
import { industries } from "./industries-data";
import { featuredAgentRecipes } from "./recipes-data";
import { useCases } from "./use-cases-data";

export const navItems = [
  { label: "Explore", href: "/#channels" },
  { label: "Agent Recipes", href: "/recipes" },
  { label: "Become a Client", href: "/become-a-client" },
  { label: "Become a Coach", href: "/become-a-coach" },
  { label: "Login", href: "/login" },
];

export const heroSignals = [
  "Expert-built",
  "Rankable",
  "Deployable",
  "Enterprise-ready",
];

export const conversionPaths = [
  {
    title: "Become a Client",
    eyebrow: "For individuals, teams, and enterprises",
    description:
      "Use expert-built Agent Recipes to improve decision speed, standardize repeated work, and deploy private AI agents for teams.",
    href: "/become-a-client",
    cta: "Become a Client",
    points: [
      "Use expert-built workflows",
      "Improve decision speed",
      "Deploy private team agents",
    ],
    icon: Users,
  },
  {
    title: "Become a Coach",
    eyebrow: "For experts and operators",
    description:
      "Package your workflows, judgment, and domain knowledge into reusable Agent Recipes others can discover and deploy.",
    href: "/become-a-coach",
    cta: "Become a Coach",
    points: [
      "Publish complete Agent Recipes",
      "Build reputation through verified workflows",
      "Prepare for future monetization",
    ],
    icon: Workflow,
  },
];

export const recipeParts = [
  {
    title: "System instruction",
    body: "Role, domain context, decision rules, constraints, and source discipline.",
    icon: Binary,
  },
  {
    title: "Workflow",
    body: "A repeatable sequence for gathering data, reasoning through choices, and handing off work.",
    icon: Workflow,
  },
  {
    title: "Input template",
    body: "The structured fields, files, tools, and source requirements needed to run the recipe.",
    icon: ClipboardCheck,
  },
  {
    title: "Output format",
    body: "Briefs, scores, tables, checklists, plans, or review packets shaped for real decisions.",
    icon: FileText,
  },
  {
    title: "Required tools",
    body: "The search, coding, database, CRM, document, or internal systems the agent must use.",
    icon: Search,
  },
  {
    title: "Evaluation criteria",
    body: "Source checks, quality gates, pass/fail criteria, and review steps before deployment.",
    icon: Activity,
  },
  {
    title: "Risk boundary",
    body: "Clear escalation rules for regulated, financial, medical, legal, or high-impact work.",
    icon: ShieldCheck,
  },
  {
    title: "Deployment option",
    body: "Public preview, pro recipe, team workflow, private agent, or local model package.",
    icon: Database,
  },
];

const industryIcons = {
  "biotech-pharma": Stethoscope,
  "finance-market-research": LineChart,
  "coding-automation": Cpu,
  "sales-business-development": BriefcaseBusiness,
  "healthcare-research": HeartPulse,
  "enterprise-operations": Truck,
};

export const channels = industries.map((industry) => ({
  ...industry,
  decisions: industry.decisionsSupported.slice(0, 3).join(", "),
  data: industry.dataUsed.slice(0, 5).join(", "),
  produces: industry.agentOutputs.slice(0, 5).join(", "),
  icon: industryIcons[industry.slug as keyof typeof industryIcons],
}));

const recipeIcons = {
  "biotech-bd-meeting-prep-agent": Stethoscope,
  "finance-earnings-call-analyst": Landmark,
  "codex-full-stack-builder-agent": Cpu,
  "healthcare-evidence-review-agent": HeartPulse,
};

export const featuredRecipes = featuredAgentRecipes.map((recipe) => ({
  ...recipe,
  modules: ["Instruction", "Workflow", "Evaluation", "Deployment"],
  output: recipe.outputExamples.join(", "),
  icon: recipeIcons[recipe.slug as keyof typeof recipeIcons],
}));

export const useCaseHighlights = useCases
  .filter((useCase) =>
    [
      "biotech-bd-meeting-preparation",
      "earnings-call-analysis",
      "codex-task-generation",
      "lead-research",
      "healthcare-literature-review",
      "sop-transformation",
    ].includes(useCase.slug),
  )
  .map((useCase) => ({
    ...useCase,
    industry: industries.find((industry) => industry.slug === useCase.industrySlug)?.name ?? "",
  }));

export const enterpriseCapabilities = [
  "Private Agent Recipe adaptation",
  "Secure team workflows",
  "Local AI and private model options",
  "Governance and approval paths",
  "Evaluation checklists",
  "Role-based access patterns",
  "Internal knowledge integration",
  "Public-to-private recipe conversion",
];

export const enterpriseFlow = [
  "Discover public Agent Recipes",
  "Adapt to internal data and policies",
  "Evaluate with team-specific criteria",
  "Deploy as private enterprise agents",
];

export const finalAudiencePaths = [
  {
    title: "Become a Client",
    body: "Use expert Agent Recipes for repeated high-value work.",
    href: "/become-a-client",
    icon: Users,
  },
  {
    title: "Become a Coach",
    body: "Publish workflows as reusable Agent Recipes.",
    href: "/become-a-coach",
    icon: Workflow,
  },
  {
    title: "Enterprise",
    body: "Convert proven recipes into private agents.",
    href: "/#enterprise",
    icon: LockKeyhole,
  },
];
