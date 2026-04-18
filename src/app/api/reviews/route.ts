import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ── Rate limiting ─────────────────────────────────────────────────────────────
const reviewAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const e = reviewAttempts.get(ip)
  if (!e || e.resetAt < now) {
    reviewAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (e.count >= 3) return false // max 3 avis/heure par IP
  e.count++
  return true
}

// GET — avis approuvés d'un produit
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const productId = url.searchParams.get('productId')

  if (!productId || typeof productId !== 'string' || productId.length > 50) {
    return NextResponse.json({ error: 'productId invalide' }, { status: 400 })
  }

  const reviews = await db.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: 'desc' },
    take: 50, // limite de sécurité
  })

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return NextResponse.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length })
}

// POST — soumettre un avis
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop d\'avis soumis. Réessayez dans une heure.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { productId, customerName, rating, comment } = body

    // Validation stricte
    if (!productId || !customerName || rating === undefined || !comment) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
    }

    if (typeof productId !== 'string' || productId.length > 50) {
      return NextResponse.json({ error: 'productId invalide' }, { status: 400 })
    }

    if (typeof customerName !== 'string' || customerName.trim().length < 2 || customerName.length > 60) {
      return NextResponse.json({ error: 'Nom invalide (2–60 caractères)' }, { status: 400 })
    }

    if (typeof comment !== 'string' || comment.trim().length < 10 || comment.length > 1000) {
      return NextResponse.json({ error: 'Commentaire invalide (10–1000 caractères)' }, { status: 400 })
    }

    const numRating = parseInt(String(rating))
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Note entre 1 et 5' }, { status: 400 })
    }

    // Vérifier que le produit existe
    const product = await db.product.findUnique({ where: { id: productId }, select: { id: true } })
    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }

    const review = await db.review.create({
      data: {
        productId,
        customerName: customerName.trim(),
        rating: numRating,
        comment: comment.trim(),
        approved: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Avis soumis, en attente de modération',
      review: { id: review.id, createdAt: review.createdAt },
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur soumission avis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
