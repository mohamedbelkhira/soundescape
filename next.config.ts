// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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