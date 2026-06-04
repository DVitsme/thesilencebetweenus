import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LegalSmall,
  LegalCallout,
  LegalLink,
} from "@/components/site/legal/legal-layout";
import { TIERS } from "@/content/tiers";

export const metadata: Metadata = { title: "Contribution Terms" };

const UPDATED = "June 3, 2026";

// Render the Tier 1 amount + benefits from the single source so this page can never drift
// from the home tiers / the /give checkout (handoff doc 14).
const supporter = TIERS.find((t) => t.id === "supporter")!;

const TOC = [
  { id: "nature", label: "Nature of a contribution" },
  { id: "tax", label: "Tax treatment" },
  { id: "tiers", label: "Tiers & benefits" },
  { id: "fulfillment", label: "Fulfillment of benefits" },
  { id: "payment", label: "Payment & processing" },
  { id: "refunds", label: "Refunds & cancellations" },
  { id: "funds", label: "Use of funds" },
  { id: "recognition", label: "Recognition & credits" },
  { id: "noguarantee", label: "No guarantee of release" },
  { id: "changes", label: "Changes to these terms" },
  { id: "contact", label: "Contact us" },
];

export default function ContributionsPage() {
  return (
    <LegalLayout
      title="Contribution Terms"
      updated={UPDATED}
      current="contributions"
      toc={TOC}
      reviewedBy="qualified legal and tax counsel"
      intro={
        <>
          Thank you for supporting <em>The Silence Between Us</em>. These Contribution Terms describe
          what your contribution is, the benefits it includes, and how payments, fulfillment, and
          refunds work.
        </>
      }
    >
      <LegalSection id="nature" title="Nature of a contribution">
        <p>
          A contribution is a financial gift made to support the production of the film. It is not an
          investment, a purchase of equity, a loan, or a security. You will not receive any ownership
          interest, profit share, or financial return. The benefits you receive are tokens of
          appreciation, as described below.
        </p>
      </LegalSection>

      <LegalSection id="tax" title="Tax treatment">
        <LegalCallout>
          Contributions are administered by KC Films &amp; Media, the parent company of Take 3 Media.
          Because the film is produced by a for-profit company, contributions are not tax-deductible
          as charitable donations, and we do not provide charitable tax receipts. Tax treatment can
          depend on your circumstances, and we do not provide tax advice, so please consult your own
          tax advisor.
        </LegalCallout>
        <p>
          We will provide a written acknowledgment of your contribution by email for your records.
        </p>
      </LegalSection>

      <LegalSection id="tiers" title="Tiers & benefits">
        <p>
          The current Tier 1 Supporter contribution is <strong>{supporter.amountLabel}</strong> and
          includes:
        </p>
        <ul>
          {supporter.benefits.map((b) => (
            <li key={b.text}>{b.text}</li>
          ))}
        </ul>
        <LegalSmall>
          Partner and Patron tiers, and the option to give any amount, may include additional or
          different benefits, which will be described at the point of contribution.
        </LegalSmall>
      </LegalSection>

      <LegalSection id="fulfillment" title="Fulfillment of benefits">
        <p>
          We will make commercially reasonable efforts to deliver each benefit. Some benefits depend
          on the film’s production schedule. For example, credits appear in the finished film, and
          the trailer preview occurs before public release. Timing of meet &amp; greet sessions and
          updates will be communicated by email.
        </p>
      </LegalSection>

      <LegalSection id="payment" title="Payment & processing">
        <p>
          Payments are processed securely by Stripe, Inc. Contributions are one-time, and by
          contributing you authorize the charge for the amount you select. You are responsible for
          providing accurate payment information.
        </p>
      </LegalSection>

      <LegalSection id="refunds" title="Refunds & cancellations">
        <p>
          Because contributions fund production work that begins promptly, contributions are
          generally non-refundable once benefits have begun to be fulfilled. If you believe a
          contribution was made in error, contact us within 14 days and we will review your request
          in good faith.
        </p>
      </LegalSection>

      <LegalSection id="funds" title="Use of funds">
        <p>
          Contributions support the development, production, and completion of the film, which may
          include writing, casting, crew, equipment, locations, post-production, and related costs.
          We retain discretion over how funds are allocated to bring the project to life.
        </p>
      </LegalSection>

      <LegalSection id="recognition" title="Recognition & credits">
        <p>
          You may choose how your name appears in credits and on the Founding Supporters page. We
          reserve the right to decline or edit any name or listing that is unlawful, offensive, or
          impractical to display. Recognition is provided as described and is not a guarantee of
          placement, size, or prominence.
        </p>
      </LegalSection>

      <LegalSection id="noguarantee" title="No guarantee of release">
        <p>
          Filmmaking is creative and uncertain. While we are committed to completing and releasing
          the film, we cannot guarantee a specific completion date, festival selection, distribution,
          or release. Your contribution supports the effort regardless of outcome.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these Contribution Terms from time to time. The “Last updated” date above
          reflects the most recent revision. Contributions are governed by the terms in effect at the
          time they are made.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions about your contribution? Email{" "}
          <LegalLink href="mailto:kevin@kcfilmsmedia.com">kevin@kcfilmsmedia.com</LegalLink> or use
          our <LegalLink href="/contact">contact page</LegalLink>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
