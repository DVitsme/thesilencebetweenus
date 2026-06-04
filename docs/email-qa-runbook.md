# Email QA send runbook — show the 6 designs to a reviewer

**Goal:** send all six email templates to a reviewer's inbox (e.g. Kevin's team lead) for design QA,
fast, with **no re-derivation**. You can run this yourself; a Claude session only needs to read *this
file* (don't make it re-read the templates).

> **For a future Claude:** to send all six to a reviewer, make sure `pnpm dev` is running, then run the
> loop in "Send all six" with `TO=<reviewer email>`. That's the whole job. Do **not** re-open the
> `emails/*.tsx` files or the mockups — nothing else is needed.

---

## The mechanism (already built)

A **dev-only** route renders + sends any template using its built-in sample data (`PreviewProps`):

- File: `app/api/dev/email-preview/route.ts` (returns **404 in production** — dev only).
- **Preview in a browser:** `http://localhost:3000/api/dev/email-preview?t=<id>`
- **Send via Resend:** add `&send=<email>` → `…?t=<id>&send=<email>`
- Sends **From** `The Silence Between Us <hello@…>` (`CONTACT_FROM_EMAIL`), key from `.env.local`
  (`RESEND_API_KEY`). **These are just emails — no payments, no real money.**

### The six template ids
| id | what it is | type |
|---|---|---|
| `supporter-confirmation` | "You're a Founding Supporter" thank-you | transactional |
| `contact-autoreply` | "We got your message" | transactional |
| `refund-confirmation` | "Your contribution has been refunded" | transactional |
| `internal-new-contribution` | internal team alert (ops) | utility |
| `production-update` | quarterly "from the set" update | broadcast |
| `trailer-first-look` | trailer reveal (dark, cinematic) | broadcast |

---

## Send all six to a reviewer

```bash
# 1. Start the dev server (reads .env.local). Leave it running.
pnpm dev                      # http://localhost:3000
# (first hit to the email route compiles it, ~10–15s on this VM; later sends are instant)

# 2. Send all six. Swap in the reviewer's address.
TO="REVIEWER@EXAMPLE.COM"
for t in supporter-confirmation contact-autoreply refund-confirmation \
         internal-new-contribution production-update trailer-first-look; do
  echo "→ $t"
  curl -s "http://localhost:3000/api/dev/email-preview?t=$t&send=$TO"; echo
  sleep 1
done
```

Each returns `{"ok":true,"id":"…"}` on success.

### What to tell the reviewer
- **Transactional (1–4)** land in the **Primary** inbox.
- **Broadcasts** (`production-update`, `trailer-first-look`) usually sort to **Spam / Promotions**
  (external images + Unsubscribe + marketing tone). Ask them to check there. *(This is normal email
  behavior, not a bug — see `email-plan.md` deliverability notes.)*
- The content is **sample/placeholder** (names, amounts, `placehold.co` images, mailing address). Real
  data fills in once the templates are wired to live triggers.

---

## Alternative: hand over self-contained HTML files (no inbox needed)

Best when the reviewer is remote or you want to dodge spam filtering entirely. Renders each template to
a standalone `.html` they can open in any browser:

```bash
mkdir -p /tmp/email-designs
for t in supporter-confirmation contact-autoreply refund-confirmation \
         internal-new-contribution production-update trailer-first-look; do
  curl -s "http://localhost:3000/api/dev/email-preview?t=$t" -o "/tmp/email-designs/$t.html"
done
# → /tmp/email-designs/*.html  (zip and send, or open locally)
```

---

## Gotchas / quick fixes
- **First send slow / times out:** it's the one-time route compile. Re-run; it's fast after.
- **`{"ok":false,...}` on send:** check `.env.local` `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (the
  domain must be verified in Resend).
- **Check delivery:** `curl -s -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/emails/<id>`
  → look at `last_event` (`delivered` means it reached the mailbox, possibly in spam/promotions).
- **Change the sample data** a reviewer sees: edit the `PreviewProps` at the bottom of the relevant
  `emails/<id>.tsx`.

## Prerequisite
The email slice must be present on disk: `emails/*.tsx` (+ `emails/components/shell.tsx`), the dev route
above, and deps `@react-email/components` / `@react-email/render` / `resend`. **Commit the email slice**
so this survives a fresh clone / context reset.
