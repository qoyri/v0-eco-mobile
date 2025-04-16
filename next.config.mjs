/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Nécessaire pour Capacitor
  distDir: 'out',
  images: {
    unoptimized: true, // Nécessaire pour le mode export
  },
  // Désactiver le serveur en production
  experimental: {
    // Nécessaire pour le mode export
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
