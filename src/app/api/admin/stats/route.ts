import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  try {
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const [totalProducts, totalOrders, pendingOrders, revenueOrders, recentOrders] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.order.count({ where: { status: 'pending' } }),
      db.order.findMany({
        where: { status: { in: ['confirmed', 'shipped', 'delivered'] } },
        select: { totalAmount: true },
      }),
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          customerName: true,
          customerPhone: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
    ])

    const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.totalAmount, 0)

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        total: order.totalAmount,        // nom cohérent avec le dashboard
        totalAmount: order.totalAmount,  // alias pour rétrocompat
        status: order.status,
        createdAt: order.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
