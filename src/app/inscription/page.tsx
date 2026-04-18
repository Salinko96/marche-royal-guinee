'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone, Lock, User, Mail, MapPin, ArrowLeft, Loader2, Eye, EyeOff,
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function InscriptionPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    address: '',
    city: 'Conakry',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    const result = await register({
      name: form.name,
      phone: form.phone,
      password: form.password,
      email: form.email || undefined,
      address: form.address || undefined,
      city: form.city || undefined,
    });

    if (result.success) {
      router.push('/compte');
    } else {
      setError(result.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF9E6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-[#B8860B] hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à la boutique
          </Link>
          <div className="flex justify-center mt-4">
            <BrandLogo size="lg" href="/" />
          </div>
          <p className="text-gray-500 mt-2">Créez votre compte client</p>
        </div>

        <Card className="shadow-xl border-[#B8860B]/20">
          <CardHeader>
            <CardTitle className="text-center text-xl">Inscription</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Nom complet */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Votre nom complet"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+224 6XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email (optionnel) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-gray-400">(optionnel)</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 4 caractères"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmer mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirmez votre mot de passe"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse de livraison <span className="text-gray-400">(optionnel)</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="Quartier, rue..."
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#B8860B] hover:bg-[#996F0A] text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Déjà un compte ?{' '}
                <Link href="/connexion" className="text-[#B8860B] font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
