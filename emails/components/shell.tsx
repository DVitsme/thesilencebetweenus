import { Html, Head, Preview, Body, Container, Section, Text, Link, Hr } from "@react-email/components";
import type { ReactNode } from "react";

/**
 * Shared brand shell for every email (masthead + footer). Hex values ARE the
 * brand tokens from app/globals.css, hard-coded because email can't use CSS vars.
 * Footer carries the 988 crisis line on every send; broadcasts pass `unsubscribeUrl`
 * + `mailingAddress` (CAN-SPAM); the cinematic trailer email uses `variant="dark"`.
 */
const C = {
  shell: "#ece5d6", paper: "#f7f3ea", card: "#ffffff", tint: "#f1ebdd",
  ink: "#2c2620", inkSoft: "#5e564a", muted: "#9a8c6f",
  gold: "#f3c33b", goldDeep: "#b98a14", line: "#e3dccb",
  dark: "#211d17", onDark: "#efe9da", onDarkSoft: "#cfc4ac", onDarkMuted: "#b9ad93",
} as const;
const SERIF = "Newsreader, Georgia, 'Times New Roman', serif";

type ShellProps = {
  preview: string;
  children: ReactNode;
  /** Broadcast emails pass these → renders unsubscribe (else a transactional note). */
  unsubscribeUrl?: string;
  mailingAddress?: string;
  /** Dark variant for the cinematic trailer email. */
  variant?: "light" | "dark";
  /** Optional second line under the wordmark (e.g. broadcast "Dispatch No. 02 · from production"). */
  mastheadSubline?: string;
};

export function EmailShell({ preview, children, unsubscribeUrl, mailingAddress, variant = "light", mastheadSubline }: ShellProps) {
  const onDarkBg = variant === "dark";
  const year = new Date().getFullYear();
  const tiny = { margin: "0 0 10px", fontFamily: SERIF, fontSize: 12, fontStyle: "italic" as const, color: "#6f6a5c" };

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: onDarkBg ? C.dark : C.shell, fontFamily: SERIF }}>
        <Container
          style={{
            width: 600, maxWidth: "100%", backgroundColor: onDarkBg ? "#1b1813" : C.paper,
            border: `1px solid ${onDarkBg ? "#2c2a22" : C.line}`, margin: "28px auto",
          }}
        >
          {/* masthead */}
          <Section style={{ padding: mastheadSubline ? "22px 40px" : "26px 40px", borderBottom: `1px solid ${onDarkBg ? "#2c2a22" : C.line}`, textAlign: "center" }}>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500, color: onDarkBg ? C.onDark : C.ink }}>
              The Silence Between Us
            </Text>
            {mastheadSubline ? (
              <Text style={{ margin: "4px 0 0", fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: onDarkBg ? C.onDarkMuted : C.muted }}>
                {mastheadSubline}
              </Text>
            ) : null}
          </Section>

          {children}

          {/* footer (always dark) */}
          <Section style={{ backgroundColor: onDarkBg ? "#15140f" : C.dark, padding: "30px 40px" }}>
            <Text style={{ margin: "0 0 14px", fontFamily: SERIF, fontSize: 14, fontStyle: "italic", lineHeight: 1.55, color: C.onDarkSoft }}>
              If you or a teen you love is struggling, you are not alone. Call or text{" "}
              <Link href="tel:988" style={{ color: C.onDark }}>988</Link>, the Suicide &amp; Crisis Lifeline. It&apos;s free, confidential, and available 24/7.
            </Text>
            <Hr style={{ borderColor: "#2c2a22", margin: "14px 0" }} />
            <Text style={{ margin: "0 0 10px", fontFamily: SERIF, fontSize: 13, fontStyle: "italic", lineHeight: 1.6, color: "#85806f" }}>
              The Silence Between Us · a Take 3 Media production · contributions administered by KC Films &amp; Media.<br />
              Questions? <Link href="mailto:kevin@take3mediallc.com" style={{ color: "#a59d8c" }}>kevin@take3mediallc.com</Link>
            </Text>
            {unsubscribeUrl ? (
              <Text style={tiny}>
                You&apos;re receiving this as a Founding Supporter of The Silence Between Us.{" "}
                <Link href={unsubscribeUrl} style={{ color: "#a59d8c" }}>Unsubscribe</Link>
              </Text>
            ) : (
              <Text style={tiny}>
                You&apos;re receiving this because you contributed to The Silence Between Us. This is a one-time transactional confirmation.
              </Text>
            )}
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 12, fontStyle: "italic", lineHeight: 1.5, color: "#6f6a5c" }}>
              {mailingAddress ? `${mailingAddress} · ` : ""}© {year} Take 3 Media
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const EMAIL_COLORS = C;
export const EMAIL_SERIF = SERIF;
