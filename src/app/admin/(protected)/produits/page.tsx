'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, Package, Tag, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ImageUpload from '@/components/admin/ImageUpload';

const CATEGORIES = [
  'Montres',
  'Sacs',
  'Accessoires',
  'Bijoux',
  'Chaussures',
  'Vêtements',
  'Parfums',
  'Electronique',
  'Maison',
  'Beauté',
];

interface Characteristic {
  key: string;
  value: string;
}

interface VariantOption {
  label: string;
  extraPrice: number;
}

interface Variant {
  name: string;
  options: VariantOption[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  shortDescription: string;
  longDescription: string;
  image: string;
  images: string;
  characteristics: string;
  highlights: string;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  isRealPhoto: boolean;
  badge?: string | null;
  isNew: boolean;
  variants?: string;
  tags?: string;
}

interface FormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  stockQuantity: string;
  inStock: boolean;
  featured: boolean;
  isRealPhoto: boolean;
  badge: string;
  isNew: boolean;
  characteristics: Characteristic[];
  highlights: string[];
  variants: Variant[];
  tags: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [newHighlight, setNewHighlight] = useState('');

  const defaultForm: FormData = {
    name: '',
    category: 'Montres',
    price: '',
    originalPrice: '',
    shortDescription: '',
    longDescription: '',
    images: [],
    stockQuantity: '0',
    inStock: true,
    featured: false,
    isRealPhoto: false,
    badge: '',
    isNew: false,
    characteristics: [{ key: '', value: '' }],
    highlights: [],
    variants: [],
    tags: '',
  };

