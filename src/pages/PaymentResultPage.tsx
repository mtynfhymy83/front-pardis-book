import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clock3, CreditCard } from 'lucide-react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { Button, ButtonLink } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { checkoutApi } from '../features/checkout/api/checkout.api'
import { checkoutSession } from '../features/checkout/checkout-session'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'
import { sessionStore } from '../shared/api/storage'

export function PaymentResultPage() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const { navigation, currency, cartCount } = useSiteChrome(); const [error, setError] = useState(''); const storedOrder = checkoutSession.order(); const orderId = params.get('orderId') || storedOrder?.id; const attemptId = params.get('attemptId') || checkoutSession.attemptId()
  const payment = useQuery({ queryKey: ['checkout', 'order-payment', orderId], queryFn: () => checkoutApi.orderPayment(orderId!), enabled: Boolean(orderId && sessionStore.hasSession()), refetchInterval: (query) => query.state.data?.paymentStatus === 'paid' ? false : 8_000 })
  const start = useMutation({ mutationFn: () => checkoutApi.createPayment(orderId!, `${window.location.origin}${routes.paymentResult}`), onSuccess: (data) => { checkoutSession.setAttemptId(data.attemptId); if (data.redirectUrl) window.location.assign(data.redirectUrl); else setError('درگاه نشانی انتقال برنگرداند. وضعیت پرداخت را دوباره بررسی کنید.') }, onError: () => setError('ایجاد تلاش پرداخت ناموفق بود.') })
  const verify = useMutation({ mutationFn: () => checkoutApi.verifyPayment(attemptId!), onSuccess: () => payment.refetch(), onError: () => setError('تأیید پرداخت هنوز ممکن نیست.') })
  if (!sessionStore.hasSession()) return <Navigate to={routes.login} replace />
  if (!orderId) return <Navigate to={routes.cart} replace />
  const paid = payment.data?.paymentStatus === 'paid'
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={error} onDismissNotice={() => setError('')} onAccountAction={() => undefined} onCartAction={() => undefined}><section className="payment-page section container">{payment.isLoading && <StatePanel kind="loading" title="در حال بررسی وضعیت سفارش" />}{payment.isError && <StatePanel kind="error" title="وضعیت پرداخت دریافت نشد" actionLabel="بازگشت به سبد" onAction={() => navigate(routes.cart)} />}{payment.data && <div className={`payment-status ${paid ? 'is-success' : 'is-pending'}`}>{paid ? <CheckCircle2 /> : <Clock3 />}<h1>{paid ? 'پرداخت با موفقیت انجام شد' : 'سفارش ثبت شد؛ آماده پرداخت است'}</h1><p>{paid ? 'رسید سفارش در بخش سفارش‌های من در دسترس خواهد بود.' : 'برای نهایی‌شدن سفارش، پرداخت را از طریق درگاه انجام دهید.'}</p><b>شماره سفارش: {storedOrder?.orderNumber || orderId}</b>{!paid && <Button onClick={() => start.mutate()} disabled={start.isPending}>{start.isPending ? 'در حال انتقال…' : <><CreditCard /> پرداخت آنلاین</>}</Button>}{attemptId && !paid && <Button variant="secondary" onClick={() => verify.mutate()} disabled={verify.isPending}>تأیید وضعیت پرداخت</Button>}{paid && <ButtonLink href={routes.home}>بازگشت به خانه</ButtonLink>}</div>}</section></SiteShell>
}
