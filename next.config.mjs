/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "italmarket.com.ar" },
      { protocol: "https", hostname: "**.italmarket.com.ar" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },
};

export default nextConfig;
