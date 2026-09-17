import { Check, LoaderCircle, ShoppingCart } from 'lucide-react'
import type { ProductSummary } from '../types/catalog'
import { BookCover } from './BookCover'

type ProductCardProps = {
  product: ProductSummary
  onAdd: (product: ProductSummary) => Promise<void>
  adding?: boolean
  href?: string
}

const formatPrice = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

const palette = (id: string) => {
  const palettes = [
    ['#ffe57c', '#e8445a'],
    ['#78a1f7', '#ffc62e'],
    ['#4acbb7', '#155cce'],
    ['#fb8478', '#162f4a'],
  ]
  const index = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length
  return palettes[index]
}

export function ProductCard({ product, onAdd, adding = false, href }: ProductCardProps) {
  const sku = product.defaultSku
  const [color, accent] = palette(product.id)
  const attributes = sku?.attributes || {}
  const variant = [attributes.level, attributes.bookType, attributes.edition].filter(Boolean).join(' — ') || product.subtitle || ''
  const hasDiscount = Boolean(sku && sku.referenceUnitPrice > sku.startingUnitPrice)
  const canAdd = Boolean(sku && sku.maximumPurchasableQuantity >= sku.minimumQuantity)

  return (
    <article className="product-card">
      <div className="product-card__visual">
        {sku?.fastDispatch && <span className="product-card__badge">ارسال سریع</span>}
        <BookCover
          title={product.title}
          eyebrow={product.publisher?.name || 'PARDIS'}
          color={color}
          accent={accent}
          compact
          imageUrl={product.cover?.url}
          imageAlt={product.cover?.alt}
        />
      </div>
      <div className="product-card__body">
        <span className="product-card__meta">{variant}</span>
        <h3>{href ? <a href={href}>{product.title}</a> : product.title}</h3>
        <div className={`stock-line ${canAdd ? '' : 'stock-line--empty'}`}>
          <Check size={14} /> {canAdd ? `موجود در انبار (${new Intl.NumberFormat('fa-IR').format(sku?.maximumPurchasableQuantity || 0)} جلد)` : 'ناموجود'}
        </div>
        <div className="product-card__price">
          <div>
            {hasDiscount && <del>{formatPrice(sku!.referenceUnitPrice)}</del>}
            <strong>{sku ? formatPrice(sku.startingUnitPrice) : '—'}</strong>
            <span>تومان</span>
          </div>
          <button
            type="button"
            className="icon-button icon-button--blue"
            onClick={() => void onAdd(product)}
            aria-label={`افزودن ${product.title} به سبد خرید`}
            disabled={!canAdd || adding}
          >
            {adding ? <LoaderCircle className="spin" size={19} /> : <ShoppingCart size={19} />}
          </button>
        </div>
      </div>
    </article>
  )
}
