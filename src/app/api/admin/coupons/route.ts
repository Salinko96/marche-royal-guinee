import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const body = await request.json()
    const { code, type, value, minOrder, maxUses, expiresAt } = body

    if (!code || !value) {
      return NextResponse.json({ error: 'Code et valeur requis' }, { status: 400 })
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type || 'percentage',
        value: parseInt(value),
        minOrder: minOrder ? parseInt(minOrder) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error('Erreur création coupon:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  await db.coupon.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  const coupon = await db.coupon.update({
    where: { id },
    data: {
      ...(data.active !== undefined && { active: data.active }),
      ...(data.code && { code: data.code.toUpperCase().trim() }),
      ...(data.value && { value: parseInt(data.value) }),
      ...(data.type && { type: data.type }),
      ...(data.maxUses !== undefined && { maxUses: data.maxUses ? parseInt(data.maxUses) : null }),
      ...(data.minOrder !== undefined && { minOrder: data.minOrder ? parseInt(data.minOrder) : null }),
    },
  })
  return NextResponse.json(coupon)
}
