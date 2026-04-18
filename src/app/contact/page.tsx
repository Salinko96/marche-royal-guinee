'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  Send,
  CheckCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nom requis';
    if (!form.email.trim()) e.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.message.trim()) e.message = 'Message requis';
    else if (form.message.trim().length < 10) e.message = 'Message trop court';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        toast.success('Message envoyé !', { description: 'Nous vous répondrons très bientôt.' });
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch {
      toast.error('Connexion impossible. Réessayez ou contactez-nous sur WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <ArrowLeft className="h-5 w-5 text-[#B8860B]" />
              <BrandLogo size="sm" href="" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Contactez-nous</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Une question ? On est là !</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Notre équipe répond sous 24h. Pour une réponse immédiate, contactez-nous sur WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Infos contact */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 border-0 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-5">Nos coordonnées</h3>
              <div className="space-y-5">
                <a
                  href="https://wa.me/224623457689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-green-700 transition">WhatsApp</p>
                    <p className="text-sm text-gray-500">+224 623 457 689</p>
                    <p className="text-xs text-green-600 mt-0.5">Réponse rapide</p>
                  </div>
                </a>

                <a
                  href="tel:+224623457689"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition">
                    <Phone className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-amber-700 transition">Téléphone</p>
                    <p className="text-sm text-gray-500">+224 623 457 689</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-500">Lambanyi, Conakry</p>
                    <p className="text-sm text-gray-500">République de Guinée</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Horaires</p>
                    <p className="text-sm text-gray-500">Lun – Sam : 8h – 20h</p>
                    <p className="text-sm text-gray-500">Dimanche : 10h – 18h</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA WhatsApp */}
            <a
              href="https://wa.me/224623457689?text=Bonjour%2C%20j%27ai%20une%20question%20pour%20MARCH%C3%89%20ROYAL%20DE%20GUIN%C3%89E."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="p-5 border-0 shadow-md bg-green-600 text-white cursor-pointer hover:bg-green-700 transition">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-8 w-8 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Réponse immédiate</p>
                    <p className="text-sm text-green-100">Discutez directement sur WhatsApp</p>
                  </div>
                </div>
              </Card>
            </a>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            {sent ? (
              <Card className="p-10 border-0 shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                <p className="text-gray-500 mb-6">
                  Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }} variant="outline">
                    Envoyer un autre message
                  </Button>
                  <Button asChild className="bg-[#B8860B] hover:bg-[#9A7209] text-white">
                    <Link href="/produits">Voir nos produits</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border-0 shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <Mail className="h-5 w-5 text-[#B8860B]" />
                  <h3 className="font-semibold text-gray-900 text-lg">Envoyer un message</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nom complet <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Mamadou Diallo"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`mt-1 ${errors.name ? 'border-red-400' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Téléphone <span className="text-gray-400 text-xs">(optionnel)</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="624 00 00 00"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mamadou@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`mt-1 ${errors.email ? 'border-red-400' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="message"
                      placeholder="Votre question ou demande..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length}/5000</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#B8860B] hover:bg-[#9A7209] text-white font-semibold shadow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" href="/" invert />
          </div>
          <p className="text-sm">Lambanyi, Conakry – Guinée | +224 623 457 689</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
            <Link href="/cgv" className="hover:text-gray-400 transition-colors">CGV</Link>
            <span>·</span>
            <Link href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions légales</Link>
            <span>·</span>
            <Link href="/confidentialite" className="hover:text-gray-400 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-xs mt-3">© {new Date().getFullYear()} MARCHÉ ROYAL DE GUINÉE. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
