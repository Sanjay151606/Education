/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix Windows build worker issues
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Optimize for production
  swcMinify: true,
  // Reduce memory usage
  webpack: (config, { isServer }) => {
    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    }
    return config
  },
  // Disable source maps in development to save memory
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
