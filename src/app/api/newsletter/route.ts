import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    if (email.length > 200) {
      return NextResponse.json({ error: 'Email trop long' }, { status: 400 })
    }

    const existing = await db.newsletter.findUnique({ where: { email: email.toLowerCase().trim() } })

    if (existing) {
      if (!existing.active) {
        await db.newsletter.update({ where: { email: email.toLowerCase().trim() }, data: { active: true } })
        return NextResponse.json({ success: true, message: 'Inscription réactivée !' })
      }
      return NextResponse.json({ success: true, message: 'Vous êtes déjà inscrit(e) !' })
    }

    await db.newsletter.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
      },
    })

    return NextResponse.json({ success: true, message: 'Inscription réussie ! Merci 🎉' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

    await db.newsletter.update({
      where: { email: email.toLowerCase().trim() },
      data: { active: false },
    })

    return NextResponse.json({ success: true, message: 'Désinscription effectuée.' })
  } catch {
    return NextResponse.json({ error: 'Email introuvable' }, { status: 404 })
  }
}
