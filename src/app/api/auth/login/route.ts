import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, generateSessionToken } from '@/lib/customerAuth'
import { cookies } from 'next/headers'

// ── Rate limiting ─────────────────────────────────────────────────────────────
const attempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const e = attempts.get(ip)
  if (!e || e.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (e.count >= 10) return false
  e.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { phone, password } = body

    if (!phone || !password || typeof phone !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Téléphone et mot de passe requis' },
        { status: 400 }
      )
    }

    if (phone.length > 20 || password.length > 128) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s/g, '').replace(/^00224/, '+224')

    const customer = await db.customer.findUnique({ where: { phone: cleanPhone } })

    if (!customer || !(await verifyPassword(password, customer.password))) {
      return NextResponse.json(
        { error: 'Téléphone ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const token = generateSessionToken()
    const cookieStore = await cookies()
    cookieStore.set('customer_session', `${token}:${customer.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 jours
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
    console.error('Erreur connexion:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
