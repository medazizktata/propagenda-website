"use client";

import { useActionState } from "react";
import { contactFormSection } from "@/content/contact";
import { submitContact } from "@/lib/forms/submitContact";
import { cn } from "@/components/ui/cn";
import type { ContactFormResult } from "@/types/forms";

const initialState: ContactFormResult = { success: false, message: "" };

const field =
  "w-full border-0 border-b border-white/25 bg-transparent px-0 py-4 text-base text-white placeholder:text-white/35 focus-visible:border-orange focus-visible:outline-none";

/** Asymmetric editorial form — sticky headline left, fields right. */
export function ContactTalkForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <section
      id="contact-form"
      className="relative border-b border-white/10 bg-black px-gutter-m py-20 lg:px-gutter-d lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-20">
        <aside className="lg:sticky lg:top-28">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-orange">
            01 — Contact
          </p>
          <h2
            className="max-w-[9ch] font-sans font-extrabold uppercase leading-[0.86] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
          >
            Let&apos;s{" "}
            <span className="text-orange">talk</span>
            <span className="text-orange">.</span>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/55 md:text-base">
            {contactFormSection.subheading}
          </p>
        </aside>

        <form
          key={JSON.stringify(errors) + String(state.success)}
          action={formAction}
          className="space-y-1"
          noValidate
        >
          <div className="grid gap-x-8 sm:grid-cols-2">
            <Field
              id="firstName"
              name="firstName"
              label="First name"
              defaultValue={values.firstName}
              error={errors.firstName}
              required
            />
            <Field
              id="lastName"
              name="lastName"
              label="Last name"
              defaultValue={values.lastName}
              error={errors.lastName}
              required
            />
          </div>

          <div className="grid gap-x-8 sm:grid-cols-2">
            <Field
              id="email"
              name="email"
              type="email"
              label="Email"
              defaultValue={values.email}
              error={errors.email}
              required
            />
            <Field
              id="phone"
              name="phone"
              type="tel"
              label="Phone"
              defaultValue={values.phone}
              error={errors.phone}
              required
            />
          </div>

          <div className="pt-2">
            <label
              htmlFor="message"
              className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/40"
            >
              Project
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="What's the project?"
              defaultValue={values.message}
              required
              rows={5}
              className={cn(
                field,
                "min-h-36 resize-y",
                errors.message && "border-error",
              )}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message ? (
              <p className="mt-1 text-xs text-error">{errors.message}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-8">
            <button
              type="submit"
              disabled={pending}
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-full bg-orange px-9 py-3",
                "font-sans text-sm font-extrabold uppercase tracking-[0.14em] text-black",
                "transition-[transform,background-color,color] duration-300 ease-out",
                "hover-fine:hover:-translate-y-0.5 hover-fine:hover:bg-white",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {pending ? "Sending…" : contactFormSection.submitLabel}
            </button>
            {state.message ? (
              <p
                className={cn(
                  "text-sm",
                  state.success ? "text-success" : "text-error",
                )}
                role="status"
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  defaultValue,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="py-2">
      <label
        htmlFor={id}
        className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/40"
      >
        {label}
        {required ? <span className="ml-1 text-orange">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={label}
        defaultValue={defaultValue}
        required={required}
        className={cn(field, error && "border-error")}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}
