export type AgentRecipeModule =
  | "Instruction"
  | "Workflow"
  | "Input Template"
  | "Output Format"
  | "Evaluation"
  | "Risk Boundary"
  | "Deployment";

export type AgentRecipe = {
  slug: string;
  name: string;
  domain: string;
  industrySlug: string;
  useCase: string;
  shortDescription: string;
  longDescription: string;
  modules: AgentRecipeModule[];
  inputExamples: string[];
  outputExamples: string[];
  requiredTools: string[];
  evaluationCriteria: string[];
  riskBoundary: string;
  deploymentOption: string;
  maturityLevel: "Concept" | "Prototype" | "Preview" | "Verified";
  featured: boolean;
  verified: boolean;
};

const coreModules: AgentRecipeModule[] = [
  "Instruction",
  "Workflow",
  "Input Template",
  "Output Format",
  "Evaluation",
  "Risk Boundary",
  "Deployment",
];

export const agentRecipes: AgentRecipe[] = [
  {
    slug: "biotech-bd-meeting-prep-agent",
    name: "Biotech BD Meeting Prep Agent",
    domain: "Biotech & Pharma",
    industrySlug: "biotech-pharma",
    useCase: "Prepare for pharma BD / partnering meetings.",
    shortDescription:
      "A meeting-prep system for turning fragmented company, science, and deal context into a focused partnering brief.",
    longDescription:
      "This Agent Recipe helps biotech and pharma teams prepare for high-value BD conversations by combining company context, pipeline fit, scientific rationale, prior deal signals, and meeting objectives into a reusable workflow.",
    modules: coreModules,
    inputExamples: [
      "Target company name and business unit",
      "Internal capability summary",
      "Recent company news, pipeline page, and trial records",
      "CRM notes or prior meeting history",
    ],
    outputExamples: [
      "Company brief",
      "Collaboration angle",
      "Meeting agenda",
      "Risk flags",
      "CRM-ready follow-up",
    ],
    requiredTools: [
      "Web research",
      "Scientific literature search",
      "Clinical trial lookup",
      "CRM or internal notes",
    ],
    evaluationCriteria: [
      "Sources are cited and recent",
      "Collaboration angle is grounded in both parties' context",
      "Risks and uncertainties are explicit",
      "Follow-up is suitable for human review",
    ],
    riskBoundary:
      "Supports business and research preparation only. Scientific, legal, clinical, and regulatory decisions require expert review.",
    deploymentOption:
      "Public preview recipe, pro team workflow, or private enterprise agent connected to internal pipeline and CRM data.",
    maturityLevel: "Preview",
    featured: true,
    verified: false,
  },
  {
    slug: "finance-earnings-call-analyst",
    name: "Finance Earnings Call Analyst",
    domain: "Finance & Market Research",
    industrySlug: "finance-market-research",
    useCase: "Analyze earnings calls, transcripts, and investor materials.",
    shortDescription:
      "A source-disciplined workflow for turning earnings materials into structured analyst-style research notes.",
    longDescription:
      "This Agent Recipe reviews transcripts, filings, investor decks, guidance, and related news to produce a repeatable earnings analysis with source checks and risk-aware framing.",
    modules: coreModules,
    inputExamples: [
      "Earnings call transcript",
      "10-Q or 10-K filing",
      "Investor presentation",
      "Recent news and analyst updates",
    ],
    outputExamples: [
      "Earnings brief",
      "Key deltas",
      "Management tone notes",
      "Watchlist signals",
      "Source-linked research notes",
    ],
    requiredTools: ["Filing lookup", "Transcript source", "News search", "Table extraction"],
    evaluationCriteria: [
      "Claims are tied to source material",
      "Financial advice language is avoided",
      "Bullish and bearish interpretations are separated",
      "Uncertainty and missing data are visible",
    ],
    riskBoundary:
      "Research support only. No financial advice, trading calls, return guarantees, or portfolio recommendations.",
    deploymentOption:
      "Personal research support, team market-research workflow, or private analyst assistant with internal notes.",
    maturityLevel: "Preview",
    featured: true,
    verified: false,
  },
  {
    slug: "codex-full-stack-builder-agent",
    name: "Codex Full-Stack Builder Agent",
    domain: "Coding & Automation",
    industrySlug: "coding-automation",
    useCase: "Convert product requirements into focused Codex implementation tasks.",
    shortDescription:
      "A build-planning workflow for converting product requests into scoped implementation, validation, and PR notes.",
    longDescription:
      "This Agent Recipe helps teams turn vague feature requests into constrained implementation steps, repo-aware edits, validation commands, and deployment-ready summaries.",
    modules: coreModules,
    inputExamples: [
      "Product requirement",
      "Repo structure",
      "Design constraints",
      "Existing issue or bug report",
    ],
    outputExamples: [
      "Implementation plan",
      "Scoped code changes",
      "Test plan",
      "Build results",
      "PR summary",
    ],
    requiredTools: ["Codebase access", "Terminal", "Test runner", "Git"],
    evaluationCriteria: [
      "Scope is explicit",
      "Edits match existing project patterns",
      "Lint and build are run when practical",
      "No unrelated files are rewritten",
    ],
    riskBoundary:
      "No unreviewed production deployment, no credential exposure, and human review required for security-sensitive changes.",
    deploymentOption:
      "Developer assistant recipe, internal engineering workflow, or team-specific private coding agent.",
    maturityLevel: "Preview",
    featured: true,
    verified: false,
  },
  {
    slug: "healthcare-evidence-review-agent",
    name: "Healthcare Evidence Review Agent",
    domain: "Healthcare Research",
    industrySlug: "healthcare-research",
    useCase: "Summarize clinical literature and evidence with clear risk boundaries.",
    shortDescription:
      "An evidence-review workflow for structured healthcare research summaries, source checks, and discussion questions.",
    longDescription:
      "This Agent Recipe supports healthcare research preparation by organizing literature, trial context, source quality, uncertainty, and question lists while keeping medical risk boundaries explicit.",
    modules: coreModules,
    inputExamples: [
      "Focused evidence question",
      "Relevant papers",
      "Guidelines or trial records",
      "Patient education context if applicable",
    ],
    outputExamples: [
      "Evidence table",
      "Summary brief",
      "Uncertainty notes",
      "Source checks",
      "Discussion questions",
    ],
    requiredTools: ["Literature search", "Guideline lookup", "Clinical trial source", "Citation review"],
    evaluationCriteria: [
      "Evidence hierarchy is clear",
      "Uncertainty is not hidden",
      "Medical advice language is avoided",
      "High-risk questions are escalated",
    ],
    riskBoundary:
      "Education and research support only. No diagnosis, treatment replacement, or emergency guidance.",
    deploymentOption:
      "Research workflow, patient-education preparation assistant, or private evidence-review system.",
    maturityLevel: "Preview",
    featured: true,
    verified: false,
  },
  {
    slug: "sales-outreach-agent",
    name: "Sales Outreach Agent",
    domain: "Sales & Business Development",
    industrySlug: "sales-business-development",
    useCase: "Research leads and generate structured outreach drafts.",
    shortDescription:
      "An account-research workflow for turning public and CRM context into tailored outreach and follow-up.",
    longDescription:
      "This Agent Recipe helps sales and BD teams standardize account research, fit scoring, outreach drafting, meeting prep, and CRM handoff without relying on generic personalization.",
    modules: coreModules,
    inputExamples: [
      "Target account list",
      "ICP definition",
      "CRM notes",
      "Recent company updates",
    ],
    outputExamples: [
      "Account brief",
      "Fit score",
      "Outreach draft",
      "Meeting prep notes",
      "Follow-up task",
    ],
    requiredTools: ["Web research", "CRM data", "Company/news lookup", "Email draft handoff"],
    evaluationCriteria: [
      "Outreach angle is specific and sourced",
      "CRM context is reflected",
      "No deceptive or fabricated personalization",
      "Human approval before external send",
    ],
    riskBoundary:
      "Drafting and preparation only. Respect privacy, consent, brand standards, and human approval.",
    deploymentOption:
      "Team sales workflow, BD assistant, or private CRM-connected account-planning agent.",
    maturityLevel: "Concept",
    featured: false,
    verified: false,
  },
  {
    slug: "enterprise-workflow-architect-agent",
    name: "Enterprise Workflow Architect Agent",
    domain: "Enterprise Operations",
    industrySlug: "enterprise-operations",
    useCase: "Convert internal operating procedures into reusable AI workflows.",
    shortDescription:
      "A workflow-architecture system for turning SOPs, policies, and team knowledge into governed Agent Recipes.",
    longDescription:
      "This Agent Recipe helps enterprise teams identify repeatable internal workflows, map data and approval paths, define evaluation gates, and specify private deployment patterns.",
    modules: coreModules,
    inputExamples: [
      "SOP document",
      "Policy library",
      "Team workflow notes",
      "Approval and escalation rules",
    ],
    outputExamples: [
      "Workflow map",
      "Agent Recipe spec",
      "Risk boundary",
      "Evaluation checklist",
      "Deployment plan",
    ],
    requiredTools: ["Document analysis", "Internal knowledge base", "Policy source", "Workflow mapping"],
    evaluationCriteria: [
      "Workflow owner is clear",
      "Access and risk boundaries are explicit",
      "Evaluation criteria are measurable",
      "Deployment plan is reviewable by stakeholders",
    ],
    riskBoundary:
      "Internal workflow planning only. Sensitive data, compliance, and regulated processes require authorized review.",
    deploymentOption:
      "Private enterprise agent, internal workflow system, or local/private model deployment package.",
    maturityLevel: "Concept",
    featured: false,
    verified: false,
  },
];

export const featuredAgentRecipes = agentRecipes.filter((recipe) => recipe.featured);

export function getRecipeBySlug(slug: string) {
  return agentRecipes.find((recipe) => recipe.slug === slug);
}

export function getRecipesByIndustrySlug(industrySlug: string) {
  return agentRecipes.filter((recipe) => recipe.industrySlug === industrySlug);
}
