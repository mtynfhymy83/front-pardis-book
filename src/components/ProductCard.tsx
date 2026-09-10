import { Check, ShoppingCart } from 'lucide-react'
import type { Product } from '../types/catalog'
import { BookCover } from './BookCover'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

const formatPrice = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__visual">
        {product.label && <span className="product-card__badge">{product.label}</span>}
        <BookCover
          title={product.title}
          eyebrow={product.publisher}
          color={product.color}
          accent={product.accent}
          compact
        />
      </div>
      <div className="product-card__body">
        <span className="product-card__meta">{product.level}</span>
        <h3>{product.title}</h3>
        <div className="stock-line">
          <Check size={14} /> موجود در انبار ({new Intl.NumberFormat('fa-IR').format(product.stock)} جلد)
        </div>
        <div className="product-card__price">
          <div>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
            <strong>{formatPrice(product.price)}</strong>
            <span>تومان</span>
          </div>
          <button type="button" className="icon-button icon-button--blue" onClick={() => onAdd(product)} aria-label={`افزودن ${product.title} به سبد خرید`}>
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </article>
  )
}
