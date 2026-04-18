import { NextRequest, NextResponse } from 'next/server'
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client'
import { getAdmin } from '@/lib/auth'

/**
 * GET /api/admin/upload?filename=photo.jpg
 * Génère un token client signé que le navigateur utilisera pour uploader
 * directement vers Vercel Blob (contourne la limite 4.5MB de Vercel serverless)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // 1. Vérifier l'authentification admin
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // 2. Lire le nom de fichier depuis les query params
  const filename = request.nextUrl.searchParams.get('filename') || 'upload.jpg'
  const ext = (filename.split('.').pop() ?? 'jpg').toLowerCase()

  const allowedExts: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
  }

  if (!allowedExts[ext]) {
    return NextResponse.json(
      { error: `Type de fichier non supporté (.${ext})` },
      { status: 400 }
    )
  }

  // 3. Construire un nom de fichier unique
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const pathname = `produits/${timestamp}-${random}.${ext}`

  // 4. Générer le token client
  const rwToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!rwToken) {
    console.error('BLOB_READ_WRITE_TOKEN manquant')
    return NextResponse.json({ error: 'Configuration storage manquante' }, { status: 500 })
  }

  try {
    const clientToken = await generateClientTokenFromReadWriteToken({
      token: rwToken,
      pathname,
      allowedContentTypes: [allowedExts[ext]],
      maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
    })

    return NextResponse.json({
      token: clientToken,
      pathname,
      uploadUrl: `https://vercel.com/api/blob/?pathname=${encodeURIComponent(pathname)}`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Erreur génération token blob:', msg)
    return NextResponse.json({ error: `Erreur token: ${msg}` }, { status: 500 })
  }
}
