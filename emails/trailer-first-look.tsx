import { Section, Heading, Text, Button, Img } from "@react-email/components";
import { EmailShell, EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";

export interface TrailerFirstLookProps {
  firstName: string;
  trailerUrl: string;
  thumbnailUrl: string;
  unsubscribeUrl: string;
  mailingAddress: string;
}

export const subject = (_p: TrailerFirstLookProps) => "Watch first: the trailer for The Silence Between Us";

export default function TrailerFirstLook(p: TrailerFirstLookProps) {
  return (
    <EmailShell
      variant="dark"
      preview={`As a Founding Supporter, ${p.firstName}, you see it before anyone else. Press play.`}
      unsubscribeUrl={p.unsubscribeUrl}
      mailingAddress={p.mailingAddress}
    >
      {/* intro */}
      <Section style={{ padding: "42px 48px 6px", textAlign: "center" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 16, fontStyle: "italic", color: C.onDarkMuted }}>For our Founding Supporters</Text>
        <Heading as="h1" style={{ margin: "10px 0 0", fontFamily: SERIF, fontSize: 40, lineHeight: 1.08, letterSpacing: "-0.5px", fontWeight: 400, color: "#ffffff" }}>
          You see it first, {p.firstName}.
        </Heading>
        <Text style={{ margin: "14px auto 0", maxWidth: 420, fontFamily: SERIF, fontSize: 18, lineHeight: 1.55, color: C.onDarkSoft }}>
          The first trailer for the film you&apos;re helping make, yours to watch before it goes public.
        </Text>
      </Section>

      {/* thumbnail (linked to the trailer) */}
      <Section style={{ padding: "30px 40px 0", textAlign: "center" }}>
        <a href={p.trailerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
          <Img
            src={p.thumbnailUrl}
            width={520}
            height={292}
            alt="Play the trailer for The Silence Between Us"
            style={{ width: "100%", maxWidth: 520, height: "auto", border: "1px solid #3a352b", backgroundColor: "#2a251d", display: "block", margin: "0 auto" }}
          />
        </a>
      </Section>

      {/* play button — the real affordance (never rely on the image) */}
      <Section style={{ padding: "18px 40px 0", textAlign: "center" }}>
        <Button href={p.trailerUrl} style={{ backgroundColor: C.gold, border: `1px solid ${C.gold}`, borderRadius: 30, color: C.dark, fontFamily: SERIF, fontStyle: "italic", fontSize: 18, padding: "14px 36px", textDecoration: "none" }}>
          &#9658;&nbsp; Watch the trailer
        </Button>
      </Section>

      {/* share line */}
      <Section style={{ padding: "28px 48px 44px", textAlign: "center" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 17, lineHeight: 1.6, color: C.onDarkSoft }}>
          If it moves you, share it. Every person who sees this story is one more who might need it, and one more who might help us finish it.
        </Text>
      </Section>
    </EmailShell>
  );
}

TrailerFirstLook.PreviewProps = {
  firstName: "Derrick",
  trailerUrl: "https://thesilencebetweenus.film/trailer",
  thumbnailUrl: "https://placehold.co/520x292/0d0b08/cfc4ac/png?text=Play+the+Trailer",
  unsubscribeUrl: "https://thesilencebetweenus.film/unsubscribe?id=preview",
  mailingAddress: "PO Box 0000, Cleveland, OH 44101",
} satisfies TrailerFirstLookProps;
