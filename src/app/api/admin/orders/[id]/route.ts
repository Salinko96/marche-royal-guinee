import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'
import { sendOrderConfirmationSms } from '@/lib/sms'
import { sendWhatsAppOrderNotification } from '@/lib/whatsapp'

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_SMS: Record<string, string> = {
  confirmed: 'Votre commande a ete confirmee ! Nous vous appellerons pour la livraison.',
  shipped: 'Votre commande est en route ! Notre livreur arrive bientot a Conakry.',
  delivered: 'Votre commande a ete livree. Merci pour votre confiance !',
  cancelled: 'Votre commande a ete annulee. Contactez-nous sur WhatsApp pour plus d\'infos.',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin()
    if (!admin) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { id } = await params
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const order = await db.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH — mise à jour partielle (statut, notes, paymentStatus)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin()
    if (!admin) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { id } = await params
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const body = await request.json()
    const { status, paymentStatus, notes } = body

    // Validation statut
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus
    if (notes !== undefined) updateData.notes = String(notes).slice(0, 500)

    const order = await db.order.update({ where: { id }, data: updateData })

    // ── Notification client si statut changé ──────────────────────────────────
    if (status && STATUS_SMS[status]) {
      // SMS au client pour l'informer du changement de statut
      sendOrderConfirmationSms({
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
      }).catch(console.error)

      // WhatsApp admin : rappel quand une commande est confirmée
      if (status === 'confirmed') {
        sendWhatsAppOrderNotification({
          orderId: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress || undefined,
          items: (() => { try { return JSON.parse(order.items) } catch { return [] } })(),
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
        }).catch(console.error)
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT — mise à jour complète (rétrocompatibilité)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params })
}
