/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simple config for development without security headers
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
