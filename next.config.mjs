/** @type {import('next').NextConfig} */
export default {
  async rewrites() {
    return [
      {
        source: "/.well-known/webfinger",
        destination: "/api/webfinger",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub.holewinski.dev",
        port: "",
        pathname: "/**/*",
      },
    ],
  },
};
