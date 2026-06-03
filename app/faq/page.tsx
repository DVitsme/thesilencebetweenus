import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — The Silence Between Us",
  description:
    "Answers about the film, supporting it, your supporter perks, and the filmmaker.",
};

// Provisional placeholder copy — source: docs/copy/secondary-pages.md.
// Subject to Kevin's final inputs (release window, full tier ladder, etc.).
const faqGroups: { heading: string; items: { q: string; a: string }[] }[] = [
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
        a: "It's a story for anyone who has ever loved a young person who was hurting. Kevin's work is rooted in hope and humanity — you don't need to share any particular faith to be moved by it, or to help make it.",
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
        a: "No — it's a single, one-time contribution. We never see or store your card details; payments are processed by Stripe.",
      },
      {
        q: "Can I get a refund?",
        a: "Contributions go directly into production, so they're generally final — but if something isn't right, contact us and we'll work with you.",
      },
      {
        q: "Can a business, church, or organization sponsor the film?",
        a: "Yes — we'd welcome it. Get in touch and we'll find the right fit.",
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
        a: "It depends on your tier — an on-screen credit, a virtual meet & greet with the director and cast, set updates, early trailer access, and a spot on the Founding Supporters page.",
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
        a: "A filmmaker and former educator whose work spans features, documentaries, and films made with schools, churches, and mental-health organizations — including a feature now streaming on Amazon Prime.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-24">
      <header className="mb-10 sm:mb-14">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Everything you need to know about the film and supporting it. Still have a
          question? Reach out and we&apos;ll help.
        </p>
      </header>

      <div className="space-y-10">
        {faqGroups.map((group) => (
          <section key={group.heading}>
            <h2 className="text-muted-foreground mb-1 text-sm font-medium tracking-wide uppercase">
              {group.heading}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {group.items.map((item, i) => (
                <AccordionItem key={i} value={`${group.heading}-${i}`}>
                  <AccordionTrigger className="text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </main>
  );
}
