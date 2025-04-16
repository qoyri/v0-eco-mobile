/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppression de output: 'export'
  // Suppression de distDir: 'out'
  images: {
    domains: ['placeholder.svg'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
