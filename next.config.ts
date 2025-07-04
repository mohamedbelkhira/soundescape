// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Add this to skip prerendering errors
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '10.1.0.101',
        port: '3001',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '3001',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '46.202.171.194',
        port: '3000',
        pathname: '/api/uploads/**',
      },
      // Add your production domain here when you deploy
      // {
      //   protocol: 'https',
      //   hostname: 'yourdomain.com',
      //   pathname: '/api/uploads/**',
      // },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;