import { Resend } from "resend";

// Resend SDK + reading secrets need the server runtime (workerd + nodejs_compat).
export const runtime = "nodejs";

type Body = {
  inquiry?: string;
  first?: string;
  last?: string;
  email?: string;
  message?: string;
};

// Inquiry id -> label for the subject line (mirrors the contact-form chips).
const INQUIRY_LABELS: Record<string, string> = {
  general: "General inquiry",
  "partner-patron": "Partner / Patron interest",
  press: "Press & media",
  partnership: "Partnership",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // TODO(recaptcha): verify the Google reCAPTCHA token here before sending
  // (RECAPTCHA_SECRET_KEY is set) — next slice.

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
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: email, // a reply goes straight to the sender
    subject: `[${label}] Message from ${name}`,
    text: `Inquiry: ${label}\nFrom: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("[contact] resend error:", error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true, id: data?.id });
}
