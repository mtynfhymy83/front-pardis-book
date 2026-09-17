import { apiClient } from '../../../shared/api/client'
import { sessionStore } from '../../../shared/api/storage'
import type { AccountProfile, Address, AddressInput, BusinessProfile, CustomerType } from '../../../types/account'

export const accountApi = {
  me: () => apiClient.request<AccountProfile>('/me', { auth: 'required' }),
  update: (data: { name?: string; customerType?: CustomerType }) => apiClient.request<AccountProfile>('/me', {
    method: 'PATCH', auth: 'required', body: data,
  }),
  businessProfile: () => apiClient.request<BusinessProfile | null>('/me/business-profile', { auth: 'required' }),
  saveBusinessProfile: (data: Omit<BusinessProfile, 'version'> & { version?: number }) => apiClient.request<BusinessProfile>('/me/business-profile', {
    method: 'PUT', auth: 'required', body: data,
  }),
  addresses: () => apiClient.request<Address[]>('/me/addresses', { auth: 'required' }),
  addAddress: (data: AddressInput) => apiClient.request<Address>('/me/addresses', {
    method: 'POST', auth: 'required', body: data,
  }),
  updateAddress: (addressId: string, data: Partial<AddressInput> & { version: number }) => apiClient.request<Address>(
    `/me/addresses/${encodeURIComponent(addressId)}`,
    { method: 'PATCH', auth: 'required', body: data },
  ),
  removeAddress: (addressId: string, version: number) => apiClient.request<void>(
    `/me/addresses/${encodeURIComponent(addressId)}`,
    { method: 'DELETE', auth: 'required', body: { version } },
  ),
  makeDefaultAddress: (addressId: string, version: number) => apiClient.request<Address>(
    `/me/addresses/${encodeURIComponent(addressId)}/default`,
    { method: 'POST', auth: 'required', body: { version } },
  ),
  async requestAccountDeletion() {
    await apiClient.request<void>('/me', { method: 'DELETE', auth: 'required' })
    sessionStore.clear()
  },
}
