import { createElement } from "react";
import { Resend } from "resend";
import ContactAutoReply, { subject as autoReplySubject } from "@/emails/contact-autoreply";

// Resend SDK + reading secrets need the server runtime (workerd + nodejs_compat).
export const runtime = "nodejs";

type Body = {
  inquiry?: string;
  first?: string;
  last?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
};

// Inquiry id -> label for the subject line (mirrors the contact-form chips).
const INQUIRY_LABELS: Record<string, string> = {
  general: "General inquiry",
  "partner-patron": "Partner / Patron interest",
  press: "Press & media",
  partnership: "Partnership",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Cloudflare Turnstile token check via siteverify. Pass/fail (no score, unlike reCAPTCHA v3). */
async function verifyTurnstile(token: string, secret: string, remoteip?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (remoteip) form.set("remoteip", remoteip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      "error-codes"?: string[];
    };
    console.log("[contact] Turnstile verify:", {
      success: data.success,
      hostname: data.hostname,
      action: data.action,
      errors: data["error-codes"],
    });
    return Boolean(data.success);
  } catch (e) {
    console.error("[contact] Turnstile verify error:", e);
    return false;
  }
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const first = (body.first ?? "").trim();
  const last = (body.last ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const inquiry = body.inquiry ?? "general";

  // Server-side validation — never trust the client island.
  if (!first || !email || !message) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return Response.json({ error: "bad_email" }, { status: 400 });
  }
  if (message.length > 5000) {
    return Response.json({ error: "message_too_long" }, { status: 400 });
  }

  // Cloudflare Turnstile: verify before sending. Strict in production; in dev we log + allow
  // through so the contact flow stays testable even if the widget/secret isn't fully set up.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const remoteip = req.headers.get("CF-Connecting-IP") ?? undefined;
    const ok = await verifyTurnstile((body.turnstileToken ?? "").trim(), turnstileSecret, remoteip);
    if (!ok) {
      if (process.env.NODE_ENV === "production") {
        return Response.json({ error: "turnstile_failed" }, { status: 400 });
      }
      console.warn("[contact] Turnstile failed — allowing through (dev only)");
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL; // verified Resend sender (hello@…)
  // TODO(launch): CONTACT_TO_EMAIL is derrick@digitaldog.io while testing so delivery is
  // verifiable. Flip it to kevin@take3mediallc.com before go-live (final phase) — set it as
  // a Cloudflare secret in prod (and in .dev.vars for `pnpm preview`).
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("[contact] missing RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL");
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  const label = INQUIRY_LABELS[inquiry] ?? "General inquiry";
  const name = `${first} ${last}`.trim() || email;

  const resend = new Resend(apiKey);

  // 1) Team notification (critical — fail the request if this doesn't send).
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: email, // a reply goes straight to the sender
    subject: `[${label}] Message from ${name}`,
    text: `Inquiry: ${label}\nFrom: ${name} <${email}>\n\n${message}`,
  });
  if (error) {
    console.error("[contact] team notify error:", error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  // 2) Auto-reply to the submitter (best-effort — never fail the request on this).
  try {
    const autoReplyProps = {
      firstName: first,
      inquiryLabel: label,
      contactEmail: "kevin@take3mediallc.com",
      messageQuote: message,
    };
    await resend.emails.send({
      from,
      to: email,
      subject: autoReplySubject(autoReplyProps),
      react: createElement(ContactAutoReply, autoReplyProps),
    });
  } catch (e) {
    console.error("[contact] auto-reply failed:", e);
  }

  return Response.json({ ok: true, id: data?.id });
}
