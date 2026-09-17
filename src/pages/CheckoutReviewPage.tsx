import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { Button } from '../components/ui/Button'
import { checkoutApi } from '../features/checkout/api/checkout.api'
import { checkoutSession } from '../features/checkout/checkout-session'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'
import { sessionStore } from '../shared/api/storage'
import { CheckoutSteps } from './CheckoutAddressPage'
const money = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

export function CheckoutReviewPage() {
  const navigate = useNavigate(); const quote = checkoutSession.quote(); const { navigation, currency, cartCount } = useSiteChrome(); const [accepted, setAccepted] = useState(false); const [error, setError] = useState('')
  const order = useMutation({ mutationFn: () => checkoutApi.createOrder(quote!.quoteId, 'v1'), onSuccess: (data) => { checkoutSession.setOrder(data); navigate(`${routes.paymentResult}?orderId=${encodeURIComponent(data.id)}`) }, onError: () => setError('ثبت سفارش انجام نشد. احتمالاً اعتبار پیش‌فاکتور تمام شده یا موجودی تغییر کرده است.') })
  if (!sessionStore.hasSession()) return <Navigate to={routes.login} replace state={{ returnTo: routes.checkoutAddress }} />
  if (!quote) return <Navigate to={routes.checkoutAddress} replace />
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={error} onDismissNotice={() => setError('')} onAccountAction={() => undefined} onCartAction={() => undefined}><section className="checkout-page section container"><CheckoutSteps active={3} /><h1>بازبینی و ثبت سفارش</h1><div className="review-layout"><div className="review-lines"><h2>اقلام سفارش</h2>{quote.lines.map((line) => <article key={line.id}><span>{line.product.title}<small>{line.quantity} جلد</small></span><b>{money(line.lineSubtotal || 0)} تومان</b></article>)}<h2>نشانی تحویل</h2><p>{String(quote.address.recipientName)} — {String(quote.address.addressLine)}، {String(quote.address.cityId)}</p></div><aside className="cart-summary"><h2>خلاصه پرداخت</h2><p><span>کالاها</span><b>{money(quote.summary.merchandiseSubtotal)} تومان</b></p><p><span>ارسال</span><b>{money(quote.shipping.cost)} تومان</b></p><p className="cart-summary__total"><span>قابل پرداخت</span><b>{money(quote.summary.payable)} تومان</b></p><label className="terms-check"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /> قوانین و شرایط خرید را می‌پذیرم.</label><Button disabled={!accepted || order.isPending} onClick={() => order.mutate()}>{order.isPending ? 'در حال ثبت…' : 'ثبت سفارش و پرداخت'}</Button></aside></div></section></SiteShell>
}
