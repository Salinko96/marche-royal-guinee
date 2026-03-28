'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: string;
  notes?: string;
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/products'); // Note: replace with /api/admin/orders when available
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus as Order['status'] }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Payée',
      pending: 'En attente',
      failed: 'Échouée',
    };
    return labels[status] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(
    (order) => selectedStatus === 'all' || order.status === selectedStatus
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-600 mt-1">Gérez toutes vos commandes</p>
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">
            Toutes ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({orders.filter((o) => o.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmées ({orders.filter((o) => o.status === 'confirmed').length})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Expédiées ({orders.filter((o) => o.status === 'shipped').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Livrées ({orders.filter((o) => o.status === 'delivered').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées ({orders.filter((o) => o.status === 'cancelled').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order.id ? null : order.id
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Commande #{order.id.substring(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customerName} • {order.customerPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Badge className={`${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(order.total)} GNF
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <button className="ml-4 p-2">
                    {expandedOrder === order.id ? (
                      <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrder === order.id && (
                <div className="p-6 space-y-6 bg-gray-50">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Articles commandés
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-white rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)} GNF
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Informations client
                    </h3>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase mb-1">Nom</p>
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase mb-1">Téléphone</p>
                        <p className="font-medium text-gray-900">
                          {order.customerPhone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 uppercase mb-1">Email</p>
                        <p className="font-medium text-gray-900">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 uppercase mb-2">
                        Méthode de paiement
                      </p>
                      <p className="font-medium text-gray-900">
                        {order.paymentMethod}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 uppercase mb-2">
                        Statut du paiement
                      </p>
                      <p className="font-medium text-gray-900">
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </p>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Mettre à jour le statut
                    </h3>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      disabled={updatingId === order.id}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 uppercase mb-2">Notes</p>
                      <p className="text-gray-900">{order.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-0 shadow-md">
            <p className="text-gray-600">
              Aucune commande avec ce statut pour le moment
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
