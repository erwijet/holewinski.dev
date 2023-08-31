import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
