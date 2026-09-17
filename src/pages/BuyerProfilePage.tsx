import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import type { CustomerType } from '../types/account'

const types: Array<{ value: CustomerType; label: string }> = [{ value: 'individual', label: 'خریدار شخصی' }, { value: 'teacher', label: 'مدرس' }, { value: 'language_school', label: 'آموزشگاه زبان' }, { value: 'bookstore', label: 'کتاب‌فروشی' }, { value: 'school', label: 'مدرسه' }, { value: 'other_business', label: 'سایر کسب‌وکارها' }]
export function BuyerProfilePage() {
  const navigate = useNavigate(); const [notice, setNotice] = useState<string>(); const { navigation, currency, cartCount } = useSiteChrome(); const queryClient = useQueryClient()
  const profile = useQuery({ queryKey: ['account', 'me'], queryFn: accountApi.me, enabled: sessionStore.hasSession() })
  const [name, setName] = useState(''); const [customerType, setCustomerType] = useState<CustomerType | null>(null)
  const save = useMutation({ mutationFn: () => accountApi.update({ name: name || profile.data?.name || undefined, customerType: customerType || profile.data?.customerType || 'individual' }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['account', 'me'] }); navigate(routes.home) }, onError: () => setNotice('ذخیرهٔ پروفایل انجام نشد.') })
  if (!sessionStore.hasSession()) return <Navigate to={routes.login} replace state={{ returnTo: routes.buyerProfile }} />
  return <SiteShell navigation={navigation} phone="۰۲۱-۶۶۹۷۴۴۲۰" currency={currency} cartCount={cartCount} headerSearch={<ShellSearch />} notice={notice} onDismissNotice={() => setNotice(undefined)} onAccountAction={() => undefined} onCartAction={() => undefined}><section className="profile-page section container"><span className="section-kicker">تکمیل حساب</span><h1>چند اطلاعات کوتاه برای خرید بهتر</h1><p className="page-lead">این اطلاعات برای پیشنهادهای مناسب‌تر و صدور فاکتور در سفارش‌های سازمانی استفاده می‌شود.</p>{profile.isLoading && <StatePanel kind="loading" title="در حال دریافت اطلاعات حساب" />}{profile.isError && <StatePanel kind="error" title="اطلاعات حساب دریافت نشد" />}{profile.data && <form className="profile-form" onSubmit={(event: FormEvent) => { event.preventDefault(); save.mutate() }}><TextInput label="نام و نام خانوادگی" value={name || profile.data.name || ''} onChange={(event) => setName(event.target.value)} /><fieldset><legend>نوع خریدار</legend><div>{types.map((type) => <label key={type.value}><input type="radio" name="customerType" checked={(customerType || profile.data.customerType || 'individual') === type.value} onChange={() => setCustomerType(type.value)} /> {type.label}</label>)}</div></fieldset><Button type="submit" disabled={save.isPending}>{save.isPending ? 'در حال ذخیره…' : 'ذخیره و ادامه'}</Button></form>}</section></SiteShell>
}
