"use client";

import { useActionState, useEffect, useRef } from "react";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { contactCloser } from "@/content/contact";
import { submitContact } from "@/lib/forms/submitContact";
import { cn } from "@/components/ui/cn";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import type { ContactFormResult } from "@/types/forms";

const initialState: ContactFormResult = { success: false, message: "" };

const field = cn(
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3",
  "text-[0.95rem] text-white placeholder:text-white/35",
  "transition-[border-color,background-color,box-shadow] duration-200",
  "hover-fine:hover:border-white/20 hover-fine:hover:bg-white/[0.07]",
  "focus-visible:border-orange/70 focus-visible:bg-white/[0.08] focus-visible:outline-none",
  "focus-visible:shadow-[0_0_0_3px_rgba(245,139,39,0.18)]",
);

const selectField = cn(
  field,
  "appearance-none bg-[length:0.75rem] bg-[right_1rem_center] bg-no-repeat pr-10",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 8%27 fill=%27none%27%3E%3Cpath d=%27M1 1.5L6 6.5L11 1.5%27 stroke=%27%23f58b27%27 stroke-width=%271.6%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')]",
);

/**
 * Manifesto + brief form — same row on desktop, stacked on mobile.
 */
export function ContactCloser() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const f = contactCloser.fields;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-closer-in]", {
        y: 40,
        autoAlpha: 0,
        ease: "power3.out",
        duration: 0.75,
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      id="contact-form"
      className="relative overflow-hidden bg-charcoal"
    >
      <div aria-hidden className="pattern-section-fade pointer-events-none absolute inset-0">
        <BrandPattern variant="dense" className="opacity-[0.14]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[35%] h-[55%] w-[48%] -translate-y-1/2 rounded-full bg-orange opacity-[0.1] blur-[160px]"
      />

      <div className="relative z-content mx-auto max-w-[1920px] px-gutter-m py-20 lg:px-gutter-d lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-16 xl:gap-20">
          <div data-closer-in className="lg:sticky lg:top-28">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-orange">
              {contactCloser.kicker}
            </p>

            <h2
              className="font-sans font-black uppercase leading-[0.86] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.25rem, 5.2vw, 5.25rem)" }}
            >
              {contactCloser.lines.map((line, i) => {
                const hero = line.some((s) => "hero" in s && s.hero);
                return (
                  <span
                    key={i}
                    className={cn(
                      "block",
                      hero && "text-[1.06em] text-orange",
                    )}
                  >
                    {line.map((seg, j) => (
                      <span
                        key={j}
                        className={cn(
                          !hero && (seg.accent ? "text-orange" : "text-white"),
                          hero && "text-orange",
                        )}
                      >
                        {seg.text}
                      </span>
                    ))}
                  </span>
                );
              })}
            </h2>

            <a
              href={`mailto:${contactCloser.mailto}`}
              className="mt-8 inline-block font-sans text-base font-semibold normal-case tracking-normal text-orange transition-colors hover-fine:hover:text-white md:text-lg"
            >
              {contactCloser.mailto}
            </a>
          </div>

          <div
            data-closer-in
            className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/12 border-t-4 border-t-orange bg-[#2f2f2f] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)]"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40">
                  {contactCloser.formEyebrow}
                </p>
                <h3 className="mt-1 font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
                  {contactCloser.formTitle}
                </h3>
              </div>

              <form
                key={JSON.stringify(errors) + String(state.success)}
                action={formAction}
                className="space-y-3.5"
                noValidate
              >
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <LabeledField
                    id="name"
                    name="name"
                    label={f.name.label}
                    placeholder={f.name.placeholder}
                    defaultValue={values.name}
                    error={errors.name}
                    required
                  />
                  <LabeledField
                    id="company"
                    name="company"
                    label={f.company.label}
                    placeholder={f.company.placeholder}
                    defaultValue={values.company}
                    error={errors.company}
                    required
                  />
                </div>

                <LabeledField
                  id="email"
                  name="email"
                  type="email"
                  label={f.email.label}
                  placeholder={f.email.placeholder}
                  defaultValue={values.email}
                  error={errors.email}
                  required
                />

                <SelectField
                  id="source"
                  name="source"
                  label={f.source.label}
                  placeholder={f.source.placeholder}
                  options={f.source.options}
                  defaultValue={values.source}
                  error={errors.source}
                  required
                />

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <SelectField
                    id="budget"
                    name="budget"
                    label={f.budget.label}
                    placeholder={f.budget.placeholder}
                    options={f.budget.options}
                    defaultValue={values.budget}
                    error={errors.budget}
                    required
                  />
                  <SelectField
                    id="timeframe"
                    name="timeframe"
                    label={f.timeframe.label}
                    placeholder={f.timeframe.placeholder}
                    options={f.timeframe.options}
                    defaultValue={values.timeframe}
                    error={errors.timeframe}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium tracking-normal text-white/55"
                  >
                    {f.message.label} <span className="text-orange">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={f.message.placeholder}
                    defaultValue={values.message}
                    required
                    rows={4}
                    className={cn(field, "min-h-28 resize-y", errors.message && "border-error")}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message ? (
                    <p className="mt-1.5 text-xs text-error">{errors.message}</p>
                  ) : null}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={pending}
                    className={cn(
                      "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange px-8 py-3.5",
                      "font-sans text-sm font-extrabold uppercase tracking-[0.14em] text-black",
                      "transition-[transform,background-color,box-shadow] duration-300 ease-out",
                      "hover-fine:hover:-translate-y-0.5 hover-fine:hover:bg-white hover-fine:hover:shadow-[0_16px_40px_-12px_rgba(245,139,39,0.55)]",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                    )}
                  >
                    {pending ? "Sending…" : contactCloser.submitLabel}
                  </button>
                  {state.message ? (
                    <p
                      className={cn(
                        "mt-3 text-center text-sm",
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
          </div>
        </div>
      </div>
    </section>
  );
}

function LabeledField({
  id,
  name,
  label,
  placeholder,
  type = "text",
  defaultValue,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium tracking-normal text-white/55"
      >
        {label}
        {required ? <span className="ml-1 text-orange">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className={cn(field, error && "border-error")}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  placeholder,
  options,
  defaultValue,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium tracking-normal text-white/55"
      >
        {label}
        {required ? <span className="ml-1 text-orange">*</span> : null}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={cn(selectField, error && "border-error")}
        aria-invalid={Boolean(error)}
      >
        <option value="" disabled className="text-white/40">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#2f2f2f] text-white">
            {opt}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}
