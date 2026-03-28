import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export async function getAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session) return null
  
  // Session format: token:adminId
  const [token, adminId] = session.value.split(':')
  if (!adminId) return null
  
  const admin = await db.admin.findUnique({ where: { id: adminId } })
  return admin
}

export function hashPassword(password: string): string {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionToken(): string {
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('hex')
}
