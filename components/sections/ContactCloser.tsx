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

function HandwrittenEmail({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="group inline-flex flex-col items-start normal-case text-orange transition-colors hover-fine:hover:text-white"
    >
      <span className="font-sans text-base font-semibold tracking-normal md:text-lg">
        {email}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 300 22"
        className="mt-1 h-[0.7em] w-[min(100%,16rem)] overflow-visible text-orange"
      >
        <path
          d="M6 13.5c18.4-5.2 36.8 1.6 55.2-2.4 17.6-3.8 34.4-8.2 52.8-3.6 16.8 4.2 32.4 6.8 49.6 1.2 14.8-4.8 29.6-7.2 45.2-2.8 13.6 3.8 28.4 5.6 43.6-0.4 10.4-4.1 21.6-6.8 35.6-3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M12 16.8c22.4 2.4 44.8-4.8 67.2-1.2 20.8 3.4 41.6 5.6 62.4 0.8 18.4-4.2 37.6-3.6 56 1.6 14.4 4.1 30.4 2.8 46.4-1.2 11.2-2.8 23.2-1.6 36.8 2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M278 15.2c6.4-1.6 10.8-4.8 14.4-8.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </a>
  );
}

/**
 * Full-bleed manifesto with a floating brief panel —
 * type stays huge (vw), form never gets collided into.
 */
export function ContactCloser() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

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
        {/* Manifesto — full content width, huge viewport type */}
        <div className="max-w-5xl">
          <p
            data-closer-in
            className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-orange"
          >
            {contactCloser.kicker}
          </p>

          <h2
            data-closer-in
            className="font-sans font-black uppercase leading-[0.82] tracking-[-0.035em]"
            style={{ fontSize: "clamp(2.75rem, 7.2vw, 7.25rem)" }}
          >
            {contactCloser.lines.map((line, i) => {
              const hero = line.some((s) => "hero" in s && s.hero);
              return (
                <span
                  key={i}
                  className={cn(
                    "block whitespace-nowrap",
                    hero && "text-[1.08em] text-orange",
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

          <div data-closer-in className="mt-8">
            <HandwrittenEmail email={contactCloser.mailto} />
          </div>
        </div>

        {/* Form — sits under the manifesto, wide but contained, never fights the type */}
        <div
          data-closer-in
          className="relative mt-14 w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/12 border-t-4 border-t-orange bg-[#2f2f2f] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)] lg:mt-16"
        >
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40">
                  Brief
                </p>
                <h3 className="mt-1 font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
                  Tell us what you need
                </h3>
              </div>
            </div>

            <form
              key={JSON.stringify(errors) + String(state.success)}
              action={formAction}
              className="space-y-3.5"
              noValidate
            >
              <div className="grid gap-3.5 sm:grid-cols-2">
                <LabeledField
                  id="firstName"
                  name="firstName"
                  label="First name"
                  placeholder="First name"
                  defaultValue={values.firstName}
                  error={errors.firstName}
                  required
                />
                <LabeledField
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  placeholder="Last name"
                  defaultValue={values.lastName}
                  error={errors.lastName}
                  required
                />
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <LabeledField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder={contactCloser.fields.email}
                  defaultValue={values.email}
                  error={errors.email}
                  required
                />
                <LabeledField
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone"
                  placeholder={contactCloser.fields.phone}
                  defaultValue={values.phone}
                  error={errors.phone}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium tracking-normal text-white/55"
                >
                  Project <span className="text-orange">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={contactCloser.fields.message}
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
