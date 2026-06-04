import { Section, Heading, Text, Button, Img } from "@react-email/components";
import { EmailShell, EMAIL_COLORS as C, EMAIL_SERIF as SERIF } from "./components/shell";

/** Editorial content slots — vary each quarter. */
export type ProductionBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "img"; src: string; alt: string };

export interface ProductionUpdateProps {
  firstName: string;
  dispatchLabel: string; // "No. 02"
  title: string;
  heroImageUrl: string;
  bodyBlocks: ProductionBlock[];
  milestone: string;
  ctaUrl?: string;
  ctaLabel?: string;
  unsubscribeUrl: string;
  mailingAddress: string;
}

export const subject = (p: ProductionUpdateProps) => `From the set: ${p.title}`;

const para = { margin: "0 0 18px", fontFamily: SERIF, fontSize: 18, lineHeight: 1.72, color: C.ink };

export default function ProductionUpdate(p: ProductionUpdateProps) {
  return (
    <EmailShell
      preview={`Dispatch ${p.dispatchLabel} from production. ${p.title}.`}
      mastheadSubline={`Dispatch ${p.dispatchLabel} · from production`}
      unsubscribeUrl={p.unsubscribeUrl}
      mailingAddress={p.mailingAddress}
    >
      {/* hero image */}
      <Img
        src={p.heroImageUrl}
        width={600}
        height={320}
        alt="On set: The Silence Between Us"
        style={{ width: "100%", maxWidth: 600, height: 320, objectFit: "cover", backgroundColor: C.line, display: "block" }}
      />

      {/* headline */}
      <Section style={{ padding: "38px 48px 4px" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 15, fontStyle: "italic", color: C.muted }}>A note from the set, {p.firstName}</Text>
        <Heading as="h1" style={{ margin: "8px 0 0", fontFamily: SERIF, fontSize: 38, lineHeight: 1.1, letterSpacing: "-0.5px", fontWeight: 400, color: C.ink }}>
          {p.title}
        </Heading>
      </Section>

      {/* editorial body (dynamic blocks) */}
      <Section style={{ padding: "20px 48px 0" }}>
        {p.bodyBlocks.map((b, i) => {
          if (b.type === "h") {
            return (
              <Heading key={i} as="h2" style={{ margin: "24px 0 10px", fontFamily: SERIF, fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.3px", fontWeight: 400, color: C.ink }}>
                {b.text}
              </Heading>
            );
          }
          if (b.type === "img") {
            return (
              <Section key={i} style={{ padding: "0 0 6px" }}>
                <Img src={b.src} width={504} alt={b.alt} style={{ width: "100%", height: "auto", border: `1px solid ${C.line}`, display: "block" }} />
                <Text style={{ margin: "8px 0 14px", fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: C.muted, textAlign: "center" }}>{b.alt}</Text>
              </Section>
            );
          }
          return (
            <Text key={i} style={para}>
              {b.text}
            </Text>
          );
        })}
      </Section>

      {/* milestone */}
      <Section style={{ padding: "26px 48px 0" }}>
        <Section style={{ backgroundColor: C.tint, border: `1px solid ${C.line}` }}>
          <Section style={{ padding: "20px 24px" }}>
            <Text style={{ margin: "0 0 6px", fontFamily: SERIF, fontSize: 14, fontStyle: "italic", color: C.goldDeep }}>&#9670; Milestone</Text>
            <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 19, lineHeight: 1.5, color: C.ink }}>{p.milestone}</Text>
          </Section>
        </Section>
      </Section>

      {/* optional CTA */}
      {p.ctaUrl && p.ctaLabel ? (
        <Section style={{ padding: "30px 48px 6px", textAlign: "center" }}>
          <Button href={p.ctaUrl} style={{ backgroundColor: C.gold, border: `1px solid ${C.ink}`, borderRadius: 30, color: C.ink, fontFamily: SERIF, fontStyle: "italic", fontSize: 17, padding: "13px 32px", textDecoration: "none" }}>
            {p.ctaLabel} →
          </Button>
        </Section>
      ) : null}

      {/* sign-off */}
      <Section style={{ padding: "24px 48px 44px" }}>
        <Text style={{ margin: 0, fontFamily: SERIF, fontSize: 18, lineHeight: 1.6, color: C.ink }}>
          More soon, and thank you for making it possible.
          <br />
          <span style={{ fontStyle: "italic", color: C.muted, fontSize: 16 }}>Kevin &amp; the team</span>
        </Text>
      </Section>
    </EmailShell>
  );
}

ProductionUpdate.PreviewProps = {
  firstName: "Derrick",
  dispatchLabel: "No. 02",
  title: "Halfway through, and the story is finding its voice",
  heroImageUrl: "https://placehold.co/600x320/211d17/efe9da/png?text=On+Set",
  bodyBlocks: [
    {
      type: "p",
      text: "We wrapped our second block of shooting days this quarter, and I keep coming back to one thing. The young actors carrying this story are giving it everything they have. There is a scene we shot last week that I have already watched a dozen times.",
    },
    { type: "img", src: "https://placehold.co/504x300/3a352b/efe9da/png?text=Behind+the+Scenes", alt: "Rehearsing a classroom scene before the first take" },
    { type: "h", text: "Why this quarter mattered" },
    {
      type: "p",
      text: "Casting the final supporting roles took longer than we planned, and I am glad it did. The right faces make the silence in this film feel true, and your support is what let us hold out for them.",
    },
  ],
  milestone: "Principal photography is now more than halfway complete.",
  ctaUrl: "https://thesilencebetweenus.film/supporters",
  ctaLabel: "See the Founding Supporters wall",
  unsubscribeUrl: "https://thesilencebetweenus.film/unsubscribe?id=preview",
  mailingAddress: "PO Box 0000, Cleveland, OH 44101",
} satisfies ProductionUpdateProps;
