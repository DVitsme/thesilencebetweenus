"use client";

import { useState } from "react";
import Script from "next/script";
import { Check } from "lucide-react";

// reCAPTCHA v3 site key (public). The matching secret verifies the token in /api/contact.
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

/** Run reCAPTCHA v3 for the "contact" action; returns a token ("" if unavailable). */
async function getRecaptchaToken(): Promise<string> {
  const grecaptcha = typeof window !== "undefined" ? window.grecaptcha : undefined;
  if (!RECAPTCHA_SITE_KEY || !grecaptcha) return "";
  try {
    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact" }).then(resolve, reject);
      });
    });
  } catch {
    return "";
  }
}

const INQUIRIES = [
  { id: "general", label: "General inquiry" },
  { id: "partner-patron", label: "Partner / Patron interest" },
  { id: "press", label: "Press & media" },
  { id: "partnership", label: "Partnership" },
] as const;

type InquiryId = (typeof INQUIRIES)[number]["id"];

const FIELD =
  "w-full rounded-[5px] border border-line bg-card-paper px-[15px] py-[13px] font-serif text-[17px] text-ink placeholder:text-[#bcae93] placeholder:italic";

const LABEL = "text-muted-warm mb-[7px] block font-serif text-[16px] italic";

export function ContactForm() {
  const [inquiry, setInquiry] = useState<InquiryId>("general");
  const [form, setForm] = useState({ first: "", last: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setForm({ first: "", last: "", email: "", message: "" });
    setInquiry("general");
    setError(null);
    setSent(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.first.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please add your first name, email, and a short message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("That email address doesn't look right. Mind double-checking it?");
      return;
    }

    setSending(true);
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ inquiry, ...form, recaptchaToken }),
      });
      if (!res.ok) throw new Error("send_failed");
      setSent(true);
    } catch {
      setError(
        "Something went wrong sending your message. Please email us directly at kevin@take3mediallc.com.",
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border-line bg-card-paper rounded-[8px] border px-7 py-10 text-center">
        <span className="bg-gold text-ink mx-auto mb-5 flex size-12 items-center justify-center rounded-full">
          <Check size={24} strokeWidth={2.5} aria-hidden />
        </span>
        <h2 className="font-serif text-[27px] tracking-[-0.2px]">
          Thank you — your message is on its way.
        </h2>
        <p className="text-ink-soft mx-auto mt-3 max-w-[420px] font-serif text-[17px] leading-[1.6]">
          We read every note and reply ourselves. You&apos;ll hear back personally from Kevin&apos;s
          team at{" "}
          <a href="mailto:kevin@take3mediallc.com" className="border-muted-warm border-b">
            kevin@take3mediallc.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="border-ink hover:bg-ink hover:text-paper mt-6 inline-flex items-center gap-2 rounded-full border px-6 py-2.5 font-serif text-[16px] italic transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  const chip = (active: boolean) =>
    `cursor-pointer rounded-full border px-4 py-2 font-serif text-[15px] italic transition-colors ${
      active
        ? "border-ink bg-gold text-ink"
        : "border-line bg-card-paper text-ink-soft hover:border-muted-warm"
    }`;

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <form onSubmit={onSubmit} noValidate>
      <div className="mb-5">
        <span className={LABEL}>What&apos;s this about?</span>
        <div className="flex flex-wrap gap-2.5">
          {INQUIRIES.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setInquiry(i.id)}
              aria-pressed={inquiry === i.id}
              className={chip(inquiry === i.id)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <div>
          <label htmlFor="first" className={LABEL}>
            First name
          </label>
          <input
            id="first"
            type="text"
            value={form.first}
            onChange={(e) => update("first", e.target.value)}
            placeholder="Your first name"
            autoComplete="given-name"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="last" className={LABEL}>
            Last name
          </label>
          <input
            id="last"
            type="text"
            value={form.last}
            onChange={(e) => update("last", e.target.value)}
            placeholder="Your last name"
            autoComplete="family-name"
            className={FIELD}
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="email" className={LABEL}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          className={FIELD}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="msg" className={LABEL}>
          Your message
        </label>
        <textarea
          id="msg"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us how we can help…"
          className={`${FIELD} min-h-[140px] resize-y leading-[1.5]`}
        />
      </div>

      {error && (
        <p role="alert" className="text-destructive mb-4 font-serif text-[15px] italic">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="border-ink bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep inline-flex items-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors hover:text-white disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send message →"}
      </button>
      <p className="text-muted-warm mt-3.5 font-serif text-[14px] italic">
        We read every note and reply ourselves. Your details are never shared.
      </p>
      {RECAPTCHA_SITE_KEY && (
        <p className="text-muted-warm mt-2 font-serif text-[12.5px]">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="border-muted-warm border-b"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="border-muted-warm border-b"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      )}
    </form>
    </>
  );
}
