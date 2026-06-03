# Transactional Email Copy (Resend) — *The Silence Between Us*

Same register: serious, warm, sincere — no catchphrases. `{tokens}` = dynamic values.
Sender: `CONTACT_FROM_EMAIL` (e.g. "The Silence Between Us <support@thesilencebetweenus.com>").
These are **transactional** (triggered by an action), not marketing.

---

## 1 · Supporter confirmation
*Trigger: Stripe webhook `checkout.session.completed` (payment confirmed). The human thank-you;
Stripe's own receipt covers the financial record.*

- **To:** the supporter's email (from Checkout)
- **Subject:** Thank you for backing *The Silence Between Us*
- **Preheader:** Your support is helping put this story on the screen.
- **Body:**

  Hi {firstName},

  Thank you for backing *The Silence Between Us*. Your contribution of **{amount}** as a
  **{tierName}** is now confirmed — and it matters more than you know.

  This film tells the story of the anxiety and depression so many teenagers carry in silence, and
  the fear that keeps them from reaching the people who love them. Your support helps us tell it with
  the honesty and care these young people deserve.

  **What happens next:**
  - We'll send you updates straight from the set, every quarter.
  - {perksLine — e.g. "We'll be in touch to arrange your virtual meet & greet and confirm how your name appears in the credits."}
  - You'll get the first look at the trailer before anyone else.

  A separate payment receipt is on its way for your records.

  With gratitude,
  **Kevin Cameron**
  Writer & Director, *The Silence Between Us*

- **Footer:** Questions? Just reply to this email or reach us at kevin@kcfilmsmedia.com ·
  *The Silence Between Us* is an independent film; contributions are not tax-deductible. ·
  If you or someone you know is struggling, call or text **988** (US & Canada), 24/7.

---

## 2 · Contact form — notification to Kevin
*Trigger: `/api/contact` submit. Reply-To set to the sender so Kevin can reply directly.*

- **To:** `CONTACT_TO_EMAIL` (kevin@kcfilmsmedia.com)
- **Reply-To:** {senderEmail}
- **Subject:** New message ({reason}) — {senderName}
- **Body:**

  New contact-form submission:

  - **Name:** {senderName}
  - **Email:** {senderEmail}
  - **Reason:** {reason}
  - **Sent:** {timestamp}

  **Message:**
  {message}

---

## 3 · Contact form — auto-reply to sender
*Trigger: same submit. Confirms receipt.*

- **To:** {senderEmail}
- **Subject:** We received your message — *The Silence Between Us*
- **Body:**

  Hi {senderName},

  Thanks for reaching out about *The Silence Between Us*. Your message came through, and we'll get
  back to you as soon as we can.

  Warmly,
  The *Silence Between Us* team

- **Footer:** This is an automated confirmation — but a real person will reply. For anything urgent,
  email kevin@kcfilmsmedia.com.

---

## Notes for build
- Build emails as React Email components (works cleanly with Resend) so they're styled and consistent.
- Keep the supporter confirmation idempotent — send once per `checkout.session.completed`, keyed off
  the session/payment id (webhooks can retry).
- `{perksLine}` should be derived from the tier (or omitted for custom amounts below the lowest tier).
- Plain-text fallbacks for all three.
