import type { CartLine, CartSummary } from './cart'

export type OrderSummary = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  payable: number | string
  createdAt: string
}

export type OrderDetail = OrderSummary & {
  reservationExpiresAt: string | null
  lines: CartLine[]
  address: Record<string, unknown> | null
  shipping: Record<string, unknown> | null
  summary: CartSummary
}

export type OrderTimelineItem = {
  previousStatus: string | null
  newStatus: string
  reason: string | null
  createdAt: string
}

export type Invoice = {
  id: string
  invoiceNumber: string
  storageKey: string | null
}

export type Shipment = {
  id: string
  status: string
  version: number
  trackingCode?: string | null
  provider?: string | null
  [key: string]: unknown
}
