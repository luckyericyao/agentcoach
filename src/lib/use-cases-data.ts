export type UseCase = {
  slug: string;
  title: string;
  industrySlug: string;
  persona: string;
  problem: string;
  agentWorkflow: string;
  efficiencyGain: string;
  exampleOutput: string;
  riskBoundary: string;
};

export const useCases: UseCase[] = [
  {
    slug: "biotech-bd-meeting-preparation",
    title: "BD meeting preparation",
    industrySlug: "biotech-pharma",
    persona: "BD team",
    problem:
      "Partnering teams spend hours pulling company, pipeline, trial, publication, and deal context before each meeting.",
    agentWorkflow:
      "Collect source material, map strategic fit, identify collaboration angles, flag risks, and prepare agenda questions.",
    efficiencyGain: "Turns fragmented prep work into a repeatable meeting packet.",
    exampleOutput: "Company brief, collaboration hypothesis, risk flags, agenda, CRM note.",
    riskBoundary: "Business preparation only; scientific and legal decisions require expert review.",
  },
  {
    slug: "pharma-partnering-scout",
    title: "Pharma partnering scout",
    industrySlug: "biotech-pharma",
    persona: "Corporate development",
    problem:
      "Teams need to screen many companies and assets against changing strategic priorities.",
    agentWorkflow:
      "Normalize target data, compare against strategic filters, score fit, and generate shortlists.",
    efficiencyGain: "Reduces first-pass partner screening and makes criteria explicit.",
    exampleOutput: "Partner shortlist, fit score, rationale, and next-step diligence questions.",
    riskBoundary: "Screening support only; no investment, legal, or clinical conclusions.",
  },
  {
    slug: "pipeline-competitive-intelligence",
    title: "Pipeline competitive intelligence",
    industrySlug: "biotech-pharma",
    persona: "Strategy team",
    problem:
      "Competitive landscapes change across trial updates, publications, regulatory events, and company announcements.",
    agentWorkflow:
      "Monitor sources, extract pipeline changes, compare competitors, and summarize strategic implications.",
    efficiencyGain: "Creates a repeatable update cycle for pipeline monitoring.",
    exampleOutput: "Landscape map, competitor changes, risk signals, source-linked brief.",
    riskBoundary: "Strategic support only; expert interpretation required.",
  },
  {
    slug: "earnings-call-analysis",
    title: "Earnings call analysis",
    industrySlug: "finance-market-research",
    persona: "Market researcher",
    problem:
      "Analysts need consistent, source-linked summaries from transcripts, filings, guidance, and news.",
    agentWorkflow:
      "Compare transcript themes, guidance changes, risk language, and supporting source material.",
    efficiencyGain: "Standardizes the first-pass research brief after earnings.",
    exampleOutput: "Earnings brief, key deltas, source links, risk notes, watchlist update.",
    riskBoundary: "Research support only; no financial advice or trading calls.",
  },
  {
    slug: "market-map-generation",
    title: "Market map generation",
    industrySlug: "finance-market-research",
    persona: "Research team",
    problem:
      "Market maps are often rebuilt manually from company lists, categories, and fragmented public data.",
    agentWorkflow:
      "Collect companies, normalize segments, score relevance, and generate map-ready summaries.",
    efficiencyGain: "Compresses manual research into a repeatable classification workflow.",
    exampleOutput: "Segment map, company table, category notes, uncertainty flags.",
    riskBoundary: "Market research support only; source review required.",
  },
  {
    slug: "codex-task-generation",
    title: "Codex task generation",
    industrySlug: "coding-automation",
    persona: "Engineering team",
    problem:
      "Product requests are often too broad for AI coding agents to implement safely in one pass.",
    agentWorkflow:
      "Analyze requirements, inspect repo context, define scope, create tasks, and specify validation steps.",
    efficiencyGain: "Turns vague requests into focused implementation work.",
    exampleOutput: "Codex-ready task brief, impacted files, validation plan, PR notes.",
    riskBoundary: "Human review required before merge or deployment.",
  },
  {
    slug: "code-review-workflow",
    title: "Code review workflow",
    industrySlug: "coding-automation",
    persona: "Engineering lead",
    problem:
      "AI-generated code needs consistent review for architecture, behavior, security, and tests.",
    agentWorkflow:
      "Read diff, compare against requirements, check risk areas, and produce review findings.",
    efficiencyGain: "Makes review coverage more repeatable and easier to audit.",
    exampleOutput: "Review checklist, risk findings, test gaps, suggested follow-ups.",
    riskBoundary: "Reviewer remains accountable for approval.",
  },
  {
    slug: "lead-research",
    title: "Lead research",
    industrySlug: "sales-business-development",
    persona: "Sales team",
    problem:
      "Reps spend time manually researching accounts before deciding how to approach them.",
    agentWorkflow:
      "Collect account context, match against ICP, identify triggers, and draft an outreach angle.",
    efficiencyGain: "Turns account research into a reusable workflow.",
    exampleOutput: "Account brief, fit score, trigger summary, outreach draft.",
    riskBoundary: "Human review required before outreach; no fabricated personalization.",
  },
  {
    slug: "crm-summary",
    title: "CRM summary",
    industrySlug: "sales-business-development",
    persona: "BD operator",
    problem:
      "Follow-up notes and CRM updates are inconsistent after meetings and calls.",
    agentWorkflow:
      "Summarize meeting notes, identify commitments, draft next steps, and structure CRM fields.",
    efficiencyGain: "Creates cleaner handoffs and more consistent pipeline records.",
    exampleOutput: "CRM note, follow-up task list, stakeholder summary, open questions.",
    riskBoundary: "Internal preparation only; review before external follow-up.",
  },
  {
    slug: "healthcare-literature-review",
    title: "Literature review",
    industrySlug: "healthcare-research",
    persona: "Healthcare researcher",
    problem:
      "Evidence review requires careful source quality checks and uncertainty framing.",
    agentWorkflow:
      "Collect papers, rank evidence quality, summarize findings, and flag limitations.",
    efficiencyGain: "Creates a consistent research-review packet.",
    exampleOutput: "Evidence table, source-quality notes, summary brief, discussion questions.",
    riskBoundary: "No diagnosis, treatment replacement, or emergency guidance.",
  },
  {
    slug: "clinical-trial-summary",
    title: "Clinical trial summary",
    industrySlug: "healthcare-research",
    persona: "Research team",
    problem:
      "Trial records and publications are difficult to compare quickly across endpoints and populations.",
    agentWorkflow:
      "Extract trial design, endpoints, population, results, limitations, and source citations.",
    efficiencyGain: "Improves consistency of trial comparison.",
    exampleOutput: "Trial summary, comparison grid, endpoint notes, uncertainty flags.",
    riskBoundary: "Research preparation only; clinical interpretation requires expert review.",
  },
  {
    slug: "sop-transformation",
    title: "SOP transformation",
    industrySlug: "enterprise-operations",
    persona: "Operations team",
    problem:
      "Internal SOPs often sit as static documents instead of reusable AI-assisted workflows.",
    agentWorkflow:
      "Map SOP steps, inputs, owners, approvals, risk gates, and output requirements.",
    efficiencyGain: "Turns documentation into a reusable workflow blueprint.",
    exampleOutput: "Workflow map, agent spec, evaluation checklist, escalation rules.",
    riskBoundary: "Internal workflow support only; compliance review required where applicable.",
  },
  {
    slug: "internal-knowledge-assistant",
    title: "Internal knowledge assistant",
    industrySlug: "enterprise-operations",
    persona: "Enterprise team",
    problem:
      "Teams repeatedly ask the same operational questions across fragmented knowledge sources.",
    agentWorkflow:
      "Route questions to approved knowledge, cite sources, identify gaps, and generate handoff tasks.",
    efficiencyGain: "Reduces repeated manual knowledge lookup and improves source discipline.",
    exampleOutput: "Source-linked answer, escalation note, missing-doc flag, task packet.",
    riskBoundary: "Access control, auditability, and human review required for sensitive topics.",
  },
];

export function getUseCasesByIndustrySlug(industrySlug: string) {
  return useCases.filter((useCase) => useCase.industrySlug === industrySlug);
}
