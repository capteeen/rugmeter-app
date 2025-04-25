/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['unavatar.io'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  webpack: (config, { isServer }) => {
    // Handle Handlebars require.extensions warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
    };
    return config;
  },
}

module.exports = nextConfig 