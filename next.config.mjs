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
  // Exclure les routes API de l'exportation statique
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/dashboard': { page: '/dashboard' },
      '/agencies': { page: '/agencies' },
      '/support': { page: '/support' },
      '/register': { page: '/register' },
      '/new-reservation': { page: '/new-reservation' },
      '/admin': { page: '/admin' },
      '/admin/dashboard': { page: '/admin/dashboard' },
    };
  },
}

export default nextConfig
