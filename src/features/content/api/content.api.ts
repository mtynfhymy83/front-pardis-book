import { apiClient } from '../../../shared/api/client'

export type ContentPage = {
  id: string
  slug: string
  title: string
  body: string
}

export const contentApi = {
  page: (slug: string) => apiClient.request<ContentPage>(`/content/pages/${encodeURIComponent(slug)}`, { auth: 'none' }),
}
