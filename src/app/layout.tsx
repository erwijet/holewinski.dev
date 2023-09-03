import { Providers } from "./providers";

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
          content="https://www.holewinski.dev/code_vibes.jpg"
        />
        <meta property="og:site_name" content="Tyler Holewinski" />
        <meta property="og:title" content="Tyler Holewinski" />
        <meta property="og:type" content="website" />
        <meta
          property="og:type"
          content="https://www.holewinski.dev/code_vibes.jpg"
        />
        <title>Tyler Holewinski</title>
      </head>
      <body>
        <a rel="me" href="https://mastodon.social/@erwijet" style={{ display: 'none' }}>Mastodon</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
