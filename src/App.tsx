import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Headphones,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
} from 'lucide-react'
import { api, ApiError } from './services/api'
import type { BookSeries, HomeContent, Navigation, ProductSummary, SearchSuggestion } from './types/catalog'
import { BookCover } from './components/BookCover'
import { ProductCard } from './components/ProductCard'
import { SiteShell } from './components/layout/SiteShell'
import { ButtonLink } from './components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { routes, routeTo } from './app/routes'

const defaultHero = {
  eyebrow: 'انتخاب حرفه‌ای آموزشگاه‌ها و کتاب‌فروشی‌ها',
  title: 'کتاب‌های آموزش زبان، با قیمت عمده شفاف',
  description: 'مجموعه‌های اصلی و پرفروش آموزش زبان را با موجودی به‌روز، تخفیف پلکانی و ارسال سریع تهیه کنید.',
  stats: [] as Array<{ value: string; label: string }>,
} satisfies HomeContent['hero']

const benefitIcons = [Truck, ShoppingBag, ShieldCheck, Headphones]
const seriesPalettes = [
  ['#ffd64d', '#e7475d'],
  ['#42c9b5', '#1666db'],
  ['#5d8df6', '#ffca34'],
  ['#ff7b70', '#1a3551'],
]

function App() {
  const navigate = useNavigate()
  const [home, setHome] = useState<HomeContent | null>(null)
  const [navigation, setNavigation] = useState<Navigation | null>(null)
  const [currency, setCurrency] = useState('تومان')
  const [cartCount, setCartCount] = useState(0)
  const [addingSku, setAddingSku] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [focusedSearch, setFocusedSearch] = useState<'header' | 'hero' | null>(null)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    Promise.allSettled([api.bootstrap(), api.home(), api.navigation(), api.currentCart()]).then((results) => {
      if (!active) return

      const [bootstrapResult, homeResult, navigationResult, cartResult] = results
      if (bootstrapResult.status === 'fulfilled') {
        setCurrency(bootstrapResult.value.currency === 'TOMAN' ? 'تومان' : bootstrapResult.value.currency)
      }
      if (homeResult.status === 'fulfilled') {
        setHome(homeResult.value)
      } else {
        setLoadError('دریافت اطلاعات صفحه اصلی ناموفق بود. لطفاً اتصال API را بررسی کنید.')
      }
      if (navigationResult.status === 'fulfilled') setNavigation(navigationResult.value)
      if (cartResult.status === 'fulfilled' && cartResult.value) {
        setCartCount(cartResult.value.summary.totalQuantity)
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const normalized = query.trim()
    if (!focusedSearch || normalized.length < 2) {
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      api.suggestions(normalized, controller.signal)
        .then(setSuggestions)
        .catch((error: unknown) => {
          if (!(error instanceof DOMException && error.name === 'AbortError')) setSuggestions([])
        })
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, focusedSearch])

  const hero: HomeContent['hero'] = home?.hero || defaultHero
  const heroTitle = hero.title || defaultHero.title
  const titleParts = heroTitle.split('،')
  const products = useMemo(() => home?.fastDispatch || [], [home])
  const phone = home?.contact.phone || '02191000000'

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const normalized = query.trim()
    if (!normalized) {
      setNotice('نام کتاب یا مجموعه را وارد کنید.')
      return
    }
    navigate(routeTo.catalogSearch(normalized))
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) setSuggestions([])
  }

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label)
    setSuggestions([])
    setFocusedSearch(null)
    setNotice(`${suggestion.type === 'product' ? 'کتاب' : 'مجموعه'} «${suggestion.label}» انتخاب شد.`)
  }

  const handleAdd = async (product: ProductSummary) => {
    const sku = product.defaultSku
    if (!sku || addingSku) return

    setAddingSku(sku.id)
    try {
      const cart = await api.addToCart(sku.id, sku.minimumQuantity)
      setCartCount(cart.summary.totalQuantity)
      setNotice(`${new Intl.NumberFormat('fa-IR').format(sku.minimumQuantity)} جلد «${product.title}» به سبد اضافه شد.`)
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : 'افزودن محصول به سبد ناموفق بود.')
    } finally {
      setAddingSku(null)
    }
  }

  const renderSuggestions = (location: 'header' | 'hero') => focusedSearch === location && suggestions.length > 0 && (
    <div className="search-suggestions" role="listbox">
      {suggestions.map((suggestion) => (
        <button key={`${suggestion.type}-${suggestion.id}`} type="button" onMouseDown={() => selectSuggestion(suggestion)}>
          <Search size={15} />
          <span><strong>{suggestion.label}</strong><small>{suggestion.subtitle}</small></span>
        </button>
      ))}
    </div>
  )

  return (
    <SiteShell
      navigation={navigation}
      phone={phone}
      currency={currency}
      cartCount={cartCount}
      notice={notice}
      onDismissNotice={() => setNotice('')}
      onAccountAction={() => setNotice('ورود و حساب کاربری در فاز چهارم فعال می‌شود.')}
      onCartAction={() => setNotice('صفحه سبد خرید در فاز چهارم فعال می‌شود.')}
      headerSearch={(
        <form className="header-search" onSubmit={handleSearch} role="search">
          <Search size={20} />
          <input value={query} onChange={(event) => handleQueryChange(event.target.value)} onFocus={() => setFocusedSearch('header')} onBlur={() => window.setTimeout(() => setFocusedSearch(null), 150)} placeholder="جست‌وجوی نام کتاب، مجموعه یا سطح..." aria-label="جست‌وجوی کتاب" />
          <button type="submit">جست‌وجو</button>
          {renderSuggestions('header')}
        </form>
      )}
    >
        {loadError && <div className="api-error" role="alert">{loadError}</div>}
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <span className="eyebrow"><BadgeCheck size={17} /> {hero.eyebrow || defaultHero.eyebrow}</span>
              <h1>{titleParts[0]}{titleParts.length > 1 && <><br /><em>{titleParts.slice(1).join('،')}</em></>}</h1>
              <p>{hero.description || defaultHero.description}</p>

              <form className="hero-search" id="hero-search" onSubmit={handleSearch} role="search">
                <Search size={21} />
                <input value={query} onChange={(event) => handleQueryChange(event.target.value)} onFocus={() => setFocusedSearch('hero')} onBlur={() => window.setTimeout(() => setFocusedSearch(null), 150)} placeholder="مثلاً Family and Friends 3" aria-label="نام کتاب مورد نظر" />
                <button type="submit">پیدا کردن کتاب</button>
                {renderSuggestions('hero')}
              </form>

              <div className="hero__actions">
                <ButtonLink href={routes.seriesIndex}>{hero.primaryAction?.label || 'مشاهده مجموعه‌ها'} <ArrowLeft size={18} /></ButtonLink>
                <ButtonLink variant="ghost" href={routes.wholesaleGuide}>{hero.secondaryAction?.label || 'راهنمای خرید عمده'}</ButtonLink>
              </div>

              <div className="hero__proof">
                {(hero.stats || []).map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
              </div>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <span className="hero-blob hero-blob--one" /><span className="hero-blob hero-blob--two" />
              <div className="floating-note floating-note--top"><PackageCheck size={20} /><span><strong>آماده ارسال</strong>موجودی به‌روز انبار</span></div>
              <div className="book-stack">
                <div className="stack-book stack-book--back"><BookCover title="English File" color="#fb8478" accent="#17334f" /></div>
                <div className="stack-book stack-book--middle"><BookCover title="Oxford Discover" color="#6f9bf5" accent="#ffd042" /></div>
                <div className="stack-book stack-book--front"><BookCover title="Family Friends" color="#ffe06a" accent="#e6445b" /></div>
              </div>
              <div className="floating-note floating-note--bottom"><ShieldCheck size={20} /><span><strong>خرید مطمئن</strong>پرداخت امن آنلاین</span></div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="مزیت‌های خرید از پردیس">
          <div className="container trust-strip__grid">
            {(home?.benefits || []).map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length]
              return <div key={benefit.title}><Icon /><span><strong>{benefit.title}</strong>{benefit.description}</span></div>
            })}
          </div>
        </section>

        <section className="section container" id="series">
          <div className="section-heading"><div><span className="section-kicker">انتخاب بر اساس مجموعه</span><h2>مجموعه‌های محبوب آموزش زبان</h2></div><a href={routes.seriesIndex}>مشاهده همه مجموعه‌ها <ArrowLeft size={17} /></a></div>
          <div className="series-grid">
            {(home?.featuredSeries || []).map((series: BookSeries, index) => {
              const [color, accent] = seriesPalettes[index % seriesPalettes.length]
              return (
                <article className="series-card" key={series.id}>
                  <BookCover title={series.name} color={color} accent={accent} compact imageUrl={series.cover?.url} imageAlt={series.cover?.alt} />
                  <div className="series-card__content">
                    <span>{series.levels.length ? series.levels.join('، ') : `${new Intl.NumberFormat('fa-IR').format(series.productCount)} عنوان`}</span>
                    <h3>{series.name}</h3>
                    <p>{new Intl.NumberFormat('fa-IR').format(series.productCount)} کتاب منتشرشده در این مجموعه</p>
                    <a href={routeTo.search(series.name)}>جست‌وجوی کتاب‌ها <ArrowLeft size={16} /></a>
                  </div>
                </article>
              )
            })}
          </div>
          {loading && <div className="loading-row">در حال دریافت مجموعه‌ها…</div>}
        </section>

        <section className="wholesale" id="wholesale">
          <div className="container wholesale__grid">
            <div className="wholesale__copy"><span className="section-kicker section-kicker--light">قیمت‌گذاری شفاف</span><h2>بیشتر سفارش بدهید، کمتر پرداخت کنید.</h2><p>تخفیف هر محصول بر اساس تعداد، همان لحظه در سبد خرید محاسبه می‌شود؛ بدون تماس تلفنی و انتظار برای استعلام.</p><ButtonLink variant="white" href={routes.wholesaleGuide}>راهنمای خرید عمده <ArrowLeft size={18} /></ButtonLink></div>
            <div className="price-tiers"><div className="price-tier"><span>سفارش پایه</span><strong>۵ تا ۱۹ جلد</strong><b>٪۵ تخفیف</b></div><div className="price-tier price-tier--active"><span>انتخاب محبوب</span><strong>۲۰ تا ۴۹ جلد</strong><b>٪۱۲ تخفیف</b></div><div className="price-tier"><span>همکار ویژه</span><strong>۵۰ جلد به بالا</strong><b>٪۱۸ تخفیف</b></div></div>
          </div>
        </section>

        {home && home.bestSelling.length > 0 && (
          <section className="section container" id="best-selling">
            <div className="section-heading"><div><span className="section-kicker">انتخاب مشتریان</span><h2>پرفروش‌ترین کتاب‌ها</h2></div></div>
            <div className="products-grid">{home.bestSelling.slice(0, 4).map((product) => <ProductCard product={product} href={routeTo.product(product.slug)} onAdd={handleAdd} adding={addingSku === product.defaultSku?.id} key={product.id} />)}</div>
          </section>
        )}

        <section className="section container" id="fast-delivery">
          <div className="section-heading"><div><span className="section-kicker">برای سفارش‌های فوری</span><h2>کتاب‌های آماده ارسال</h2></div><a href="#all-products">مشاهده همه کتاب‌ها <ArrowLeft size={17} /></a></div>
          <div className="products-grid">{products.slice(0, 4).map((product) => <ProductCard product={product} href={routeTo.product(product.slug)} onAdd={handleAdd} adding={addingSku === product.defaultSku?.id} key={product.id} />)}</div>
          {!loading && products.length === 0 && <div className="empty-state">در حال حاضر محصول آماده ارسالی وجود ندارد.</div>}
        </section>

        <section className="process section">
          <div className="container">
            <div className="section-heading section-heading--center"><div><span className="section-kicker">ساده و سریع</span><h2>خرید عمده در سه قدم</h2></div></div>
            <div className="process-grid">
              {(home?.wholesaleSteps || []).map((step, index) => {
                const Icon = [BookOpen, ShoppingCart, Truck][index % 3]
                return <div key={step.step}><span>{new Intl.NumberFormat('fa-IR').format(step.step)}</span><div><Icon /><h3>{step.title}</h3><p>{step.description}</p></div></div>
              })}
            </div>
          </div>
        </section>

        <section className="container cta" id="contact">
          <div><span className="cta__icon"><Store /></span><div><h2>{home?.contact.title || 'برای خرید سازمانی نیاز به مشاوره دارید؟'}</h2><p>{home?.contact.description || 'کارشناسان پردیس برای انتخاب کتاب و ثبت سفارش کنار شما هستند.'}</p></div></div>
          <ButtonLink href={`tel:${phone}`}><Phone size={18} /> تماس با واحد فروش</ButtonLink>
        </section>
    </SiteShell>
  )
}

export default App
