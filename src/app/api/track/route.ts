import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * API publique de suivi de commande.
 * Le client peut chercher par ID de commande OU par numéro de téléphone.
 * Seules les infos non-sensibles sont retournées.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('id')
    const phone = searchParams.get('phone')

    if (!orderId && !phone) {
      return NextResponse.json(
        { error: 'Veuillez fournir un ID de commande ou un numéro de téléphone' },
        { status: 400 }
      )
    }

    let orders

    if (orderId) {
      // Recherche par ID (partiel ou complet)
      const order = await db.order.findFirst({
        where: {
          id: { startsWith: orderId },
        },
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Commande introuvable. Vérifiez votre numéro de commande.' },
          { status: 404 }
        )
      }

      orders = [order]
    } else if (phone) {
      // Recherche par numéro de téléphone
      orders = await db.order.findMany({
        where: { customerPhone: phone },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })

      if (orders.length === 0) {
        return NextResponse.json(
          { error: 'Aucune commande trouvée pour ce numéro de téléphone.' },
          { status: 404 }
        )
      }
    }

    // Retourner uniquement les infos non-sensibles
    const safeOrders = (orders || []).map((order) => ({
      id: order.id,
      shortId: order.id.substring(0, 8).toUpperCase(),
      customerName: order.customerName,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return NextResponse.json(safeOrders)
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche de la commande' },
      { status: 500 }
    )
  }
}
