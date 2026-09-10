export type BookSeries = {
  id: number
  title: string
  subtitle: string
  levels: string
  color: string
  accent: string
  badge?: string
}

export type Product = {
  id: number
  title: string
  level: string
  publisher: string
  price: number
  oldPrice?: number
  stock: number
  color: string
  accent: string
  label?: string
}

export type Benefit = {
  title: string
  description: string
}
