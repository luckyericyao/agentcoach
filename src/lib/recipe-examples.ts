type FindingStatus = "documented" | "hypothesis" | "unknown";

export type RecipeWorkedExample = Readonly<{
  kind: "synthetic";
  title: string;
  scenario: string;
  sources: readonly { id: string; date: string; label: string; excerpt: string }[];
  output: {
    summary: string;
    findings: readonly { status: FindingStatus; text: string; sourceIds: readonly string[] }[];
    agenda: readonly { minutes: number; topic: string }[];
    handoff: string;
  };
  reviewChecklist: readonly string[];
}>;

const biotechMeetingExample = {
  kind: "synthetic",
  title: "Partnering meeting brief",
  scenario: "Prepare a 20-minute introductory meeting between a pharma partnering team and a biotech business development team. Decide whether a second discussion is worth scheduling.",
  sources: [
    {
      id: "S1", date: "2026-10-08", label: "Partnering brief",
      excerpt: "For introductory meetings, bring a non-confidential capability summary. Name the evidence a second discussion would need.",
    },
    {
      id: "S2", date: "2026-10-12", label: "Internal capability note",
      excerpt: "The BD team has an approved non-confidential one-page summary. Detailed materials have not been cleared for sharing.",
    },
    {
      id: "S3", date: "2026-10-15", label: "Meeting intake note",
      excerpt: "A 20-minute introductory slot is penciled in. Attendees and next-step criteria are unconfirmed.",
    },
  ],
  output: {
    summary: "Use the introductory slot to test fit. Bring only the approved one-pager and agree what evidence would warrant a second discussion.",
    findings: [
      {
        status: "documented",
        text: "A non-confidential summary is ready. Detailed materials have not been cleared for sharing.",
        sourceIds: ["S2"],
      },
      {
        status: "documented",
        text: "The 20-minute slot is tentative. Its attendees and next-step criteria are not confirmed.",
        sourceIds: ["S3"],
      },
      {
        status: "hypothesis",
        text: "The approved one-pager may be enough to start a fit discussion, but it does not establish collaboration interest.",
        sourceIds: ["S1", "S2"],
      },
      {
        status: "unknown",
        text: "Who owns the follow-up decision, and what evidence would they require?",
        sourceIds: [],
      },
    ],
    agenda: [
      { minutes: 5, topic: "Confirm the partnering team's priorities and who owns the decision." },
      { minutes: 10, topic: "Discuss fit using the approved non-confidential summary." },
      { minutes: 5, topic: "Agree which materials, if any, should be reviewed next." },
    ],
    handoff: "The meeting owner reviews the source notes, confirms attendees, and approves any outreach or CRM entry. Nothing is sent or recorded automatically.",
  },
  reviewChecklist: [
    "Check each documented claim against the dated source excerpt.",
    "Keep the fit hypothesis separate from confirmed partner interest.",
    "Confirm the attendee list and sharing permissions before outreach.",
  ],
} as const satisfies RecipeWorkedExample;

export function getRecipeWorkedExample(slug: string): RecipeWorkedExample | undefined {
  return slug === "biotech-bd-meeting-prep-agent" ? biotechMeetingExample : undefined;
}
