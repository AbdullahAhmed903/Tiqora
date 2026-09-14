import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    qualities: [75, 85, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol:"https",
        hostname:"mctcgwfnlrxxnbhmioon.supabase.co"
      }
    ],
  },
};

export default nextConfig;
