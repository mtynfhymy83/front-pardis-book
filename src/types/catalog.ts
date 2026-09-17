export type Cover = {
  url: string
  alt: string
}

export type ProductSummary = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  series: { id: string; name: string } | null
  publisher: { id: string; name: string } | null
  cover: Cover | null
  defaultSku: {
    id: string
    attributes: Record<string, string>
    minimumQuantity: number
    startingUnitPrice: number
    referenceUnitPrice: number
    maximumPurchasableQuantity: number
    availability: string
    fastDispatch: boolean
  } | null
}

export type PricingTier = {
  minQuantity: number
  maxQuantity: number | null
  unitPrice: number
}

export type ProductSku = {
  id: string
  code: string
  isbn: string | null
  attributes: Record<string, string>
  minimumQuantity: number
  referenceUnitPrice: number
  fastDispatch: boolean
  status: string
  pricingVersion: string
  isDefault: boolean
  availableQuantity: number
  pricingTiers: PricingTier[]
}

export type ProductDetail = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  series: { id: string; name: string } | null
  publisher: { id: string; name: string } | null
  category: { id: string; name: string } | null
  media: Array<Cover & { id: string; isPrimary: boolean; sortOrder: number }>
  skus: ProductSku[]
}

export type BookSeries = {
  id: string
  slug: string
  name: string
  productCount: number
  levels: string[]
  cover: Cover | null
}

export type HomeContent = {
  hero: {
    eyebrow?: string
    title?: string
    description?: string
    primaryAction?: { label: string; href: string }
    secondaryAction?: { label: string; href: string }
    stats?: Array<{ value: string; label: string }>
  }
  benefits: Array<{ title: string; description: string }>
  featuredSeries: BookSeries[]
  bestSelling: ProductSummary[]
  fastDispatch: ProductSummary[]
  wholesaleSteps: Array<{ step: number; title: string; description: string }>
  contact: { title?: string; description?: string; phone?: string }
}

export type NavigationCategory = {
  id: string
  slug: string
  name: string
  productCount: number
  children: NavigationCategory[]
}

export type Navigation = {
  categories: NavigationCategory[]
  links: Array<{ label: string; href: string }>
}

export type SearchSuggestion = {
  type: 'product' | 'series'
  id: string
  slug: string
  label: string
  subtitle: string
}

export type CatalogFacet = {
  type: 'series' | 'publisher' | 'category' | 'ageGroup' | 'level' | 'edition' | 'bookType' | string
  id: string
  label: string
  count: number
}

export type PricingQuote = {
  skuId: string
  quantity: number
  minimumQuantity: number
  selectedTier: { min: number; max: number | null; unitPrice: number }
  unitPrice: number
  referenceUnitPrice: number
  lineSubtotal: number
  lineSaving: number
  maximumPurchasableQuantity: number
  canPurchase: boolean
  pricingVersion: string
}

export type SkuPricing = {
  skuId: string
  minimumQuantity: number
  referenceUnitPrice: number
  availability: string
  maximumPurchasableQuantity: number
  pricingVersion: string
  tiers: PricingTier[]
}
