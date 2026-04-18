import { NextRequest, NextResponse } from 'next/server'
import { getCustomer } from '@/lib/customerAuth'
import { db } from '@/lib/db'

export async function GET() {
  const customer = await getCustomer()
  if (!customer) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  // Récupérer les commandes du client
  const orders = await db.order.findMany({
    where: { customerPhone: customer.phone },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ customer, orders })
}

export async function PUT(request: NextRequest) {
  const customer = await getCustomer()
  if (!customer) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, address, city } = body

    const updated = await db.customer.update({
      where: { id: customer.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(address !== undefined && { address: address?.trim() || null }),
        ...(city && { city: city.trim() }),
      },
    })

    return NextResponse.json({
      customer: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        address: updated.address,
        city: updated.city,
      },
    })
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
