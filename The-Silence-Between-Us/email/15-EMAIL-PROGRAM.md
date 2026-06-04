# 15 · Email Program — Design → React Email (Resend)

Six email templates, designed in the warm-literary system, **email-safe** (table layout, inline
styles, **Georgia** fallback since web fonts don't load reliably in mail). This doc maps the HTML
mockups in this folder to the **React Email** deliverable your `email-plan.md` asked for, with a
**shared shell** so the look stays consistent.

> **Design = source of truth (these files). Mechanics = your stack.** Where a mockup and your wiring
> differ, keep the *look & copy* from the mockup and the *trigger/data* from your plan.

## The files (this folder)

| Mockup (HTML) | → React Email file | Type | Trigger |
|---|---|---|---|
| `Email - Supporter Confirmation.html` | `emails/supporter-confirmation.tsx` | transactional | webhook `payment_intent.succeeded` → supporter |
| `Email - Contact Auto-Reply.html` | `emails/contact-autoreply.tsx` | transactional | `/api/contact` 2nd send → submitter |
| `Email - Refund Confirmation.html` | `emails/refund-confirmation.tsx` | transactional | `charge.refunded` webhook → supporter |
| `Email - Internal New Contribution.html` | `emails/internal-new-contribution.tsx` | utility | same webhook → `CONTACT_TO_EMAIL` |
| `Email - Production Update.html` | `emails/production-update.tsx` | **broadcast** | Resend Broadcast over D1 audience |
| `Email - Trailer First-Look.html` | `emails/trailer-first-look.tsx` | **broadcast** | one-time Resend Broadcast |

`Email Program - The Silence Between Us.html` is just the **review gallery** (tabs over all six) —
not shipped; it's for you/Kevin to approve the designs.

---

## Build the shared shell first

Every template is **masthead + body + footer**. The masthead and footer are identical across the
four supporter-facing emails — extract them into one shell so you maintain the brand in one place.

`emails/components/shell.tsx`
```tsx
import {
  Html, Head, Preview, Body, Container, Section, Text, Link, Hr,
} from "@react-email/components";

const C = {
  shell: "#ece5d6", paper: "#f7f3ea", card: "#ffffff", tint: "#f1ebdd",
  ink: "#2c2620", inkSoft: "#5e564a", muted: "#9a8c6f",
  gold: "#f3c33b", goldDeep: "#b98a14", line: "#e3dccb",
  dark: "#211d17", onDark: "#efe9da", onDarkSoft: "#cfc4ac", onDarkMuted: "#b9ad93",
} as const;
const SERIF = "Newsreader, Georgia, 'Times New Roman', serif";

type ShellProps = {
  preview: string;
  children: React.ReactNode;
  /** broadcast emails pass these → renders unsubscribe + mailing address (CAN-SPAM) */
  unsubscribeUrl?: string;
  mailingAddress?: string;
  /** dark variant for the cinematic trailer email */
  variant?: "light" | "dark";
};

export function EmailShell({ preview, children, unsubscribeUrl, mailingAddress, variant = "light" }: ShellProps) {
  const onDarkBg = variant === "dark";
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: onDarkBg ? C.dark : C.shell, fontFamily: SERIF }}>
        <Container style={{ width: 600, maxWidth: "100%", backgroundColor: onDarkBg ? "#1b1813" : C.paper,
          border: `1px solid ${onDarkBg ? "#2c2a22" : C.line}`, margin: "28px auto" }}>
          {/* masthead */}
          <Section style={{ padding: "26px 40px", borderBottom: `1px solid ${onDarkBg ? "#2c2a22" : C.line}`, textAlign: "center" }}>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 14, letterSpacing: 3, textTransform: "uppercase",
              fontWeight: 500, color: onDarkBg ? C.onDark : C.ink }}>The Silence Between Us</Text>
          </Section>

          {children}

          {/* footer */}
          <Section style={{ backgroundColor: onDarkBg ? "#15140f" : C.dark, padding: "30px 40px" }}>
            <Text style={{ margin: "0 0 14px", fontFamily: SERIF, fontSize: 14, fontStyle: "italic", lineHeight: 1.55, color: C.onDarkSoft }}>
              If you or a teen you love is struggling, you are not alone. Call or text{" "}
              <Link href="tel:988" style={{ color: C.onDark }}>988</Link> — the Suicide &amp; Crisis Lifeline, free and confidential, 24/7.
            </Text>
            <Hr style={{ borderColor: "#2c2a22", margin: "14px 0" }} />
            {unsubscribeUrl && (
              <Text style={{ margin: "0 0 10px", fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: "#85806f" }}>
                You're receiving this as a Founding Supporter of The Silence Between Us.{" "}
                <Link href={unsubscribeUrl} style={{ color: "#a59d8c" }}>Unsubscribe</Link>
              </Text>
            )}
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 12, fontStyle: "italic", lineHeight: 1.5, color: "#6f6a5c" }}>
              The Silence Between Us · Take 3 Media · administered by KC Films &amp; Media
              {mailingAddress ? <> · {mailingAddress}</> : null}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const EMAIL_COLORS = C;
export const EMAIL_SERIF = SERIF;
```

> Export `C`/`SERIF` so every template styles from the same tokens. These hex values **are** the
> brand tokens from `app/globals.css`, hard-coded because email can't use CSS vars.

---

## Template contract (every file)

Each template: a typed `Props`, a default export, `PreviewProps` for the react-email dev server, and
an exported `subject`. Example — the one you've already approved:

`emails/supporter-confirmation.tsx`
```tsx
import { Section, Row, Column, Heading, Text, Button } from "@react-email/components";
import { EmailShell, EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";

export interface SupporterConfirmationProps {
  firstName: string;
  creditName: string;
  tierName: string;        // "Supporter" | "Partner" | "Patron"
  amountFormatted: string; // "$175.00"
  receiptRef: string;
  wallUrl: string;
}

export const subject = (p: SupporterConfirmationProps) =>
  `You're a Founding Supporter of The Silence Between Us`;

export default function SupporterConfirmation(p: SupporterConfirmationProps) {
  return (
    <EmailShell preview="Your name is already part of this film — here's what comes next.">
      {/* hero seal + heading + receipt chips + Kevin note + perks + "what happens next" + CTA.
          Port markup 1:1 from Email - Supporter Confirmation.html, swapping inline styles for the C tokens.
          Perks list is TIER-AWARE — render from content/tiers.ts by p.tierName, not hard-coded. */}
      <Section style={{ padding: "24px 48px" }}>
        <Button href={p.wallUrl}
          style={{ backgroundColor: C.gold, border: `1px solid ${C.ink}`, borderRadius: 30,
                   color: C.ink, fontFamily: SERIF, fontStyle: "italic", fontSize: 18, padding: "14px 34px" }}>
          See your name on the wall →
        </Button>
      </Section>
    </EmailShell>
  );
}

SupporterConfirmation.PreviewProps = {
  firstName: "Derrick", creditName: "The Smith Family", tierName: "Supporter",
  amountFormatted: "$175.00", receiptRef: "SBU-0042", wallUrl: "https://thesilencebetweenus.film/supporters",
} satisfies SupporterConfirmationProps;
```

Repeat for the other five. **Props per template** (names already in the mockups' top comments):

- **contact-autoreply:** `firstName, inquiryLabel, contactEmail, messageQuote?`
- **refund-confirmation:** `firstName, amountFormatted, refundRef, contactEmail`
- **internal-new-contribution:** `creditName, supporterName, tierName, amountFormatted, email, receiptRef, createdAt, fulfillmentNote` — *no shell footer 988/marketing; it's internal.* Either pass a flag to `EmailShell` to suppress the crisis line, or give this one its own minimal wrapper (recommended — see the mockup; it uses a dark header bar + plain data table, not the standard masthead).
- **production-update (broadcast):** `firstName, dispatchLabel, title, heroImageUrl, bodyBlocks, subhead, milestone, ctaUrl?, ctaLabel?, unsubscribeUrl, mailingAddress` → pass `unsubscribeUrl`+`mailingAddress` to `EmailShell`. `bodyBlocks` is dynamic editorial content — model it as an array of `{type:"p"|"h"|"img", ...}` and map over it.
- **trailer-first-look (broadcast):** `firstName, trailerUrl, thumbnailUrl, unsubscribeUrl, mailingAddress` → `EmailShell variant="dark"`.

---

## Sending (wiring map — your side)

```ts
// transactional (webhook / route)
import { render } from "@react-email/render";
import SupporterConfirmation, { subject } from "@/emails/supporter-confirmation";

await resend.emails.send({
  from: "The Silence Between Us <hello@thesilencebetweenus.film>", // TODO(sender): verified domain
  to: supporter.email,
  subject: subject(props),
  react: <SupporterConfirmation {...props} />,
  // Resend auto-generates text; or pass text: render(<SupporterConfirmation {...props}/>, { plainText: true })
});
```

- **supporter-confirmation** → in the webhook's `TODO(email)` block, after `recordSupporter()`.
- **internal-new-contribution** → same webhook, `to: process.env.CONTACT_TO_EMAIL`.
- **contact-autoreply** → `/api/contact`, the second send (to the submitter).
- **refund-confirmation** → add a `charge.refunded` branch to the webhook.
- **broadcasts** → Resend **Broadcasts** over the D1 supporter audience; these are the only two that
  need unsubscribe + mailing address.

---

## Open items to resolve before live sends

1. **`{{mailingAddress}}`** — a real physical address is **required** for the two broadcasts (CAN-SPAM).
2. **Sender addresses** — transactional `hello@` vs broadcast `updates@`/`kevin@` on the verified
   domain (your `decisions-for-kevin.md` §8.3).
3. **Stripe receipt vs ours** — these confirmations restate perks/next-steps; let Stripe send the
   itemized financial receipt (set `receipt_email`). Don't duplicate the line-item receipt here.
4. **Broadcast image URLs** — hero/inline/thumbnail must be absolute `https://` with alt text.
5. **Plain-text** — let Resend auto-generate, or render with `{ plainText: true }`. Required for
   deliverability.

That's the whole program. Subjects + preview text are in each mockup's top comment and in the review
gallery; the shell keeps all six visually consistent.
