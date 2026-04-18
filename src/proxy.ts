import { NextRequest, NextResponse } from 'next/server'

// ──────────────────────────────────────────────────────────────────────────────
// Rate limiting (Node.js runtime — Next.js 16 proxy.ts)
// Pour fort trafic, remplacer par Upstash Redis
// ──────────────────────────────────────────────────────────────────────────────

const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  '/api/admin/orders':  { max: 10, window: 60_000 },
  '/api/reviews':       { max: 5,  window: 60_000 },
  '/api/auth/login':    { max: 10, window: 60_000 },
  '/api/auth/register': { max: 5,  window: 60_000 },
  '/api/coupons':       { max: 20, window: 60_000 },
}

const store = new Map<string, { count: number; resetAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [key, val] of store.entries()) {
    if (now >= val.resetAt) store.delete(key)
  }
}, 60_000)

function isRateLimited(ip: string, pathname: string): boolean {
  const limit = RATE_LIMITS[pathname]
  if (!limit) return false

  const key = `${ip}:${pathname}`
  const now = Date.now()
  const record = store.get(key)

  if (!record || now >= record.resetAt) {
    store.set(key, { count: 1, resetAt: now + limit.window })
    return false
  }

  if (record.count >= limit.max) return true
  record.count++
  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url)

  if (request.method === 'POST' && pathname in RATE_LIMITS) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0'

    if (isRateLimited(ip, pathname)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter avant de réessayer.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
  }

  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export const config = {
  matcher: [
    '/api/admin/orders',
    '/api/reviews',
    '/api/auth/login',
    '/api/auth/register',
    '/api/coupons',
  ],
}
