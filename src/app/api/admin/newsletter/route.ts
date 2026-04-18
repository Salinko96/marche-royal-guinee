import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const activeOnly = request.nextUrl.searchParams.get('active') !== 'false'

    const subscribers = await db.newsletter.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error('Admin newsletter GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

    await db.newsletter.update({ where: { id }, data: { active: false } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
}
