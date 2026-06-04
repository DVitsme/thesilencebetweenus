-- Founding Supporters — recognition-wall source of truth (task #12).
-- Written by the Stripe webhook (payment_intent.succeeded -> recordSupporter);
-- read by /supporters. PUBLIC columns = credit_name + display_tier (+ created_at);
-- the rest is admin/private and is never selected for the page.

CREATE TABLE IF NOT EXISTS supporters (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Idempotency key: the webhook may deliver payment_intent.succeeded more than once.
  stripe_payment_intent  TEXT    NOT NULL UNIQUE,
  -- Wall bucket. Computed at write time from the checkout tier (+ amount for custom).
  display_tier           TEXT    NOT NULL CHECK (display_tier IN ('patron','partner','supporter')),
  -- Raw tier id from PI metadata ('supporter'|'partner'|'patron'|'custom').
  tier_id                TEXT    NOT NULL DEFAULT 'custom',
  -- PUBLIC: the credit name the supporter chose. Blank -> omitted from the wall.
  credit_name            TEXT    NOT NULL DEFAULT '',
  -- Private (admin/dedupe). Never selected for the page.
  supporter_name         TEXT    NOT NULL DEFAULT '',
  amount_cents           INTEGER NOT NULL DEFAULT 0,
  email                  TEXT,
  created_at             TEXT    NOT NULL  -- ISO 8601
);

-- Drives the wall's ordering (patron -> partner -> supporter, then oldest-first).
CREATE INDEX IF NOT EXISTS idx_supporters_tier_created
  ON supporters (display_tier, created_at);
