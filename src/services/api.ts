import type { Cart, HomeContent, Navigation, SearchSuggestion } from '../types/catalog'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')
const GUEST_CART_STORAGE_KEY = 'pardis_guest_cart_token'

type ApiEnvelope<T> = {
  data: T
  meta: { requestId: string; serverTime: string }
}

type ApiErrorEnvelope = {
  error?: { code?: string; message?: string }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code = 'API_ERROR',
    public readonly status = 0,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  headers.set('Accept-Language', 'fa-IR')
  if (init.body) headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const payload = (await response.json().catch(() => ({}))) as Partial<ApiEnvelope<T>> & ApiErrorEnvelope
  if (!response.ok || payload.error) {
    throw new ApiError(
      payload.error?.message || 'ارتباط با سرور ناموفق بود.',
      payload.error?.code,
      response.status,
    )
  }
  if (!('data' in payload)) {
    throw new ApiError('پاسخ دریافتی از سرور معتبر نیست.', 'INVALID_API_RESPONSE', response.status)
  }

  return payload.data as T
}

export const api = {
  bootstrap: () => request<{ currency: string; locale: string }>('/bootstrap'),
  home: () => request<HomeContent>('/home'),
  navigation: () => request<Navigation>('/navigation'),
  suggestions: (query: string, signal?: AbortSignal) =>
    request<SearchSuggestion[]>(`/search/suggestions?q=${encodeURIComponent(query)}&limit=8`, { signal }),

  async currentCart(): Promise<Cart | null> {
    const token = localStorage.getItem(GUEST_CART_STORAGE_KEY)
    if (!token) return null

    try {
      return await request<Cart>('/cart', { headers: { 'X-Guest-Cart-Token': token } })
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        localStorage.removeItem(GUEST_CART_STORAGE_KEY)
        return null
      }
      throw error
    }
  },

  async addToCart(skuId: string, quantity: number): Promise<Cart> {
    let token = localStorage.getItem(GUEST_CART_STORAGE_KEY)
    if (!token) {
      const created = await request<{ guestCartToken: string }>('/carts', { method: 'POST' })
      token = created.guestCartToken
      localStorage.setItem(GUEST_CART_STORAGE_KEY, token)
    }

    return request<Cart>('/cart/items', {
      method: 'POST',
      headers: { 'X-Guest-Cart-Token': token },
      body: JSON.stringify({ skuId, quantity }),
    })
  },
}
