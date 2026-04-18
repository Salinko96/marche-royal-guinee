'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, Package, Users, ShoppingCart, DollarSign,
  AlertTriangle, Loader2,
} from 'lucide-react';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF';

const COLORS = ['#B8860B', '#D4A418', '#F5C542', '#2563EB', '#EF4444', '#10B981'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};
const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Espèces',
  orange_money: 'Orange Money',
  mtn_money: 'MTN Money',
};

interface Analytics {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    pendingOrders: number;
    averageOrderValue: number;
  };
  salesTimeline: { date: string; label: string; revenue: number; orders: number }[];
  statusDistribution: { status: string; count: number }[];
  paymentMethods: { method: string; count: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  lowStockProducts: { id: string; name: string; slug: string; inStock: boolean }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  if (!data) return <p className="p-8 text-red-500">Erreur de chargement</p>;

  const { summary, salesTimeline, statusDistribution, paymentMethods, topProducts, lowStockProducts } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-500">Revenus</span>
            </div>
            <p className="text-lg font-bold">{formatPrice(summary.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-500">Commandes</span>
            </div>
            <p className="text-lg font-bold">{summary.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#B8860B]" />
              <span className="text-xs text-gray-500">Panier moyen</span>
            </div>
            <p className="text-lg font-bold">{formatPrice(summary.averageOrderValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-500">Produits</span>
            </div>
            <p className="text-lg font-bold">{summary.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-gray-500">Clients</span>
            </div>
            <p className="text-lg font-bold">{summary.totalCustomers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-gray-500">En attente</span>
            </div>
            <p className="text-lg font-bold text-yellow-700">{summary.pendingOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique ventes 30 jours */}
      <Card>
        <CardHeader>
          <CardTitle>Ventes des 30 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={11} />
              <YAxis fontSize={11} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
              <Tooltip
                formatter={(value: number) => [formatPrice(value), 'Revenus']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#B8860B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Nombre de commandes par jour */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes par jour</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={11} />
              <YAxis fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#D4A418" name="Commandes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <Card>
          <CardHeader>
            <CardTitle>Statuts des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution.filter(s => s.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={({ status, count }) => `${STATUS_LABELS[status] || status}: ${count}`}
                >
                  {statusDistribution.filter(s => s.count > 0).map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [value, STATUS_LABELS[name] || name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Méthodes de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Méthodes de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  dataKey="count"
                  nameKey="method"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={({ method, count }) => `${PAYMENT_LABELS[method] || method}: ${count}`}
                >
                  {paymentMethods.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [value, PAYMENT_LABELS[name] || name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top produits */}
      <Card>
        <CardHeader>
          <CardTitle>Top Produits</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune donnée de vente</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, topProducts.length * 50)}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={11} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <YAxis type="category" dataKey="name" width={150} fontSize={11} />
                <Tooltip formatter={(value: number) => [formatPrice(value), 'Revenus']} />
                <Bar dataKey="revenue" fill="#B8860B" name="Revenus" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Alertes stock */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Alertes Stock ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <Badge variant="destructive">Rupture de stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
