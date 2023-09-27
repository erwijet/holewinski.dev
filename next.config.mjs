/** @type {import('next').NextConfig} */
export default {
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
