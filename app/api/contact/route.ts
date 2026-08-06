import { createElement } from "react";
import { Resend } from "resend";
import ContactAutoReply, { subject as autoReplySubject } from "@/emails/contact-autoreply";
import { SITE_URL } from "@/lib/site";

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

/**
 * Hostnames a Turnstile token may legitimately have been solved on.
 *
 * siteverify reports the hostname of the page that solved the challenge. The widget's domain list
 * also allows localhost/127.0.0.1 so local dev can exercise real verification — which means
 * production must reject tokens minted there. The sitekey is public, so without this check anyone
 * could serve a page on their own localhost, solve the challenge, and replay the token against
 * production. Derived from SITE_URL so it follows the domain instead of drifting from it.
 */
const PROD_HOSTNAMES: ReadonlySet<string> = (() => {
  const host = new URL(SITE_URL).hostname;
  const bare = host.startsWith("www.") ? host.slice(4) : host;
  return new Set([bare, `www.${bare}`]);
})();
const DEV_HOSTNAMES: ReadonlySet<string> = new Set(["localhost", "127.0.0.1"]);

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
    // Non-2xx means we never got a verdict. Throw into the catch below so we fail closed
    // rather than reading `success` off an error body (which would be undefined anyway).
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
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
    if (!data.success) return false;

    // Bind the token to a hostname we actually serve. In dev the localhost pair is allowed too.
    const allowed =
      process.env.NODE_ENV === "production"
        ? PROD_HOSTNAMES
        : new Set([...PROD_HOSTNAMES, ...DEV_HOSTNAMES]);
    if (!data.hostname || !allowed.has(data.hostname)) {
      console.warn("[contact] Turnstile hostname rejected:", data.hostname);
      return false;
    }
    return true;
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
  const isProd = process.env.NODE_ENV === "production";
  if (!turnstileSecret) {
    // Fail closed. A missing secret in production used to skip verification entirely, which
    // silently dropped all bot protection on a live form. Refuse instead of accepting unverified mail.
    if (isProd) {
      console.error("[contact] TURNSTILE_SECRET_KEY is not set — refusing unverified submissions");
      return Response.json({ error: "not_configured" }, { status: 500 });
    }
    console.warn("[contact] TURNSTILE_SECRET_KEY unset — skipping verification (dev only)");
  } else {
    const remoteip = req.headers.get("CF-Connecting-IP") ?? undefined;
    const ok = await verifyTurnstile((body.turnstileToken ?? "").trim(), turnstileSecret, remoteip);
    if (!ok) {
      if (isProd) {
        return Response.json({ error: "turnstile_failed" }, { status: 400 });
      }
      console.warn("[contact] Turnstile failed — allowing through (dev only)");
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL; // verified Resend sender address
  // CONTACT_TO_EMAIL is Kevin's inbox (kevin@kcfilmsmedia.com), set as a Cloudflare Worker secret.
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !fromEmail || !to) {
    console.error("[contact] missing RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL");
    return Response.json({ error: "not_configured" }, { status: 500 });
  }
  // Named sender ("The Silence Between Us <…>") — matches the webhook emails (lib/email/notify)
  // and reads as a recognizable brand, which helps inbox placement and trust.
  const from = `The Silence Between Us <${fromEmail}>`;

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
