import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow, Rule } from "@/components/site/primitives";
import { SupportButton } from "@/components/site/support-button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about the film, supporting it, your supporter perks, and the filmmaker.",
};

// Copy source: docs/copy/secondary-pages.md (em-dashes scrubbed per the copy register). The release
// window stays open until Kevin confirms it; the answer reads fine without a date.
const FAQ_GROUPS: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "The film",
    items: [
      {
        q: "What is The Silence Between Us about?",
        a: "It's a powerful, necessary film about the anxiety and depression so many teenagers face within the school system, and the fear and uncertainty that keep them from opening up to their parents. Through raw emotion and authentic storytelling, it shines a light on trauma, isolation, healing, and the importance of being seen, heard, and understood.",
      },
      {
        q: "When will it be released?",
        a: "It's in production now. Supporters get quarterly updates from the set, so you'll be among the first to know.",
      },
      {
        q: "Is this a faith-based film?",
        a: "It's a story for anyone who has ever loved a young person who was hurting. Kevin's work is rooted in hope and humanity, and you don't need to share any particular faith to be moved by it, or to help make it.",
      },
    ],
  },
  {
    heading: "Supporting the film",
    items: [
      {
        q: "How do I support it?",
        a: "Choose a supporter tier or contribute any amount through our secure checkout. It takes about a minute.",
      },
      {
        q: "Is my contribution tax-deductible?",
        a: "No. The Silence Between Us is an independent film, so your support is a contribution toward making it (with supporter perks), not a tax-deductible donation.",
      },
      {
        q: "Will I be charged more than once?",
        a: "No. It's a single, one-time contribution. We never see or store your card details; payments are processed by Stripe.",
      },
      {
        q: "Can I get a refund?",
        a: "Contributions go directly into production, so they're generally final. If something isn't right, contact us and we'll work with you.",
      },
      {
        q: "Can a business, church, or organization sponsor the film?",
        a: "Yes, we'd welcome it. Get in touch and we'll find the right fit.",
      },
      {
        q: "I can't give right now. How else can I help?",
        a: "Share the film with the parents, educators, and friends in your life. Awareness is its own kind of support.",
      },
    ],
  },
  {
    heading: "Your supporter perks",
    items: [
      {
        q: "What do I get?",
        a: "It depends on your tier: an on-screen credit, a virtual meet & greet with the director and cast, set updates, early trailer access, and a spot on the Founding Supporters page.",
      },
      {
        q: "How do I choose how my name appears in the credits?",
        a: "You'll tell us exactly how you'd like to be credited at checkout.",
      },
      {
        q: "When will I receive my perks?",
        a: "Set updates arrive quarterly; we'll email you to arrange the meet & greet and confirm your credit as production progresses.",
      },
    ],
  },
  {
    heading: "About the filmmaker",
    items: [
      {
        q: "Who is Kevin Cameron?",
        a: "A filmmaker and former educator whose work spans features, documentaries, and films made with schools, churches, and mental-health organizations, including a feature now streaming on Amazon Prime.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="px-7 pt-[58px] pb-[10px] text-center">
        <Eyebrow>Good to know</Eyebrow>
        <h1 className="mx-auto max-w-[640px] font-serif text-[clamp(2.25rem,5vw,3rem)] leading-[1.07] tracking-[-0.5px]">
          Frequently asked questions
        </h1>
        <p className="text-ink-soft mx-auto mt-4 max-w-[560px] font-serif text-[19px] leading-[1.55]">
          Everything you need to know about the film and supporting it. Still have a question? Reach
          out and we&apos;ll help.
        </p>
      </section>

      <Rule className="mt-9" />

      <section className="mx-auto max-w-[760px] px-7 pt-12 pb-[60px]">
        <div className="flex flex-col gap-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.heading}>
              <span className="text-gold-deep mb-1.5 block font-serif text-[15px] italic">
                {group.heading}
              </span>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, i) => (
                  <AccordionItem key={i} value={`${group.heading}-${i}`} className="border-line">
                    <AccordionTrigger className="text-ink font-serif text-[18px] hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-ink-soft font-serif text-[16.5px] leading-[1.6]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* support bridge */}
      <section className="bg-tint px-7 py-[54px] text-center">
        <h2 className="mx-auto max-w-[520px] font-serif text-[clamp(1.6rem,3.5vw,2rem)] leading-[1.15] tracking-[-0.3px]">
          Still wondering about something?
        </h2>
        <p className="text-ink-soft mx-auto mt-3 max-w-[480px] font-serif text-[17px] leading-[1.6]">
          We read every note and reply ourselves. Ask us anything about the film or supporting it.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <SupportButton>Support the film →</SupportButton>
          <Link
            href="/contact"
            className="border-ink hover:bg-ink hover:text-paper inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 font-serif text-[17px] italic transition-colors"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
