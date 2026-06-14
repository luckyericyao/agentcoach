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
  linkedin_or_website: "",
  expertise_area: "",
  recipe_interest: "",
  notes: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CoachLeadForm() {
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
      values.expertise_area,
      values.recipe_interest,
    ];

    if (requiredValues.some((value) => !value.trim()) || !emailPattern.test(values.email)) {
      setStatus("error");
      setMessage("Please complete the required fields with a valid email.");
      return;
    }

    setStatus("loading");
    const result = await submitLead({
      lead_type: "coach",
      name: values.name.trim(),
      email: values.email.trim(),
      linkedin_or_website: values.linkedin_or_website.trim(),
      expertise_area: values.expertise_area.trim(),
      recipe_interest: values.recipe_interest.trim(),
      message: values.notes.trim(),
      source: "become-a-coach",
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
      submitLabel="Apply as a Coach"
      successMessage="Thanks. We received your coach application and will reach out when AgentCoach opens early access."
      errorMessage={message}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LeadTextField
          label="Name"
          name="coach-name"
          required
          value={values.name}
          onChange={(value) => updateField("name", value)}
          placeholder="Your name"
        />
        <LeadTextField
          label="Email"
          name="coach-email"
          required
          type="email"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          placeholder="you@company.com"
        />
      </div>
      <LeadTextField
        label="LinkedIn or website"
        name="coach-linkedin"
        value={values.linkedin_or_website}
        onChange={(value) => updateField("linkedin_or_website", value)}
        placeholder="https://..."
      />
      <LeadTextField
        label="Area of expertise"
        name="coach-expertise"
        required
        value={values.expertise_area}
        onChange={(value) => updateField("expertise_area", value)}
        placeholder="Biotech BD, finance research, automation, operations..."
      />
      <LeadTextArea
        label="What kind of Agent Recipe do you want to build?"
        name="coach-recipe-interest"
        required
        value={values.recipe_interest}
        onChange={(value) => updateField("recipe_interest", value)}
        placeholder="Describe the workflow, decision, or playbook you want to package."
      />
      <LeadTextArea
        label="Optional notes"
        name="coach-notes"
        value={values.notes}
        onChange={(value) => updateField("notes", value)}
        placeholder="Anything else we should know?"
        rows={3}
      />
    </LeadFormShell>
  );
}
