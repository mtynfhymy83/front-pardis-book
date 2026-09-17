import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { Button, ButtonLink } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { cartApi } from '../features/cart/api/cart.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'
import { sessionStore } from '../shared/api/storage'
import type { CartLine } from '../types/cart'

const money = (value: number) => new Intl.NumberFormat('fa-IR').format(value)
export function CartPage() {
  const navigate = useNavigate(); const [notice, setNotice] = useState<string>(); const client = useQueryClient(); const { navigation, currency, cartCount } = useSiteChrome(); const cart = useQuery({ queryKey: ['cart', 'current'], queryFn: cartApi.current })
  const refresh = async () => { await client.invalidateQueries({ queryKey: ['cart', 'current'] }) }
  const update = useMutation({ mutationFn: ({ item, quantity }: { item: CartLine; quantity: number }) => cartApi.updateItem(item.id, quantity, cart.data!.version), onSuccess: refresh, onError: () => setNotice('تغییر تعداد ذخیره نشد؛ موجودی را بررسی کنید.') })
  const remove = useMutation({ mutationFn: (item: CartLine) => cartApi.removeItem(item.id, cart.data!.version), onSuccess: refresh, onError: () => setNotice('حذف کالا انجام نشد.') })
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => navigate(routes.login)} onCartAction={() => undefined}><section className="cart-page section container"><span className="section-kicker">سبد خرید</span><h1>سفارش شما</h1>{cart.isLoading && <StatePanel kind="loading" title="در حال دریافت سبد خرید" />}{cart.isError && <StatePanel kind="error" title="سبد خرید دریافت نشد" actionLabel="تلاش دوباره" onAction={() => cart.refetch()} />}{!cart.data && !cart.isLoading && <StatePanel kind="empty" title="سبد خرید شما خالی است" description="برای شروع، کتاب‌های موردنیازتان را انتخاب کنید." actionLabel="مشاهده کاتالوگ" onAction={() => navigate(routes.catalog)} />}{cart.data && <div className="cart-layout"><div className="cart-lines">{cart.data.items.length === 0 && <StatePanel kind="empty" title="سبد خرید شما خالی است" />}{cart.data.items.map((item) => <article key={item.id} className="cart-line"><div><h2>{item.product.title}</h2><p>{Object.values(item.variant).join(' • ')}</p><span>حداقل سفارش: {money(item.minimumQuantity)} جلد</span></div><div className="quantity-picker"><button type="button" disabled={item.quantity <= item.minimumQuantity || update.isPending} onClick={() => update.mutate({ item, quantity: item.quantity - 1 })}><Minus /></button><b>{money(item.quantity)}</b><button type="button" disabled={update.isPending} onClick={() => update.mutate({ item, quantity: item.quantity + 1 })}><Plus /></button></div><strong>{money(item.lineSubtotal || 0)} تومان</strong><button className="cart-remove" type="button" onClick={() => remove.mutate(item)} aria-label={`حذف ${item.product.title}`}><Trash2 /></button></article>)}</div><aside className="cart-summary"><h2>خلاصه سفارش</h2><p><span>جمع کالاها</span><b>{money(cart.data.summary.referenceSubtotal)} تومان</b></p><p><span>تخفیف عمده</span><b className="saving">{money(cart.data.summary.wholesaleSaving)} تومان</b></p><p className="cart-summary__total"><span>مبلغ قابل پرداخت</span><b>{money(cart.data.summary.payable)} تومان</b></p>{sessionStore.hasSession() ? <Button disabled={!cart.data.isValidForCheckout} onClick={() => navigate(routes.checkoutAddress)}>ادامهٔ ثبت سفارش</Button> : <ButtonLink href={routes.login}>ورود برای ثبت سفارش</ButtonLink>}<Link to={routes.catalog}>ادامه خرید</Link></aside></div>}</section></SiteShell>
}
