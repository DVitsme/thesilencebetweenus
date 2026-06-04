import type { Metadata } from "next";
import { LegalLayout, LegalSection, LegalLink } from "@/components/site/legal/legal-layout";

export const metadata: Metadata = { title: "Terms of Use" };

const UPDATED = "June 3, 2026";

const TOC = [
  { id: "acceptance", label: "Acceptance of these terms" },
  { id: "about", label: "Who we are" },
  { id: "use", label: "Permitted use of the site" },
  { id: "ip", label: "Intellectual property" },
  { id: "contrib", label: "Contributions & payments" },
  { id: "submissions", label: "Your submissions" },
  { id: "thirdparty", label: "Third-party services" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of liability" },
  { id: "changes", label: "Changes to these terms" },
  { id: "law", label: "Governing law" },
  { id: "contact", label: "Contact us" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      updated={UPDATED}
      current="terms"
      toc={TOC}
      intro={
        <>
          Welcome. These Terms of Use govern your access to and use of the website for{" "}
          <em>The Silence Between Us</em> (the “Site”), including any pages where you make a financial
          contribution to the film. Please read them carefully.
        </>
      }
    >
      <LegalSection id="acceptance" title="Acceptance of these terms">
        <p>
          By accessing or using the Site, you agree to be bound by these Terms of Use and by our{" "}
          <LegalLink href="/legal/privacy">Privacy Policy</LegalLink>. If you do not agree, please do
          not use the Site.
        </p>
      </LegalSection>

      <LegalSection id="about" title="Who we are">
        <p>
          The Site is operated in connection with the production of the film{" "}
          <em>The Silence Between Us</em> by Take 3 Media, the creative production company for the
          project. Financial contributions are administered by KC Films &amp; Media, the parent
          company of Take 3 Media (together, “we,” “us,” or “our”).
        </p>
      </LegalSection>

      <LegalSection id="use" title="Permitted use of the site">
        <p>You agree to use the Site only for lawful purposes. You agree not to:</p>
        <ul>
          <li>Use the Site in any way that violates applicable law or regulation;</li>
          <li>Attempt to gain unauthorized access to the Site, its servers, or related systems;</li>
          <li>Interfere with or disrupt the integrity or performance of the Site;</li>
          <li>Copy, reproduce, or redistribute Site content except as expressly permitted.</li>
        </ul>
      </LegalSection>

      <LegalSection id="ip" title="Intellectual property">
        <p>
          All content on the Site, including the film title, logos, text, images, trailers, and other
          materials, is owned by or licensed to us and is protected by intellectual property laws.
          Your contribution does not transfer to you any ownership of the film or any underlying
          rights.
        </p>
      </LegalSection>

      <LegalSection id="contrib" title="Contributions & payments">
        <p>
          Financial contributions made through the Site are governed by our{" "}
          <LegalLink href="/legal/contributions">Contribution Terms</LegalLink>, which describe the
          nature of contributions, supporter benefits, fulfillment, and refunds. By making a
          contribution, you agree to those terms.
        </p>
      </LegalSection>

      <LegalSection id="submissions" title="Your submissions">
        <p>
          When you contact us or provide information, such as the name you wish to appear in the
          film’s credits or on the Founding Supporters page, you grant us permission to use that
          information for the stated purpose. Please do not submit the personal information of others
          without their consent.
        </p>
      </LegalSection>

      <LegalSection id="thirdparty" title="Third-party services">
        <p>
          Payments are processed by Stripe, Inc. Your use of payment features is also subject to
          Stripe’s terms and privacy policy. The Site may link to third-party websites; we are not
          responsible for the content or practices of those sites.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="Disclaimers">
        <p>
          The Site and its content are provided “as is” and “as available,” without warranties of any
          kind, whether express or implied. We do not warrant that the Site will be uninterrupted,
          error-free, or secure. A contribution supports a creative project in production; we do not
          guarantee any particular outcome, completion date, or release.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, we will not be liable for any indirect, incidental,
          consequential, or punitive damages arising from your use of the Site or any contribution,
          even if advised of the possibility of such damages.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these Terms of Use from time to time. The “Last updated” date above reflects
          the most recent revision. Your continued use of the Site after changes are posted
          constitutes acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection id="law" title="Governing law">
        {/* TODO(legal-confirm): governing-law state. The mockup showed Ohio (inferred from
            Cleveland), but docs/copy/legal.md states KC Films & Media LLC is registered in Florida.
            Defaulting to Florida per that copy doc — Kevin to confirm the registered entity's state. */}
        <p>
          These Terms of Use are governed by the laws of the State of Florida, without regard to its
          conflict-of-law principles. Any disputes will be resolved in the state or federal courts
          located in Florida.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions about these terms? Email{" "}
          <LegalLink href="mailto:kevin@kcfilmsmedia.com">kevin@kcfilmsmedia.com</LegalLink> or use
          our <LegalLink href="/contact">contact page</LegalLink>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
