/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com'],
    unoptimized: true,
  },
  output: 'export',
  basePath: '/www.btcnews.co.za',
  assetPrefix: '/www.btcnews.co.za/',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig;
