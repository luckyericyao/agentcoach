export type Industry = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  decisionsSupported: string[];
  dataUsed: string[];
  agentOutputs: string[];
  exampleUseCases: string[];
  exampleRecipes: string[];
  riskBoundaries: string[];
  clientValue: string;
  coachOpportunity: string;
};

export const industries: Industry[] = [
  {
    slug: "biotech-pharma",
    name: "Biotech & Pharma",
    shortName: "Biotech",
    tagline: "Agent Recipes for scientific, clinical, and partnering decisions.",
    description:
      "Biotech and pharma teams depend on fragmented scientific, clinical, commercial, and regulatory context. AgentCoach packages expert workflows for repeatable research, BD, evidence review, and enterprise deployment.",
    whyItMatters:
      "In biotech and pharma, the workflow matters as much as the model. Useful AI needs source discipline, review boundaries, scientific context, and domain-specific judgment.",
    decisionsSupported: [
      "BD meeting preparation",
      "Pipeline and modality strategy",
      "Clinical trial comparison",
      "Competitive intelligence",
      "Regulatory and safety review preparation",
    ],
    dataUsed: [
      "Publications",
      "Clinical trial records",
      "Company pipelines",
      "Deal history",
      "Conference agendas",
      "Regulatory documents",
      "Internal notes",
    ],
    agentOutputs: [
      "Meeting briefs",
      "Pipeline maps",
      "Evidence tables",
      "Partnering shortlists",
      "Risk checklists",
      "Decision memos",
    ],
    exampleUseCases: [
      "BD meeting preparation",
      "Pharma partnering scout",
      "Pipeline competitive intelligence",
      "Scientific evidence review",
      "Modality landscape mapping",
    ],
    exampleRecipes: [
      "Biotech BD Meeting Prep Agent",
      "Healthcare Evidence Review Agent",
      "Enterprise Workflow Architect Agent",
    ],
    riskBoundaries: [
      "No clinical diagnosis",
      "No treatment recommendation",
      "No regulatory submission without expert review",
      "Human review required for high-stakes decisions",
    ],
    clientValue:
      "Teams can reduce manual research time, standardize meeting preparation, and preserve expert review in scientific and commercial decisions.",
    coachOpportunity:
      "Scientists, BD leaders, regulatory experts, and clinical strategists can turn tacit workflows into reusable Agent Recipes.",
  },
  {
    slug: "finance-market-research",
    name: "Finance & Market Research",
    shortName: "Finance",
    tagline: "Structured research workflows for market intelligence and analysis.",
    description:
      "Finance and market research workflows require disciplined source review, repeatable analysis, and clear boundaries. Agent Recipes can help standardize research without turning into trading calls.",
    whyItMatters:
      "Market information moves quickly, but useful research depends on repeatable evidence gathering, comparison, summarization, and risk-aware framing.",
    decisionsSupported: [
      "Earnings call review",
      "Company and competitor analysis",
      "Market map generation",
      "Risk signal monitoring",
      "Investor presentation review",
    ],
    dataUsed: [
      "Filings",
      "Earnings transcripts",
      "Investor decks",
      "News",
      "Analyst updates",
      "Market maps",
      "Macro context",
    ],
    agentOutputs: [
      "Earnings briefs",
      "Market maps",
      "Risk-aware summaries",
      "Competitor trackers",
      "Source-linked research notes",
    ],
    exampleUseCases: [
      "Earnings call analysis",
      "Investor presentation review",
      "Market map generation",
      "Competitor tracking",
      "Risk-aware research summary",
    ],
    exampleRecipes: ["Finance Earnings Call Analyst"],
    riskBoundaries: [
      "No financial advice",
      "No trading calls",
      "No guaranteed returns",
      "Research support only",
    ],
    clientValue:
      "Analysts and teams can reduce repetitive research work while keeping source checks and decision ownership intact.",
    coachOpportunity:
      "Analysts, researchers, and operators can package disciplined research methods into reusable decision-support systems.",
  },
  {
    slug: "coding-automation",
    name: "Coding & Automation",
    shortName: "Coding",
    tagline: "Repeatable build, review, and automation workflows for AI coding agents.",
    description:
      "Coding teams need more than one-off AI code generation. They need reusable workflows for scoping, implementation, review, testing, and deployment.",
    whyItMatters:
      "AI coding becomes valuable when product requirements are converted into constrained implementation tasks with validation and review gates.",
    decisionsSupported: [
      "Feature scoping",
      "Repo analysis",
      "Implementation planning",
      "Code review",
      "QA and deployment readiness",
    ],
    dataUsed: [
      "Codebases",
      "Issues",
      "Product requirements",
      "Design notes",
      "API docs",
      "Logs",
      "Test output",
    ],
    agentOutputs: [
      "Codex task briefs",
      "Implementation plans",
      "Code review checklists",
      "Automation runbooks",
      "QA plans",
    ],
    exampleUseCases: [
      "Codex task generation",
      "Code review workflow",
      "Product requirement breakdown",
      "Full-stack implementation plan",
      "QA checklist generation",
    ],
    exampleRecipes: ["Codex Full-Stack Builder Agent"],
    riskBoundaries: [
      "No unreviewed production deployment",
      "No credential exposure",
      "Human review for security-sensitive changes",
    ],
    clientValue:
      "Teams can move from vague requests to focused implementation tasks, tests, and PR-ready documentation.",
    coachOpportunity:
      "Engineers and technical operators can encode proven build and review workflows into reusable AI agent systems.",
  },
  {
    slug: "sales-business-development",
    name: "Sales & Business Development",
    shortName: "Sales & BD",
    tagline: "Agent workflows for account research, outreach, and relationship preparation.",
    description:
      "Sales and BD work often repeats across accounts, meetings, and follow-ups. Agent Recipes can standardize the research-to-action workflow without losing human judgment.",
    whyItMatters:
      "High-quality outreach depends on account context, timing, fit, and disciplined follow-up rather than generic message generation.",
    decisionsSupported: [
      "Lead prioritization",
      "Account planning",
      "Outreach angle selection",
      "Meeting preparation",
      "Follow-up planning",
    ],
    dataUsed: [
      "Company websites",
      "CRM notes",
      "Funding signals",
      "Product pages",
      "Conference lists",
      "Press releases",
      "LinkedIn context",
    ],
    agentOutputs: [
      "Account briefs",
      "Outreach drafts",
      "Meeting plans",
      "Follow-up tasks",
      "CRM summaries",
    ],
    exampleUseCases: [
      "Lead research",
      "Account planning",
      "Outreach draft generation",
      "Meeting preparation",
      "CRM summary",
    ],
    exampleRecipes: ["Sales Outreach Agent", "Biotech BD Meeting Prep Agent"],
    riskBoundaries: [
      "No deceptive personalization",
      "Respect consent and privacy",
      "Human approval before outreach",
    ],
    clientValue:
      "Revenue teams can reduce account research time and create more consistent, context-aware outreach workflows.",
    coachOpportunity:
      "BD professionals, sales leaders, and consultants can publish proven account and meeting workflows as Agent Recipes.",
  },
  {
    slug: "healthcare-research",
    name: "Healthcare Research",
    shortName: "Healthcare",
    tagline: "Evidence-review workflows with clear medical risk boundaries.",
    description:
      "Healthcare research requires careful source handling, uncertainty framing, and strict boundaries. Agent Recipes can support education and research preparation without replacing clinicians.",
    whyItMatters:
      "Generic AI answers are risky in healthcare. Useful systems need evidence structure, source quality checks, and explicit escalation boundaries.",
    decisionsSupported: [
      "Literature review",
      "Clinical trial summary",
      "Evidence comparison",
      "Patient question preparation",
      "Medical education support",
    ],
    dataUsed: [
      "Clinical papers",
      "Guidelines",
      "Trial records",
      "Drug labels",
      "Visit summaries",
      "Lab context",
      "Care timelines",
    ],
    agentOutputs: [
      "Evidence tables",
      "Question lists",
      "Study comparison grids",
      "Education summaries",
      "Source quality notes",
    ],
    exampleUseCases: [
      "Literature review",
      "Clinical trial summary",
      "Evidence comparison",
      "Patient question preparation",
      "Medical education support",
    ],
    exampleRecipes: ["Healthcare Evidence Review Agent"],
    riskBoundaries: [
      "No diagnosis",
      "No treatment replacement",
      "No emergency guidance",
      "Clinical review required",
    ],
    clientValue:
      "Researchers and care-adjacent teams can prepare clearer evidence reviews and discussion materials with safer boundaries.",
    coachOpportunity:
      "Healthcare researchers and clinical educators can encode careful evidence-review workflows for responsible use.",
  },
  {
    slug: "enterprise-operations",
    name: "Enterprise Operations",
    shortName: "Enterprise Ops",
    tagline: "Private Agent Recipes for governed internal workflows.",
    description:
      "Enterprise operations depend on internal knowledge, approvals, compliance, and repeatability. Agent Recipes can convert institutional process into governed AI workflows.",
    whyItMatters:
      "Enterprise AI adoption fails when usage is undocumented, inconsistent, or disconnected from internal systems and risk controls.",
    decisionsSupported: [
      "SOP transformation",
      "Internal knowledge routing",
      "Compliance workflow support",
      "Team operating systems",
      "Governance and evaluation",
    ],
    dataUsed: [
      "SOPs",
      "Policies",
      "Knowledge bases",
      "Tickets",
      "Meeting notes",
      "Approval rules",
      "Audit requirements",
    ],
    agentOutputs: [
      "Workflow playbooks",
      "Decision records",
      "Escalation notes",
      "Task packets",
      "Role-based assistant specs",
    ],
    exampleUseCases: [
      "SOP transformation",
      "Internal knowledge assistant",
      "Compliance workflow support",
      "Meeting summary and action system",
      "Role-based workflow assistant",
    ],
    exampleRecipes: ["Enterprise Workflow Architect Agent"],
    riskBoundaries: [
      "Role-based access required",
      "Sensitive data controls required",
      "Human approval for regulated workflows",
      "Auditability required",
    ],
    clientValue:
      "Organizations can standardize AI-assisted work while preserving governance, access control, and evaluation.",
    coachOpportunity:
      "Operators, consultants, and enterprise architects can package internal workflow expertise into deployable systems.",
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
