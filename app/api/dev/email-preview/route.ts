import { createElement, type ReactElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import SupporterConfirmation, {
  subject as supporterConfirmationSubject,
} from "@/emails/supporter-confirmation";
import ContactAutoReply, { subject as contactAutoReplySubject } from "@/emails/contact-autoreply";
import RefundConfirmation, { subject as refundConfirmationSubject } from "@/emails/refund-confirmation";
import InternalNewContribution, {
  subject as internalNewContributionSubject,
} from "@/emails/internal-new-contribution";
import ProductionUpdate, { subject as productionUpdateSubject } from "@/emails/production-update";
import TrailerFirstLook, { subject as trailerFirstLookSubject } from "@/emails/trailer-first-look";

/**
 * DEV-ONLY email preview + test-send (404 in production). One surface to QA every
 * template as we build them — register each in TEMPLATES below.
 *
 *   GET /api/dev/email-preview?t=<id>             → rendered HTML (open in a browser)
 *   GET /api/dev/email-preview?t=<id>&send=<to>   → sends a real test via Resend
 *
 * Remove (or keep gated) before launch.
 */
export const runtime = "nodejs";

// dev-only registry of heterogeneous templates; `any` is fine for this preview tool.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Entry = {
  Component: (props: any) => ReactElement;
  subject: (props: any) => string;
  props: any;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const previewProps = (C: { PreviewProps?: unknown }) => C.PreviewProps;

const TEMPLATES: Record<string, Entry> = {
  "supporter-confirmation": {
    Component: SupporterConfirmation as Entry["Component"],
    subject: supporterConfirmationSubject as Entry["subject"],
    props: previewProps(SupporterConfirmation as unknown as { PreviewProps?: unknown }),
  },
  "contact-autoreply": {
    Component: ContactAutoReply as Entry["Component"],
    subject: contactAutoReplySubject as Entry["subject"],
    props: previewProps(ContactAutoReply as unknown as { PreviewProps?: unknown }),
  },
  "refund-confirmation": {
    Component: RefundConfirmation as Entry["Component"],
    subject: refundConfirmationSubject as Entry["subject"],
    props: previewProps(RefundConfirmation as unknown as { PreviewProps?: unknown }),
  },
  "internal-new-contribution": {
    Component: InternalNewContribution as Entry["Component"],
    subject: internalNewContributionSubject as Entry["subject"],
    props: previewProps(InternalNewContribution as unknown as { PreviewProps?: unknown }),
  },
  "production-update": {
    Component: ProductionUpdate as Entry["Component"],
    subject: productionUpdateSubject as Entry["subject"],
    props: previewProps(ProductionUpdate as unknown as { PreviewProps?: unknown }),
  },
  "trailer-first-look": {
    Component: TrailerFirstLook as Entry["Component"],
    subject: trailerFirstLookSubject as Entry["subject"],
    props: previewProps(TrailerFirstLook as unknown as { PreviewProps?: unknown }),
  },
};

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });

  const url = new URL(req.url);
  const id = url.searchParams.get("t") ?? Object.keys(TEMPLATES)[0];
  const sendTo = url.searchParams.get("send");
  const entry = TEMPLATES[id];
  if (!entry) {
    return new Response(`Unknown template "${id}". Options: ${Object.keys(TEMPLATES).join(", ")}`, {
      status: 404,
    });
  }

  const element = createElement(entry.Component, entry.props);

  if (sendTo) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `The Silence Between Us <${process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
      to: sendTo,
      subject: entry.subject(entry.props),
      react: element,
    });
    return Response.json(
      error ? { ok: false, error } : { ok: true, id: data?.id, template: id, to: sendTo },
    );
  }

  const html = await render(element);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
