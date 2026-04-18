'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function AvisPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const loadReviews = async () => {
    const res = await fetch('/api/admin/reviews');
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const approveReview = async (id: string, approved: boolean) => {
    await fetch('/api/admin/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    });
    await loadReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Supprimer cet avis ?')) return;
    await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await loadReviews();
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

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
        <h1 className="text-3xl font-bold text-gray-900">
          Avis Clients {pendingCount > 0 && <Badge className="ml-2 bg-yellow-100 text-yellow-800">{pendingCount} en attente</Badge>}
        </h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-[#B8860B] text-white' : ''}>
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Approuvés'}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Aucun avis {filter !== 'all' ? 'dans cette catégorie' : ''}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <Card key={review.id} className={!review.approved ? 'border-yellow-300 bg-yellow-50/50' : ''}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{review.customerName}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Badge className={review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {review.approved ? 'Approuvé' : 'En attente'}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">Produit: {review.productId.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {!review.approved && (
                      <Button variant="ghost" size="sm" onClick={() => approveReview(review.id, true)}
                        className="text-green-600 hover:text-green-700">
                        <CheckCircle className="w-5 h-5" />
                      </Button>
                    )}
                    {review.approved && (
                      <Button variant="ghost" size="sm" onClick={() => approveReview(review.id, false)}
                        className="text-yellow-600 hover:text-yellow-700">
                        <XCircle className="w-5 h-5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteReview(review.id)}
                      className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
