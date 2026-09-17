export type ApiMeta = {
  requestId: string
  serverTime: string
  page?: number
  pageSize?: number
  total?: number
  totalPages?: number
  count?: number
}

export type ApiEnvelope<T> = {
  data: T
  meta: ApiMeta
}

export type ApiErrorFields = Record<string, string | string[]>

export type ApiFailure = {
  code: string
  message: string
  fields: ApiErrorFields
  details: Record<string, unknown>
}

export type ApiFailureEnvelope = {
  error: ApiFailure
  meta?: Partial<ApiMeta>
}

export type PaginatedResult<T> = {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: 'none' | 'optional' | 'required'
  guestCart?: boolean
  retryAuth?: boolean
  idempotencyKey?: string
}
