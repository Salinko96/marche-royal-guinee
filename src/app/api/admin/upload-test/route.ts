import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN manquant' }, { status: 500 })
    }

    // Test: upload un petit fichier texte
    const blob = await put('test/ping.txt', 'pong', {
      access: 'public',
      contentType: 'text/plain',
      token,
    })

    return NextResponse.json({
      ok: true,
      url: blob.url,
      token_prefix: token.substring(0, 30) + '...',
    })
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    }, { status: 500 })
  }
}
