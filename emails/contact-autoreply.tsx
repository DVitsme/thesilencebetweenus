import { Section, Heading, Text } from "@react-email/components";
import { EmailShell, EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";

export interface ContactAutoReplyProps {
  firstName: string;
  inquiryLabel: string;
  contactEmail: string;
  messageQuote?: string;
}

export const subject = (_p: ContactAutoReplyProps) => "We got your message";

const eyebrow = { margin: 0, fontFamily: SERIF, fontSize: 16, fontStyle: "italic" as const, color: C.muted };
const para = { margin: "0 0 16px", fontFamily: SERIF, fontSize: 18, lineHeight: 1.7, color: C.ink };

export default function ContactAutoReply(p: ContactAutoReplyProps) {
  return (
    <EmailShell preview={`Thanks, ${p.firstName}. We read every note and reply personally.`}>
      {/* hero */}
      <Section style={{ padding: "46px 48px 8px" }}>
        <Text style={eyebrow}>Your message is in good hands</Text>
        <Heading as="h1" style={{ margin: "10px 0 0", fontFamily: SERIF, fontSize: 40, lineHeight: 1.08, letterSpacing: "-0.5px", fontWeight: 400, color: C.ink }}>
          Thank you for reaching out, {p.firstName}.
        </Heading>
      </Section>

      {/* body */}
      <Section style={{ padding: "18px 48px 6px" }}>
        <Text style={para}>
          {" "}Your <strong style={{ fontWeight: 500 }}>{p.inquiryLabel}</strong> message reached us, and we don&apos;t take that lightly. We&apos;re a small team, and we read every note ourselves, so this isn&apos;t an automated dead end. A real person will write you back, usually within a few days.
        </Text>
        <Text style={{ ...para, margin: 0 }}>
          If it&apos;s time sensitive, you can reach us directly at{" "}
          <a href={`mailto:${p.contactEmail}`} style={{ color: C.goldDeep, textDecoration: "none", borderBottom: "1px solid #d8cba0" }}>
            {p.contactEmail}
          </a>
          . Either way, thank you for caring enough to write. It means more than you know.
        </Text>
      </Section>

      {/* optional: echo their message */}
      {p.messageQuote ? (
        <Section style={{ padding: "26px 48px 6px" }}>
          <Section style={{ backgroundColor: C.tint, border: `1px solid ${C.line}`, padding: "18px 22px" }}>
            <Text style={{ margin: "0 0 7px", fontFamily: SERIF, fontSize: 14, fontStyle: "italic", color: C.muted }}>Your message</Text>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 16, lineHeight: 1.6, color: C.inkSoft, fontStyle: "italic" }}>
              &ldquo;{p.messageQuote}&rdquo;
            </Text>
          </Section>
        </Section>
      ) : null}

      {/* sign-off */}
      <Section style={{ padding: "26px 48px 44px" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 18, lineHeight: 1.6, color: C.ink }}>
          With gratitude,
          <br />
          <span style={{ fontStyle: "italic", color: C.muted, fontSize: 16 }}>The team behind The Silence Between Us</span>
        </Text>
      </Section>
    </EmailShell>
  );
}

ContactAutoReply.PreviewProps = {
  firstName: "Derrick",
  inquiryLabel: "Partner / Patron interest ",
  contactEmail: "kevin@kcfilmsmedia.com",
  messageQuote:
    "Hi, I'd love to learn more about becoming a Patron and what the producer credit involves. Could we set up a quick call?",
} satisfies ContactAutoReplyProps;
