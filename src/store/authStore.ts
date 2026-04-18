import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from './cartStore'

interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  city: string | null
}

interface AuthState {
  customer: Customer | null
  isLoading: boolean
  setCustomer: (customer: Customer | null) => void
  setLoading: (loading: boolean) => void
  login: (phone: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<Customer>) => Promise<boolean>
}

interface RegisterData {
  name: string
  phone: string
  password: string
  email?: string
  address?: string
  city?: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      isLoading: false,
      setCustomer: (customer) => set({ customer }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (phone: string, password: string) => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password }),
          })
          const data = await res.json()
          if (res.ok && data.customer) {
            set({ customer: data.customer, isLoading: false })
            return true
          }
          set({ isLoading: false })
          return false
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          const result = await res.json()
          if (res.ok && result.customer) {
            set({ customer: result.customer, isLoading: false })
            return { success: true }
          }
          set({ isLoading: false })
          return { success: false, error: result.error || 'Erreur d\'inscription' }
        } catch {
          set({ isLoading: false })
          return { success: false, error: 'Erreur réseau' }
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch {}
        set({ customer: null })
        useCartStore.getState().clearCart()
      },

      fetchProfile: async () => {
        try {
          const res = await fetch('/api/auth/me')
          if (res.ok) {
            const data = await res.json()
            set({ customer: data.customer })
          } else {
            set({ customer: null })
          }
        } catch {
          set({ customer: null })
        }
      },

      updateProfile: async (data: Partial<Customer>) => {
        try {
          const res = await fetch('/api/auth/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (res.ok) {
            const result = await res.json()
            set({ customer: result.customer })
            return true
          }
          return false
        } catch {
          return false
        }
      },
    }),
    {
      name: 'marche-royal-auth',
      partialize: (state) => ({ customer: state.customer }),
    }
  )
)
