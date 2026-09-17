import { apiClient } from '../../../shared/api/client'
import type { Invoice, OrderDetail, OrderSummary, OrderTimelineItem, Shipment } from '../../../types/orders'

export const ordersApi = {
  list: () => apiClient.request<OrderSummary[]>('/orders', { auth: 'required' }),
  detail: (orderId: string) => apiClient.request<OrderDetail>(`/orders/${encodeURIComponent(orderId)}`, { auth: 'required' }),
  timeline: (orderId: string) => apiClient.request<OrderTimelineItem[]>(
    `/orders/${encodeURIComponent(orderId)}/timeline`,
    { auth: 'required' },
  ),
  invoice: (orderId: string) => apiClient.request<Invoice>(`/orders/${encodeURIComponent(orderId)}/invoice`, { auth: 'required' }),
  shipments: (orderId: string) => apiClient.request<Shipment[]>(`/orders/${encodeURIComponent(orderId)}/shipments`, { auth: 'required' }),
  tracking: (shipmentId: string) => apiClient.request<{
    shipmentId: string
    status: string
    trackingCode: string | null
    provider: string | null
    events: Array<Record<string, unknown>>
  }>(`/shipments/${encodeURIComponent(shipmentId)}/tracking`, { auth: 'required' }),
  cancel: (orderId: string, reason?: string) => apiClient.request<{ id: string; status: string }>(
    `/orders/${encodeURIComponent(orderId)}/cancel`,
    { method: 'POST', auth: 'required', body: { reason } },
  ),
}
