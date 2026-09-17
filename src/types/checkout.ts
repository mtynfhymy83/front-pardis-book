import type { Address } from './account'
import type { CartLine, CartSummary } from './cart'

export type CheckoutQuote = {
  quoteId: string
  cartVersion: number
  lines: CartLine[]
  address: Omit<Address, 'id' | 'version' | 'isDefault'>
  shipping: { id: string; cost: number }
  summary: CartSummary & { tax: number }
  taxRateBps: number
  expiresAt: string
}

export type CreatedOrder = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  payable: number
  inventoryReservationExpiresAt: string
}

export type PaymentAttempt = {
  attemptId: string
  status: string
  redirectUrl?: string
  expiresAt?: string
  resumeRequired?: boolean
}
