import { FormEvent, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, LibraryBig, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { StatePanel } from '../components/ui/StatePanel'
import { catalogApi } from '../features/catalog/api/catalog.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [notice, setNotice] = useState<string>()
  const { navigation, currency, cartCount } = useSiteChrome()

  const suggestions = useQuery({
    queryKey: ['catalog', 'suggestions', initialQuery],
    queryFn: ({ signal }) => catalogApi.suggestions(initialQuery, signal),
    enabled: initialQuery.trim().length >= 2,
    staleTime: 30_000,
  })
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = query.trim()
    if (value) setSearchParams({ q: value })
  }
  const chooseSuggestion = (label: string) => {
    setQuery(label)
    setSearchParams({ q: label })
  }

  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />}
    notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => setNotice('ورود و حساب کاربری در فاز چهارم فعال می‌شود.')} onCartAction={() => setNotice('سبد خرید در فاز چهارم فعال می‌شود.')}>
    <section className="search-page section container">
      <span className="section-kicker">جست‌وجوی سریع</span>
      <h1>کتاب موردنظرتان را پیدا کنید</h1>
      <p className="page-lead">نام کتاب، مجموعه، ناشر یا سطح آموزشی را وارد کنید تا پیشنهادهای مرتبط را ببینید.</p>
      <form className="search-explorer" onSubmit={submit} role="search">
        <Search aria-hidden="true" />
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="مثلاً English Time یا Oxford" aria-label="عبارت جست‌وجو" />
        <button type="submit">جست‌وجو</button>
      </form>
      {!initialQuery && <StatePanel kind="empty" title="جست‌وجو را شروع کنید" description="حداقل دو حرف بنویسید تا پیشنهادهای API نمایش داده شوند." />}
      {initialQuery && initialQuery.length < 2 && <StatePanel kind="empty" title="عبارت کوتاه است" description="برای دریافت پیشنهاد، دست‌کم دو حرف وارد کنید." />}
      {suggestions.isLoading && <StatePanel kind="loading" title="در حال دریافت پیشنهادها" description="یک لحظه صبر کنید." />}
      {suggestions.isError && <StatePanel kind="error" title="پیشنهادها دریافت نشدند" description="اتصال API را بررسی کنید." actionLabel="تلاش دوباره" onAction={() => suggestions.refetch()} />}
      {suggestions.data && suggestions.data.length === 0 && <StatePanel kind="empty" title="نتیجه‌ای پیدا نشد" description="عبارت دیگری را امتحان کنید." />}
      {suggestions.data && suggestions.data.length > 0 && <div className="suggestion-results" aria-live="polite">
        <p>{new Intl.NumberFormat('fa-IR').format(suggestions.data.length)} پیشنهاد برای «{initialQuery}»</p>
        <div className="suggestion-results__grid">
          {suggestions.data.map((item) => <button key={`${item.type}-${item.id}`} type="button" onClick={() => chooseSuggestion(item.label)}>
            {item.type === 'series' ? <LibraryBig aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
            <span><strong>{item.label}</strong><small>{item.subtitle || (item.type === 'series' ? 'مجموعه آموزشی' : 'کتاب')}</small></span>
          </button>)}
        </div>
        <p className="search-page__note">فهرست کامل نتایج و فیلترها در فاز بعدی کاتالوگ اضافه می‌شود.</p>
      </div>}
    </section>
  </SiteShell>
}
