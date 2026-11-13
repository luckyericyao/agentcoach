"use client";

import { useState, type FormEvent } from "react";
import type { AgentRecipe } from "@/lib/recipes-data";
import { useLeadSubmission } from "./useLeadSubmission";
import {
  LeadFormShell,
  LeadTextArea,
  LeadTextField,
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

export function ClientLeadForm({ recipe }: { recipe?: Pick<AgentRecipe, "slug" | "name" | "domain" | "useCase"> }) {
  const [values, setValues] = useState(() => ({
    ...initialValues,
    industry: recipe?.domain ?? "",
    improvement_goal: recipe ? `I would like to adapt the ${recipe.name} workflow for my team.` : "",
  }));
  const { status, message, warning, submit, clearError } = useLeadSubmission();

  function updateField(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    clearError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await submit({
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
      recipe_interest: recipe?.name,
    });

  }

  return (
    <LeadFormShell
      onSubmit={handleSubmit}
      status={status}
      submitLabel="Request Client Access"
      successMessage="Thanks. We received your request and will reach out when AgentCoach opens early access."
      errorMessage={message}
      warning={warning}
    >
      {recipe ? (
        <div className="border-b border-white/10 pb-5">
          <p className="text-xs font-semibold uppercase text-ion">Selected sample recipe</p>
          <p className="mt-2 text-lg font-semibold leading-7 text-platinum">{recipe.name}</p>
          <p className="mt-2 text-sm leading-6 text-steel">{recipe.useCase}</p>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <LeadTextField
          label="Name"
          name="client-name"
          autoComplete="name"
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
          autoComplete="organization"
          value={values.company}
          onChange={(value) => updateField("company", value)}
          placeholder="Company or organization"
        />
        <LeadTextField
          label="Role"
          name="client-role"
          autoComplete="organization-title"
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
          maxLength={120}
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
        maxLength={2000}
        value={values.notes}
        onChange={(value) => updateField("notes", value)}
        placeholder="Anything else we should know?"
        rows={3}
      />
    </LeadFormShell>
  );
}