  const [formData, setFormData] = useState<FormData>(defaultForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      let chars: Characteristic[] = [{ key: '', value: '' }];
      let highlights: string[] = [];
      let variants: Variant[] = [];
      try { chars = Object.entries(JSON.parse(product.characteristics || '{}')).map(([k, v]) => ({ key: k, value: String(v) })); } catch {}
      try { highlights = JSON.parse(product.highlights || '[]'); } catch {}
      try { variants = JSON.parse(product.variants || '[]'); } catch {}
      if (chars.length === 0) chars = [{ key: '', value: '' }];

      let parsedImages: string[] = [];
      try { parsedImages = JSON.parse(product.images || '[]'); } catch {}
      if (product.image && !parsedImages.includes(product.image)) {
        parsedImages = [product.image, ...parsedImages];
      }

      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        images: parsedImages,
        stockQuantity: (product.stockQuantity ?? 0).toString(),
        inStock: product.inStock,
        featured: product.featured,
        isRealPhoto: product.isRealPhoto ?? false,
        badge: product.badge ?? '',
        isNew: product.isNew ?? false,
        characteristics: chars,
        highlights,
        variants,
        tags: (() => { try { return (JSON.parse(product.tags || '[]') as string[]).join(', '); } catch { return ''; } })(),
      });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setActiveSection('basic');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const charObj: Record<string, string> = {};
    formData.characteristics.forEach((c) => {
      if (c.key.trim()) charObj[c.key.trim()] = c.value.trim();
    });

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const slug = slugify(formData.name) + '-' + Date.now().toString(36);

    const payload = {
      name: formData.name,
      slug: editingId ? undefined : slug,
      category: formData.category,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      image: formData.images[0] || '',
      images: formData.images,
      characteristics: charObj,
      highlights: formData.highlights,
      variants: formData.variants,
      tags,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      inStock: formData.inStock,
      featured: formData.featured,
      isRealPhoto: formData.isRealPhoto,
      badge: formData.badge.trim() || null,
      isNew: formData.isNew,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : '/api/admin/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchProducts();
        handleCloseDialog();
      } else {
        const err = await response.json();
        alert(err.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (response.ok) await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const addCharacteristic = () => {
    setFormData({ ...formData, characteristics: [...formData.characteristics, { key: '', value: '' }] });
  };

  const removeCharacteristic = (i: number) => {
    setFormData({ ...formData, characteristics: formData.characteristics.filter((_, idx) => idx !== i) });
  };

  const updateCharacteristic = (i: number, field: 'key' | 'value', val: string) => {
    const chars = [...formData.characteristics];
    chars[i] = { ...chars[i], [field]: val };
    setFormData({ ...formData, characteristics: chars });
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData({ ...formData, highlights: [...formData.highlights, newHighlight.trim()] });
    setNewHighlight('');
  };

  const removeHighlight = (i: number) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, idx) => idx !== i) });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { name: '', options: [{ label: '', extraPrice: 0 }] }] });
  };

  const removeVariant = (i: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, idx) => idx !== i) });
  };

  const updateVariantName = (i: number, name: string) => {
    const vars = [...formData.variants];
    vars[i] = { ...vars[i], name };
    setFormData({ ...formData, variants: vars });
  };

  const addVariantOption = (variantIdx: number) => {
    const vars = [...formData.variants];
    vars[variantIdx].options = [...vars[variantIdx].options, { label: '', extraPrice: 0 }];
    setFormData({ ...formData, variants: vars });
  };

  const removeVariantOption = (variantIdx: number, optIdx: number) => {
    const vars = [...formData.variants];
    vars[variantIdx].options = vars[variantIdx].options.filter((_, i) => i !== optIdx);
    setFormData({ ...formData, variants: vars });
  };

  const updateVariantOption = (variantIdx: number, optIdx: number, field: 'label' | 'extraPrice', val: string) => {
    const vars = [...formData.variants];
    vars[variantIdx].options[optIdx] = {
      ...vars[variantIdx].options[optIdx],
      [field]: field === 'extraPrice' ? parseInt(val) || 0 : val,
    };
    setFormData({ ...formData, variants: vars });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR').format(price);

  const sections = [
    { id: 'basic', label: 'Infos de base' },
    { id: 'images', label: 'Images' },
    { id: 'details', label: 'Détails' },
    { id: 'variants', label: 'Variantes' },
    { id: 'stock', label: 'Stock & Visibilité' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-600 mt-1">{products.length} produit{products.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-amber-500 hover:bg-amber-600">
          <Plus size={20} className="mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-md">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter || 'all'} onValueChange={(v) => setCategoryFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            let mainImage = product.image;
            if (!mainImage) {
              try { const imgs = JSON.parse(product.images || '[]'); mainImage = imgs[0] || ''; } catch {}
            }
            return (
              <Card key={product.id} className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  {mainImage ? (
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={40} className="text-gray-300" />
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Vedette
                    </span>
                  )}
                  <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? `Stock: ${product.stockQuantity ?? 0}` : 'Rupture'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-amber-600 font-medium mb-1">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)} GNF</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleOpenDialog(product)}
                      className="flex-1 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit2 size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-md p-16 text-center">
          <Package size={56} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucun produit</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm || categoryFilter ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter votre premier produit'}
          </p>
          {!searchTerm && !categoryFilter && (
            <Button onClick={() => handleOpenDialog()} className="mt-4 bg-amber-500 hover:bg-amber-600">
              <Plus size={18} className="mr-2" /> Ajouter un produit
            </Button>
          )}
        </Card>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </DialogTitle>
          </DialogHeader>

          {/* Section Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`flex-1 min-w-fit px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  activeSection === s.id
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* SECTION: Infos de base */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Montre Élégance Or Royal"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix actuel (GNF) *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="350000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix barré / avant promo (GNF)
                      <span className="text-gray-400 font-normal ml-1">— optionnel</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="Ex: 500000 (sera affiché barré)"
                      min="0"
                    />
                    {formData.originalPrice && parseInt(formData.originalPrice) > parseInt(formData.price || '0') && (
                      <p className="text-xs text-green-600 mt-1">
                        Réduction : {Math.round((1 - parseInt(formData.price || '0') / parseInt(formData.originalPrice)) * 100)}%
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge personnalisé
                      <span className="text-gray-400 font-normal ml-1">— optionnel</span>
                    </label>
                    <Input
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Ex: Sélection premium, Coup de cœur…"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Résumé en une phrase pour la liste de produits"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description complète</label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    placeholder="Description détaillée du produit, matériaux, histoire..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag size={14} className="inline mr-1" />Tags (séparés par des virgules)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="luxe, montre, or, cadeau..."
                  />
                </div>
              </div>
            )}

            {/* SECTION: Images */}
            {activeSection === 'images' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos du produit
                    <span className="text-gray-400 font-normal ml-2">— La première photo sera l'image principale</span>
                  </label>
                  <ImageUpload
                    images={formData.images}
                    onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                    maxImages={8}
                  />
                </div>
              </div>
            )}

            {/* SECTION: Détails */}
            {activeSection === 'details' && (
              <div className="space-y-5">
                {/* Characteristics */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Caractéristiques</label>
                    <button type="button" onClick={addCharacteristic} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                      + Ajouter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.characteristics.map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={c.key}
                          onChange={(e) => updateCharacteristic(i, 'key', e.target.value)}
                          placeholder="Ex: Matériau"
                          className="flex-1"
                        />
                        <Input
                          value={c.value}
                          onChange={(e) => updateCharacteristic(i, 'value', e.target.value)}
                          placeholder="Ex: Acier inoxydable"
                          className="flex-1"
                        />
                        <button type="button" onClick={() => removeCharacteristic(i)} className="text-red-400 hover:text-red-600 px-2">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points forts</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Ex: Résistant à l'eau 50m"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                    />
                    <Button type="button" onClick={addHighlight} variant="outline" className="shrink-0">Ajouter</Button>
                  </div>
                  <ul className="space-y-1">
                    {formData.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg text-sm text-green-800">
                        <span className="flex-1">✓ {h}</span>
                        <button type="button" onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-600">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION: Variantes */}
            {activeSection === 'variants' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Les variantes permettent aux clients de choisir la taille, la couleur, etc.</p>
                {formData.variants.map((variant, vi) => (
                  <Card key={vi} className="p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariantName(vi, e.target.value)}
                        placeholder="Nom de la variante (ex: Taille, Couleur)"
                        className="flex-1"
                      />
                      <button type="button" onClick={() => removeVariant(vi)} className="text-red-400 hover:text-red-600">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-2 pl-3 border-l-2 border-amber-200">
                      {variant.options.map((opt, oi) => (
                        <div key={oi} className="flex gap-2">
                          <Input
                            value={opt.label}
                            onChange={(e) => updateVariantOption(vi, oi, 'label', e.target.value)}
                            placeholder="Ex: Rouge, L, 42..."
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={opt.extraPrice || ''}
                            onChange={(e) => updateVariantOption(vi, oi, 'extraPrice', e.target.value)}
                            placeholder="+Prix GNF"
                            className="w-32"
                          />
                          <button type="button" onClick={() => removeVariantOption(vi, oi)} className="text-red-400 hover:text-red-600 px-1">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addVariantOption(vi)}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-1"
                      >
                        + Ajouter une option
                      </button>
                    </div>
                  </Card>
                ))}
                <Button type="button" onClick={addVariant} variant="outline" className="w-full border-dashed">
                  <Plus size={16} className="mr-2" /> Ajouter une variante
                </Button>
              </div>
            )}

            {/* SECTION: Stock & Visibilité */}
            {activeSection === 'stock' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock</label>
                    <Input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, stockQuantity: e.target.value, inStock: qty > 0 });
                      }}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${
                      formData.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {formData.inStock ? 'En stock' : 'Rupture de stock'}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Forcer "En stock"</p>
                      <p className="text-xs text-gray-500">Afficher comme disponible même si quantité = 0</p>
                    </div>
                    <Switch
                      checked={formData.inStock}
                      onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Produit en vedette</p>
                      <p className="text-xs text-gray-500">Apparaît en premier sur la boutique</p>
                    </div>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Photo réelle du produit</p>
                      <p className="text-xs text-gray-500">Affiche un badge "Photo réelle" sur la boutique</p>
                    </div>
                    <Switch
                      checked={formData.isRealPhoto}
                      onCheckedChange={(checked) => setFormData({ ...formData, isRealPhoto: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nouveau produit</p>
                      <p className="text-xs text-gray-500">Badge "NOUVEAU" visible sur la boutique</p>
                    </div>
                    <Switch
                      checked={formData.isNew}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation entre sections + Submit */}
            <div className="border-t pt-4 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {activeSection !== 'basic' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const idx = sections.findIndex(s => s.id === activeSection);
                      if (idx > 0) setActiveSection(sections[idx - 1].id);
                    }}
                  >
                    ← Précédent
                  </Button>
                )}
                {activeSection !== 'stock' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const idx = sections.findIndex(s => s.id === activeSection);
                      if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                    }}
                  >
                    Suivant →
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 min-w-[140px]" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Ajouter le produit'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
