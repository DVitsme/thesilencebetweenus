-- Founding Supporters — REAL roster (confirmed by Kevin, 2026-06-16).
-- These are actual supporters, NOT the review samples in seed-supporters.sql.
-- Unique ids use the 'founding:' prefix (never 'seed:'), so the go-live cleanup
--   DELETE FROM supporters WHERE stripe_payment_intent LIKE 'seed:%';
-- removes only the samples and leaves these in place permanently.
-- Apply:  pnpm db:founding:local  (local D1)  |  pnpm db:founding  (remote)
-- Idempotent: INSERT OR IGNORE on the unique stripe_payment_intent.
-- amount_cents is private (never shown on the wall); set to the tier baseline.

INSERT OR IGNORE INTO supporters
  (stripe_payment_intent, display_tier, tier_id, credit_name, supporter_name, amount_cents, email, created_at)
VALUES
  ('founding:0001', 'partner',   'partner',   'Dr. Tanya Lea',             'Dr. Tanya Lea',             50000, NULL, '2026-06-16T12:00:00.000Z'),
  ('founding:0002', 'supporter', 'supporter', 'Melanie and Kieron Kinard', 'Melanie and Kieron Kinard', 17500, NULL, '2026-06-16T12:01:00.000Z'),
  ('founding:0003', 'supporter', 'supporter', 'Harvey Robinson',        'Harvey Robinson',        17500, NULL, '2026-06-16T12:02:00.000Z'),
  ('founding:0004', 'supporter', 'supporter', 'Kira Somerville',        'Kira Somerville',        17500, NULL, '2026-06-16T12:03:00.000Z'),
  ('founding:0005', 'supporter', 'supporter', 'Heather McKenzie',       'Heather McKenzie',       17500, NULL, '2026-06-16T12:04:00.000Z'),
  ('founding:0006', 'supporter', 'supporter', 'Osakwe Mattocks',        'Osakwe Mattocks',        17500, NULL, '2026-06-16T12:05:00.000Z'),
  ('founding:0007', 'supporter', 'supporter', 'Angel Jeudin',           'Angel Jeudin',           17500, NULL, '2026-06-16T12:06:00.000Z'),
  ('founding:0008', 'supporter', 'supporter', 'Sandra Doran',           'Sandra Doran',           17500, NULL, '2026-06-16T12:07:00.000Z'),
  ('founding:0009', 'supporter', 'supporter', 'Kymone & Kerine Hinds',  'Kymone & Kerine Hinds',  17500, NULL, '2026-06-16T12:08:00.000Z');
