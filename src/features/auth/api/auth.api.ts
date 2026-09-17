import { apiClient } from '../../../shared/api/client'
import { guestCartStore, sessionStore } from '../../../shared/api/storage'
import type { AuthSession, OtpChallenge, UserSession } from '../../../types/auth'

export const authApi = {
  requestOtp: (phone: string) => apiClient.request<OtpChallenge>('/auth/otp/request', {
    method: 'POST',
    auth: 'none',
    body: { phone },
  }),

  async verifyOtp(challengeId: string, code: string) {
    const session = await apiClient.request<AuthSession>('/auth/otp/verify', {
      method: 'POST',
      auth: 'none',
      body: { challengeId, code, guestCartToken: guestCartStore.getToken() || '' },
    })
    sessionStore.setTokens(session)
    guestCartStore.clear()
    return session
  },

  sessions: () => apiClient.request<UserSession[]>('/auth/sessions', { auth: 'required' }),

  async logout() {
    try {
      await apiClient.request<void>('/auth/logout', { method: 'POST', auth: 'required' })
    } finally {
      sessionStore.clear()
    }
  },

  async logoutAll() {
    try {
      await apiClient.request<void>('/auth/logout-all', { method: 'POST', auth: 'required' })
    } finally {
      sessionStore.clear()
    }
  },

  revokeSession: (sessionId: string) => apiClient.request<void>(`/auth/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
    auth: 'required',
  }),
}
