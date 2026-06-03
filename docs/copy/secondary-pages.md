# Secondary Pages Copy — *The Silence Between Us*

Same register as the landing page: **serious, credible, warm — no catchphrases.** Teens-first.
Framing: contribution/support (never donate/tax-deductible/invest). See
[`landing-page.md`](./landing-page.md) and [`docs/persona-kevin-cameron.md`](../persona-kevin-cameron.md).

---

## /thank-you  *(Stripe `success_url`)*
*Confirm, set expectations, and — critically — invite sharing. The single biggest lever after a gift.*

- **Headline:** Thank you for backing this film.
- **Body:** Your support means more than you know. You've just helped move a story about our kids —
  and the silence too many of them carry — one step closer to the screen.
- **Confirmation block (dynamic):** A confirmation and receipt are on their way to **{email}**.
  *(If tier:)* You're now a **{tierName}**, and your supporter perks are reserved.
- **What happens next:**
  - Watch for a welcome note and your receipt by email.
  - We'll be in touch about your perks *(credit, meet & greet, early trailer — by tier)*.
  - You'll receive quarterly updates straight from the set.
- **Share prompt (prominent):**
  - **Heading:** The next thing you can do costs nothing.
  - **Body:** Share this film. Every person who sees it is another reason a young person might feel
    less alone — and another chance to bring this story to life.
  - **Buttons:** `Copy link` · `Share on Facebook` · `Share on X` · `Email it`
- **Secondary CTA:** `See Kevin's work` · `Back to home`
- **Microcopy:** Questions about your contribution? `Contact us`.

---

## /support/canceled  *(Stripe `cancel_url`)*
*Soft, zero guilt, easy to resume. NOT an error page.*

- **Headline:** Your contribution wasn't completed.
- **Body:** No problem — and nothing was charged. If something went wrong, or you simply changed your
  mind, you can pick up right where you left off whenever you're ready.
- **Primary CTA:** `Return to support the film`
- **Reassurance:** Checkout is handled securely by Stripe. Hit a snag? `Let us know` and we'll help.

---

## /contact
*Simple, warm, serious. Form + a direct email option.*

- **Headline:** Get in touch.
- **Subhead:** Questions about the film, supporting it, press, or partnering with us? We'd love to hear from you.
- **Form fields:**
  - Name *(required)*
  - Email *(required)*
  - Reason *(select: General question · Supporting the film · Press & media · Partnership/sponsorship · Something else)*
  - Message *(required)*
  - *(invisible reCAPTCHA)*
  - **Submit button:** `Send message`
- **Success state:** Thank you — your message is on its way. We'll get back to you as soon as we can.
- **Error state:** Something went wrong sending your message. Please try again, or email us directly
  at **kevin@kcfilmsmedia.com**.
- **Alt contact line:** Prefer email? Reach us anytime at **kevin@kcfilmsmedia.com**.

---

## /faq  *(standalone — fuller than the landing section)*
*Grouped. Reassuring and concrete.*

**The film**
- **What is *The Silence Between Us* about?** It's a powerful, necessary film about the anxiety and
  depression so many teenagers face within the school system, and the fear and uncertainty that keep
  them from opening up to their parents. Through raw emotion and authentic storytelling, it shines a
  light on trauma, isolation, healing, and the importance of being seen, heard, and understood.
- **When will it be released?** It's in production now. `[TBD: release window]` Supporters get
  quarterly updates from the set, so you'll be among the first to know.
- **Is this a faith-based film?** It's a story for anyone who has ever loved a young person who was
  hurting. Kevin's work is rooted in hope and humanity — you don't need to share any particular faith
  to be moved by it, or to help make it.

**Supporting the film**
- **How do I support it?** Choose a supporter tier or contribute any amount through our secure
  checkout. It takes about a minute.
- **Is my contribution tax-deductible?** No. *The Silence Between Us* is an independent film, so your
  support is a contribution toward making it (with supporter perks), not a tax-deductible donation.
- **Will I be charged more than once?** No — it's a single, one-time contribution. We never see or
  store your card details; payments are processed by Stripe.
- **Can I get a refund?** Contributions go directly into production, so they're generally final — but
  if something isn't right, `contact us` and we'll work with you. *(See the Contributions policy.)*
- **Can a business, church, or organization sponsor the film?** Yes — we'd welcome it. `Get in touch`
  and we'll find the right fit.
- **I can't give right now. How else can I help?** Share the film with the parents, educators, and
  friends in your life. Awareness is its own kind of support.

**Your supporter perks**
- **What do I get?** It depends on your tier — an on-screen credit, a virtual meet & greet with the
  director and cast, set updates, early trailer access, and a spot on the Founding Supporters page.
- **How do I choose how my name appears in the credits?** You'll tell us exactly how you'd like to be
  credited at checkout.
- **When will I receive my perks?** Set updates arrive quarterly; we'll email you to arrange the meet
  & greet and confirm your credit as production progresses.

**About the filmmaker**
- **Who is Kevin Cameron?** A filmmaker and former educator whose work spans features, documentaries,
  and films made with schools, churches, and mental-health organizations — including a feature now
  streaming on Amazon Prime. `See his work →`

---

## 404  *(not-found)*
- **Headline:** This page wandered off.
- **Body:** The page you're looking for isn't here. Let's get you back to the story.
- **CTAs:** `Return home` · `Meet the film` · `Become a Supporter`

---

## Error  *(error.tsx / global-error — app errors only, NOT payments)*
- **Headline:** Something went wrong on our end.
- **Body:** Sorry about that — a technical hiccup got in the way. Please try again in a moment. If it
  keeps happening, we'd appreciate you letting us know.
- **CTAs:** `Try again` · `Return home` · `Contact us`

---

## /portfolio  *(intro — page then renders the proof bar, featured film, work grid, partners, tour, bio; see [`portfolio-page-plan.md`](../portfolio-page-plan.md))*
- **Eyebrow:** THE WORK BEHIND THE TRUST
- **Headline:** A career of telling stories that matter.
- **Subhead:** Before *The Silence Between Us*, there were features, documentaries, and films made
  with schools, churches, and mental-health organizations — including a feature now streaming on
  Amazon Prime. Here's the work.
- **Closing bridge CTA:** You've seen the work. Now help tell the next story. `Support The Silence Between Us`

---

## Meta / Open Graph  *(SEO + social sharing)*
- **Site name:** The Silence Between Us
- **Home — title:** The Silence Between Us — A New Film by Kevin Cameron
- **Home — description:** A powerful, necessary film about the anxiety and depression so many
  teenagers carry in silence. Help bring this story to the screen.
- **Portfolio — title:** The Work of Kevin Cameron — Films, Documentaries & Brand Stories
- **Portfolio — description:** Features, documentaries, and brand films from filmmaker Kevin Cameron —
  including a feature now streaming on Amazon Prime.
- **FAQ — title:** FAQ — Supporting The Silence Between Us
- **Contact — title:** Contact — The Silence Between Us
- **Thank-you — title:** Thank You for Your Support — The Silence Between Us
- **OG image:** `[TBD: key art / still — 1200×630]`; **alt:** "The Silence Between Us — a film by Kevin Cameron."
