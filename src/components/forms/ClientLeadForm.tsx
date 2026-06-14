"use client";

import { useState, type FormEvent } from "react";
import { submitLead } from "@/lib/lead-submission";
import {
  LeadFormShell,
  LeadTextArea,
  LeadTextField,
  type LeadFormStatus,
} from "./LeadFormShell";

const initialValues = {
  name: "",
  email: "",
  company: "",
  role: "",
  industry: "",
  improvement_goal: "",
  team_size: "",
  notes: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ClientLeadForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [message, setMessage] = useState("");

  function updateField(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (status !== "loading") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading" || status === "success") {
      return;
    }

    const requiredValues = [
      values.name,
      values.email,
      values.industry,
      values.improvement_goal,
    ];

    if (requiredValues.some((value) => !value.trim()) || !emailPattern.test(values.email)) {
      setStatus("error");
      setMessage("Please complete the required fields with a valid email.");
      return;
    }

    setStatus("loading");
    const result = await submitLead({
      lead_type: "client",
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      role: values.role.trim(),
      industry: values.industry.trim(),
      improvement_goal: values.improvement_goal.trim(),
      team_size: values.team_size.trim(),
      message: values.notes.trim(),
      source: "become-a-client",
    });

    if (result.ok) {
      setStatus("success");
      return;
    }

    if (result.reason === "missing-config") {
      setStatus("config");
      setMessage(result.message);
      return;
    }

    setStatus("error");
    setMessage(result.message);
  }

  return (
    <LeadFormShell
      onSubmit={handleSubmit}
      status={status}
      submitLabel="Request Client Access"
      successMessage="Thanks. We received your request and will reach out when AgentCoach opens early access."
      errorMessage={message}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LeadTextField
          label="Name"
          name="client-name"
          required
          value={values.name}
          onChange={(value) => updateField("name", value)}
          placeholder="Your name"
        />
        <LeadTextField
          label="Email"
          name="client-email"
          required
          type="email"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          placeholder="you@company.com"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LeadTextField
          label="Company"
          name="client-company"
          value={values.company}
          onChange={(value) => updateField("company", value)}
          placeholder="Company or organization"
        />
        <LeadTextField
          label="Role"
          name="client-role"
          value={values.role}
          onChange={(value) => updateField("role", value)}
          placeholder="Founder, researcher, operator..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LeadTextField
          label="Industry"
          name="client-industry"
          required
          value={values.industry}
          onChange={(value) => updateField("industry", value)}
          placeholder="Biotech, finance, operations..."
        />
        <LeadTextField
          label="Team size"
          name="client-team-size"
          value={values.team_size}
          onChange={(value) => updateField("team_size", value)}
          placeholder="1, 2-10, 10-50, 50+"
        />
      </div>
      <LeadTextArea
        label="What do you want to improve?"
        name="client-improvement-goal"
        required
        value={values.improvement_goal}
        onChange={(value) => updateField("improvement_goal", value)}
        placeholder="Describe the workflow, research, decision, or team process."
      />
      <LeadTextArea
        label="Optional notes"
        name="client-notes"
        value={values.notes}
        onChange={(value) => updateField("notes", value)}
        placeholder="Anything else we should know?"
        rows={3}
      />
    </LeadFormShell>
  );
}
