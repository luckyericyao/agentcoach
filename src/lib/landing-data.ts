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
  Scale,
  Search,
  ShieldCheck,
  Stethoscope,
  Truck,
  WalletCards,
  Workflow,
} from "lucide-react";

export const navItems = [
  { label: "Vision", href: "#vision" },
  { label: "Recipes", href: "#recipes" },
  { label: "Channels", href: "#channels" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Contact", href: "#waitlist" },
];

export const pillars = [
  {
    title: "Instruction",
    description:
      "Roles, data sources, constraints, tools, review rules, and decision criteria in one reusable system.",
    icon: Binary,
  },
  {
    title: "Workflow",
    description:
      "Repeatable steps for gathering fragmented data, scoring options, escalating risk, and producing deliverables.",
    icon: Workflow,
  },
  {
    title: "Evaluation",
    description:
      "Source checks, hallucination review, acceptance criteria, and human-review gates before decisions move forward.",
    icon: Activity,
  },
  {
    title: "Deployment",
    description:
      "Packaging patterns for teams, private data, CRM notes, task creation, and enterprise controls.",
    icon: Cpu,
  },
];

export const promptComparison = {
  prompt: {
    title: "Prompt",
    example: "\"Research Bayer and write a BD email.\"",
    point: "A prompt asks for an answer.",
  },
  recipe: {
    title: "Agent Recipe",
    point:
      "An Agent Recipe runs a repeatable professional workflow with data, scoring, review, and handoff steps.",
    steps: [
      "Identify business unit and strategic context",
      "Pull recent news, pipeline, deals, filings, and internal CRM history",
      "Match company needs against internal capabilities",
      "Score collaboration fit, urgency, budget, and decision-maker access",
      "Generate outreach email",
      "Generate meeting brief",
      "Run source-check and hallucination review",
      "Create CRM note and follow-up task",
    ],
  },
};

export const recipeExamples = [
  {
    name: "Stock Signal Intelligence Agent",
    description:
      "Turn fragmented market data into structured investment briefs, risk alerts, and watchlist updates.",
    data:
      "Filings, earnings calls, news, analyst updates, insider activity, options activity, social sentiment, macro events.",
    workflow: "Monitor -> summarize -> score -> alert -> brief.",
    output: "Daily watchlist, bullish/bearish signals, risk events, thesis update.",
    value:
      "Faster market research, fewer missed events, more disciplined decision-making.",
    disclaimer: "Research and decision support only. Not financial advice.",
    badges: ["Research", "Decision Support", "Human Review Required"],
    icon: LineChart,
  },
  {
    name: "Personal CFO Agent",
    description:
      "Analyze income, spending, debt, insurance, and investment options to support smarter personal financial decisions.",
    data:
      "Bank statements, credit card bills, income, debt, insurance policies, tax status, financial goals.",
    workflow: "Classify -> detect waste -> compare options -> generate plan -> track progress.",
    output:
      "Monthly cash-flow report, debt strategy, savings plan, insurance review, decision checklist.",
    value:
      "Better financial visibility, less manual budgeting, clearer tradeoff analysis.",
    badges: ["Decision Support", "Research", "Human Review Required"],
    icon: WalletCards,
  },
  {
    name: "BD Deal Scout Agent",
    description:
      "Find high-fit accounts, map partnership angles, draft outreach, and prepare meeting briefs from public and internal data.",
    data:
      "Company websites, pipeline pages, press releases, conference lists, CRM notes, funding news, clinical trials, LinkedIn signals.",
    workflow: "Research -> match -> score -> draft -> brief -> follow up.",
    output: "Account brief, collaboration angle, outreach email, meeting prep, CRM note.",
    value:
      "Higher BD productivity, faster account research, better-targeted outreach.",
    badges: ["Workflow Automation", "Decision Support", "Enterprise Ready"],
    icon: BriefcaseBusiness,
  },
  {
    name: "Medication Navigator Agent",
    description:
      "Organize medications, summarize labels, flag potential risks, and prepare doctor-ready questions.",
    data:
      "Medication lists, drug labels, allergy history, side-effect notes, lab reports, visit summaries.",
    workflow: "Organize -> check -> summarize -> prepare questions -> track.",
    output:
      "Medication summary, possible interaction flags, doctor discussion list, care timeline.",
    value:
      "Better patient preparation, safer medication conversations, reduced confusion.",
    disclaimer:
      "Supports patient education and care navigation only. Not diagnosis or medical treatment.",
    badges: ["Review Preparation", "Human Review Required", "Decision Support"],
    icon: HeartPulse,
  },
  {
    name: "Sourcing Intelligence Agent",
    description:
      "Compare suppliers, pricing, MOQ, lead time, certifications, and product specs to support faster sourcing decisions.",
    data:
      "Supplier quotes, catalogs, product specs, MOQ, lead time, certifications, historical orders, competitor pricing.",
    workflow: "Normalize -> compare -> score -> flag risk -> recommend.",
    output:
      "Supplier comparison table, cost breakdown, sourcing recommendation, risk checklist.",
    value:
      "Faster procurement decisions, better supplier comparison, fewer sourcing mistakes.",
    badges: ["Decision Support", "Workflow Automation", "Enterprise Ready"],
    icon: Truck,
  },
  {
    name: "Contract Risk Agent",
    description:
      "Review contracts against internal playbooks and flag negotiation risks before legal review.",
    data:
      "Contract PDFs, internal templates, redlines, negotiation playbooks, approval rules.",
    workflow: "Extract -> compare -> flag -> summarize -> suggest negotiation points.",
    output: "Risk summary, clause-level flags, negotiation checklist, approval notes.",
    value:
      "Faster contract review, better risk visibility, more consistent commercial decisions.",
    disclaimer: "Supports review preparation only. Does not replace legal counsel.",
    badges: ["Review Preparation", "Human Review Required", "Enterprise Ready"],
    icon: Scale,
  },
];

export const channels = [
  {
    title: "Market Intelligence",
    data: "Filings, earnings calls, news, analyst notes, options activity, macro events.",
    decisions: "Position monitoring, watchlist prioritization, risk escalation.",
    output: "Signals, briefs, risk alerts, thesis updates.",
    icon: Landmark,
  },
  {
    title: "Personal Finance",
    data: "Statements, bills, debts, policies, goals, tax context.",
    decisions: "Cash-flow planning, debt tradeoffs, insurance review.",
    output: "Monthly reports, checklists, plans, progress tracking.",
    icon: WalletCards,
  },
  {
    title: "Business Development",
    data: "Company data, pipelines, CRM notes, events, funding and partnership signals.",
    decisions: "Account fit, outreach priority, collaboration angle.",
    output: "Account briefs, outreach drafts, meeting prep, CRM notes.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Healthcare Navigation",
    data: "Medication lists, labels, visit notes, labs, symptom logs.",
    decisions: "Care preparation, question planning, risk discussion prompts.",
    output: "Summaries, timelines, possible flags, doctor-ready questions.",
    icon: Stethoscope,
  },
  {
    title: "Sourcing & Supply Chain",
    data: "Quotes, catalogs, specs, MOQ, certifications, lead times, order history.",
    decisions: "Supplier comparison, risk review, procurement recommendation.",
    output: "Comparison tables, cost breakdowns, risk checklists.",
    icon: Truck,
  },
  {
    title: "Contract & Risk Review",
    data: "Contracts, templates, redlines, playbooks, approval rules.",
    decisions: "Clause risk, negotiation position, review readiness.",
    output: "Risk summaries, clause flags, negotiation checklists.",
    icon: FileText,
  },
  {
    title: "Enterprise Operations",
    data: "Internal knowledge, process docs, tickets, approvals, team systems.",
    decisions: "Workflow routing, escalation, compliance review, operational action.",
    output: "Standardized notes, checklists, tasks, review packets.",
    icon: ShieldCheck,
  },
];

export const creatorBullets = [
  "Turn expertise into reusable agent systems",
  "Build reputation through ranked recipes",
  "Monetize with Pro Recipes and enterprise licensing",
  "Help companies operationalize expert workflows",
];

export const enterpriseCapabilities = [
  "Standardized workflows",
  "Private recipe adaptation",
  "Security and compliance review",
  "Team deployment patterns",
  "Evaluation checklists",
  "Local model and private AI options",
  "Internal knowledge integration",
];

export const finalAudiencePaths = [
  {
    title: "For Users",
    body: "Explore usable Agent Recipes.",
    icon: Search,
  },
  {
    title: "For Experts",
    body: "Publish and monetize your workflows.",
    icon: ClipboardCheck,
  },
  {
    title: "For Companies",
    body: "Deploy private agent systems for your team.",
    icon: Database,
  },
];
