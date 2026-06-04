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
  recaptchaToken?: string;
};

// Inquiry id -> label for the subject line (mirrors the contact-form chips).
const INQUIRY_LABELS: Record<string, string> = {
  general: "General inquiry",
  "partner-patron": "Partner / Patron interest",
  press: "Press & media",
  partnership: "Partnership",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** reCAPTCHA v3 token check via Google siteverify. Requires success + score >= 0.5. */
async function verifyRecaptcha(token: string, secret: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      hostname?: string;
      "error-codes"?: string[];
    };
    console.log("[contact] reCAPTCHA verify:", {
      success: data.success,
      score: data.score,
      hostname: data.hostname,
      errors: data["error-codes"],
    });
    return Boolean(data.success) && (data.score ?? 0) >= 0.5;
  } catch (e) {
    console.error("[contact] reCAPTCHA verify error:", e);
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

  // reCAPTCHA v3: verify before sending. Strict in production; in dev we log + allow
  // through so the contact flow stays testable even if localhost isn't registered for
  // the site key.
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    const ok = await verifyRecaptcha((body.recaptchaToken ?? "").trim(), recaptchaSecret);
    if (!ok) {
      if (process.env.NODE_ENV === "production") {
        return Response.json({ error: "recaptcha_failed" }, { status: 400 });
      }
      console.warn("[contact] reCAPTCHA failed — allowing through (dev only)");
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL; // verified Resend sender (hello@…)
  // TODO(launch): CONTACT_TO_EMAIL is derrick@digitaldog.io while testing so delivery is
  // verifiable. Flip it to kevin@kcfilmsmedia.com before go-live (final phase) — set it as
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
      contactEmail: "kevin@kcfilmsmedia.com",
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
