import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Phone } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { Brand } from '../components/Brand'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { authApi } from '../features/auth/api/auth.api'

export function LoginPage() {
  const navigate = useNavigate(); const location = useLocation(); const [phone, setPhone] = useState(''); const [error, setError] = useState('')
  const request = useMutation({ mutationFn: () => authApi.requestOtp(phone.trim()), onSuccess: (challenge) => navigate(routes.otp, { state: { challenge, returnTo: (location.state as { returnTo?: string } | null)?.returnTo } }), onError: () => setError('ارسال کد ممکن نشد. شماره را بررسی و دوباره تلاش کنید.') })
  const submit = (event: FormEvent) => { event.preventDefault(); setError(''); if (!/^09\d{9}$/.test(phone.replace(/\s/g, ''))) { setError('شماره موبایل را به صورت ۰۹xxxxxxxxx وارد کنید.'); return } request.mutate() }
  return <main className="auth-page"><div className="auth-card"><Brand /><span className="section-kicker">ورود یا ثبت‌نام</span><h1>خوش آمدید</h1><p>برای ادامه، شماره موبایل خود را وارد کنید.</p><form onSubmit={submit}><TextInput label="شماره موبایل" value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" error={error} /><Button type="submit" disabled={request.isPending}>{request.isPending ? 'در حال ارسال…' : <>ارسال کد <ArrowLeft size={18} /></>}</Button></form><small><Phone size={14} /> شمارهٔ شما فقط برای ورود و پیگیری سفارش استفاده می‌شود.</small></div></main>
}
