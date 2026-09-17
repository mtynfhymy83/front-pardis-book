import { FormEvent, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { Brand } from '../components/Brand'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/TextInput'
import { authApi } from '../features/auth/api/auth.api'
import type { OtpChallenge } from '../types/auth'

export function OtpPage() {
  const navigate = useNavigate(); const location = useLocation(); const state = location.state as { challenge?: OtpChallenge; returnTo?: string } | null; const challenge = state?.challenge
  const [code, setCode] = useState(''); const [error, setError] = useState('')
  useEffect(() => { if (!challenge) navigate(routes.login, { replace: true }) }, [challenge, navigate])
  const verify = useMutation({ mutationFn: () => authApi.verifyOtp(challenge!.challengeId, code.trim()), onSuccess: (session) => navigate(session.profileCompleted ? (state?.returnTo || routes.home) : routes.buyerProfile, { replace: true }), onError: () => setError('کد واردشده معتبر نیست یا منقضی شده است.') })
  if (!challenge) return null
  const submit = (event: FormEvent) => { event.preventDefault(); setError(''); if (!/^\d{4,8}$/.test(code)) { setError('کد تأیید را کامل وارد کنید.'); return } verify.mutate() }
  return <main className="auth-page"><div className="auth-card"><Brand /><span className="section-kicker">تأیید شماره</span><h1>کد را وارد کنید</h1><p>کد تأیید به {challenge.maskedPhone} ارسال شد.</p><form onSubmit={submit}><TextInput label="کد تأیید" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="••••••" error={error} /><Button type="submit" disabled={verify.isPending}>{verify.isPending ? 'در حال تأیید…' : 'ورود به حساب'}</Button></form>{challenge.developmentCode && <small className="dev-code">کد توسعه: {challenge.developmentCode}</small>}<button className="text-button" type="button" onClick={() => navigate(routes.login)}>تغییر شماره</button></div></main>
}
