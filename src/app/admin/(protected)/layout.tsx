'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Tag,
  Star,
  Bell,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// ── Son de notification via Web Audio API (pas de fichier externe) ──────────
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const times = [0, 0.15, 0.30];
    times.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + t + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + t + 0.18);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.2);
    });
  } catch {
    // Web Audio non disponible — pas grave
  }
}

const POLL_INTERVAL = 30_000; // 30 secondes

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  // ── Système d'alerte nouvelles commandes ──────────────────────────────────
  const [pendingCount, setPendingCount] = useState(0);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const lastKnownCount = useRef<number | null>(null);

  const checkNewOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders?status=pending', {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const orders = await res.json();
      const count = Array.isArray(orders) ? orders.length : 0;

      setPendingCount(count);

      // Première vérification : initialise sans alerter
      if (lastKnownCount.current === null) {
        lastKnownCount.current = count;
        return;
      }

      // Nouvelle(s) commande(s) détectée(s)
      if (count > lastKnownCount.current) {
        const diff = count - lastKnownCount.current;
        lastKnownCount.current = count;
        setNewOrderAlert(true);
        playNotificationSound();
        toast.success(
          diff === 1
            ? '🛒 Nouvelle commande reçue !'
            : `🛒 ${diff} nouvelles commandes reçues !`,
          {
            description: 'Cliquez sur "Commandes" pour les voir.',
            duration: 8000,
            action: {
              label: 'Voir',
              onClick: () => router.push('/admin/commandes'),
            },
          }
        );
      } else {
        lastKnownCount.current = count;
      }
    } catch {
      // Erreur réseau — on ignore silencieusement
    }
  }, [router]);

  // Réinitialise l'alerte quand l'admin visite la page commandes
  useEffect(() => {
    if (pathname.startsWith('/admin/commandes')) {
      setNewOrderAlert(false);
    }
  }, [pathname]);

  // Polling toutes les 30s (uniquement si authentifié)
  useEffect(() => {
    if (!isAuthenticated) return;
    checkNewOrders(); // vérification immédiate
    const interval = setInterval(checkNewOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, checkNewOrders]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setAdminName(data.admin?.name || data.name || 'Admin');
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const menuItems = [
    {
      name: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
      badge: null,
    },
    {
      name: 'Produits',
      href: '/admin/produits',
      icon: Package,
      active: pathname.startsWith('/admin/produits'),
      badge: null,
    },
    {
      name: 'Commandes',
      href: '/admin/commandes',
      icon: ShoppingBag,
      active: pathname.startsWith('/admin/commandes'),
      badge: pendingCount > 0 ? pendingCount : null,
      alert: newOrderAlert,
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      active: pathname.startsWith('/admin/messages'),
      badge: null,
    },
    {
      name: 'Avis',
      href: '/admin/avis',
      icon: Star,
      active: pathname.startsWith('/admin/avis'),
      badge: null,
    },
    {
      name: 'Coupons',
      href: '/admin/coupons',
      icon: Tag,
      active: pathname.startsWith('/admin/coupons'),
      badge: null,
    },
    {
      name: 'Newsletter',
      href: '/admin/newsletter',
      icon: Mail,
      active: pathname.startsWith('/admin/newsletter'),
      badge: null,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      active: pathname.startsWith('/admin/analytics'),
      badge: null,
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/settings'),
      badge: null,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center justify-center gap-3">
            <Image
              src="/logo-royal.png"
              alt="Royal Marché de Guinée"
              width={sidebarOpen ? 120 : 36}
              height={sidebarOpen ? 60 : 36}
              className={`object-contain brightness-0 invert transition-all ${sidebarOpen ? 'h-12 w-auto' : 'h-9 w-9'}`}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                    item.active
                      ? 'bg-amber-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Icon size={20} />
                    {/* Badge rouge clignotant si nouvelles commandes */}
                    {'alert' in item && item.alert && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium flex-1 text-left">
                      {item.name}
                    </span>
                  )}
                  {/* Compteur de commandes en attente */}
                  {sidebarOpen && item.badge !== null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      'alert' in item && item.alert
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Cloche d'alerte si nouvelles commandes */}
            {newOrderAlert && (
              <button
                onClick={() => router.push('/admin/commandes')}
                className="relative p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                title={`${pendingCount} commande(s) en attente`}
              >
                <Bell size={20} className="text-red-500" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              </button>
            )}

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{adminName}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
              {adminName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
