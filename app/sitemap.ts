import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public, indexable routes only. The post-payment pages (/thank-you, /support/canceled) are
// robots:{index:false} and are intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/give", 0.9, "monthly"),
    entry("/supporters", 0.8, "weekly"),
    entry("/about", 0.7, "monthly"),
    entry("/portfolio", 0.7, "monthly"),
    entry("/contact", 0.6, "monthly"),
    entry("/faq", 0.6, "monthly"),
    entry("/legal/contributions", 0.4, "monthly"),
    entry("/legal/terms", 0.3, "monthly"),
    entry("/legal/privacy", 0.3, "monthly"),
  ];
}
