"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useId, useRef, type FormEvent, type ReactNode } from "react";
import type { LeadFormStatus } from "./useLeadSubmission";

type LeadFormShellProps = {
  children: ReactNode;
  disabled?: boolean;
  errorMessage: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: LeadFormStatus;
  submitLabel: string;
  successMessage: string;
  warning?: string;
};

export function LeadFormShell({
  children,
  disabled = false,
  errorMessage,
  onSubmit,
  status,
  submitLabel,
  successMessage,
  warning,
}: LeadFormShellProps) {
  const isLoading = status === "loading";
  const feedbackId = useId();
  const dataNoticeId = useId();
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status === "success") feedback.current?.focus({ preventScroll: true });
  }, [status]);

  return (
    <motion.form
      onSubmit={onSubmit}
      method="post"
      aria-busy={isLoading}
      aria-describedby={`${dataNoticeId} ${feedbackId}`}
      className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line sm:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <p id={dataNoticeId} className="mb-6 border-b border-white/10 pb-5 text-sm leading-6 text-steel">
        Describe the workflow at a high level. Do not include patient records,
        financial account details, passwords, or confidential documents.
      </p>
      <fieldset disabled={disabled || isLoading || status === "success"} className="grid min-w-0 gap-4">
        <legend className="sr-only">Contact details</legend>
        {children}
      </fieldset>

      <button
        type="submit"
        disabled={disabled || isLoading || status === "success"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-platinum px-5 text-sm font-semibold text-carbon transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-ion/50 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isLoading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
        {status === "success" ? "Received" : submitLabel}
        {!isLoading && status !== "success" ? (
          <ArrowRight aria-hidden="true" className="size-4" />
        ) : null}
      </button>

      <div id={feedbackId} ref={feedback} tabIndex={-1} aria-live="polite" aria-atomic="true">
        {status === "success" ? (
          <p className="mt-4 text-sm leading-6 text-ion">{successMessage}</p>
        ) : null}
        {status === "success" && warning ? (
          <p className="mt-3 text-sm leading-6 text-ember">{warning}</p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="mt-4 text-sm leading-6 text-ember">{errorMessage}</p>
        ) : null}
      </div>
    </motion.form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "email" | "text" | "url";
  maxLength?: number;
  autoComplete?: string;
  value: string;
};

export function LeadTextField({
  label,
  name,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
  maxLength = type === "email" ? 254 : 180,
  autoComplete,
}: FieldProps) {
  return (
    <div className="grid gap-2 text-sm font-medium text-platinum">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete ?? (type === "email" ? "email" : undefined)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 min-w-0 w-full rounded border border-white/[0.14] bg-white/[0.06] px-4 text-base font-normal text-platinum outline-none transition duration-200 placeholder:text-steel/60 focus:border-ion/[0.55] focus:bg-white/[0.09] disabled:opacity-70"
      />
    </div>
  );
}

type TextAreaProps = Omit<FieldProps, "type"> & {
  rows?: number;
};

export function LeadTextArea({
  label,
  name,
  onChange,
  placeholder,
  required,
  rows = 4,
  value,
  maxLength = 1500,
}: TextAreaProps) {
  return (
    <div className="grid gap-2 text-sm font-medium text-platinum">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        required={required}
        maxLength={maxLength}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 w-full resize-y rounded border border-white/[0.14] bg-white/[0.06] px-4 py-3 text-base font-normal leading-7 text-platinum outline-none transition duration-200 placeholder:text-steel/60 focus:border-ion/[0.55] focus:bg-white/[0.09] disabled:opacity-70"
      />
    </div>
  );
}
