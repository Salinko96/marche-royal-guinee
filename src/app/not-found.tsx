'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, Package, MessageCircle, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF9E6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <BrandLogo size="lg" href="/" />
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-black text-[#B8860B] mb-4">404</h1>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Page introuvable
        </h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Cette page n&apos;existe pas ou a été déplacée. Revenez à la boutique pour découvrir nos montres et accessoires premium.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Button asChild className="bg-[#B8860B] hover:bg-[#996F0A] text-white gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/produits">
              <Package className="w-4 h-4" />
              Voir les produits
            </Link>
          </Button>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-left">
          <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#B8860B]" />
            Pages populaires
          </p>
          <ul className="space-y-2">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/produits', label: 'Catalogue complet' },
              { href: '/suivi', label: 'Suivi de commande' },
              { href: '/connexion', label: 'Mon compte' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#B8860B] transition-colors py-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support WhatsApp */}
        <p className="mt-6 text-sm text-gray-400">
          Besoin d&apos;aide ?{' '}
          <a
            href="https://wa.me/224623457689"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            Contactez-nous sur WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
