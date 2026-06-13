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
  Workflow,
} from "lucide-react";

export const navItems = [
  { label: "Recipes", href: "#recipes" },
  { label: "Channels", href: "#channels" },
  { label: "Featured", href: "#featured-recipes" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Access", href: "#waitlist" },
];

export const heroSignals = [
  "Expert-built",
  "Rankable",
  "Deployable",
  "Enterprise-ready",
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

export const channels = [
  {
    name: "Biotech & Pharma",
    decisions:
      "Partnering, pipeline strategy, clinical context, conference planning, regulatory preparation.",
    data:
      "Pipelines, filings, trials, publications, deal history, press releases, internal notes.",
    produces:
      "BD briefs, trial maps, target lists, meeting packs, diligence summaries, review checklists.",
    icon: Stethoscope,
  },
  {
    name: "Finance & Market Research",
    decisions:
      "Market monitoring, company analysis, earnings review, risk signals, portfolio questions.",
    data:
      "Filings, earnings calls, news, analyst updates, macro events, transcripts, price context.",
    produces:
      "Signal briefs, thesis updates, watchlists, risk alerts, comparison tables, source packs.",
    icon: LineChart,
  },
  {
    name: "Coding & Automation",
    decisions:
      "Build planning, repo analysis, implementation strategy, testing, automation design.",
    data:
      "Codebases, issues, docs, logs, designs, tickets, APIs, product requirements.",
    produces:
      "Implementation plans, code changes, test plans, PR notes, automation runbooks.",
    icon: Cpu,
  },
  {
    name: "Sales & Business Development",
    decisions:
      "Account fit, prospecting priority, partnership angle, outreach sequencing, meeting prep.",
    data:
      "Company sites, CRM notes, funding signals, product pages, events, LinkedIn context.",
    produces:
      "Account briefs, opportunity scores, outreach drafts, call plans, follow-up tasks.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Healthcare Research",
    decisions:
      "Evidence review, care preparation, literature scan, study comparison, patient education support.",
    data:
      "Guidelines, papers, labels, visit notes, lab context, care timelines, public evidence.",
    produces:
      "Evidence summaries, question lists, study grids, source reviews, clinician-ready notes.",
    icon: HeartPulse,
  },
  {
    name: "Enterprise Operations",
    decisions:
      "Process routing, internal knowledge use, policy alignment, approvals, operational handoffs.",
    data:
      "Policies, tickets, knowledge bases, SOPs, approvals, team systems, audit requirements.",
    produces:
      "Decision records, playbooks, task packets, escalation notes, governed team workflows.",
    icon: Truck,
  },
];

export const featuredRecipes = [
  {
    name: "Biotech BD Meeting Prep Agent",
    domain: "Biotech & Pharma",
    useCase:
      "Prepare a partnership meeting with company context, scientific fit, deal signals, and next-step questions.",
    modules: ["Instruction", "Workflow", "Evaluation", "Deployment"],
    output: "Company brief, collaboration angle, meeting agenda, risk flags, CRM-ready follow-up.",
    icon: Stethoscope,
  },
  {
    name: "Finance Earnings Call Analyst",
    domain: "Finance & Market Research",
    useCase:
      "Turn transcripts, filings, guidance, and news into an analyst-style earnings review.",
    modules: ["Instruction", "Workflow", "Evaluation", "Deployment"],
    output: "Earnings brief, key deltas, management tone, watchlist signals, source-linked notes.",
    icon: Landmark,
  },
  {
    name: "Codex Full-Stack Builder Agent",
    domain: "Coding & Automation",
    useCase:
      "Translate a product request into implementation steps, code edits, validation, and PR-ready notes.",
    modules: ["Instruction", "Workflow", "Evaluation", "Deployment"],
    output: "Build plan, scoped code changes, test results, deployment notes, PR summary.",
    icon: Cpu,
  },
  {
    name: "Healthcare Evidence Review Agent",
    domain: "Healthcare Research",
    useCase:
      "Review a focused medical question against papers, guidelines, and source quality boundaries.",
    modules: ["Instruction", "Workflow", "Evaluation", "Deployment"],
    output: "Evidence table, summary brief, uncertainty notes, source checks, discussion questions.",
    icon: HeartPulse,
  },
];

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
    title: "Creators",
    body: "Publish expert workflows as complete Agent Recipes.",
    icon: Workflow,
  },
  {
    title: "Teams",
    body: "Find reusable systems for high-value professional work.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Enterprises",
    body: "Convert proven public recipes into private agents.",
    icon: LockKeyhole,
  },
];
