'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  ShoppingCart,
  Phone,
  User,
  MapPin,
  CreditCard,
  ArrowLeft,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Format prix en GNF
const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF';

type PaymentMethod = 'cash' | 'orange_money' | 'mtn_money';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: '💵 Paiement à la livraison',
  orange_money: '🟠 Orange Money',
  mtn_money: '🟡 MTN Money',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal: getTotalPrice() }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponDiscount(data.coupon.discount);
        setCouponApplied(data.coupon.code);
      } else {
        setCouponError(data.error || 'Code invalide');
        setCouponDiscount(0);
        setCouponApplied('');
      }
    } catch {
      setCouponError('Erreur réseau');
    }
    setCouponLoading(false);
  };

  // Rediriger si panier vide
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [items, orderPlaced, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Nom requis';
    if (!form.customerPhone.trim()) newErrors.customerPhone = 'Téléphone requis';
    else if (!/^[0-9+\s]{8,15}$/.test(form.customerPhone.trim()))
      newErrors.customerPhone = 'Numéro invalide';
    if (form.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
      newErrors.customerEmail = 'Email invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: String(item.id),
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          totalAmount: getTotalPrice() - couponDiscount,
          paymentMethod,
          couponCode: couponApplied || undefined,
          status: 'pending',
          paymentStatus: 'pending',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.id?.substring(0, 8).toUpperCase() || 'NOUVEAU');
        setOrderPlaced(true);
        clearCart();
        toast.success('Commande confirmée ! 🎉', {
          description: 'Notre équipe vous contactera sous 24h.',
          duration: 5000,
        });
      } else {
        const err = await response.json();
        toast.error('Erreur lors de la commande', {
          description: err.error || 'Veuillez réessayer ou nous contacter sur WhatsApp.',
        });
      }
    } catch {
      toast.error('Connexion impossible', {
        description: 'Vérifiez votre connexion internet et réessayez.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const itemsList = items
      .map((i) => `• ${i.name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
      .join('\n');
    const total = formatPrice(getTotalPrice());
    const msg = encodeURIComponent(
      `Bonjour, je souhaite commander :\n\n${itemsList}\n\nTotal : ${total}\n\nNom : ${form.customerName}\nTél : ${form.customerPhone}${form.customerAddress ? '\nAdresse : ' + form.customerAddress : ''}\n\nMerci de confirmer ma commande.`
    );
    window.open(`https://wa.me/224623457689?text=${msg}`, '_blank');
  };

  // ─── Écran de confirmation ───────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-xl border-0">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-2">
            Votre commande <span className="font-semibold text-amber-600">#{orderId}</span> a bien été reçue.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Notre équipe vous contactera sous peu au{' '}
            <span className="font-medium">{form.customerPhone}</span> pour confirmer la livraison.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => window.open(`https://wa.me/224623457689?text=${encodeURIComponent(`Bonjour, je viens de passer la commande #${orderId}. Merci de confirmer !`)}`, '_blank')}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <MessageCircle size={18} />
              Confirmer via WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Retour à la boutique
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── Formulaire de commande ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-amber-600" />
            <h1 className="text-xl font-bold text-gray-900">Finaliser la commande</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─── Formulaire ─── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Infos client */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <User size={20} className="text-amber-600" />
              Vos informations
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Mamadou Diallo"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className={`mt-1 ${errors.customerName ? 'border-red-400' : ''}`}
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone size={14} />
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="Ex: 624 00 00 00"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className={`mt-1 ${errors.customerPhone ? 'border-red-400' : ''}`}
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-gray-400 text-xs">(optionnel)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: mamadou@email.com"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className={`mt-1 ${errors.customerEmail ? 'border-red-400' : ''}`}
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin size={14} />
                  Adresse de livraison <span className="text-gray-400 text-xs">(optionnel)</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Ex: Kaloum, Conakry"
                  value={form.customerAddress}
                  onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes <span className="text-gray-400 text-xs">(optionnel)</span>
                </Label>
                <textarea
                  id="notes"
                  placeholder="Instructions spéciales pour la livraison..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Méthode de paiement */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-600" />
              Mode de paiement
            </h2>
            <div className="space-y-3">
              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-amber-500"
                  />
                  <span className="font-medium text-gray-800">
                    {PAYMENT_LABELS[method]}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Bouton commander */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Envoi en cours...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2" size={20} />
                Confirmer la commande — {formatPrice(getTotalPrice() - couponDiscount)}
              </>
            )}
          </Button>

          {/* Option WhatsApp directe */}
          <Button
            type="button"
            variant="outline"
            onClick={handleWhatsApp}
            className="w-full gap-2 text-green-700 border-green-300 hover:bg-green-50"
          >
            <MessageCircle size={18} />
            Commander directement via WhatsApp
          </Button>
        </form>

        {/* ─── Récapitulatif ─── */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-amber-600" />
              Récapitulatif ({items.length} article{items.length > 1 ? 's' : ''})
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison</span>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  Gratuite
                </Badge>
              </div>
            </div>

            {/* Code promo */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium">Code promo</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="PROMO2024"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                  disabled={!!couponApplied}
                />
                {couponApplied ? (
                  <Button variant="outline" size="sm" onClick={() => {
                    setCouponCode(''); setCouponDiscount(0); setCouponApplied(''); setCouponError('');
                  }}>Retirer</Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={applyCoupon} disabled={couponLoading}>
                    {couponLoading ? '...' : 'Appliquer'}
                  </Button>
                )}
              </div>
              {couponError && <p className="text-xs text-red-500">{couponError}</p>}
              {couponApplied && (
                <p className="text-xs text-green-600">Coupon {couponApplied} appliqué : -{formatPrice(couponDiscount)}</p>
              )}
            </div>

            <Separator className="my-4" />

            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Réduction</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-amber-600">
                {formatPrice(getTotalPrice() - couponDiscount)}
              </span>
            </div>
          </Card>

          {/* Garanties */}
          <Card className="p-4 border-0 shadow-sm bg-green-50">
            <div className="space-y-2 text-sm text-green-800">
              <p className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Livraison rapide à Conakry
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Paiement sécurisé à la livraison
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Satisfait ou remboursé
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
