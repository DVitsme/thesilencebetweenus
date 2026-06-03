/**
 * Portfolio & social-proof content — single source of truth for the site's
 * portfolio/credibility sections. Render this; don't hardcode in components.
 *
 * Voice when writing copy: docs/persona-kevin-cameron.md
 * Asset archive + provenance: portfolio/README.md
 * Images live under /public/portfolio/* (served at /portfolio/*).
 *
 * STRATEGY NOTE: lead with distribution + tour + partners, NOT YouTube view
 * counts (his channel is small). The mental-health clients (Murtis Taylor,
 * ADAMHS, Cleveland Peacemakers) directly de-risk "The Silence Between Us".
 */

export type WorkCategory =
  | "feature"
  | "documentary"
  | "tv"
  | "commercial"
  | "music-video"
  | "in-development";

export interface CastMember {
  name: string;
  role?: string;
  imdbUrl?: string;
}

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  year?: string;
  role: string;
  blurb: string;
  image: string;
  videoUrl?: string;
  externalUrl?: string;
  badges?: string[];
}

export type PartnerGroup =
  | "education"
  | "mental-health"
  | "faith"
  | "business"
  | "arts";

export interface Partner {
  name: string;
  logo: string;
  group: PartnerGroup;
}

export interface TourStop {
  city: string;
  date: string;
  venue: string;
  note?: string;
}

export interface ProofStat {
  value: string;
  label: string;
}

export interface Credential {
  label: string;
  detail?: string;
}

/** Hero spotlight — the strongest single proof point. */
export const featuredFilm = {
  title: "For His Name's Sake",
  year: "2024",
  logline:
    "An intense family drama about faith, courage, and the power of reconciliation.",
  synopsis:
    "When a young couple's newborn needs a rare blood transfusion, a small-town mechanic must track down the estranged father who abandoned him — a race against time that tests family, forgiveness, and faith. Inspired by Psalm 23:3.",
  comps: ["John Q", "The Shack"],
  image: "/portfolio/works/for-his-name-sake-trailer.jpg",
  trailerUrl: "https://www.youtube.com/watch?v=8vIWZzd8h1o",
  streamUrl: "https://www.amazon.com/dp/B0H33GHDD2",
  distributor: "Pisgarie Entertainment",
  badges: [
    "Now streaming on Amazon Prime Video",
    "Sold-out Toronto premiere (400+)",
    "9–10 city premiere tour",
  ],
  cast: [
    {
      name: "Romaine Waite",
      role: "Lead • Writer • Producer",
      imdbUrl: "https://www.imdb.com/name/nm4582495/",
    },
    { name: "Tyson Coleman" },
    { name: "Lee Highgate" },
    { name: "Krystal Lawton" },
  ] satisfies CastMember[],
} as const;

