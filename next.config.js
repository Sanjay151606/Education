/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix Windows build worker issues
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Optimize for production
  swcMinify: true
}

module.exports = nextConfig
