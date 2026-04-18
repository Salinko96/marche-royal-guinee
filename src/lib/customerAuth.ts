import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'

export interface CustomerSession {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  city: string | null
}

export async function getCustomer(): Promise<CustomerSession | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('customer_session')
  if (!session) return null

  try {
    const parts = session.value.split(':')
    if (parts.length < 2) return null
    const customerId = parts[parts.length - 1]
    if (!customerId) return null

    const customer = await db.customer.findUnique({ where: { id: customerId } })
    if (!customer) return null

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
    }
  } catch {
    return null
  }
}

/**
 * Hash avec bcrypt (coût 12). Rétrocompatible SHA-256 pour anciens comptes.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.startsWith('$2')) {
    return bcrypt.compare(password, hash)
  }
  // Legacy SHA-256
  const sha256 = createHash('sha256').update(password).digest('hex')
  return sha256 === hash
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}
