/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com'],
    unoptimized: true,
  },
  output: 'export',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig;
