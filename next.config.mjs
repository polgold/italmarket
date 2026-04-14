/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Limit the variants Next generates. Defaults are 16 sizes per image,
    // which thrashes the optimizer when a page shows 20+ product thumbs.
    imageSizes: [64, 96, 128, 256, 384],
    deviceSizes: [640, 828, 1200, 1920],
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
