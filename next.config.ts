import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,

  // Prisma : évite d'embarquer le client dans le bundle edge
  serverExternalPackages: ['@prisma/client', 'bcrypt'],

  // Réduit le bundle JS en n'important que les icônes utilisées
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'sonner',
    ],
  },

  // Optimisation des images avec next/image
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours de cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },

  // Compression et optimisation
  compress: true,

  // En-têtes de sécurité
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com https://www.google-analytics.com",
              // Fonts auto-hébergées via next/font — pas besoin de fonts.googleapis.com
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://aigc-files.bigmodel.cn https://vercel.com https://*.public.blob.vercel-storage.com",
              "media-src 'self' https://aigc-files.bigmodel.cn https://*.public.blob.vercel-storage.com",
              "frame-src 'self' https://www.facebook.com",
            ].join('; '),
          },
        ],
      },
      {
        // Cache statique pour les assets
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};


export default nextConfig;
