import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { routeTo } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { ProductCard } from '../components/ProductCard'
import { Button } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { cartApi } from '../features/cart/api/cart.api'
import { catalogApi, type CatalogFilters, type CatalogSort } from '../features/catalog/api/catalog.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'
import type { CatalogFacet, ProductSummary } from '../types/catalog'

const facetTitles: Record<string, string> = { series: 'مجموعه', publisher: 'ناشر', category: 'دسته‌بندی', ageGroup: 'گروه سنی', level: 'سطح', edition: 'ویرایش', bookType: 'نوع کتاب' }
const sortOptions: Array<{ value: CatalogSort; label: string }> = [{ value: 'newest', label: 'جدیدترین' }, { value: 'bestSelling', label: 'پرفروش‌ترین' }, { value: 'unitPriceAsc', label: 'ارزان‌ترین' }, { value: 'discountDesc', label: 'بیشترین تخفیف' }, { value: 'fastDispatch', label: 'ارسال سریع' }]

function filtersFromParams(params: URLSearchParams): CatalogFilters {
  const filters: CatalogFilters = {}
  ;(['seriesId', 'publisherId', 'categoryId', 'ageGroup', 'level', 'edition', 'bookType'] as const).forEach((key) => { const value = params.get(key); if (value) filters[key] = value })
  if (params.get('inStock') === '1') filters.inStock = true
  if (params.get('fastDispatch') === '1') filters.fastDispatch = true
  return filters
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [notice, setNotice] = useState<string>()
  const queryClient = useQueryClient()
  const { navigation, currency, cartCount } = useSiteChrome()
  const q = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page') ?? '1'))
  const sort = (params.get('sort') ?? 'newest') as CatalogSort
  const filters = useMemo(() => filtersFromParams(params), [params])
  const catalog = useQuery({ queryKey: ['catalog', { q, page, sort, filters }], queryFn: () => catalogApi.products({ q: q || undefined, page, pageSize: 12, sort, filter: filters }), placeholderData: (previous) => previous })
  const facets = useQuery({ queryKey: ['catalog', 'facets'], queryFn: catalogApi.facets, staleTime: 300_000 })
  const add = useMutation({ mutationFn: (product: ProductSummary) => cartApi.addItem(product.defaultSku!.id, product.defaultSku!.minimumQuantity), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['cart', 'current'] }); setNotice('کتاب با حداقل تعداد سفارش به سبد خرید اضافه شد.') }, onError: () => setNotice('افزودن به سبد خرید انجام نشد.') })
  const update = (name: string, value?: string) => { const next = new URLSearchParams(params); next.delete('page'); if (value) next.set(name, value); else next.delete(name); setParams(next) }
  const clearFilters = () => { const next = new URLSearchParams(); if (q) next.set('q', q); setParams(next) }

  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => setNotice('ورود و حساب کاربری در فاز چهارم فعال می‌شود.')} onCartAction={() => setNotice('صفحهٔ سبد خرید در فاز چهارم تکمیل می‌شود.')}>
    <section className="catalog-page container section"><div className="catalog-page__heading"><div><span className="section-kicker">کاتالوگ کتاب</span><h1>{q ? `نتایج «${q}»` : 'همه کتاب‌های آموزش زبان'}</h1><p>{catalog.data ? `${new Intl.NumberFormat('fa-IR').format(catalog.data.pagination.total)} عنوان قابل سفارش` : 'جست‌وجو، فیلتر و مقایسهٔ قیمت عمده'}</p></div></div>
      <div className="catalog-layout"><aside className="catalog-filters"><div className="catalog-filters__head"><h2><SlidersHorizontal size={18} /> فیلترها</h2><button type="button" onClick={clearFilters}>پاک کردن</button></div><label className="filter-check"><input type="checkbox" checked={filters.inStock ?? false} onChange={(event) => update('inStock', event.target.checked ? '1' : undefined)} /> فقط موجود</label><label className="filter-check"><input type="checkbox" checked={filters.fastDispatch ?? false} onChange={(event) => update('fastDispatch', event.target.checked ? '1' : undefined)} /> ارسال سریع</label>
        <FacetControls facets={facets.data || {}} filters={filters} onChange={update} className="facet-group--desktop" />
      </aside>
      <div className="catalog-results"><div className="catalog-results__toolbar"><span>{catalog.isFetching ? 'در حال به‌روزرسانی…' : 'نمایش محصولات'}</span><label>مرتب‌سازی <select value={sort} onChange={(event) => update('sort', event.target.value)}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>
        <FacetControls facets={facets.data || {}} filters={filters} onChange={update} className="facet-group--mobile" />
        {catalog.isLoading && <StatePanel kind="loading" title="در حال دریافت کتاب‌ها" />}{catalog.isError && <StatePanel kind="error" title="کاتالوگ دریافت نشد" actionLabel="تلاش دوباره" onAction={() => catalog.refetch()} />}{catalog.data?.items.length === 0 && <StatePanel kind="empty" title="کتابی با این شرایط پیدا نشد" description="فیلترها یا عبارت جست‌وجو را تغییر دهید." />}
        {catalog.data && catalog.data.items.length > 0 && <><div className="products-grid catalog-products">{catalog.data.items.map((product) => <ProductCard key={product.id} product={product} href={routeTo.product(product.slug)} adding={add.isPending && add.variables?.id === product.id} onAdd={async (item) => { await add.mutateAsync(item) }} />)}</div><Pagination page={page} totalPages={catalog.data.pagination.totalPages} onPage={(nextPage) => update('page', String(nextPage))} /></>}
      </div></div></section>
  </SiteShell>
}

function FacetControls({ facets, filters, onChange, className }: { facets: Record<string, CatalogFacet[]>; filters: CatalogFilters; onChange: (name: string, value?: string) => void; className: string }) {
  return <>{Object.entries(facets).map(([type, items]) => <fieldset className={`facet-group ${className}`} key={type}><legend>{facetTitles[type] || type}</legend>{items.map((item) => <label key={item.id} className="filter-check"><input type="radio" name={type} checked={filters[type as keyof CatalogFilters] === item.id} onChange={() => onChange(type === 'series' ? 'seriesId' : type === 'publisher' ? 'publisherId' : type === 'category' ? 'categoryId' : type, item.id)} /> {item.label} <small>{new Intl.NumberFormat('fa-IR').format(item.count)}</small></label>)}</fieldset>)}</>
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) { if (totalPages <= 1) return null; return <nav className="pagination" aria-label="صفحه‌بندی"><Button variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>قبلی</Button><span>صفحه {new Intl.NumberFormat('fa-IR').format(page)} از {new Intl.NumberFormat('fa-IR').format(totalPages)}</span><Button variant="secondary" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>بعدی</Button></nav> }
