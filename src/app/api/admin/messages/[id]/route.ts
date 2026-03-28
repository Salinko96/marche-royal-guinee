import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

// PATCH - Marquer lu/non-lu
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const message = await db.contactMessage.update({
      where: { id },
      data: { read: body.read },
    })
    return NextResponse.json(message)
  } catch {
    return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 })
  }
}

// DELETE - Supprimer un message
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = await params
    await db.contactMessage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 })
  }
}
