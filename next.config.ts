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
  async redirects() {
    return [
      {
        source: '/signin',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/sign-up',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
