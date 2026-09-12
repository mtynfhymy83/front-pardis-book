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
    availableQuantity: number
    availability: string
    fastDispatch: boolean
  } | null
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

export type Cart = {
  id: string
  version: number
  summary: {
    lineCount: number
    totalQuantity: number
    payable: number
  }
}
