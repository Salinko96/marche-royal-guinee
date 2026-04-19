'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const COUPON_CODE = 'ROYAL10';
const STORAGE_KEY = 'exit-popup-shown';

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    // Ne pas montrer si déjà vu dans les 3 derniers jours
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown && Date.now() - Number(lastShown) < 3 * 24 * 60 * 60 * 1000) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true;
        setOpen(true);
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    };

    // Sur mobile : déclencher après 30 secondes de navigation
    const mobileTimer = setTimeout(() => {
      if (!triggered.current && window.innerWidth < 768) {
        triggered.current = true;
        setOpen(true);
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success(`Code copié : ${COUPON_CODE}`, { description: '-10% sur votre prochaine commande' });
        navigator.clipboard.writeText(COUPON_CODE).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>

            {/* Header doré */}
            <div className="bg-gradient-to-br from-[#1a1400] to-[#3d2c00] px-8 pt-8 pb-6 text-center">
              <div className="w-14 h-14 bg-[#D4A418] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tag className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-1">Attendez ! 👑</h2>
              <p className="text-[#D4A418] font-semibold text-lg">-10% sur votre commande</p>
            </div>

            <div className="px-8 py-6">
              {done ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Votre code est prêt !</p>
                  <div className="bg-[#FFF9E6] border-2 border-dashed border-[#D4A418] rounded-xl py-3 px-6 mb-3">
                    <p className="text-[#B8860B] font-black text-2xl tracking-widest">{COUPON_CODE}</p>
                  </div>
                  <p className="text-gray-500 text-sm">Copié dans votre presse-papiers automatiquement</p>
                  <Button
                    onClick={() => setOpen(false)}
                    className="mt-4 bg-[#B8860B] hover:bg-[#9A7209] text-white w-full"
                  >
                    Utiliser mon code maintenant →
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm text-center mb-5">
                    Entrez votre email pour recevoir votre code de réduction exclusif.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                    <Button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="w-full h-12 bg-[#B8860B] hover:bg-[#9A7209] text-white font-bold text-base"
                    >
                      {loading ? 'Envoi...' : 'Obtenir mon -10% 🎁'}
                    </Button>
                  </form>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600"
                  >
                    Non merci, je préfère payer plein tarif
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
