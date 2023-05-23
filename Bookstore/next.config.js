/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret:
      "bab6615b-74e2-4baa-8008-a38de420d9ad70b1916d-0488-42e3-9326-deb7fa20f48371240661-31c9-4986-80fd-cb733bda2549236ccc33-e7e4-4bd1-809b-21d54950709b",
  },
  trailingSlash: true,
  images: {
    // formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        port: "",
        pathname: "/books/**",
      },
    ],
  },
};

module.exports = nextConfig;
