import { BookOpen } from 'lucide-react'

type BrandProps = {
  light?: boolean
}

export function Brand({ light = false }: BrandProps) {
  return (
    <a className={`brand ${light ? 'brand--light' : ''}`} href="#top" aria-label="صفحه اصلی کتابسرای پردیس">
      <span className="brand__mark" aria-hidden="true">
        <BookOpen size={22} strokeWidth={2.2} />
      </span>
      <span>
        <strong>کتابسرای پردیس</strong>
        <small>مرجع عمده کتاب زبان</small>
      </span>
    </a>
  )
}
