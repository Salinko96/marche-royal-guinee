import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Valider un coupon
export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code requis' }, { status: 400 })
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Code promo invalide' }, { status: 404 })
    }

    if (!coupon.active) {
      return NextResponse.json({ error: 'Ce code promo n\'est plus actif' }, { status: 400 })
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: 'Ce code promo a expiré' }, { status: 400 })
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'Ce code promo a atteint sa limite d\'utilisation' }, { status: 400 })
    }

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        error: `Commande minimum de ${new Intl.NumberFormat('fr-GN').format(coupon.minOrder)} GNF requise`,
      }, { status: 400 })
    }

    // Calculer la réduction
    let discount = 0
    if (coupon.type === 'percentage') {
      discount = Math.round(orderTotal * coupon.value / 100)
    } else {
      discount = coupon.value
    }
    discount = Math.min(discount, orderTotal) // Ne pas dépasser le total

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
      },
    })
  } catch (error) {
    console.error('Erreur validation coupon:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
