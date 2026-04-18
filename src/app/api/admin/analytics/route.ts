import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Récupérer toutes les commandes
    const allOrders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Récupérer les produits pour stock
    const products = await db.product.findMany()
    const customers = await db.customer.count()

    // Stats des 30 derniers jours
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Ventes par jour (30 derniers jours)
    const dailySales: Record<string, { date: string; revenue: number; orders: number }> = {}
    for (let i = 0; i < 30; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dailySales[key] = { date: key, revenue: 0, orders: 0 }
    }

    allOrders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10)
      if (dailySales[key]) {
        dailySales[key].revenue += order.totalAmount
        dailySales[key].orders += 1
      }
    })

    const salesTimeline = Object.values(dailySales)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        ...d,
        label: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      }))

    // Répartition par statut
    const statusCounts: Record<string, number> = {
      pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0,
    }
    allOrders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1 })

    // Répartition par méthode de paiement
    const paymentMethods: Record<string, number> = {}
    allOrders.forEach((o) => {
      paymentMethods[o.paymentMethod] = (paymentMethods[o.paymentMethod] || 0) + 1
    })

    // Top produits vendus
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
    allOrders.forEach((order) => {
      try {
        const items = JSON.parse(order.items) as { name?: string; productName?: string; quantity: number; price: number }[]
        items.forEach((item) => {
          const name = item.productName || item.name || 'Inconnu'
          if (!productSales[name]) productSales[name] = { name, quantity: 0, revenue: 0 }
          productSales[name].quantity += item.quantity
          productSales[name].revenue += item.price * item.quantity
        })
      } catch {}
    })
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Produits en rupture de stock ou stock faible
    const lowStockProducts = products.filter((p) => !p.inStock)

    const totalRevenue = allOrders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return NextResponse.json({
      summary: {
        totalOrders: allOrders.length,
        totalRevenue,
        totalProducts: products.length,
        totalCustomers: customers,
        pendingOrders: statusCounts.pending,
        averageOrderValue: allOrders.length > 0
          ? Math.round(allOrders.reduce((s, o) => s + o.totalAmount, 0) / allOrders.length)
          : 0,
      },
      salesTimeline,
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
        status, count,
      })),
      paymentMethods: Object.entries(paymentMethods).map(([method, count]) => ({
        method, count,
      })),
      topProducts,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id, name: p.name, slug: p.slug, inStock: p.inStock,
      })),
    })
  } catch (error) {
    console.error('Erreur analytics:', error)
    return NextResponse.json({ error: 'Erreur analytics' }, { status: 500 })
  }
}
