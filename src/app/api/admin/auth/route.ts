import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyPassword, generateSessionToken, getAdmin } from '@/lib/auth'

// ── Rate limiting simple en mémoire ──────────────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count++
  return true
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip)
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
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Validation basique
    if (typeof email !== 'string' || email.length > 255) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const admin = await db.admin.findUnique({ where: { email: email.toLowerCase().trim() } })

    // Délai constant pour éviter timing attacks
    if (!admin || !(await verifyPassword(password, admin.password))) {
      return NextResponse.json(
        { error: 'Email ou mot de passe invalide' },
        { status: 401 }
      )
    }

    resetRateLimit(ip)

    const sessionToken = generateSessionToken()
    const cookieStore = await cookies()
    cookieStore.set('admin_session', `${sessionToken}:${admin.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 jours (pas 10 ans)
      path: '/',
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'authentification' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la déconnexion' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  try {
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({
      authenticated: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 })
  }
}
