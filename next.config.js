/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['unavatar.io'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 