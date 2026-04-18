'use client';

import { useEffect, useState } from 'react';
import { Mail, Download, Trash2, Users, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter?active=${!showInactive}`);
      if (res.ok) setSubscribers(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [showInactive]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnsubscribe = async (id: string, email: string) => {
    if (!confirm(`Désinscrire ${email} ?`)) return;
    const res = await fetch('/api/admin/newsletter', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success('Désabonné');
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } else {
      toast.error('Erreur');
    }
  };

  const exportCSV = () => {
    const active = subscribers.filter((s) => s.active);
    const csv = ['Email,Nom,Date inscription', ...active.map((s) =>
      `${s.email},${s.name ?? ''},${new Date(s.createdAt).toLocaleDateString('fr-FR')}`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${active.length} emails exportés`);
  };

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-6 w-6 text-amber-500" />
            Newsletter
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des abonnés à la newsletter</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Actualiser
          </Button>
          <Button size="sm" onClick={exportCSV} className="bg-amber-500 hover:bg-amber-600 text-white">
            <Download className="h-4 w-4 mr-1.5" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            <p className="text-sm text-gray-500">Abonnés actifs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            <p className="text-sm text-gray-500">Total inscrits</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-gray-300 accent-amber-500"
          />
          Afficher les désabonnés
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Mail className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">Aucun abonné pour l&apos;instant</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Nom</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{s.email}</span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{s.name || '—'}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      s.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.active ? 'Actif' : 'Désabonné'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.active && (
                      <button
                        onClick={() => handleUnsubscribe(s.id, s.email)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Désinscrire"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
