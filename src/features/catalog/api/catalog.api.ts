import { apiClient } from '../../../shared/api/client'
import type { PaginatedResult } from '../../../shared/api/contracts'
import { withQuery, type QueryParams } from '../../../shared/api/query'
import type {
  BookSeries,
  CatalogFacet,
  PricingQuote,
  ProductDetail,
  ProductSummary,
  SearchSuggestion,
  SkuPricing,
} from '../../../types/catalog'

export type CatalogSort = 'newest' | 'bestSelling' | 'unitPriceAsc' | 'discountDesc' | 'fastDispatch'

export type CatalogFilters = {
  seriesId?: string
  categoryId?: string
  publisherId?: string
  ageGroup?: string
  level?: string
  edition?: string
  bookType?: string
  inStock?: boolean
  fastDispatch?: boolean
  minimumUnitPrice?: number
  maximumUnitPrice?: number
}

export type CatalogParams = {
  q?: string
  page?: number
  pageSize?: number
  sort?: CatalogSort
  filter?: CatalogFilters
}

type TaxonomyItem = { id: string; slug?: string; name: string }
type Availability = {
  skuId: string
  availability: string
  minimumQuantity?: number
  maximumPurchasableQuantity: number
  canPurchase: boolean
}

async function paginatedProducts(path: string): Promise<PaginatedResult<ProductSummary>> {
  const response = await apiClient.requestEnvelope<ProductSummary[]>(path, { auth: 'none' })
  return {
    items: response.data,
    pagination: {
      page: response.meta.page || 1,
      pageSize: response.meta.pageSize || response.data.length,
      total: response.meta.total || 0,
      totalPages: response.meta.totalPages || 1,
    },
  }
}

function catalogQuery(params: CatalogParams): QueryParams {
  return {
    q: params.q,
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
    filter: params.filter,
  }
}

export const catalogApi = {
  products: (params: CatalogParams = {}) => paginatedProducts(withQuery('/products', catalogQuery(params))),
  search: (params: CatalogParams & { q: string }) => paginatedProducts(withQuery('/search', catalogQuery(params))),
  product: (slug: string) => apiClient.request<ProductDetail>(`/products/${encodeURIComponent(slug)}`, { auth: 'none' }),
  related: (slug: string, limit = 12) => apiClient.request<ProductSummary[]>(
    withQuery(`/products/${encodeURIComponent(slug)}/related`, { limit }),
    { auth: 'none' },
  ),
  bestSelling: (limit = 12) => apiClient.request<ProductSummary[]>(withQuery('/products/best-selling', { limit }), { auth: 'none' }),
  fastDispatch: (limit = 12) => apiClient.request<ProductSummary[]>(withQuery('/products/fast-dispatch', { limit }), { auth: 'none' }),
  series: () => apiClient.request<TaxonomyItem[]>('/series', { auth: 'none' }),
  featuredSeries: (limit = 8) => apiClient.request<BookSeries[]>(withQuery('/series/featured', { limit }), { auth: 'none' }),
  seriesDetail: (slug: string, params: Omit<CatalogParams, 'filter'> = {}) => apiClient.request<{
    series: TaxonomyItem
    products: { items: ProductSummary[]; page: number; pageSize: number; total: number }
  }>(withQuery(`/series/${encodeURIComponent(slug)}`, params), { auth: 'none' }),
  suggestions: (query: string, signal?: AbortSignal) => apiClient.request<SearchSuggestion[]>(
    withQuery('/search/suggestions', { q: query, limit: 8 }),
    { auth: 'none', signal },
  ),
  publishers: () => apiClient.request<TaxonomyItem[]>('/publishers', { auth: 'none' }),
  categories: () => apiClient.request<TaxonomyItem[]>('/categories', { auth: 'none' }),
  facets: () => apiClient.request<Record<string, CatalogFacet[]>>('/catalog/facets', { auth: 'none' }),
  pricing: (skuId: string) => apiClient.request<SkuPricing>(`/skus/${encodeURIComponent(skuId)}/pricing`, { auth: 'none' }),
  quoteLine: (skuId: string, quantity: number) => apiClient.request<PricingQuote>('/pricing/quote-line', {
    method: 'POST', auth: 'none', body: { skuId, quantity },
  }),
  availability: (items: Array<{ skuId: string; quantity?: number }>) => apiClient.request<{ items: Availability[] }>('/availability/check', {
    method: 'POST', auth: 'none', body: { items },
  }),
}
