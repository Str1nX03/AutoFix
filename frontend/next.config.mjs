/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Compression and Performance
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {},
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect www to non-www (optional)
      // {
      //   source: '/:path*',
      //   destination: '/:path*',
      //   permanent: true,
      // },
    ];
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
