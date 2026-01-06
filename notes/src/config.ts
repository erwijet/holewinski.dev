export const SITE = {
  website: "https://www.holewinski.dev", // replace this with your deployed domain
  author: "Tyler Holewinski",
  profile: "https://www.holewinski.dev",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "holewinski.dev",
  ogImage: "astropaper-og.jpg",
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en",
  timezone: "America/New_York",
  bios: [
    "Bookbinder",
    "Pothos Gardener",
    "Home Cook",
    "z80 Nostalgist",
    "Personal Library Builder"
  ],
} as const;