/** Body-of-work grid (one card per distinct project). */
export const works: Work[] = [
  {
    slug: "for-his-name-sake",
    title: "For His Name's Sake",
    category: "feature",
    year: "2024",
    role: "Director, Co-writer",
    blurb:
      "His flagship feature — now on Amazon Prime after a sold-out Toronto premiere and a multi-city tour.",
    image: "/portfolio/works/for-his-name-sake-trailer.jpg",
    videoUrl: "https://www.youtube.com/watch?v=8vIWZzd8h1o",
    externalUrl: "https://www.amazon.com/dp/B0H33GHDD2",
    badges: ["Feature film", "On Amazon Prime"],
  },
  {
    slug: "the-silence-between-us",
    title: "The Silence Between Us",
    category: "in-development",
    role: "Director, Writer",
    blurb:
      "His next feature — a powerful, necessary film about the anxiety and depression teens carry in silence, and the fear that keeps them from opening up to the people who love them. The film this site supports.",
    image: "/portfolio/works/pastor-snell-interview.jpg",
    badges: ["In production", "Mental health"],
  },
  {
    slug: "forevers-a-long-time",
    title: "Forever's a Long Time",
    category: "in-development",
    role: "Director, Producer",
    blurb:
      "A relationship dramedy on love, marriage, and divorce — currently in development (scenes & table reads released).",
    image: "/portfolio/works/forevers-a-long-time-trailer.jpg",
    videoUrl: "https://www.youtube.com/watch?v=nuz-nmlUk8Y",
    badges: ["Feature / series"],
  },
  {
    slug: "the-calling",
    title: "The Calling",
    category: "documentary",
    year: "2024",
    role: "Director, Producer",
    blurb: "A feature-length documentary on faith and purpose.",
    image: "/portfolio/works/the-calling-documentary.jpg",
    videoUrl: "https://www.youtube.com/watch?v=-mA-tP2EUSs",
    badges: ["Documentary"],
  },
  {
    slug: "cleveland-peacemakers",
    title: "Cleveland Peacemakers Alliance",
    category: "documentary",
    year: "2022",
    role: "Director, Producer",
    blurb:
      "A community film on youth, gun violence, and healing — produced for Cleveland's violence-intervention nonprofit.",
    image: "/portfolio/works/cleveland-peacemakers-documentary.jpg",
    videoUrl: "https://www.youtube.com/watch?v=KLYbZ3yOYIQ",
    badges: ["Documentary", "Mental health & community"],
  },
  {
    slug: "murtis-taylor",
    title: "Murtis Taylor Human Services",
    category: "documentary",
    year: "2012",
    role: "Director, Producer",
    blurb:
      "Story and event films for a Cleveland mental-health & human-services system.",
    image: "/portfolio/works/murtis-taylor-my-story.jpg",
    videoUrl: "https://www.youtube.com/watch?v=B4yUVLG1Ix0",
    badges: ["Documentary", "Mental health & community"],
  },
  {
    slug: "naprim-naturals",
    title: "NAPRIM Naturals",
    category: "documentary",
    year: "2021",
    role: "Director, Producer",
    blurb: "A brand origin documentary for a vegan, talc-free product line.",
    image: "/portfolio/works/naprim-naturals-documentary.jpg",
    videoUrl: "https://www.youtube.com/watch?v=GkWxXyV20-k",
    badges: ["Brand documentary"],
  },
  {
    slug: "the-watkins",
    title: '"105 and Watkins" (TV Pilot)',
    category: "tv",
    year: "2012",
    role: "Writer, Producer",
    blurb:
      "An original TV pilot he wrote, cast, and produced — premiered to a packed house. He now teaches the craft as a course.",
    image: "/portfolio/works/the-watkins-pilot-trailer.jpg",
    videoUrl: "https://www.youtube.com/watch?v=JpocmgrOVGs",
    badges: ["TV pilot"],
  },
  {
    slug: "anthony-brown-i-got-that",
    title: 'Anthony Brown — "I Got That"',
    category: "music-video",
    year: "2023",
    role: "Director, Editor",
    blurb: "Gospel music video — his most-watched release.",
    image: "/portfolio/works/anthony-brown-i-got-that.jpg",
    videoUrl: "https://www.youtube.com/watch?v=g3FCgWIlzM8",
    badges: ["Music video"],
  },
  {
    slug: "commercials-brand-films",
    title: "Commercials & Brand Films",
    category: "commercial",
    role: "Director, Editor",
    blurb:
      "500+ commercials, promos, and product videos for businesses and institutions over 7+ years.",
    image: "/portfolio/works/beard-oil-commercial.jpg",
    videoUrl: "https://www.youtube.com/@KevinCameronFilms",
    badges: ["500+ produced"],
  },
];

