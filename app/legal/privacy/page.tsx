import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LegalSmall,
  LegalLink,
} from "@/components/site/legal/legal-layout";

export const metadata: Metadata = { title: "Privacy Policy" };

const UPDATED = "June 3, 2026";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "collect", label: "Information we collect" },
  { id: "use", label: "How we use information" },
  { id: "payments", label: "Payment processing" },
  { id: "sharing", label: "Sharing & disclosure" },
  { id: "cookies", label: "Cookies & analytics" },
  { id: "retention", label: "Data retention" },
  { id: "rights", label: "Your choices & rights" },
  { id: "children", label: "Children’s privacy" },
  { id: "security", label: "Security" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      current="privacy"
      toc={TOC}
      intro={
        <>
          Your trust matters to us. This Privacy Policy explains what information we collect when you
          visit the Site for <em>The Silence Between Us</em> or make a contribution, how we use it,
          and the choices you have.
        </>
      }
    >
      <LegalSection id="overview" title="Overview">
        <p>
          We collect only the information we need to process your contribution, deliver supporter
          benefits, and respond to your messages. We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="Information we collect">
        <ul>
          <li>
            <strong>Contact details:</strong> your name and email address;
          </li>
          <li>
            <strong>Credit preference:</strong> the name you wish to appear in the film’s credits or
            on the Founding Supporters page;
          </li>
          <li>
            <strong>Contribution details:</strong> the tier or amount you choose;
          </li>
          <li>
            <strong>Messages:</strong> anything you send us through the contact form;
          </li>
          <li>
            <strong>Technical data:</strong> basic, non-identifying analytics such as device and
            browser type.
          </li>
        </ul>
        <LegalSmall>
          Payment card numbers are entered directly with our payment processor and are never stored
          on our servers.
        </LegalSmall>
      </LegalSection>

      <LegalSection id="use" title="How we use information">
        <ul>
          <li>To process and acknowledge your contribution;</li>
          <li>
            To deliver the benefits associated with your tier, such as credits, updates, and meet
            &amp; greet scheduling;
          </li>
          <li>To send production updates you have opted into;</li>
          <li>To respond to inquiries and provide support;</li>
          <li>To maintain the security and integrity of the Site.</li>
        </ul>
      </LegalSection>

      <LegalSection id="payments" title="Payment processing">
        <p>
          Payments are processed securely by Stripe, Inc. When you pay, your card details are
          transmitted directly to Stripe and handled under their security standards and privacy
          policy. We receive confirmation of payment and limited details, such as the last four
          digits of your card, but not your full card number.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Sharing & disclosure">
        <p>
          We share information only as needed to operate the project, for example with our payment
          processor (Stripe) and email service providers, or where required by law. The name you
          choose for credits or the Founding Supporters page may be displayed publicly, as described
          when you contribute.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies & analytics">
        <p>
          The Site may use essential cookies and privacy-conscious analytics to understand how the
          Site is used and to improve it. You can control cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="Data retention">
        <p>
          We keep contribution records for as long as necessary to fulfill benefits, meet legal and
          accounting obligations, and maintain accurate records of support for the film. We retain
          other information only as long as needed for the purposes described here.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your choices & rights">
        <p>
          You may request access to, correction of, or deletion of your personal information, and you
          may unsubscribe from production updates at any time. To make a request, email us at the
          address below. We will respond consistent with applicable law.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children’s privacy">
        <p>
          The Site is intended for adults who wish to support the film. It is not directed to
          children, and we do not knowingly collect personal information from children under 13.
        </p>
      </LegalSection>

      <LegalSection id="security" title="Security">
        <p>
          We use reasonable administrative and technical safeguards to protect your information.
          However, no method of transmission or storage is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The “Last updated” date above reflects
          the most recent revision. Material changes will be reflected on this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions or requests about your privacy? Email{" "}
          <LegalLink href="mailto:kevin@take3mediallc.com">kevin@take3mediallc.com</LegalLink> or use
          our <LegalLink href="/contact">contact page</LegalLink>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
