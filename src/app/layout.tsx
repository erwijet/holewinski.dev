import { Metadata } from "next";
import { Providers } from "./providers";
import { jsonld } from "@/site.json";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  description: "holewinski.dev - Tyler Holewinski's personal site",
  keywords: [
    "typescript",
    "react",
    "javascript",
    "engineering",
    "computer science",
    "react",
    "RIT",
    "rochester ny",
  ],
  title: "Tyler Holewinski",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="description" content="Tyler Holewinski's homepage" />
        <meta name="author" content="Tyler Holewinski" />
        <meta name="twitter:title" content="Tyler Holewinski" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@erwijet" />
        <meta name="twitter:creator" content="@erwijet" />
        <meta
          name="twitter:image"
          content="https://www.holewinski.dev/banner.png"
        />
        <meta property="og:site_name" content="Tyler Holewinski" />
        <meta property="og:title" content="Tyler Holewinski" />
        <meta property="og:type" content="website" />
        <title>Tyler Holewinski</title>
        <link rel="canonical" href="https://www.holewinski.dev/" />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://www.holewinski.dev" crossOrigin="anonymous" />
        <link rel="alternate" hrefLang="en" href="https://www.holewinski.dev/" />
        <meta property="og:description" content="Tyler Holewinski's personal homepage and blog" />
        <meta property="og:image" content="https://www.holewinski.dev/banner.png" />
        <meta property="og:url" content="https://www.holewinski.dev/" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:description" content="Tyler Holewinski's personal homepage and blog" />
        <meta name="twitter:image:alt" content="Photo of Tyler Holewinski" />
      </head>
      <body>
        <a
          rel="me"
          href="https://mastodon.social/@erwijet"
          style={{ display: "none" }}
        >
          Mastodon
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
        />
        <main>
          <Providers>{children}</Providers>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Tyler Holewinski</p>
        </footer>
      </body>
    </html>
  );
}
