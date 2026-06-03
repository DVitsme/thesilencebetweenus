# 11 · Contact Page (`/contact`)

Reference mockup: **`Contact - The Silence Between Us.html`** → `app/contact/page.tsx`.

## Layout

Two columns: a **contact form** (left) + **direct details** (right). Inquiry-type chips
(General / Partner-Patron interest / Press / Partnership) select a category. Right column: email,
phone, production location, socials, and the KC Films administration note.

## Components

- **Client island:** `components/site/contact/contact-form.tsx` ("use client") — chip selection +
  field state + submit. Everything else (the aside, details) is server.
- Reuse `Eyebrow`, `SectionHeading`, `Rule`, buttons; brand tokens.

## Submission — wire to your stack (locked: Resend + reCAPTCHA)

The mockup form is front-end only. In the app:
- Submit via a **Server Action** (or `POST /api/contact`).
- **Spam:** gate with reCAPTCHA (your stack lists it) — verify the token server-side before sending.
- **Delivery:** send the message with **Resend** to `kevin@kcfilmsmedia.com`. Include the chosen
  inquiry category in the subject.
- Mark all three as `TODO(contact-wiring)`; the **design is done**, the plumbing is theirs.
- Success/error states: show an inline confirmation in the warm style (don't navigate away).

## Real details (from source — confirm before publishing)

- **Email:** `kevin@kcfilmsmedia.com`
- **Phone:** `216-308-4427` — ⚠️ this came from the original form's **Zelle** number. Confirm it's
  OK to publish as a public phone line, or replace. `TODO(contact-confirm)`.
- **Production:** Take 3 Media · Cleveland, Ohio (the persona also says Kevin is now Tampa-based —
  decide which location to show).
- **Admin note:** "Donations administered by KC Films & Media."

## Mechanics

- `metadata`: `title: "Contact"`.
- `pnpm build` passes; chips toggle; form validates client-side; submit path stubbed with a clear
  TODO and a working success state.
