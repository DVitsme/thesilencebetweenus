import type { ReactNode } from "react";
import { Html, Head, Preview, Body, Container, Section, Row, Column, Text } from "@react-email/components";
import { EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";

/**
 * INTERNAL utility email to the team (CONTACT_TO_EMAIL) on payment_intent.succeeded.
 * Deliberately plain & scannable — its own minimal wrapper, NOT the supporter shell
 * (no 988 crisis line, no marketing footer).
 */
const MONO = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";

export interface InternalNewContributionProps {
  creditName: string;
  supporterName: string;
  tierName: string;
  amountFormatted: string;
  email: string;
  receiptRef: string;
  createdAt: string;
  fulfillmentNote?: string;
}

export const subject = (p: InternalNewContributionProps) =>
  `New ${p.tierName} contribution: ${p.amountFormatted} (${p.creditName})`;

function DataRow({ label, value, mono, last }: { label: string; value: ReactNode; mono?: boolean; last?: boolean }) {
  const border = last ? "none" : `1px solid ${C.shell}`;
  return (
    <Row>
      <Column style={{ width: 170, padding: "13px 18px", fontFamily: SERIF, fontSize: 15, fontStyle: "italic", color: C.muted, backgroundColor: C.paper, borderBottom: border, verticalAlign: "top" }}>
        {label}
      </Column>
      <Column style={{ padding: "13px 18px", fontFamily: mono ? MONO : SERIF, fontSize: mono ? 14 : 16, color: C.ink, borderBottom: border, verticalAlign: "top" }}>
        {value}
      </Column>
    </Row>
  );
}

export default function InternalNewContribution(p: InternalNewContributionProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${p.tierName} · ${p.amountFormatted} from ${p.creditName}. Details inside.`}</Preview>
      <Body style={{ margin: 0, backgroundColor: C.shell, fontFamily: SERIF }}>
        <Container style={{ width: 600, maxWidth: "100%", backgroundColor: C.card, border: `1px solid ${C.line}`, margin: "24px auto" }}>
          {/* header bar */}
          <Section style={{ padding: "18px 30px", backgroundColor: C.dark }}>
            <Row>
              <Column style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: C.onDarkMuted }}>
                Internal · New contribution
              </Column>
              <Column align="right" style={{ fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: C.onDarkMuted }}>
                {p.createdAt}
              </Column>
            </Row>
          </Section>

          {/* headline number */}
          <Section style={{ padding: "28px 30px 6px" }}>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 15, fontStyle: "italic", color: C.muted }}>{p.tierName} contribution</Text>
            <Text style={{ margin: "4px 0 0", fontFamily: SERIF, fontSize: 42, lineHeight: 1, color: C.ink }}>{p.amountFormatted}</Text>
          </Section>

          {/* data block */}
          <Section style={{ padding: "18px 30px 6px" }}>
            <Section style={{ border: `1px solid ${C.line}` }}>
              <DataRow label="Credit name" value={p.creditName} />
              <DataRow label="Full name" value={p.supporterName} />
              <DataRow label="Tier" value={p.tierName} />
              <DataRow
                label="Email"
                mono
                value={<a href={`mailto:${p.email}`} style={{ color: C.goldDeep, textDecoration: "none" }}>{p.email}</a>}
              />
              <DataRow label="Receipt ref" mono value={p.receiptRef} last />
            </Section>
          </Section>

          {/* fulfillment / action needed (omit when none) */}
          {p.fulfillmentNote ? (
            <Section style={{ padding: "18px 30px 8px" }}>
              <Section style={{ backgroundColor: "#fbf3d4", border: "1px solid #e7cf73" }}>
                <Text style={{ margin: 0, padding: "14px 18px", fontFamily: SERIF, fontSize: 15, lineHeight: 1.5, color: "#7a6a2e" }}>
                  <strong style={{ fontWeight: 500 }}>Fulfillment:</strong> {p.fulfillmentNote}
                </Text>
              </Section>
            </Section>
          ) : null}

          {/* footer note */}
          <Section style={{ padding: "16px 30px 26px" }}>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: C.muted }}>
              Recorded to the supporters table · added to the Founding Supporters wall automatically.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

InternalNewContribution.PreviewProps = {
  creditName: "The Smith Family",
  supporterName: "Derrick Smith",
  tierName: "Supporter",
  amountFormatted: "$175.00",
  email: "derrick@digitaldog.io",
  receiptRef: "pi_3Tebn2985moQhXCT1aozWxJC",
  createdAt: "Jun 4, 2026 · 1:02 PM",
  fulfillmentNote: "Schedule the virtual meet & greet within the week; confirm the on-screen credit name.",
} satisfies InternalNewContributionProps;
