import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unavatar.io',
        pathname: '/twitter/**',
      },
    ],
  },
};

export default nextConfig;
