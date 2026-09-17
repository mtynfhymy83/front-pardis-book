import { ApiError, apiClient } from '../../../shared/api/client'
import { guestCartStore, sessionStore } from '../../../shared/api/storage'
import type { Cart, CreatedGuestCart } from '../../../types/cart'

async function ensureGuestCart() {
  if (sessionStore.hasSession()) return
  if (guestCartStore.getToken()) return
  const created = await apiClient.request<CreatedGuestCart>('/carts', { method: 'POST', auth: 'none' })
  guestCartStore.setToken(created.guestCartToken)
}

async function current(): Promise<Cart | null> {
  if (!sessionStore.hasSession() && !guestCartStore.getToken()) return null
  try {
    return await apiClient.request<Cart>('/cart', { guestCart: true })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      guestCartStore.clear()
      return null
    }
    throw error
  }
}

export const cartApi = {
  current,

  async addItem(skuId: string, quantity: number, version?: number) {
    await ensureGuestCart()
    return apiClient.request<Cart>('/cart/items', {
      method: 'POST',
      guestCart: true,
      body: { skuId, quantity, ...(version === undefined ? {} : { version }) },
    })
  },

  updateItem: (itemId: string, quantity: number, version: number) => apiClient.request<Cart>(
    `/cart/items/${encodeURIComponent(itemId)}`,
    { method: 'PATCH', guestCart: true, body: { quantity, version } },
  ),

  removeItem: (itemId: string, version: number) => apiClient.request<Cart>(
    `/cart/items/${encodeURIComponent(itemId)}`,
    { method: 'DELETE', guestCart: true, body: { version } },
  ),

  clear: (version: number) => apiClient.request<Cart>('/cart/items', {
    method: 'DELETE', guestCart: true, body: { version },
  }),

  validate: () => apiClient.request<Cart>('/cart/validate', { method: 'POST', guestCart: true }),

  applyCoupon: (code: string, version?: number) => apiClient.request<Cart>('/cart/coupon', {
    method: 'POST', guestCart: true, body: { code, ...(version === undefined ? {} : { version }) },
  }),

  removeCoupon: (version?: number) => apiClient.request<Cart>('/cart/coupon', {
    method: 'DELETE', guestCart: true, body: version === undefined ? {} : { version },
  }),

  async mergeGuestCart() {
    const guestCartToken = guestCartStore.getToken()
    if (!guestCartToken) return null
    const result = await apiClient.request<{ cartMerge: { status: string }; cart: Cart }>('/cart/merge', {
      method: 'POST', auth: 'required', body: { guestCartToken },
    })
    guestCartStore.clear()
    return result
  },
}
