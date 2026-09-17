import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { routeTo, routes } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { BookCover } from '../components/BookCover'
import { Button } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { cartApi } from '../features/cart/api/cart.api'
import { catalogApi } from '../features/catalog/api/catalog.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'

const money = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

export function ProductPage() {
  const { productSlug = '' } = useParams()
  const [selectedSkuId, setSelectedSkuId] = useState<string>()
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState<string>()
  const queryClient = useQueryClient()
  const { navigation, currency, cartCount } = useSiteChrome()
  const product = useQuery({ queryKey: ['catalog', 'product', productSlug], queryFn: () => catalogApi.product(productSlug), enabled: Boolean(productSlug) })
  const selectedSku = useMemo(() => product.data?.skus.find((sku) => sku.id === selectedSkuId) ?? product.data?.skus.find((sku) => sku.isDefault) ?? product.data?.skus[0], [product.data, selectedSkuId])
  const effectiveQuantity = selectedSku ? Math.max(quantity, selectedSku.minimumQuantity) : quantity
  const quote = useQuery({ queryKey: ['catalog', 'quote', selectedSku?.id, effectiveQuantity], queryFn: () => catalogApi.quoteLine(selectedSku!.id, effectiveQuantity), enabled: Boolean(selectedSku && effectiveQuantity >= selectedSku.minimumQuantity), staleTime: 10_000 })
  const add = useMutation({ mutationFn: () => cartApi.addItem(selectedSku!.id, effectiveQuantity), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['cart', 'current'] }); setNotice('کتاب به سبد خرید اضافه شد.') }, onError: () => setNotice('افزودن به سبد خرید انجام نشد.') })
  const canBuy = Boolean(selectedSku && selectedSku.availableQuantity >= selectedSku.minimumQuantity && effectiveQuantity <= selectedSku.availableQuantity)

  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => setNotice('ورود و حساب کاربری در فاز چهارم فعال می‌شود.')} onCartAction={() => setNotice('صفحهٔ سبد خرید در فاز چهارم تکمیل می‌شود.')}>
    <section className="product-page section container">{product.isLoading && <StatePanel kind="loading" title="در حال دریافت اطلاعات کتاب" />}{product.isError && <StatePanel kind="error" title="کتاب پیدا نشد" description="ممکن است آدرس کتاب تغییر کرده باشد." actionLabel="بازگشت به کاتالوگ" onAction={() => window.location.assign(routes.catalog)} />}
      {product.data && selectedSku && <><nav className="breadcrumbs"><Link to={routes.home}>خانه</Link><span>/</span><Link to={routes.catalog}>کتاب‌ها</Link><span>/</span><b>{product.data.title}</b></nav><div className="product-detail"><div className="product-detail__visual"><BookCover title={product.data.title} eyebrow={product.data.publisher?.name} color="#1c5298" accent="#f1c345" imageUrl={product.data.media[0]?.url} imageAlt={product.data.media[0]?.alt} /></div><div className="product-detail__content"><div className="product-detail__meta"><span>{product.data.series?.name || 'کتاب آموزش زبان'}</span>{selectedSku.fastDispatch && <span><Truck size={15} /> ارسال سریع</span>}</div><h1>{product.data.title}</h1>{product.data.subtitle && <p className="product-detail__subtitle">{product.data.subtitle}</p>}<p className="product-detail__description">{product.data.description || 'اطلاعات تکمیلی این کتاب به‌زودی تکمیل می‌شود.'}</p>
        {product.data.skus.length > 1 && <fieldset className="sku-options"><legend>انتخاب نسخه</legend>{product.data.skus.map((sku) => <button className={sku.id === selectedSku.id ? 'is-selected' : ''} type="button" key={sku.id} onClick={() => { setSelectedSkuId(sku.id); setQuantity(sku.minimumQuantity) }}>{Object.values(sku.attributes).filter(Boolean).join(' • ') || sku.code}</button>)}</fieldset>}
        <div className="product-detail__purchase"><div><span>قیمت هر جلد</span><strong>{money(quote.data?.unitPrice ?? selectedSku.pricingTiers[0]?.unitPrice ?? selectedSku.referenceUnitPrice)} <small>تومان</small></strong>{quote.data && quote.data.lineSaving > 0 && <em>{money(quote.data.lineSaving)} تومان تخفیف برای این تعداد</em>}</div><div className="quantity-picker"><button aria-label="کاهش تعداد" type="button" disabled={effectiveQuantity <= selectedSku.minimumQuantity} onClick={() => setQuantity((value) => value - 1)}><Minus /></button><b>{money(effectiveQuantity)}</b><button aria-label="افزایش تعداد" type="button" disabled={effectiveQuantity >= selectedSku.availableQuantity} onClick={() => setQuantity((value) => value + 1)}><Plus /></button></div></div><p className="purchase-hint">حداقل سفارش: {money(selectedSku.minimumQuantity)} جلد • موجودی: {money(selectedSku.availableQuantity)} جلد</p><Button className="product-add" disabled={!canBuy || add.isPending} onClick={() => add.mutate()}>{add.isPending ? 'در حال افزودن…' : 'افزودن به سبد خرید'}</Button><div className="product-assurances"><span><Check /> موجودی واقعی</span><span><ShieldCheck /> پرداخت امن</span><span><Truck /> بسته‌بندی مطمئن</span></div></div></div>
        <ProductPricing tiers={selectedSku.pricingTiers} /><RelatedProducts slug={productSlug} /></>}
    </section>
  </SiteShell>
}

function ProductPricing({ tiers }: { tiers: Array<{ minQuantity: number; maxQuantity: number | null; unitPrice: number }> }) { return <section className="product-pricing"><h2>قیمت‌گذاری پلکانی</h2><div>{tiers.map((tier) => <article key={tier.minQuantity}><span>{money(tier.minQuantity)} تا {tier.maxQuantity ? money(tier.maxQuantity) : 'بیشتر'} جلد</span><strong>{money(tier.unitPrice)} <small>تومان</small></strong></article>)}</div></section> }
function RelatedProducts({ slug }: { slug: string }) { const related = useQuery({ queryKey: ['catalog', 'related', slug], queryFn: () => catalogApi.related(slug, 4), staleTime: 120_000 }); if (!related.data?.length) return null; return <section className="related-products"><h2>کتاب‌های مرتبط</h2><div>{related.data.map((item) => <Link key={item.id} to={routeTo.product(item.slug)}>{item.cover?.url && <img src={item.cover.url} alt="" />}<span>{item.title}</span></Link>)}</div></section> }