/** "Trusted by" logo wall — grouped for a meaningful narrative. */
export const partners: Partner[] = [
  // Education
  {
    name: "Cleveland Metropolitan School District",
    logo: "/portfolio/partners/cleveland-metropolitan-school-district.jpg",
    group: "education",
  },
  // Mental health & community (de-risks The Silence Between Us)
  {
    name: "Murtis Taylor Human Services System",
    logo: "/portfolio/partners/murtis-taylor.png",
    group: "mental-health",
  },
  {
    name: "ADAMHS Board of Cuyahoga County",
    logo: "/portfolio/partners/adamhs-cuyahoga-county.jpg",
    group: "mental-health",
  },
  {
    name: "Cleveland Peacemakers Alliance",
    logo: "/portfolio/partners/cleveland-peacemakers-alliance.png",
    group: "mental-health",
  },
  // Faith institutions
  {
    name: "Seventh-day Adventist Church",
    logo: "/portfolio/partners/seventh-day-adventist-church.png",
    group: "faith",
  },
  {
    name: "Allegheny West Conference",
    logo: "/portfolio/partners/allegheny-west-conference.jpg",
    group: "faith",
  },
  {
    name: "Southeastern Conference",
    logo: "/portfolio/partners/southeastern-conference-sda.jpg",
    group: "faith",
  },
  // Businesses & brands
  {
    name: "The Anne K Group",
    logo: "/portfolio/partners/the-anne-k-group.png",
    group: "business",
  },
  { name: "Talmetrix", logo: "/portfolio/partners/talmetrix.png", group: "business" },
  { name: "Marelli", logo: "/portfolio/partners/marelli.png", group: "business" },
  { name: "Homewatch", logo: "/portfolio/partners/homewatch.png", group: "business" },
  {
    name: "Hunt Brothers Pizza",
    logo: "/portfolio/partners/hunt-brothers-pizza.png",
    group: "business",
  },
  { name: "Signarama", logo: "/portfolio/partners/signarama.png", group: "business" },
  {
    name: "Precision Overhead Garage Door",
    logo: "/portfolio/partners/precision-garage-door.jpg",
    group: "business",
  },
  {
    name: "Intelligent Mobile Support",
    logo: "/portfolio/partners/intelligent-mobile-support.jpg",
    group: "business",
  },
  {
    name: "Solon Chamber of Commerce",
    logo: "/portfolio/partners/solon-chamber-of-commerce.png",
    group: "business",
  },
  // Arts / brands
  { name: "Naturally 7", logo: "/portfolio/partners/naturally-7.png", group: "arts" },
  {
    name: "NAPRIM Naturals",
    logo: "/portfolio/partners/naprim-naturals.png",
    group: "arts",
  },
];

/** "For His Name's Sake" premiere tour — proof the work is in demand. */
export const tour: TourStop[] = [
  { city: "Toronto, ON", date: "2024-10-12", venue: "Premiere", note: "Sold out, 400+" },
  { city: "Orlando, FL", date: "2024-12-07", venue: "Church screening" },
  {
    city: "Huntsville, AL",
    date: "2025-02-01",
    venue: "Oakwood University Church",
    note: "Fundraiser for Oakwood Academy",
  },
  { city: "North Bronx, NY", date: "2025-03-01", venue: "North Bronx SDA Church" },
  {
    city: "Atlanta, GA",
    date: "2025-04-12",
    venue: "Silverspot Cinema @ The Battery",
    note: "with Revision Church ATL",
  },
  { city: "Euclid, OH", date: "2025-06-01", venue: "Grace Community SDA Church" },
  {
    city: "Reno, NV",
    date: "2025-06-07",
    venue: "Riverview SDA Church",
    note: "Nevada-Utah Conference",
  },
];

/** Stat bar for instant credibility. */
export const proofStats: ProofStat[] = [
  { value: "Prime", label: "Feature streaming on Amazon Prime Video" },
  { value: "9–10", label: "cities on the premiere tour (US & Canada)" },
  { value: "400+", label: "at the sold-out Toronto premiere" },
  { value: "500+", label: "videos produced for brands & businesses" },
];

/** Bio / authority strip. */
export const credentials: Credential[] = [
  { label: "Oakwood University", detail: "alumnus" },
  { label: "ASI member", detail: "Adventist-laymen's Services & Industries" },
  { label: "Chief Content Officer", detail: "The Anne K Group" },
  { label: "Former educator", detail: "English teacher, then school principal" },
  { label: "Filmmaking educator", detail: "teaches 2 production courses" },
];
