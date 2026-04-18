import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { sendWhatsAppOrderNotification } from '@/lib/whatsapp'
import { sendOrderConfirmationSms } from '@/lib/sms'

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const VALID_PAYMENT_METHODS = ['cash', 'orange_money', 'mtn_money']

export async function GET(request: NextRequest) {
  try {
    // ✅ Auth requise — plus d'accès public aux commandes clients
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    // Validation du filtre status
    const where: Record<string, unknown> = {}
    if (status && VALID_STATUSES.includes(status)) {
      where.status = status
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      totalAmount,
      paymentMethod,
      notes,
      couponCode,
    } = body

    // ── Validation stricte des champs requis ──────────────────────────────────
    if (!customerName || !customerPhone || !items || totalAmount === undefined) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    if (typeof customerName !== 'string' || customerName.trim().length < 2 || customerName.length > 100) {
      return NextResponse.json({ error: 'Nom invalide' }, { status: 400 })
    }

    if (typeof customerPhone !== 'string' || customerPhone.length > 20) {
      return NextResponse.json({ error: 'Téléphone invalide' }, { status: 400 })
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return NextResponse.json({ error: 'Articles invalides' }, { status: 400 })
    }

    // ── Validation du montant côté serveur ───────────────────────────────────
    const serverTotal = items.reduce((sum: number, item: { quantity: number; price: number }) => {
      if (!item.quantity || !item.price || item.quantity < 1 || item.price < 0) return sum
      return sum + item.quantity * item.price
    }, 0)

    // Tolérance 15% pour les coupons de réduction
    if (serverTotal > 0 && totalAmount < serverTotal * 0.85) {
      return NextResponse.json(
        { error: 'Montant total invalide' },
        { status: 400 }
      )
    }

    if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Mode de paiement invalide' }, { status: 400 })
    }

    // ── Vérification et usage du coupon ──────────────────────────────────────
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode } })
      if (coupon && coupon.active && (!coupon.maxUses || coupon.usedCount < coupon.maxUses)) {
        // Incrémenter l'usage en arrière-plan
        db.coupon.update({
          where: { code: couponCode },
          data: { usedCount: { increment: 1 } },
        }).catch(console.error)
      }
    }

    const itemsJson = JSON.stringify(items)

    const order = await db.order.create({
      data: {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        customerAddress: customerAddress?.trim() || null,
        items: itemsJson,
        totalAmount,
        status: 'pending',
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: 'pending',
        notes: notes?.trim() || null,
      },
    })

    // ── Décrémentation du stock ───────────────────────────────────────────────
    for (const item of items) {
      if (item.productId) {
        db.product.updateMany({
          where: { id: item.productId, stockQuantity: { gt: 0 } },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        }).then(async () => {
          // Passer inStock à false si stockQuantity atteint 0
          const prod = await db.product.findUnique({ where: { id: item.productId }, select: { stockQuantity: true } })
          if (prod && prod.stockQuantity <= 0) {
            await db.product.update({ where: { id: item.productId }, data: { inStock: false } })
          }
        }).catch(console.error)
      }
    }

    // ── Notifications en arrière-plan ─────────────────────────────────────────
    const parsedItems = items
    const notifData = {
      orderId: order.id,
      customerName: order.customerName,
      customerEmail: customerEmail || '',
      customerPhone: order.customerPhone,
      customerAddress: customerAddress,
      items: parsedItems,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      notes: order.notes || undefined,
    }

    if (customerEmail) sendOrderConfirmationEmail(notifData).catch(console.error)
    sendAdminNewOrderNotification(notifData).catch(console.error)
    sendWhatsAppOrderNotification(notifData).catch(console.error)
    sendOrderConfirmationSms({
      orderId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalAmount: order.totalAmount,
    }).catch(console.error)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
