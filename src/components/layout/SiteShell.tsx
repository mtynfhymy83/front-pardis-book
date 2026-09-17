import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ChevronDown,
  Home,
  LayoutGrid,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import type { Navigation } from '../../types/catalog'
import { Brand } from '../Brand'
import { routes } from '../../app/routes'
import { useNavigate } from 'react-router-dom'
import { sessionStore } from '../../shared/api/storage'

type SiteShellProps = {
  children: ReactNode
  navigation: Navigation | null
  phone: string
  currency: string
  cartCount: number
  headerSearch: ReactNode
  notice?: string
  onDismissNotice: () => void
  onAccountAction: () => void
  onCartAction: () => void
}

function sectionHref(label: string, href: string) {
  if (label.includes('مجموعه')) return routes.seriesIndex
  if (label.includes('ارسال') || label.includes('فروش')) return '#fast-delivery'
  if (label.includes('عمده')) return routes.wholesaleGuide
  if (label.includes('درباره')) return '#about'
  if (label.includes('تماس')) return '#contact'
  return href
}

const formatCount = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

export function SiteShell({
  children,
  navigation,
  phone,
  currency,
  cartCount,
  headerSearch,
  notice,
  onDismissNotice,
  onAccountAction,
  onCartAction,
}: SiteShellProps) {
  const navigate = useNavigate()
  const accountRoute = sessionStore.hasSession() ? routes.account : routes.login
  const [menuOpen, setMenuOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app" id="top">
      <div className="topbar">
        <div className="container topbar__inner">
          <p><Sparkles size={14} /> ارسال رایگان سفارش‌های بالای ۸ میلیون تومان</p>
          <a href={`tel:${phone}`}><Phone size={14} /> مشاوره خرید عمده: {phone}</a>
        </div>
      </div>

      <header className="header">
        <div className="container header__main">
          <button className="mobile-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو" aria-expanded={menuOpen} aria-controls="mobile-navigation"><Menu /></button>
          <Brand />
          {headerSearch}
          <div className="header-actions">
            <button type="button" className="header-action" onClick={() => { onAccountAction(); navigate(accountRoute) }}><UserRound size={21} /><span>{sessionStore.hasSession() ? 'حساب من' : 'ورود / ثبت‌نام'}</span></button>
            <button type="button" className="cart-button" onClick={() => { onCartAction(); navigate(routes.cart) }} aria-label={`سبد خرید، ${cartCount} جلد`}><ShoppingCart size={22} /><span className="cart-button__label">سبد خرید</span><b>{formatCount(cartCount)}</b></button>
          </div>
        </div>

        <nav className="main-nav" aria-label="منوی اصلی">
          <div className="container main-nav__inner">
            <div className="nav-category-wrap">
              <a className="nav-category" href={routes.catalog}><Menu size={18} /> دسته‌بندی کتاب‌ها <ChevronDown size={15} /></a>
              {navigation && navigation.categories.length > 0 && (
                <div className="category-menu">
                  {navigation.categories.map((category) => <a key={category.id} href={`${routes.catalog}?categoryId=${encodeURIComponent(category.id)}`}>{category.name}<small>{formatCount(category.productCount)} عنوان</small></a>)}
                </div>
              )}
            </div>
            {(navigation?.links || []).map((link) => <a key={link.label} href={sectionHref(link.label, link.href)}>{link.label}</a>)}
            <span className="nav-spacer" />
          </div>
        </nav>
      </header>

      <div className={`drawer-overlay ${menuOpen ? 'is-open' : ''}`} onClick={closeMenu} aria-hidden="true" />
      <aside id="mobile-navigation" className={`mobile-drawer ${menuOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="منوی اصلی" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-drawer__head"><Brand /><button ref={closeButtonRef} type="button" onClick={closeMenu} aria-label="بستن منو"><X /></button></div>
        {navigation?.categories.map((category) => <a key={category.id} href={`${routes.catalog}?categoryId=${encodeURIComponent(category.id)}`} onClick={closeMenu}>{category.name}</a>)}
        {navigation?.links.map((link) => <a key={link.label} href={sectionHref(link.label, link.href)} onClick={closeMenu}>{link.label}</a>)}
      </aside>

      <main className="site-main">{children}</main>

      <footer className="footer" id="about">
        <div className="container footer__grid">
          <div className="footer__about"><Brand light /><p>تأمین تخصصی و عمده کتاب‌های آموزش زبان برای آموزشگاه‌ها، مدارس و کتاب‌فروشی‌ها.</p></div>
          <div><h3>دسترسی سریع</h3><a href={routes.seriesIndex}>مجموعه‌ها</a><a href={routes.wholesaleGuide}>خرید عمده</a><a href="#fast-delivery">فروش ویژه</a></div>
          <div><h3>خدمات مشتریان</h3><a href={routes.help}>راهنمای ثبت سفارش</a><a href={routes.help}>روش‌های ارسال</a><a href={routes.help}>شرایط بازگشت</a></div>
          <div><h3>ارتباط با پردیس</h3><a href={`tel:${phone}`}>{phone}</a><a href="mailto:sales@pardisbook.ir">sales@pardisbook.ir</a><span>شنبه تا پنجشنبه، ۹ تا ۱۸</span></div>
        </div>
        <div className="container footer__bottom"><span>© ۱۴۰۵ کتابسرای پردیس؛ همه حقوق محفوظ است.</span><span>قیمت‌ها بر حسب {currency} • موجودی واقعی • ارسال سریع</span></div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="دسترسی سریع موبایل">
        <a className="is-active" href="#top"><Home /><span>خانه</span></a>
        <a href={routes.catalog}><LayoutGrid /><span>دسته‌بندی</span></a>
        <a href={routes.search}><Search /><span>جست‌وجو</span></a>
        <button type="button" onClick={() => { onCartAction(); navigate(routes.cart) }}><span className="mobile-cart-wrap"><ShoppingCart /><b>{formatCount(cartCount)}</b></span><span>سبد خرید</span></button>
        <button type="button" onClick={() => { onAccountAction(); navigate(accountRoute) }}><UserRound /><span>حساب من</span></button>
      </nav>

      {notice && <div className="toast" role="status"><span>{notice}</span><button type="button" onClick={onDismissNotice} aria-label="بستن پیام"><X size={17} /></button></div>}
    </div>
  )
}
