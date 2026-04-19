'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppBubble() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setShowTooltip(true), 800);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 max-w-[200px] text-right"
          >
            <p className="font-semibold text-gray-900">Besoin d&apos;aide ?</p>
            <p className="text-gray-500 text-xs mt-0.5">On répond en moins de 5 min 👋</p>
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -left-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <X className="h-3 w-3 text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/224623457689?text=Bonjour%2C%20je%20voudrais%20des%20informations%20sur%20vos%20produits."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl"
      >
        <MessageCircle className="h-7 w-7 text-white fill-white" />
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
      </motion.a>
    </div>
  );
}
