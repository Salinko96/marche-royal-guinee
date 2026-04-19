'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4A418] to-[#B8860B] rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">Installer l&apos;application</p>
              <p className="text-gray-500 text-xs mt-0.5">Accès rapide depuis votre écran d&apos;accueil</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-[#B8860B] hover:bg-[#9A7209] text-white h-8 px-3 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Installer
              </Button>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
