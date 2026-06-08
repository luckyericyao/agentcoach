import {
  Activity,
  Binary,
  BriefcaseBusiness,
  Code2,
  Cpu,
  FlaskConical,
  LineChart,
  ShieldCheck,
  Stethoscope,
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
      "Role, context, constraints, tools, and operating principles in one reusable system.",
    icon: Binary,
  },
  {
    title: "Workflow",
    description:
      "Stepwise agent behavior for research, analysis, decisions, and handoffs.",
    icon: Workflow,
  },
  {
    title: "Evaluation",
    description:
      "Tests, review criteria, benchmarks, and failure checks for dependable output.",
    icon: Activity,
  },
  {
    title: "Deployment",
    description:
      "Packaging patterns for teams, private environments, and enterprise controls.",
    icon: Cpu,
  },
];

export const channels = [
  {
    title: "Biotech & Drug Discovery",
    detail: "Research agents for literature, target analysis, and experiment planning.",
    icon: FlaskConical,
  },
  {
    title: "Finance & Market Research",
    detail: "Market maps, thesis generation, diligence, and monitoring workflows.",
    icon: LineChart,
  },
  {
    title: "Coding & Automation",
    detail: "Developer agents for code review, testing, documentation, and ops work.",
    icon: Code2,
  },
  {
    title: "Sales & Business Development",
    detail: "Prospecting, account intelligence, outreach systems, and pipeline research.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Healthcare Research",
    detail: "Structured assistants for evidence review, care operations, and analysis.",
    icon: Stethoscope,
  },
  {
    title: "Enterprise Operations",
    detail: "Internal agents for knowledge work, process automation, and governance.",
    icon: ShieldCheck,
  },
];

export const enterpriseCapabilities = [
  "Private recipe adaptation",
  "Security and compliance review",
  "Team deployment patterns",
  "Local model and private AI options",
];

