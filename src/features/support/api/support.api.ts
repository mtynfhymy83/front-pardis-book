import { apiClient } from '../../../shared/api/client'
import type { PresignedUpload, SupportCategory, SupportTicket, SupportTicketSummary } from '../../../types/support'

export const supportApi = {
  categories: () => apiClient.request<SupportCategory[]>('/support/categories', { auth: 'none' }),
  tickets: () => apiClient.request<SupportTicketSummary[]>('/support/tickets', { auth: 'required' }),
  ticket: (ticketId: string) => apiClient.request<SupportTicket>(`/support/tickets/${encodeURIComponent(ticketId)}`, { auth: 'required' }),
  createTicket: (data: { categoryId: string; title: string; description: string; orderId?: string; uploadIds?: string[] }) => apiClient.request<{ id: string; status: string }>('/support/tickets', {
    method: 'POST', auth: 'required', body: data,
  }),
  addMessage: (ticketId: string, body: string) => apiClient.request<{ id: string; status: string }>(
    `/support/tickets/${encodeURIComponent(ticketId)}/messages`,
    { method: 'POST', auth: 'required', body: { body } },
  ),
  closeTicket: (ticketId: string) => apiClient.request<{ id: string; status: string }>(
    `/support/tickets/${encodeURIComponent(ticketId)}/close`,
    { method: 'POST', auth: 'required' },
  ),
  createUpload: (file: File) => apiClient.request<PresignedUpload>('/support/uploads', {
    method: 'POST',
    auth: 'required',
    body: { fileName: file.name, mime: file.type, sizeBytes: file.size },
  }),
}
