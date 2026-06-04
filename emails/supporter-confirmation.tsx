import type { ReactNode } from "react";
import { Section, Row, Column, Heading, Text, Button, Hr } from "@react-email/components";
import { EmailShell, EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";
import { TIERS } from "../content/tiers";

export interface SupporterConfirmationProps {
  firstName: string;
  creditName: string;
  tierName: string; // "Supporter" | "Partner" | "Patron" | "Founding Supporter"
  amountFormatted: string; // "$175.00"
  receiptRef: string;
  wallUrl: string;
}

export const subject = (_p: SupporterConfirmationProps) =>
  "You're a Founding Supporter of The Silence Between Us";

const eyebrow = { margin: 0, fontFamily: SERIF, fontSize: 16, fontStyle: "italic" as const, color: C.muted };

// Perks are tier-aware from the single source (content/tiers.ts); custom/unknown → Supporter set.
function perksFor(tierName: string): string[] {
  const t = TIERS.find((x) => x.name === tierName) ?? TIERS.find((x) => x.id === "supporter")!;
  return t.benefits.filter((b) => !b.muted && !/^everything in/i.test(b.text)).map((b) => b.text);
}

function NextStep({ when, last, children }: { when: string; last?: boolean; children: ReactNode }) {
  return (
    <Row style={{ marginBottom: last ? 0 : 14 }}>
      <Column style={{ width: 120, verticalAlign: "top", fontFamily: SERIF, fontSize: 15, fontStyle: "italic", color: C.goldDeep, paddingRight: 14 }}>
        {when}
      </Column>
      <Column style={{ verticalAlign: "top", fontFamily: SERIF, fontSize: 16, lineHeight: 1.5, color: C.ink }}>{children}</Column>
    </Row>
  );
}

export default function SupporterConfirmation(p: SupporterConfirmationProps) {
  let origin = "https://thesilencebetweenus.film";
  try {
    origin = new URL(p.wallUrl).origin;
  } catch {}
  const manageUrl = `${origin}/give?tier=partner`;
  const perks = perksFor(p.tierName);

  return (
    <EmailShell preview={`Thank you, ${p.firstName} — your name is now part of The Silence Between Us.`}>
      {/* hero */}
      <Section style={{ padding: "48px 48px 12px", textAlign: "center" }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: "0 auto 24px" }}>
          <tbody>
            <tr>
              <td
                align="center"
                valign="middle"
                width={68}
                height={68}
                style={{ width: 68, height: 68, backgroundColor: C.gold, border: `1px solid ${C.ink}`, borderRadius: "50%", fontSize: 32, color: C.ink, fontFamily: "Georgia, serif" }}
              >
                &#10003;
              </td>
            </tr>
          </tbody>
        </table>
        <Text style={eyebrow}>Your contribution is received</Text>
        <Heading as="h1" style={{ margin: "10px 0 0", fontFamily: SERIF, fontSize: 42, lineHeight: 1.07, letterSpacing: "-0.5px", fontWeight: 400, color: C.ink }}>
          Thank you, {p.firstName}.<br />
          You&apos;re a Founding Supporter.
        </Heading>
        <Text style={{ margin: "16px auto 0", maxWidth: 430, fontFamily: SERIF, fontSize: 18, lineHeight: 1.55, color: C.inkSoft }}>
          You&apos;ve helped give a silent story a voice — and your name is already part of this film.
        </Text>
      </Section>

      {/* receipt chips */}
      <Section style={{ padding: "24px 40px 4px", textAlign: "center" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 14, fontStyle: "italic", color: C.inkSoft }}>
          Receipt <strong style={{ fontStyle: "normal", fontWeight: 500 }}>#{p.receiptRef}</strong>
          <span style={{ color: C.muted }}> &#9670; </span>
          {p.tierName}
          <span style={{ color: C.muted }}> &#9670; </span>
          {p.amountFormatted}
        </Text>
        <Text style={{ margin: "6px 0 0", fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: C.muted }}>
          Paid securely via Stripe · your full receipt is sent separately.
        </Text>
      </Section>

      <Section style={{ padding: "30px 48px 0" }}>
        <Hr style={{ borderColor: C.line, margin: 0 }} />
      </Section>

      {/* a word from Kevin */}
      <Section style={{ padding: "34px 48px 8px" }}>
        <Text style={{ ...eyebrow, marginBottom: 10 }}>A word from the director</Text>
        <Text style={{ margin: "0 0 16px", fontFamily: SERIF, fontSize: 19, lineHeight: 1.7, color: C.ink }}>
          {p.firstName}, I don&apos;t take this lightly. These teenagers — the ones this film is for — deserve to be seen, heard, and understood, and today you helped make sure they will be.
        </Text>
        <Text style={{ margin: "0 0 16px", fontFamily: SERIF, fontSize: 19, lineHeight: 1.7, color: C.ink }}>
          When you back a film like this, you aren&apos;t a bystander to it — you&apos;re part of how it gets made. Thank you for standing with this story. I&apos;ll make sure it&apos;s worthy of your trust.
        </Text>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 19, lineHeight: 1.5, color: C.ink }}>
          — Kevin Cameron
          <br />
          <span style={{ fontSize: 15, fontStyle: "italic", color: C.muted }}>Writer &amp; director, The Silence Between Us</span>
        </Text>
      </Section>

      {/* what you've unlocked */}
      <Section style={{ padding: "30px 48px 6px" }}>
        <Text style={{ ...eyebrow, marginBottom: 14 }}>What you&apos;ve unlocked</Text>
        {perks.map((text, i) => (
          <Row key={i} style={{ marginBottom: i === perks.length - 1 ? 0 : 12 }}>
            <Column style={{ width: 22, verticalAlign: "top", fontFamily: SERIF, fontSize: 16, color: C.goldDeep }}>&#9670;</Column>
            <Column style={{ verticalAlign: "top", fontFamily: SERIF, fontSize: 17, lineHeight: 1.45, color: C.ink }}>{text}</Column>
          </Row>
        ))}
      </Section>

      {/* what happens next */}
      <Section style={{ padding: "30px 48px 6px" }}>
        <Text style={{ ...eyebrow, marginBottom: 14 }}>What happens next</Text>
        <NextStep when="Right now">
          Your name joins the Founding Supporters wall — listed as <strong style={{ fontWeight: 500 }}>{p.creditName}</strong>.
        </NextStep>
        <NextStep when="This week">We&apos;ll email you to schedule your virtual meet &amp; greet.</NextStep>
        <NextStep when="Each quarter">Production updates land in your inbox.</NextStep>
        <NextStep when="Before release" last>
          Your first look at the trailer, ahead of everyone else.
        </NextStep>
      </Section>

      {/* CTA */}
      <Section style={{ padding: "34px 48px 6px", textAlign: "center" }}>
        <Button
          href={p.wallUrl}
          style={{ backgroundColor: C.gold, border: `1px solid ${C.ink}`, borderRadius: 30, color: C.ink, fontFamily: SERIF, fontStyle: "italic", fontSize: 18, padding: "14px 34px", textDecoration: "none" }}
        >
          See your name on the wall →
        </Button>
      </Section>

      {/* gentle upgrade nudge */}
      <Section style={{ padding: "14px 48px 44px", textAlign: "center" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 15, fontStyle: "italic", lineHeight: 1.5, color: C.muted }}>
          Felt led to do more? You can{" "}
          <a href={manageUrl} style={{ color: C.goldDeep, textDecoration: "none", borderBottom: "1px solid #d8cba0" }}>become a Partner or Patron</a>{" "}
          any time.
        </Text>
      </Section>
    </EmailShell>
  );
}

SupporterConfirmation.PreviewProps = {
  firstName: "Derrick",
  creditName: "The Smith Family",
  tierName: "Supporter",
  amountFormatted: "$175.00",
  receiptRef: "SBU-0042",
  wallUrl: "https://thesilencebetweenus.film/supporters",
} satisfies SupporterConfirmationProps;
