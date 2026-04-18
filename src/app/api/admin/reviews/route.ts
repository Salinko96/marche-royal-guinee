import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const reviews = await db.review.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

// PUT - Approuver/rejeter un avis
export async function PUT(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id, approved } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  const review = await db.review.update({
    where: { id },
    data: { approved },
  })
  return NextResponse.json(review)
}

// DELETE - Supprimer un avis
export async function DELETE(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  await db.review.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
