import { Section, Row, Column, Heading, Text } from "@react-email/components";
import { EmailShell, EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";

export interface RefundConfirmationProps {
  firstName: string;
  amountFormatted: string; // "$175.00"
  refundRef: string;
  contactEmail: string;
}

export const subject = (_p: RefundConfirmationProps) => "Your contribution has been refunded";

const eyebrow = { margin: 0, fontFamily: SERIF, fontSize: 16, fontStyle: "italic" as const, color: C.muted };
const para = { margin: "0 0 16px", fontFamily: SERIF, fontSize: 18, lineHeight: 1.7, color: C.ink };

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const cell = { padding: "16px 22px", fontFamily: SERIF, borderBottom: last ? "none" : `1px solid ${C.shell}` };
  return (
    <Row>
      <Column style={{ ...cell, fontSize: 16, fontStyle: "italic", color: C.muted }}>{label}</Column>
      <Column align="right" style={{ ...cell, fontSize: 16, color: C.ink }}>
        {value}
      </Column>
    </Row>
  );
}

export default function RefundConfirmation(p: RefundConfirmationProps) {
  return (
    <EmailShell preview={`We've refunded ${p.amountFormatted}. No hard feelings at all.`}>
      {/* hero */}
      <Section style={{ padding: "46px 48px 10px", textAlign: "center" }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: "0 auto 22px" }}>
          <tbody>
            <tr>
              <td
                align="center"
                valign="middle"
                width={64}
                height={64}
                style={{ width: 64, height: 64, backgroundColor: C.card, border: `1px solid ${C.ink}`, borderRadius: "50%", fontSize: 30, color: C.ink, fontFamily: "Georgia, serif" }}
              >
                &#8617;
              </td>
            </tr>
          </tbody>
        </table>
        <Text style={eyebrow}>Your refund is on its way</Text>
        <Heading as="h1" style={{ margin: "10px 0 0", fontFamily: SERIF, fontSize: 38, lineHeight: 1.08, letterSpacing: "-0.5px", fontWeight: 400, color: C.ink }}>
          All taken care of, {p.firstName}.
        </Heading>
      </Section>

      {/* refund detail block */}
      <Section style={{ padding: "24px 48px 6px" }}>
        <Section style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
          <DetailRow label="Amount refunded" value={p.amountFormatted} />
          <DetailRow label="Reference" value={p.refundRef} />
          <DetailRow label="Back to" value="Your original payment method" last />
        </Section>
      </Section>

      {/* body */}
      <Section style={{ padding: "24px 48px 6px" }}>
        <Text style={para}>
          We&apos;ve refunded your contribution in full. It should appear on your statement within{" "}
          <strong style={{ fontWeight: 500 }}>5 to 10 business days</strong>, depending on your bank.
        </Text>
        <Text style={{ ...para, margin: 0 }}>
          There are no hard feelings on our end, truly. The door stays open, and you&apos;re welcome back among the Founding Supporters any time you feel ready. Either way, thank you for caring about this story.
        </Text>
      </Section>

      {/* sign-off */}
      <Section style={{ padding: "26px 48px 44px" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 18, lineHeight: 1.6, color: C.ink }}>
          Questions about your refund? Just reply to this email, or write to{" "}
          <a href={`mailto:${p.contactEmail}`} style={{ color: C.goldDeep, textDecoration: "none", borderBottom: "1px solid #d8cba0" }}>
            {p.contactEmail}
          </a>
          , and we&apos;ll help you personally.
        </Text>
      </Section>
    </EmailShell>
  );
}

RefundConfirmation.PreviewProps = {
  firstName: "Derrick",
  amountFormatted: "$175.00",
  refundRef: "re_1ABcD2EfGhIjK",
  contactEmail: "kevin@kcfilmsmedia.com",
} satisfies RefundConfirmationProps;
