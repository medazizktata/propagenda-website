"use client";

import { useEffect, useRef, useState } from "react";
import { bookCall, contactCloser, whatsapp } from "@/content/contact";
import { cn } from "@/components/ui/cn";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  contactControl,
  contactControlSingle,
  contactLabel,
} from "@/components/molecules/contactControl";
import { useContactForm } from "@/hooks/useContactForm";
import { TurnstileField } from "@/components/molecules/TurnstileField";
import { gsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/** WhatsApp brand glyph, sized to the surrounding text (em units, inherits color). */
function WhatsAppGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-[1.05em] w-[1.05em] shrink-0">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.03.53 3.97 1.55 5.7L2 22l4.53-1.63a9.9 9.9 0 0 0 5.5 1.66h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.02A9.82 9.82 0 0 0 12.04 2Zm0 1.8a8.05 8.05 0 0 1 8.06 8.1c0 4.46-3.6 8.1-8.06 8.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-2.5.9.86-2.44-.2-.32a8.06 8.06 0 0 1-1.24-4.31c0-4.46 3.63-8.1 8.08-8.1Zm-3.4 4.3c-.15 0-.4.06-.6.28-.21.24-.8.79-.8 1.92 0 1.13.82 2.22.94 2.38.12.16 1.62 2.47 3.93 3.46.55.24.98.38 1.31.49.55.17 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.09.19-.53.19-.98.13-1.08-.05-.09-.2-.15-.43-.27-.23-.11-1.35-.66-1.56-.74-.21-.08-.36-.11-.51.12-.15.23-.58.73-.72.88-.13.16-.26.18-.49.06-.23-.12-.96-.35-1.83-1.13-.68-.6-1.13-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.26.34-.4.12-.13.15-.23.23-.38.08-.16.04-.29-.02-.4-.06-.12-.5-1.24-.7-1.7-.18-.44-.37-.38-.51-.39h-.44Z" />
    </svg>
  );
}

/** Calendar glyph for the scheduled-call link. */
function CalendarGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[1.05em] w-[1.05em] shrink-0"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/**
 * Manifesto + brief form — same row on desktop, stacked on mobile.
 */
export function ContactCloser() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { state, pending, errors, values, onSubmit, formKey, turnstileRef, setTurnstileToken } =
    useContactForm();
  const f = contactCloser.fields;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-closer-in]", el);
      if (!targets.length) return;

      // Motion only — never autoAlpha. Invisible copy after submit/hash is worse than no tween.
      gsap.from(targets, {
        y: 28,
        ease: "power3.out",
        duration: 0.7,
        stagger: 0.07,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
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
                <WhatsAppGlyph />
                WhatsApp {whatsapp.number} <span aria-hidden>↗</span>
              </a>
              {/* Scheduled call — our own styled link out, never a provider widget.
                  Hidden entirely when no booking URL is configured. */}
              {bookCall.url ? (
                <a
                  href={bookCall.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-backstage inline-flex items-center gap-2 text-white/65 transition-colors hover-fine:hover:text-white"
                >
                  <CalendarGlyph />
                  {bookCall.label} <span aria-hidden>↗</span>
                </a>
              ) : null}
            </div>

            <p className="text-backstage mt-8 text-white/35">
              <StudioTime /> GST · replies within a day
            </p>
          </div>

          <div
            data-closer-in
            className="relative w-full rounded-[2rem] border border-white/16 bg-[#1a1a1a] p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] sm:p-10 lg:p-12"
          >
            <div className="mb-8">
              <p className="text-backstage text-white/50">{contactCloser.formEyebrow}</p>
              <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight text-white lg:text-3xl">
                {contactCloser.formTitle}
              </h3>
            </div>

            <form
              key={formKey}
              onSubmit={onSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              {/* Honeypot — humans never see or reach this; bots that fill it get a
                  fake success server-side. Off the tab order, hidden from AT. */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>
              <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-5">
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

              <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-5">
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

              <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-5">
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
                    "h-auto min-h-36 resize-none py-4 leading-relaxed",
                    errors.message && "border-error",
                  )}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message ? (
                  <p id="message-error" className="mt-1.5 text-xs text-error" role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <TurnstileField ref={turnstileRef} onToken={setTurnstileToken} />

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
              {/* Post-submit accelerator: the brief stays primary; hot leads can jump
                  straight to a scheduled intro call. */}
              {state.success && bookCall.url ? (
                <p className="text-center text-sm text-white/70">
                  {bookCall.successPrompt}{' '}
                  <a
                    href={bookCall.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange transition-colors hover-fine:hover:text-white"
                  >
                    {bookCall.label} <span aria-hidden>↗</span>
                  </a>
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Live studio clock (GST, UTC+4) — updates each minute; empty until mounted so
    server and client markup never disagree. */
function StudioTime() {
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
        className={cn(contactControlSingle, "w-full min-w-0", error && "border-error")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <p
        id={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1.5 min-h-4 text-xs leading-4",
          error ? "text-error" : "invisible",
        )}
        role={error ? "alert" : undefined}
      >
        {error || "\u00a0"}
      </p>
    </div>
  );
}
