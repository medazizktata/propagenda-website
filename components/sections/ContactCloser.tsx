"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { contactCloser, whatsapp } from "@/content/contact";
import { submitContact } from "@/lib/forms/submitContact";
import { cn } from "@/components/ui/cn";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  contactControl,
  contactControlSingle,
  contactLabel,
} from "@/components/molecules/contactControl";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import type { ContactFormResult } from "@/types/forms";

const initialState: ContactFormResult = { success: false, message: "" };

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
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-1/2 h-[50%] w-[42%] -translate-y-1/2 rounded-full bg-orange opacity-[0.08] blur-[160px]"
      />

      <div className="relative z-content mx-auto max-w-[1920px] px-gutter-m py-20 lg:px-gutter-d lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div data-closer-in>
            <p className="text-backstage mb-6 text-white/55">
              {contactCloser.kicker}
            </p>

            <h2
              className="font-sans font-extrabold uppercase leading-[0.84] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.5rem, 5.4vw, 5.75rem)" }}
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

            <div className="mt-10 flex flex-col items-start gap-2.5">
              <a
                href={`mailto:${contactCloser.mailto}`}
                className="inline-block font-sans text-lg font-semibold normal-case tracking-normal text-orange transition-colors hover-fine:hover:text-white md:text-xl"
              >
                {contactCloser.mailto}
              </a>
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-backstage inline-flex items-center gap-2 text-white/65 transition-colors hover-fine:hover:text-white"
              >
                WhatsApp {whatsapp.number} <span aria-hidden>↗</span>
              </a>
            </div>

            <p className="text-backstage mt-8 text-white/35">
              Al Quoz · Dubai · <DubaiTime /> GST — replies within a day
            </p>
          </div>

          <div
            data-closer-in
            className="relative w-full rounded-[2rem] border border-white/12 bg-[#2c2c2c] p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] sm:p-10 lg:p-12"
          >
            <div className="mb-8">
              <p className="text-backstage text-white/40">{contactCloser.formEyebrow}</p>
              <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight text-white lg:text-3xl">
                {contactCloser.formTitle}
              </h3>
            </div>

            <form
              key={JSON.stringify(errors) + String(state.success)}
              action={formAction}
              className="flex flex-col gap-5"
              noValidate
            >
              <div className="grid items-end gap-5 sm:grid-cols-2">
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

              <div className="grid items-end gap-5 sm:grid-cols-2">
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
                <FormSelect
                  id="source"
                  name="source"
                  label={f.source.label}
                  placeholder={f.source.placeholder}
                  options={f.source.options}
                  defaultValue={values.source}
                  error={errors.source}
                  required
                />
              </div>

              <div className="grid items-end gap-5 sm:grid-cols-2">
                <FormSelect
                  id="budget"
                  name="budget"
                  label={f.budget.label}
                  placeholder={f.budget.placeholder}
                  options={f.budget.options}
                  defaultValue={values.budget}
                  error={errors.budget}
                  required
                />
                <FormSelect
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

              <div className="flex w-full min-w-0 flex-col">
                <label htmlFor="message" className={contactLabel}>
                  {f.message.label} <span className="text-orange">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={f.message.placeholder}
                  defaultValue={values.message}
                  required
                  rows={5}
                  className={cn(
                    contactControl,
                    "h-auto min-h-36 resize-y py-4 leading-relaxed",
                    errors.message && "border-error",
                  )}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message ? (
                  <p className="mt-1.5 text-xs text-error">{errors.message}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={pending}
                className={cn(
                  "mt-2 inline-flex h-14 w-full items-center justify-center rounded-full bg-orange px-8",
                  "font-sans text-sm font-extrabold uppercase tracking-[0.16em] text-ink",
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
                    "text-center text-sm",
                    state.success ? "text-success" : "text-error",
                  )}
                  role="status"
                >
                  {state.message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Live Dubai clock (GST, UTC+4) — updates each minute; renders empty until mounted
    so server and client markup never disagree. */
function DubaiTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Dubai',
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span>{time || '--:--'}</span>;
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
    <div className="flex w-full min-w-0 flex-col">
      <label htmlFor={id} className={contactLabel}>
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
        className={cn(contactControlSingle, error && "border-error")}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}
