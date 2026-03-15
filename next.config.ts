import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Optimisation des images pour la vitesse
  images: {
    unoptimized: true, // Utiliser les images directement sans optimisation Next.js
    formats: ['image/webp'],
  },
};

export default nextConfig;
