/**
 * The site's public base URL — the single place the production domain lives.
 *
 * NEXT_PUBLIC_SITE_URL is inlined at build time, so changing the domain is a rebuild + redeploy
 * (set the env var for the target environment: a workers.dev URL for staging, the real domain at
 * launch). Until it's set, this falls back to the working placeholder. Drives metadataBase, the
 * sitemap, robots, and share links so they all move together.
 */

const FALLBACK = "https://thesilencebetweenus.film";

function normalize(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return FALLBACK;
  // Env values are often set as a bare host (e.g. "example.com"); guarantee an absolute https URL
  // so new URL(SITE_URL) never throws.
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const SITE_URL = normalize(process.env.NEXT_PUBLIC_SITE_URL);
