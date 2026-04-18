'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Settings, Phone, MapPin, Store, MessageCircle,
  Lock, Save, Loader2, CheckCircle, BarChart3, User,
} from 'lucide-react';

interface SettingsData {
  whatsapp_number: string;
  phone_number: string;
  store_address: string;
  store_name: string;
  delivery_info: string;
  facebook_pixel: string;
  google_analytics: string;
}

interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    whatsapp_number: '',
    phone_number: '',
    store_address: '',
    store_name: '',
    delivery_info: '',
    facebook_pixel: '',
    google_analytics: '',
  });
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.admin) setAdmin(data.admin);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwords.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changePassword: {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch {
      setPasswordError('Erreur réseau');
    }
    setPasswordSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#B8860B]" />
          Paramètres
        </h1>
      </div>

      {/* Infos Admin */}
      {admin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5 text-[#B8860B]" />
              Compte Administrateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Nom</p>
                <p className="font-semibold">{admin.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold">{admin.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Rôle</p>
                <p className="font-semibold capitalize">{admin.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paramètres boutique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Store className="w-5 h-5 text-[#B8860B]" />
            Informations de la Boutique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-400" />
                Nom de la boutique
              </Label>
              <Input
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                placeholder="MARCHÉ ROYAL DE GUINÉE"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Adresse
              </Label>
              <Input
                value={settings.store_address}
                onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                placeholder="Lambanyi, Conakry – Guinée"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Numéro de téléphone
              </Label>
              <Input
                value={settings.phone_number}
                onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                placeholder="+224 623 457 689"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                Numéro WhatsApp (sans +)
              </Label>
              <Input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="224623457689"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Info livraison</Label>
              <Input
                value={settings.delivery_info}
                onChange={(e) => setSettings({ ...settings, delivery_info: e.target.value })}
                placeholder="Livraison 24-48h à Conakry"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5 text-[#B8860B]" />
            Tracking & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Facebook Pixel ID</Label>
              <Input
                value={settings.facebook_pixel}
                onChange={(e) => setSettings({ ...settings, facebook_pixel: e.target.value })}
                placeholder="123456789012345"
              />
              <p className="text-xs text-gray-500">Laissez vide pour désactiver</p>
            </div>
            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input
                value={settings.google_analytics}
                onChange={(e) => setSettings({ ...settings, google_analytics: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-gray-500">Laissez vide pour désactiver</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton sauvegarder */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-[#B8860B] hover:bg-[#996F0A] text-white px-8"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sauvegarde...</>
          ) : saveSuccess ? (
            <><CheckCircle className="w-4 h-4 mr-2" /> Sauvegardé !</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Sauvegarder les paramètres</>
          )}
        </Button>
        {saveSuccess && (
          <span className="text-green-600 text-sm font-medium">
            Paramètres mis à jour avec succès.
          </span>
        )}
      </div>

      <Separator />

      {/* Changer le mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-5 h-5 text-[#B8860B]" />
            Changer le Mot de Passe Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mot de passe changé avec succès.
              </div>
            )}

            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Minimum 6 caractères"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={passwordSaving}
              className="bg-gray-800 hover:bg-gray-900 text-white"
            >
              {passwordSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Changement...</>
              ) : (
                <><Lock className="w-4 h-4 mr-2" /> Changer le mot de passe</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
