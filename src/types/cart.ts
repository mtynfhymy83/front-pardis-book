import type { PricingQuote } from './catalog'

export type CartLine = Partial<PricingQuote> & {
  id: string
  skuId: string
  product: { title: string; slug: string }
  variant: Record<string, string>
  quantity: number
  minimumQuantity: number
  availability?: string
  warnings: string[]
}

export type CartSummary = {
  lineCount: number
  totalQuantity: number
  referenceSubtotal: number
  merchandiseSubtotal: number
  wholesaleSaving: number
  couponDiscount: number
  shipping: number | null
  payable: number
}

export type CartCoupon = {
  id?: string
  code: string
  discount?: number
}

export type Cart = {
  id: string
  version: number
  currency: 'TOMAN' | string
  items: CartLine[]
  summary: CartSummary
  coupon: CartCoupon | null
  isValidForCheckout: boolean
  warnings: string[]
}

export type CreatedGuestCart = {
  cartId: string
  guestCartToken: string
  version: number
}
