import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'

export async function getAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session) return null

  // Format: token:adminId
  const parts = session.value.split(':')
  if (parts.length < 2) return null
  const adminId = parts[parts.length - 1]
  if (!adminId) return null

  const admin = await db.admin.findUnique({ where: { id: adminId } })
  return admin
}

/**
 * Hash un mot de passe avec bcrypt (coût 12).
 * Rétrocompatible : les anciens hashs SHA-256 sont toujours vérifiés.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Vérifie un mot de passe contre un hash bcrypt OU SHA-256 (legacy).
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Hash bcrypt commence par $2b$ ou $2a$
  if (hash.startsWith('$2')) {
    return bcrypt.compare(password, hash)
  }
  // Legacy SHA-256 sans sel — supporte les anciens comptes
  const sha256 = createHash('sha256').update(password).digest('hex')
  return sha256 === hash
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}
