'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  User, Phone, Mail, MapPin, Package, LogOut, ArrowLeft,
  Loader2, CheckCircle, Clock, Truck, ShoppingCart, Edit2, Save,
} from 'lucide-react';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-3 h-3" /> },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-3 h-3" /> },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: <Clock className="w-3 h-3" /> },
};

export default function ComptePage() {
  const router = useRouter();
  const { customer, logout, updateProfile, fetchProfile } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', email: '', address: '', city: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/connexion');
          return;
        }
        const data = await res.json();
        if (data.customer) {
          setEditForm({
            name: data.customer.name || '',
            email: data.customer.email || '',
            address: data.customer.address || '',
            city: data.customer.city || 'Conakry',
          });
        }
        setOrders(data.orders || []);
      } catch {
        router.push('/connexion');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const success = await updateProfile(editForm);
    if (success) {
      setEditing(false);
      await fetchProfile();
    }
    setSaving(false);
  };

  const parseItems = (itemsStr: string): OrderItem[] => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9E6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF9E6]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-[#B8860B]" />
            <BrandLogo size="sm" href="/" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/produits">
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4 mr-1" /> Boutique
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Profil */}
        <Card className="shadow-lg border-[#B8860B]/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#B8860B]" />
              Mon Profil
            </CardTitle>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-1" /> Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Annuler</Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={saving}
                  className="bg-[#B8860B] hover:bg-[#996F0A] text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> Enregistrer</>}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom complet</Label>
                  <Input value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input value={customer.phone} disabled className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-[#B8860B]" />
                  <div><p className="text-xs text-gray-500">Nom</p><p className="font-medium">{customer.name}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-[#B8860B]" />
                  <div><p className="text-xs text-gray-500">Téléphone</p><p className="font-medium">{customer.phone}</p></div>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#B8860B]" />
                    <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{customer.email}</p></div>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#B8860B]" />
                    <div><p className="text-xs text-gray-500">Adresse</p><p className="font-medium">{customer.address}</p></div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commandes */}
        <Card className="shadow-lg border-[#B8860B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#B8860B]" />
              Mes Commandes ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Aucune commande pour le moment</p>
                <Link href="/produits">
                  <Button className="bg-[#B8860B] hover:bg-[#996F0A] text-white">
                    Découvrir nos produits
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = parseItems(order.items);
                  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  });
                  return (
                    <div key={order.id} className="border rounded-lg p-4 hover:border-[#B8860B]/40 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-gray-500">{date}</p>
                        </div>
                        <Badge className={status.color + ' flex items-center gap-1'}>
                          {status.icon} {status.label}
                        </Badge>
                      </div>
                      <Separator className="mb-3" />
                      <div className="space-y-1 mb-3">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-lg font-bold text-[#B8860B]">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
