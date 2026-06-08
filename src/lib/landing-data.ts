import {
  BadgeDollarSign,
  Beaker,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  FileCheck2,
  HeartPulse,
  Landmark,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const navItems = [
  { label: "Industries", href: "#industries" },
  { label: "Examples", href: "#coach-examples" },
  { label: "Users", href: "#users" },
  { label: "Coaches", href: "#coaches" },
  { label: "Trust", href: "#trust" },
];

export const heroIndustryTags = [
  "Biotech & Pharma",
  "Finance",
  "Tax & Accounting",
  "Technology",
];

export const industries = [
  {
    name: "Biotech & Pharma",
    description:
      "Professional AI coaches for biotech teams navigating scientific, commercial, clinical, and regulated work.",
    coachTypes: [
      "BD Coach",
      "R&D Coach",
      "Deal Intelligence Coach",
      "Clinical Trial Coach",
      "Conference Meeting Coach",
      "Regulatory / CMC Coach",
    ],
    examples: [
      {
        name: "BD Coach",
        focus: "Company fit, partnership angle, outreach preparation, and meeting context.",
      },
      {
        name: "Clinical Trial Coach",
        focus: "Trial landscape, enrollment context, endpoint review, and study comparison.",
      },
      {
        name: "Regulatory / CMC Coach",
        focus: "Submission preparation, manufacturing context, and review checklists.",
      },
    ],
    icon: Beaker,
  },
  {
    name: "Finance",
    description:
      "Professional AI coaches for personal and market-facing financial decisions that need structure and review.",
    coachTypes: [
      "Personal Finance Coach",
      "Stock Research Coach",
      "Portfolio Review Coach",
      "Retirement Planning Coach",
      "Insurance Review Coach",
    ],
    examples: [
      {
        name: "Personal Finance Coach",
        focus: "Cash-flow visibility, tradeoff review, and monthly planning support.",
      },
      {
        name: "Portfolio Review Coach",
        focus: "Holdings context, concentration review, risk discussion, and decision checklist.",
      },
      {
        name: "Insurance Review Coach",
        focus: "Policy comparison, coverage gaps, renewal questions, and advisor-ready notes.",
      },
    ],
    icon: Landmark,
  },
  {
    name: "Tax & Accounting",
    description:
      "Professional AI coaches for preparing cleaner records, clearer questions, and more consistent reviews.",
    coachTypes: [
      "Tax Prep Coach",
      "Deduction Checklist Coach",
      "Expense Review Coach",
      "Small Business Accounting Coach",
    ],
    examples: [
      {
        name: "Tax Prep Coach",
        focus: "Document readiness, filing context, missing items, and preparer handoff.",
      },
      {
        name: "Expense Review Coach",
        focus: "Expense categorization, anomaly review, and month-end cleanup.",
      },
      {
        name: "Small Business Accounting Coach",
        focus: "Bookkeeping cadence, cash context, owner questions, and reporting prep.",
      },
    ],
    icon: FileCheck2,
  },
  {
    name: "Technology",
    description:
      "Professional AI coaches for teams making product, tooling, startup, and diligence decisions.",
    coachTypes: [
      "Product Strategy Coach",
      "AI Tooling Coach",
      "Startup Operations Coach",
      "Technical Due Diligence Coach",
    ],
    examples: [
      {
        name: "Product Strategy Coach",
        focus: "Market context, roadmap tradeoffs, customer signals, and launch decisions.",
      },
      {
        name: "AI Tooling Coach",
        focus: "Tool selection, workflow fit, adoption risk, and implementation planning.",
      },
      {
        name: "Technical Due Diligence Coach",
        focus: "Architecture review, team questions, risk summary, and diligence notes.",
      },
    ],
    icon: Cpu,
  },
  {
    name: "Legal & Compliance",
    description:
      "Professional AI coaches for review preparation, policy alignment, and decision records.",
    coachTypes: [
      "Contract Review Coach",
      "Policy Compliance Coach",
      "Privacy Review Coach",
      "Approval Workflow Coach",
    ],
    examples: [
      {
        name: "Contract Review Coach",
        focus: "Clause flags, commercial risk, negotiation questions, and counsel-ready notes.",
      },
      {
        name: "Privacy Review Coach",
        focus: "Data handling questions, review packets, and policy alignment checks.",
      },
      {
        name: "Approval Workflow Coach",
        focus: "Decision history, stakeholder routing, and approval documentation.",
      },
    ],
    icon: Scale,
  },
  {
    name: "Healthcare",
    description:
      "Professional AI coaches for education, preparation, navigation, and care conversations.",
    coachTypes: [
      "Medication Navigation Coach",
      "Care Visit Prep Coach",
      "Insurance Navigation Coach",
      "Patient Timeline Coach",
    ],
    examples: [
      {
        name: "Medication Navigation Coach",
        focus: "Medication lists, label summaries, possible questions, and visit preparation.",
      },
      {
        name: "Care Visit Prep Coach",
        focus: "Symptoms, timeline, lab context, and doctor-ready discussion points.",
      },
      {
        name: "Insurance Navigation Coach",
        focus: "Benefits context, claims questions, and coverage conversation prep.",
      },
    ],
    icon: HeartPulse,
  },
];

export const userBenefits = [
  {
    title: "Start with your industry",
    body: "Find professional AI coaches organized by the decisions and context your field already understands.",
    icon: Building2,
  },
  {
    title: "Get structured guidance",
    body: "Use coach-led checklists, briefs, scoring rubrics, and handoffs instead of ad hoc AI conversations.",
    icon: ClipboardCheck,
  },
  {
    title: "Stay in control",
    body: "AI coaches support preparation and decision clarity while keeping expert and human review in the loop.",
    icon: CheckCircle2,
  },
];

export const coachBenefits = [
  {
    title: "Package expertise",
    body: "Turn your professional judgment into a reusable AI coach for a specific industry audience.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Build reputation",
    body: "Publish clear coach types, improve them with feedback, and become discoverable by teams.",
    icon: BadgeDollarSign,
  },
  {
    title: "Support private deployments",
    body: "Help organizations adapt industry coaches to internal policies, data, and review processes.",
    icon: ShieldCheck,
  },
];

export const trustPrinciples = [
  {
    title: "Privacy first",
    body: "Private deployments can keep sensitive data inside team-approved environments.",
    icon: LockKeyhole,
  },
  {
    title: "Professional boundaries",
    body: "Coaches are built for preparation and decision support, not replacing licensed professionals.",
    icon: ShieldCheck,
  },
  {
    title: "Human review",
    body: "High-stakes decisions should keep source review, audit trails, and accountable owners.",
    icon: CheckCircle2,
  },
];
