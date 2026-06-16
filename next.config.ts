import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for external domains if needed in future
  images: {
    remotePatterns: [],
  },
  // Allow large API bodies for PDF uploads (10 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
