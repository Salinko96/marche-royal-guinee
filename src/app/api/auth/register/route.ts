import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateSessionToken } from '@/lib/customerAuth'
import { cookies } from 'next/headers'

// ── Rate limiting ─────────────────────────────────────────────────────────────
const attempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const e = attempts.get(ip)
  if (!e || e.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1h
    return true
  }
  if (e.count >= 5) return false // max 5 inscriptions/heure par IP
  e.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop d\'inscriptions depuis cette adresse. Réessayez plus tard.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, phone, password, email, address, city } = body

    // Validation stricte des types et longueurs
    if (!name || !phone || !password ||
        typeof name !== 'string' || typeof phone !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Nom, téléphone et mot de passe requis' },
        { status: 400 }
      )
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Nom invalide (2–100 caractères)' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    if (password.length > 128) {
      return NextResponse.json({ error: 'Mot de passe trop long' }, { status: 400 })
    }

    // Validation email si fourni
    if (email && (typeof email !== 'string' || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s/g, '').replace(/^00224/, '+224')
    const phoneRegex = /^(\+224)?[0-9]{8,12}$/
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      )
    }

    const existing = await db.customer.findUnique({ where: { phone: cleanPhone } })
    if (existing) {
      return NextResponse.json(
        { error: 'Ce numéro de téléphone est déjà utilisé' },
        { status: 409 }
      )
    }

    const customer = await db.customer.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        password: await hashPassword(password),
        email: email?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || 'Conakry',
      },
    })

    const token = generateSessionToken()
    const cookieStore = await cookies()
    cookieStore.set('customer_session', `${token}:${customer.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
      },
    })
  } catch (error) {
    console.error('Erreur inscription:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
