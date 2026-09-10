import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  Headphones,
  Home,
  Menu,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserRound,
  X,
} from 'lucide-react'
import { bookSeries, products } from './data/mock'
import type { Product } from './types/catalog'
import { Brand } from './components/Brand'
import { BookCover } from './components/BookCover'
import { ProductCard } from './components/ProductCard'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const normalized = query.trim()
    setNotice(normalized ? `جست‌وجوی «${normalized}» بعد از اتصال API فعال می‌شود.` : 'نام کتاب یا مجموعه را وارد کنید.')
  }

  const handleAdd = (product: Product) => {
    setCartCount((count) => count + 1)
    setNotice(`«${product.title}» به سبد خرید اضافه شد.`)
  }

  return (
    <div className="app" id="top">
      <div className="topbar">
        <div className="container topbar__inner">
          <p><Sparkles size={14} /> ارسال رایگان سفارش‌های بالای ۸ میلیون تومان</p>
          <a href="tel:02191000000"><Phone size={14} /> مشاوره خرید عمده: ۰۲۱-۹۱۰۰۰۰۰۰</a>
        </div>
      </div>

      <header className="header">
        <div className="container header__main">
          <button className="mobile-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو">
            <Menu />
          </button>
          <Brand />

          <form className="header-search" onSubmit={handleSearch} role="search">
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی نام کتاب، مجموعه یا سطح..."
              aria-label="جست‌وجوی کتاب"
            />
            <button type="submit">جست‌وجو</button>
          </form>

          <div className="header-actions">
            <button type="button" className="header-action">
              <UserRound size={21} />
              <span>ورود / ثبت‌نام</span>
            </button>
            <button type="button" className="cart-button" aria-label={`سبد خرید، ${cartCount} کالا`}>
              <ShoppingCart size={22} />
              <span className="cart-button__label">سبد خرید</span>
              <b>{new Intl.NumberFormat('fa-IR').format(cartCount)}</b>
            </button>
          </div>
        </div>

        <nav className="main-nav" aria-label="منوی اصلی">
          <div className="container main-nav__inner">
            <a className="nav-category" href="#series"><Menu size={18} /> دسته‌بندی کتاب‌ها <ChevronDown size={15} /></a>
            <a href="#series">مجموعه‌های محبوب</a>
            <a href="#fast-delivery">ارسال فوری</a>
            <a href="#wholesale">خرید عمده</a>
            <a href="#about">درباره ما</a>
            <a href="#contact">تماس با ما</a>
            <span className="nav-spacer" />
            <a className="nav-sale" href="#fast-delivery">فروش ویژه</a>
          </div>
        </nav>
      </header>

      <div className={`drawer-overlay ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`mobile-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer__head">
          <Brand />
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X /></button>
        </div>
        <a href="#series" onClick={() => setMenuOpen(false)}>دسته‌بندی کتاب‌ها</a>
        <a href="#fast-delivery" onClick={() => setMenuOpen(false)}>ارسال فوری</a>
        <a href="#wholesale" onClick={() => setMenuOpen(false)}>راهنمای خرید عمده</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>درباره پردیس</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>تماس با ما</a>
      </aside>

      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <span className="eyebrow"><BadgeCheck size={17} /> انتخاب حرفه‌ای آموزشگاه‌ها و کتاب‌فروشی‌ها</span>
              <h1>کتاب‌های آموزش زبان،<br /><em>با قیمت عمده شفاف</em></h1>
              <p>مجموعه‌های اصلی و پرفروش آموزش زبان را با موجودی به‌روز، تخفیف پلکانی و ارسال سریع تهیه کنید.</p>

              <form className="hero-search" onSubmit={handleSearch} role="search">
                <Search size={21} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="مثلاً Family and Friends 3"
                  aria-label="نام کتاب مورد نظر"
                />
                <button type="submit">پیدا کردن کتاب</button>
              </form>

              <div className="hero__actions">
                <a className="button button--primary" href="#series">مشاهده مجموعه‌ها <ArrowLeft size={18} /></a>
                <a className="button button--ghost" href="#wholesale">راهنمای خرید عمده</a>
              </div>

              <div className="hero__proof">
                <div><strong>+۵۰۰</strong><span>عنوان موجود</span></div>
                <div><strong>+۱۲۰۰</strong><span>مشتری عمده</span></div>
                <div><strong>۲۴ ساعت</strong><span>زمان آماده‌سازی</span></div>
              </div>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <span className="hero-blob hero-blob--one" />
              <span className="hero-blob hero-blob--two" />
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
            <div><Truck /><span><strong>ارسال سریع</strong>به سراسر ایران</span></div>
            <div><ShoppingBag /><span><strong>خرید عمده آسان</strong>بدون فرایند پیچیده</span></div>
            <div><ShieldCheck /><span><strong>پرداخت آنلاین امن</strong>از درگاه معتبر</span></div>
            <div><Headphones /><span><strong>پشتیبانی واقعی</strong>پیش و پس از خرید</span></div>
          </div>
        </section>

        <section className="section container" id="series">
          <div className="section-heading">
            <div><span className="section-kicker">انتخاب بر اساس مجموعه</span><h2>مجموعه‌های محبوب آموزش زبان</h2></div>
            <a href="#all-series">مشاهده همه مجموعه‌ها <ArrowLeft size={17} /></a>
          </div>
          <div className="series-grid">
            {bookSeries.map((series) => (
              <article className="series-card" key={series.id}>
                {series.badge && <span className="series-card__badge">{series.badge}</span>}
                <BookCover title={series.title} color={series.color} accent={series.accent} compact />
                <div className="series-card__content">
                  <span>{series.levels}</span>
                  <h3>{series.title}</h3>
                  <p>{series.subtitle}</p>
                  <a href={`#series-${series.id}`} aria-label={`مشاهده مجموعه ${series.title}`}>مشاهده کتاب‌ها <ArrowLeft size={16} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="wholesale" id="wholesale">
          <div className="container wholesale__grid">
            <div className="wholesale__copy">
              <span className="section-kicker section-kicker--light">قیمت‌گذاری شفاف</span>
              <h2>بیشتر سفارش بدهید، کمتر پرداخت کنید.</h2>
              <p>تخفیف هر محصول بر اساس تعداد، همان لحظه در سبد خرید محاسبه می‌شود؛ بدون تماس تلفنی و انتظار برای استعلام.</p>
              <a className="button button--white" href="#fast-delivery">شروع خرید عمده <ArrowLeft size={18} /></a>
            </div>
            <div className="price-tiers">
              <div className="price-tier"><span>سفارش پایه</span><strong>۵ تا ۱۹ جلد</strong><b>٪۵ تخفیف</b></div>
              <div className="price-tier price-tier--active"><span>انتخاب محبوب</span><strong>۲۰ تا ۴۹ جلد</strong><b>٪۱۲ تخفیف</b></div>
              <div className="price-tier"><span>همکار ویژه</span><strong>۵۰ جلد به بالا</strong><b>٪۱۸ تخفیف</b></div>
            </div>
          </div>
        </section>

        <section className="section container" id="fast-delivery">
          <div className="section-heading">
            <div><span className="section-kicker">برای سفارش‌های فوری</span><h2>پرفروش‌های آماده ارسال</h2></div>
            <a href="#all-products">مشاهده همه کتاب‌ها <ArrowLeft size={17} /></a>
          </div>
          <div className="products-grid">
            {products.map((product) => <ProductCard product={product} onAdd={handleAdd} key={product.id} />)}
          </div>
        </section>

        <section className="process section">
          <div className="container">
            <div className="section-heading section-heading--center">
              <div><span className="section-kicker">ساده و سریع</span><h2>خرید عمده در سه قدم</h2></div>
            </div>
            <div className="process-grid">
              <div><span>۱</span><div><BookOpen /><h3>کتاب‌ها را انتخاب کنید</h3><p>عنوان و تعداد مورد نیازتان را به سبد اضافه کنید.</p></div></div>
              <div><span>۲</span><div><ShoppingCart /><h3>تخفیف را ببینید</h3><p>قیمت پلکانی به‌صورت خودکار محاسبه می‌شود.</p></div></div>
              <div><span>۳</span><div><Truck /><h3>سفارش را تحویل بگیرید</h3><p>پرداخت آنلاین و ارسال سریع به نشانی شما.</p></div></div>
            </div>
          </div>
        </section>

        <section className="container cta" id="contact">
          <div>
            <span className="cta__icon"><Store /></span>
            <div><h2>برای خرید سازمانی نیاز به مشاوره دارید؟</h2><p>کارشناسان پردیس برای انتخاب کتاب و ثبت سفارش کنار شما هستند.</p></div>
          </div>
          <a className="button button--primary" href="tel:02191000000"><Phone size={18} /> تماس با واحد فروش</a>
        </section>
      </main>

      <footer className="footer" id="about">
        <div className="container footer__grid">
          <div className="footer__about"><Brand light /><p>تأمین تخصصی و عمده کتاب‌های آموزش زبان برای آموزشگاه‌ها، مدارس و کتاب‌فروشی‌ها.</p></div>
          <div><h3>دسترسی سریع</h3><a href="#series">مجموعه‌ها</a><a href="#wholesale">خرید عمده</a><a href="#fast-delivery">فروش ویژه</a></div>
          <div><h3>خدمات مشتریان</h3><a href="#guide">راهنمای ثبت سفارش</a><a href="#shipping">روش‌های ارسال</a><a href="#returns">شرایط بازگشت</a></div>
          <div><h3>ارتباط با پردیس</h3><a href="tel:02191000000">۰۲۱-۹۱۰۰۰۰۰۰</a><a href="mailto:sales@pardisbook.ir">sales@pardisbook.ir</a><span>شنبه تا پنجشنبه، ۹ تا ۱۸</span></div>
        </div>
        <div className="container footer__bottom"><span>© ۱۴۰۵ کتابسرای پردیس؛ همه حقوق محفوظ است.</span><span>قیمت شفاف • موجودی واقعی • ارسال سریع</span></div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="دسترسی سریع موبایل">
        <a className="is-active" href="#top"><Home /><span>خانه</span></a>
        <a href="#series"><BookOpen /><span>دسته‌بندی</span></a>
        <a href="#fast-delivery"><Search /><span>جست‌وجو</span></a>
        <button type="button" onClick={() => setNotice('سبد خرید در مرحله اتصال API فعال می‌شود.')}><span className="mobile-cart-wrap"><ShoppingCart /><b>{new Intl.NumberFormat('fa-IR').format(cartCount)}</b></span><span>سبد خرید</span></button>
        <button type="button"><UserRound /><span>حساب من</span></button>
      </nav>

      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="بستن پیام"><X size={17} /></button>
        </div>
      )}
    </div>
  )
}

export default App
