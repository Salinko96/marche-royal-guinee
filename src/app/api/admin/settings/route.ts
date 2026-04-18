import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/customerAuth'

const crypto = require('crypto')

// GET - Récupérer tous les paramètres du site
export async function GET() {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const settings = await db.siteSettings.findMany()
    const settingsMap: Record<string, string> = {}
    settings.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    // Paramètres par défaut
    const defaults: Record<string, string> = {
      whatsapp_number: '224623457689',
      phone_number: '+224 623 457 689',
      store_address: 'Lambanyi, Conakry – Guinée',
      store_name: 'MARCHÉ ROYAL DE GUINÉE',
      delivery_info: 'Livraison 24-48h à Conakry',
      facebook_pixel: '',
      google_analytics: '',
    }

    // Fusionner les valeurs DB avec les défauts
    const merged = { ...defaults, ...settingsMap }

    return NextResponse.json({ settings: merged, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { settings, changePassword } = body

    // Mise à jour des paramètres site
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        await db.siteSettings.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      }
    }

    // Changement de mot de passe admin
    if (changePassword) {
      const { currentPassword, newPassword } = changePassword
      const adminRecord = await db.admin.findUnique({ where: { id: admin.id } })
      if (!adminRecord) {
        return NextResponse.json({ error: 'Admin introuvable' }, { status: 404 })
      }

      const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex')
      if (adminRecord.password !== currentHash) {
        return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
      }

      const newHash = crypto.createHash('sha256').update(newPassword).digest('hex')
      await db.admin.update({
        where: { id: admin.id },
        data: { password: newHash },
      })
    }

    return NextResponse.json({ success: true, message: 'Paramètres mis à jour' })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
