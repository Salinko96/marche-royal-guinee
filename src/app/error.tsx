'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw, MessageCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF9E6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Une erreur est survenue
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Notre équipe a été notifiée. Veuillez réessayer ou revenir à l&apos;accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            onClick={reset}
            className="bg-[#B8860B] hover:bg-[#996F0A] text-white gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href="/">
              <Home className="w-4 h-4" />
              Retour à l&apos;accueil
            </a>
          </Button>
        </div>

        <p className="text-sm text-gray-400">
          Problème persistant ?{' '}
          <a
            href="https://wa.me/224623457689"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            Contactez-nous
          </a>
        </p>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <details className="mt-6 text-left bg-red-50 rounded-lg p-4 text-xs text-red-700 border border-red-200">
            <summary className="cursor-pointer font-medium mb-2">Détails de l&apos;erreur (dev)</summary>
            <pre className="overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
