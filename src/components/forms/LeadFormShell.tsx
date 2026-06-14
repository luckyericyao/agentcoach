"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { FormEvent, ReactNode } from "react";

export type LeadFormStatus = "idle" | "loading" | "success" | "error" | "config";

type LeadFormShellProps = {
  children: ReactNode;
  disabled?: boolean;
  errorMessage: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: LeadFormStatus;
  submitLabel: string;
  successMessage: string;
};

export function LeadFormShell({
  children,
  disabled = false,
  errorMessage,
  onSubmit,
  status,
  submitLabel,
  successMessage,
}: LeadFormShellProps) {
  const isLoading = status === "loading";

  return (
    <motion.form
      onSubmit={onSubmit}
      className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-inner-line sm:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-4">{children}</div>

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

      {status === "success" ? (
        <p className="mt-4 text-sm leading-6 text-ion">{successMessage}</p>
      ) : null}
      {status === "error" || status === "config" ? (
        <p className="mt-4 text-sm leading-6 text-ember">{errorMessage}</p>
      ) : null}
    </motion.form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "email" | "text";
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
}: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-platinum" htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded border border-white/[0.14] bg-white/[0.06] px-4 text-base font-normal text-platinum outline-none transition duration-200 placeholder:text-steel/60 focus:border-ion/[0.55] focus:bg-white/[0.09]"
      />
    </label>
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
}: TextAreaProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-platinum" htmlFor={name}>
      {label}
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="resize-none rounded border border-white/[0.14] bg-white/[0.06] px-4 py-3 text-base font-normal leading-7 text-platinum outline-none transition duration-200 placeholder:text-steel/60 focus:border-ion/[0.55] focus:bg-white/[0.09]"
      />
    </label>
  );
}
