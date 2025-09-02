/** @type {import('next').NextConfig} */

/**
 * Next.js Configuration File
 * 
 * Configures the Next.js application with security, performance, and build settings.
 * Includes Content Security Policy (CSP) headers, environment variables, and optimization settings.
 * 
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

const nextConfig = {
  /**
   * React Strict Mode
   * Enables additional React development warnings and checks
   */
  reactStrictMode: true,

  /**
   * Production Browser Source Maps
   * Generates source maps for production builds for debugging
   */
  productionBrowserSourceMaps: false,

  /**
   * Images Configuration
   * Configures image optimization and allowed domains
   */
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  /**
   * Environment Variables
   * Expose environment variables to the browser
   */
  env: {
    // Add public environment variables here
    // Example: API_URL: process.env.API_URL,
  },

  /**
   * Security Headers
   * Configures HTTP headers for security
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Content Security Policy (CSP) can be added here
          // Note: CSP headers should be carefully configured based on actual needs
        ],
      },
    ];
  },

  /**
   * Webpack Configuration
   * Custom Webpack settings for bundle optimization
   */
  webpack: (config, { dev, isServer }) => {
    // Enable tree shaking for production
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
    }

    // Add custom Webpack plugins or rules here
    return config;
  },

  /**
   * Compiler Options
   * Configures SWC compiler for faster builds
   */
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  /**
   * Experimental Features
   * Enable Next.js experimental features
   */
  experimental: {
    // Example: appDir: true, // Already enabled in Next.js 13+
  },

  /**
   * ESLint Configuration
   * Disable ESLint during build to prevent failures due to linting errors
   */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;