import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const [totalProducts, totalOrders, pendingOrders, deliveredOrders, recentOrders] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.order.count({
        where: { status: 'pending' },
      }),
      db.order.findMany({
        where: { status: 'delivered' },
      }),
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
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
