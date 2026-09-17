import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, Truck } from 'lucide-react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { Button } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { checkoutApi } from '../features/checkout/api/checkout.api'
import { checkoutSession } from '../features/checkout/checkout-session'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'
import { sessionStore } from '../shared/api/storage'
import { CheckoutSteps } from './CheckoutAddressPage'
const money = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

export function CheckoutShippingPage() {
  const [params] = useSearchParams(); const addressId = params.get('addressId'); const navigate = useNavigate(); const { navigation, currency, cartCount } = useSiteChrome()
  const quote = useMutation({ mutationFn: () => checkoutApi.quote(addressId!), onSuccess: (data) => { checkoutSession.setQuote(data); navigate(routes.checkoutReview) } })
  if (!sessionStore.hasSession()) return <Navigate to={routes.login} replace state={{ returnTo: routes.checkoutAddress }} />
  if (!addressId) return <Navigate to={routes.checkoutAddress} replace />
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={undefined} onDismissNotice={() => undefined} onAccountAction={() => undefined} onCartAction={() => undefined}><section className="checkout-page section container"><CheckoutSteps active={2} /><h1>روش ارسال</h1><p className="page-lead">روش‌های قابل ارسال برای نشانی شما نمایش داده می‌شوند.</p><button className="shipping-card is-selected" type="button"><Truck /><span><strong>ارسال استاندارد</strong><small>تحویل با بسته‌بندی ایمن و امکان پیگیری</small></span><b>{money(80000)} تومان</b><CheckCircle2 /></button>{quote.isError && <StatePanel kind="error" title="دریافت پیش‌فاکتور ناموفق بود" description="ممکن است سبد یا نشانی تغییر کرده باشد." actionLabel="بازگشت به سبد" onAction={() => navigate(routes.cart)} />}<Button onClick={() => quote.mutate()} disabled={quote.isPending}>{quote.isPending ? 'در حال محاسبه…' : 'ادامه و بازبینی سفارش'}</Button></section></SiteShell>
}
