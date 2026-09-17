import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routeTo } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { StatePanel } from '../components/ui/StatePanel'
import { BookCover } from '../components/BookCover'
import { catalogApi } from '../features/catalog/api/catalog.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'

const palettes = [['#102a43', '#ffd24a'], ['#0f766e', '#f5b942'], ['#1261ff', '#9ad0ff'], ['#7c2d12', '#f0b55c']] as const

export function SeriesLandingPage() {
  const [notice, setNotice] = useState<string>()
  const { navigation, currency, cartCount } = useSiteChrome()
  const series = useQuery({ queryKey: ['catalog', 'featured-series'], queryFn: () => catalogApi.featuredSeries(12), staleTime: 120_000 })
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />}
    notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => setNotice('ورود و حساب کاربری در فاز چهارم فعال می‌شود.')} onCartAction={() => setNotice('سبد خرید در فاز چهارم فعال می‌شود.')}>
    <section className="series-page section container">
      <span className="section-kicker">انتخاب بر اساس مجموعه</span>
      <h1>مجموعه‌های محبوب آموزش زبان</h1>
      <p className="page-lead">مجموعه مناسب سطح و نیاز آموزشی خود را انتخاب کنید. موجودی و تعداد عنوان‌ها از API دریافت می‌شود.</p>
      {series.isLoading && <StatePanel kind="loading" title="در حال بارگذاری مجموعه‌ها" />}
      {series.isError && <StatePanel kind="error" title="مجموعه‌ها دریافت نشدند" description="لطفاً دوباره تلاش کنید." actionLabel="تلاش دوباره" onAction={() => series.refetch()} />}
      {series.data && series.data.length === 0 && <StatePanel kind="empty" title="هنوز مجموعه‌ای برای نمایش نیست" />}
      {series.data && series.data.length > 0 && <div className="series-grid series-grid--page">
        {series.data.map((item, index) => {
          const [color, accent] = palettes[index % palettes.length]
          return <article className="series-card" key={item.id}>
            <BookCover title={item.name} color={color} accent={accent} compact imageUrl={item.cover?.url} imageAlt={item.cover?.alt} />
            <div className="series-card__content"><span>{item.levels.length ? item.levels.join('، ') : 'مجموعه آموزشی'}</span><h2>{item.name}</h2><p>{new Intl.NumberFormat('fa-IR').format(item.productCount)} عنوان کتاب در این مجموعه</p>
              <Link to={routeTo.search(item.name)}>جست‌وجوی کتاب‌ها <ArrowLeft size={16} /></Link>
            </div>
          </article>
        })}
      </div>}
    </section>
  </SiteShell>
}
