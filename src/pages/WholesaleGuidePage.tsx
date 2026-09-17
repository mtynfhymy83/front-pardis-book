import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList, Headphones, PackageCheck, Truck } from 'lucide-react'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { ButtonLink } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { contentApi } from '../features/content/api/content.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'

const tiers = [['۵ تا ۹ جلد', '۵٪ تخفیف'], ['۱۰ تا ۲۴ جلد', '۱۰٪ تخفیف'], ['۲۵ جلد و بیشتر', '۱۵٪ تخفیف']]
const steps = [
  { Icon: ClipboardList, title: '۱. انتخاب کتاب‌ها', description: 'کتاب‌ها و تعداد موردنیازتان را به سبد خرید اضافه کنید.' },
  { Icon: PackageCheck, title: '۲. قیمت‌گذاری خودکار', description: 'تخفیف پلکانی هر عنوان همان لحظه محاسبه می‌شود.' },
  { Icon: Truck, title: '۳. ارسال مطمئن', description: 'سفارش پس از تأیید، سریع و ایمن به دستتان می‌رسد.' },
]

export function WholesaleGuidePage() {
  const [notice, setNotice] = useState<string>()
  const { navigation, currency, cartCount } = useSiteChrome()
  const content = useQuery({ queryKey: ['content', 'wholesale-guide'], queryFn: () => contentApi.page('wholesale-guide'), retry: false })
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />}
    notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => setNotice('ورود و حساب کاربری در فاز چهارم فعال می‌شود.')} onCartAction={() => setNotice('سبد خرید در فاز چهارم فعال می‌شود.')}>
    <section className="guide-hero"><div className="container"><span className="section-kicker section-kicker--light">خرید عمده برای مراکز آموزشی</span><h1>{content.data?.title || 'راهنمای خرید عمده کتاب'}</h1><p>{content.data?.body || 'قیمت‌گذاری شفاف، موجودی واقعی و ارسال سریع برای آموزشگاه‌ها، مدارس و کتاب‌فروشی‌ها.'}</p><ButtonLink variant="white" href="/books">شروع خرید عمده</ButtonLink></div></section>
    <section className="section container guide-page">
      {content.isLoading && <StatePanel kind="loading" title="در حال دریافت راهنما" />}
      <div className="guide-section"><span className="section-kicker">تخفیف پلکانی</span><h2>هرچه بیشتر سفارش دهید، کمتر می‌پردازید</h2><div className="guide-tiers">{tiers.map(([range, discount]) => <div key={range}><strong>{range}</strong><b>{discount}</b><span>روی هر محصول مشمول تخفیف</span></div>)}</div></div>
      <div className="guide-section"><span className="section-kicker">سه مرحله تا تحویل</span><h2>فرایند سفارش ساده و قابل پیگیری است</h2><div className="guide-steps">{steps.map(({ Icon, title, description }) => <article key={title}><Icon /><h3>{title}</h3><p>{description}</p></article>)}</div></div>
      <div className="guide-faq"><h2>پرسش‌های پرتکرار</h2><details open><summary>تخفیف‌ها چگونه محاسبه می‌شوند؟</summary><p>قیمت هر عنوان بر اساس تعداد همان عنوان در سبد خرید محاسبه می‌شود و قبل از پرداخت قابل مشاهده است.</p></details><details><summary>برای سفارش سازمانی به فاکتور نیاز دارم.</summary><p>پس از فعال‌شدن بخش حساب کاربری، مشخصات سازمان و درخواست فاکتور از همان مسیر ثبت می‌شود.</p></details><details><summary>اگر کتابی موجود نباشد چه می‌شود؟</summary><p>موجودی هر محصول پیش از تکمیل سفارش بررسی می‌شود و فقط اقلام قابل تأمین وارد سفارش می‌شوند.</p></details></div>
      <div className="guide-contact"><Headphones /><div><h2>برای سفارش‌های بزرگ، کنار شما هستیم</h2><p>برای مشاوره انتخاب مجموعه و هماهنگی سفارش با واحد فروش تماس بگیرید.</p></div><ButtonLink href="tel:02166974420">تماس با فروش</ButtonLink></div>
    </section>
  </SiteShell>
}
