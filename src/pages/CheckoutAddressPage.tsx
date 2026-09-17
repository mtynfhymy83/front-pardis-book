import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, Plus } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { ShellSearch } from '../components/search/ShellSearch'
import { SiteShell } from '../components/layout/SiteShell'
import { Button } from '../components/ui/Button'
import { StatePanel } from '../components/ui/StatePanel'
import { TextInput } from '../components/ui/TextInput'
import { accountApi } from '../features/account/api/account.api'
import { useSiteChrome } from '../features/platform/hooks/useSiteChrome'
import { sessionStore } from '../shared/api/storage'

export function CheckoutAddressPage() {
  const navigate = useNavigate(); const client = useQueryClient(); const [notice, setNotice] = useState<string>(); const [adding, setAdding] = useState(false); const { navigation, currency, cartCount } = useSiteChrome()
  const addresses = useQuery({ queryKey: ['account', 'addresses'], queryFn: accountApi.addresses, enabled: sessionStore.hasSession() })
  const create = useMutation({ mutationFn: (data: Parameters<typeof accountApi.addAddress>[0]) => accountApi.addAddress(data), onSuccess: async (address) => { await client.invalidateQueries({ queryKey: ['account', 'addresses'] }); navigate(`${routes.checkoutShipping}?addressId=${encodeURIComponent(address.id)}`) }, onError: () => setNotice('ذخیرهٔ نشانی انجام نشد.') })
  if (!sessionStore.hasSession()) return <Navigate to={routes.login} replace state={{ returnTo: routes.checkoutAddress }} />
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); create.mutate({ recipientName: String(data.get('recipientName')), recipientPhone: String(data.get('recipientPhone')), provinceId: String(data.get('provinceId')), cityId: String(data.get('cityId')), postalCode: String(data.get('postalCode')), addressLine: String(data.get('addressLine')), isDefault: addresses.data?.length === 0 }) }
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => undefined} onCartAction={() => undefined}><section className="checkout-page section container"><CheckoutSteps active={1} /><h1>انتخاب نشانی تحویل</h1>{addresses.isLoading && <StatePanel kind="loading" title="در حال دریافت نشانی‌ها" />}{addresses.data?.map((address) => <button className="address-card" key={address.id} type="button" onClick={() => navigate(`${routes.checkoutShipping}?addressId=${encodeURIComponent(address.id)}`)}><MapPin /><span><strong>{address.recipientName} {address.isDefault && <em>پیش‌فرض</em>}</strong><small>{address.addressLine}، {address.cityId}، {address.provinceId} — {address.postalCode}</small></span></button>)}<Button variant="secondary" onClick={() => setAdding(!adding)}><Plus size={18} /> نشانی جدید</Button>{adding && <form className="address-form" onSubmit={submit}><TextInput required name="recipientName" label="نام تحویل‌گیرنده" /><TextInput required name="recipientPhone" label="شماره موبایل" inputMode="tel" /><TextInput required name="provinceId" label="استان" placeholder="شناسه یا نام استان" /><TextInput required name="cityId" label="شهر" placeholder="شناسه یا نام شهر" /><TextInput required name="postalCode" label="کد پستی" inputMode="numeric" /><label className="field address-form__wide"><span className="field__label">نشانی کامل</span><textarea name="addressLine" required className="field__control" rows={3} /></label><Button type="submit" disabled={create.isPending}>{create.isPending ? 'در حال ذخیره…' : 'ذخیره و ادامه'}</Button></form>}</section></SiteShell>
}
export function CheckoutSteps({ active }: { active: number }) { return <ol className="checkout-steps"><li className={active >= 1 ? 'is-active' : ''}>۱. نشانی</li><li className={active >= 2 ? 'is-active' : ''}>۲. ارسال</li><li className={active >= 3 ? 'is-active' : ''}>۳. بازبینی</li></ol> }
