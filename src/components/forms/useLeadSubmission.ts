"use client";

import { useRef, useState } from "react";
import { submitLead } from "@/lib/lead-submission";
import { validateLead, type LeadPayload } from "@/lib/leads/schema";

export type LeadFormStatus = "idle" | "loading" | "success" | "error";

export function useLeadSubmission() {
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const locked = useRef(false);

  async function submit(payload: LeadPayload) {
    if (locked.current) return;
    const validated = validateLead(payload);
    if (!validated.ok) {
      setStatus("error");
      setMessage(validated.message);
      return;
    }

    locked.current = true;
    setStatus("loading");
    setMessage("");
    setWarning("");
    const fingerprint = JSON.stringify(validated.lead);
    if (attempt.current?.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, id: crypto.randomUUID() };
    }
    const result = await submitLead(payload, attempt.current.id);
    if (result.ok) {
      setStatus("success");
      setWarning(result.warning ?? "");
      return;
    }
    locked.current = false;
    setStatus("error");
    setMessage(result.message);
  }

  function clearError() {
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }

  return { status, message, warning, submit, clearError };
}
