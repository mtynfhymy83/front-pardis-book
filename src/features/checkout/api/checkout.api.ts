import { apiClient, createIdempotencyKey } from '../../../shared/api/client'
import type { CheckoutQuote, CreatedOrder, PaymentAttempt } from '../../../types/checkout'

export const checkoutApi = {
  quote: (addressId: string, shippingOptionId = 'ship_standard') => apiClient.request<CheckoutQuote>('/checkout/quote', {
    method: 'POST', auth: 'required', body: { addressId, shippingOptionId },
  }),
  createOrder: (quoteId: string, acceptTermsVersion: string, idempotencyKey = createIdempotencyKey('order')) => apiClient.request<CreatedOrder>('/orders', {
    method: 'POST', auth: 'required', idempotencyKey, body: { quoteId, acceptTermsVersion },
  }),
  createPayment: (
    orderId: string,
    returnUrl: string,
    provider = 'default',
    idempotencyKey = createIdempotencyKey('payment'),
  ) => apiClient.request<PaymentAttempt>('/payments/attempts', {
    method: 'POST', auth: 'required', idempotencyKey, body: { orderId, returnUrl, provider },
  }),
  paymentAttempt: (attemptId: string) => apiClient.request<PaymentAttempt & { amount: number; provider: string; createdAt: string }>(
    `/payments/attempts/${encodeURIComponent(attemptId)}`,
    { auth: 'required' },
  ),
  verifyPayment: (attemptId: string) => apiClient.request<{ attemptId: string; status: string }>(
    `/payments/attempts/${encodeURIComponent(attemptId)}/verify`,
    { method: 'POST', auth: 'required' },
  ),
  orderPayment: (orderId: string) => apiClient.request<{
    orderId: string
    status: string
    paymentStatus: string
    attempts: Array<{ id: string; status: string; amount: number; provider: string; createdAt: string }>
  }>(`/orders/${encodeURIComponent(orderId)}/payment`, { auth: 'required' }),
}
