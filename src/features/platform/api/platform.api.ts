import { apiClient } from '../../../shared/api/client'
import type { HomeContent, Navigation } from '../../../types/catalog'

export type Bootstrap = {
  currency: string
  locale: string
  features: {
    guestCart: boolean
    onlinePayment: boolean
  }
}

export const platformApi = {
  bootstrap: () => apiClient.request<Bootstrap>('/bootstrap', { auth: 'none' }),
  home: () => apiClient.request<HomeContent>('/home', { auth: 'none' }),
  navigation: () => apiClient.request<Navigation>('/navigation', { auth: 'none' }),
  live: () => apiClient.request<{ status: string }>('/health/live', { auth: 'none' }),
  ready: () => apiClient.request<{ status: string; database: string }>('/health/ready', { auth: 'none' }),
}
