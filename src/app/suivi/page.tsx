"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Loader2,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

// ============================================
// Types
// ============================================
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  shortId: string;
  customerName: string;
  items: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Format prix en GNF
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-GN").format(price) + " GNF";
};

// Statut commande → couleur + icône + label
const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock; step: number }
> = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
    step: 1,
  },
  confirmed: {
    label: "Confirmée",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
    step: 2,
  },
  shipped: {
    label: "En livraison",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: "Livrée",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    step: 4,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    step: 0,
  },
};

const paymentMethodLabels: Record<string, string> = {
  cash: "Espèces à la livraison",
  orange_money: "Orange Money",
  mtn_money: "MTN Mobile Money",
};

// ============================================
// Composant Barre de progression
// ============================================
function OrderProgress({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending;
  const steps = [
    { label: "En attente", step: 1 },
    { label: "Confirmée", step: 2 },
    { label: "En livraison", step: 3 },
    { label: "Livrée", step: 4 },
  ];

  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-2 py-4 bg-red-50 rounded-lg">
        <XCircle className="h-6 w-6 text-red-500" />
        <span className="font-semibold text-red-700">Commande annulée</span>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Ligne de fond */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        {/* Ligne active */}
        <div
          className="absolute top-5 left-0 h-1 bg-[#B8860B] rounded-full transition-all duration-500"
          style={{
            width: `${((config.step - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((s) => (
          <div key={s.step} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s.step <= config.step
                  ? "bg-[#B8860B] text-white shadow-md"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s.step <= config.step ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                s.step
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                s.step <= config.step ? "text-[#B8860B]" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Composant carte de commande
// ============================================
function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  let parsedItems: OrderItem[] = [];
  try {
    parsedItems = JSON.parse(order.items);
  } catch {
    parsedItems = [];
  }

  return (
    <Card className="border shadow-md overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-gray-500">Commande</p>
            <CardTitle className="text-xl font-mono">
              #{order.shortId}
            </CardTitle>
          </div>
          <Badge className={config.color}>
            <StatusIcon className="h-3.5 w-3.5 mr-1" />
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          Passée le{" "}
          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Barre de progression */}
        <OrderProgress status={order.status} />

        <Separator />

        {/* Articles */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Articles</h4>
          <div className="space-y-2">
            {parsedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Total et paiement */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Mode de paiement</p>
            <p className="font-medium text-sm">
              {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-[#B8860B]">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Statut paiement */}
        <div className="flex items-center gap-2">
          <Badge
            variant={
              order.paymentStatus === "completed" ? "default" : "outline"
            }
            className={
              order.paymentStatus === "completed"
                ? "bg-green-100 text-green-700"
                : ""
            }
          >
            {order.paymentStatus === "completed"
              ? "Payé"
              : order.paymentStatus === "failed"
              ? "Échec paiement"
              : "Paiement en attente"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Page principale : Suivi de commande
// ============================================
export default function SuiviPage() {
  const [searchType, setSearchType] = useState<"id" | "phone">("id");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    setError("");
    setOrders([]);
    setSearched(true);

    try {
      const param = searchType === "id" ? "id" : "phone";
      const res = await fetch(
        `/api/track?${param}=${encodeURIComponent(searchValue.trim())}`
      );

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const data = await res.json();
        setError(data.error || "Commande introuvable");
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }, [searchType, searchValue]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <ArrowLeft className="h-5 w-5 text-[#B8860B]" />
              <BrandLogo size="sm" href="" className="hidden sm:block" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Suivi commande</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre */}
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-[#B8860B] mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Suivez votre commande
          </h2>
          <p className="text-gray-500">
            Entrez votre numéro de commande ou votre numéro de téléphone pour
            voir l&apos;état de votre livraison.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {/* Choix du type de recherche */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={searchType === "id" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("id")}
                className={
                  searchType === "id"
                    ? "bg-[#B8860B] hover:bg-[#9A7209]"
                    : ""
                }
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                N° de commande
              </Button>
              <Button
                variant={searchType === "phone" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("phone")}
                className={
                  searchType === "phone"
                    ? "bg-[#B8860B] hover:bg-[#9A7209]"
                    : ""
                }
              >
                <Phone className="h-4 w-4 mr-2" />
                Numéro de téléphone
              </Button>
            </div>

            {/* Champ de recherche */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    searchType === "id"
                      ? "Ex: CMNBW79C..."
                      : "Ex: 712284781"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !searchValue.trim()}
                className="bg-[#B8860B] hover:bg-[#9A7209] text-white px-6"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Rechercher"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#B8860B] mx-auto mb-3" />
            <p className="text-gray-500">Recherche en cours...</p>
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <p className="text-sm text-red-500 mb-4">
                Vous ne retrouvez pas votre commande ? Contactez-nous sur
                WhatsApp.
              </p>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() =>
                  window.open(
                    "https://wa.me/224623457689?text=" +
                      encodeURIComponent(
                        "Bonjour, je cherche ma commande mais je ne la trouve pas."
                      ),
                    "_blank"
                  )
                }
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {!loading && !error && searched && orders.length === 0 && !error && (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun résultat trouvé.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" href="/" invert />
          </div>
          <p className="text-sm">
            Lambanyi, Conakry – Guinée | +224 623 457 689
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
            <a href="/cgv" className="hover:text-gray-400 transition-colors">CGV</a>
            <span>·</span>
            <a href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions légales</a>
            <span>·</span>
            <a href="/confidentialite" className="hover:text-gray-400 transition-colors">Confidentialité</a>
          </div>
          <p className="text-xs mt-3">
            © {new Date().getFullYear()} MARCHÉ ROYAL DE GUINÉE. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
