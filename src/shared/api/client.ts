import type { ApiEnvelope, ApiFailureEnvelope, ApiRequestOptions } from './contracts'
import { guestCartStore, sessionStore } from './storage'

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code = 'API_ERROR',
    public readonly status = 0,
    public readonly fields: Record<string, string | string[]> = {},
    public readonly details: Record<string, unknown> = {},
    public readonly requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

let refreshPromise: Promise<boolean> | null = null

function createRequestId() {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `web-${random}`
}

export function createIdempotencyKey(scope: 'order' | 'payment' | string) {
  return `${scope}-${createRequestId()}`
}

function isFailureEnvelope(value: unknown): value is ApiFailureEnvelope {
  return Boolean(value && typeof value === 'object' && 'error' in value)
}

function isSuccessEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return Boolean(value && typeof value === 'object' && 'data' in value)
}

async function parseJson(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return undefined
  return response.json().catch(() => undefined)
}

function apiErrorFrom(response: Response, payload: unknown) {
  if (isFailureEnvelope(payload)) {
    return new ApiError(
      payload.error.message || 'ارتباط با سرور ناموفق بود.',
      payload.error.code || 'API_ERROR',
      response.status,
      payload.error.fields || {},
      payload.error.details || {},
      payload.meta?.requestId,
    )
  }

  return new ApiError(
    response.status >= 500 ? 'سرویس موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.' : 'پاسخ دریافتی از سرور معتبر نیست.',
    response.status >= 500 ? 'SERVER_UNAVAILABLE' : 'INVALID_API_RESPONSE',
    response.status,
  )
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  const refreshToken = sessionStore.getRefreshToken()
  if (!refreshToken) return false

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'fa-IR',
          'Content-Type': 'application/json',
          'X-Request-Id': createRequestId(),
        },
        body: JSON.stringify({ refreshToken }),
      })
      const payload = await parseJson(response)
      if (!response.ok || !isSuccessEnvelope<{ accessToken: string; refreshToken: string }>(payload)) {
        sessionStore.clear()
        return false
      }
      sessionStore.setTokens(payload.data)
      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function prepareAccessToken(auth: ApiRequestOptions['auth']) {
  let accessToken = sessionStore.getAccessToken()
  if (!accessToken && sessionStore.getRefreshToken() && auth !== 'none') {
    await refreshAccessToken()
    accessToken = sessionStore.getAccessToken()
  }
  if (!accessToken && auth === 'required') {
    throw new ApiError('برای این عملیات باید وارد حساب شوید.', 'AUTHENTICATION_REQUIRED', 401)
  }
  return accessToken
}

async function requestEnvelope<T>(path: string, options: ApiRequestOptions = {}, hasRetried = false): Promise<ApiEnvelope<T>> {
  const {
    auth = 'optional',
    guestCart = false,
    retryAuth = true,
    idempotencyKey,
    body,
    headers: initialHeaders,
    ...init
  } = options

  const accessToken = await prepareAccessToken(auth)
  const headers = new Headers(initialHeaders)
  headers.set('Accept', 'application/json')
  headers.set('Accept-Language', 'fa-IR')
  headers.set('X-Request-Id', createRequestId())
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (accessToken && auth !== 'none') headers.set('Authorization', `Bearer ${accessToken}`)
  if (guestCart) {
    const token = guestCartStore.getToken()
    if (token) headers.set('X-Guest-Cart-Token', token)
  }
  if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('اتصال به سرور برقرار نشد. وضعیت اینترنت را بررسی کنید.', 'NETWORK_ERROR', 0)
  }

  if (response.status === 401 && retryAuth && !hasRetried && auth !== 'none') {
    const refreshed = await refreshAccessToken()
    if (refreshed) return requestEnvelope<T>(path, options, true)
    sessionStore.clear()
  }

  const payload = await parseJson(response)
  if (!response.ok || isFailureEnvelope(payload)) throw apiErrorFrom(response, payload)

  if (response.status === 204) {
    return { data: undefined as T, meta: { requestId: response.headers.get('x-request-id') || '', serverTime: '' } }
  }
  if (!isSuccessEnvelope<T>(payload)) throw apiErrorFrom(response, payload)
  return payload
}

export const apiClient = {
  requestEnvelope,
  async request<T>(path: string, options: ApiRequestOptions = {}) {
    const response = await requestEnvelope<T>(path, options)
    return response.data
  },
}
