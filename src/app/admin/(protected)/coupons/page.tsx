'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Loader2, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '',
  });

  const loadCoupons = async () => {
    const res = await fetch('/api/admin/coupons');
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  };

  useEffect(() => { loadCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '' });
      await loadCoupons();
    }
    setCreating(false);
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch('/api/admin/coupons', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
    });
    await loadCoupons();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Supprimer ce coupon ?')) return;
    await fetch('/api/admin/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await loadCoupons();
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
      <h1 className="text-3xl font-bold text-gray-900">Coupons & Réductions</h1>

      {/* Formulaire création */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nouveau Coupon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input placeholder="PROMO2024" value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                  <SelectItem value="fixed">Montant fixe (GNF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valeur *</Label>
              <Input type="number" placeholder={form.type === 'percentage' ? '10' : '50000'}
                value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Commande minimum (GNF)</Label>
              <Input type="number" placeholder="0" value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Utilisations max</Label>
              <Input type="number" placeholder="Illimité" value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date d'expiration</Label>
              <Input type="date" value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" disabled={creating} className="bg-[#B8860B] hover:bg-[#996F0A] text-white">
                {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Créer le coupon
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Liste des coupons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" /> Tous les coupons ({coupons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun coupon créé</p>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${coupon.active ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-lg font-mono">{coupon.code}</p>
                      <p className="text-sm text-gray-500">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                        {coupon.minOrder ? ` · Min: ${formatPrice(coupon.minOrder)}` : ''}
                        {coupon.maxUses ? ` · ${coupon.usedCount}/${coupon.maxUses} utilisations` : ` · ${coupon.usedCount} utilisations`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {coupon.expiresAt && (
                      <Badge variant={new Date(coupon.expiresAt) < new Date() ? 'destructive' : 'outline'}>
                        {new Date(coupon.expiresAt) < new Date() ? 'Expiré' :
                          `Expire le ${new Date(coupon.expiresAt).toLocaleDateString('fr-FR')}`}
                      </Badge>
                    )}
                    <Badge className={coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                      {coupon.active ? 'Actif' : 'Inactif'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(coupon)}>
                      {coupon.active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCoupon(coupon.id)}
                      className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
