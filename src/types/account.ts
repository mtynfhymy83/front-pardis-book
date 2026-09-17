export type CustomerType = 'individual' | 'teacher' | 'language_school' | 'bookstore' | 'school' | 'other_business'

export type AccountProfile = {
  id: string
  phone: string
  name: string | null
  customerType: CustomerType | null
}

export type BusinessProfile = {
  version: number
  organizationName?: string
  nationalId?: string
  economicCode?: string
  landline?: string
  invoiceNotes?: string
  [key: string]: unknown
}

export type Address = {
  id: string
  version: number
  isDefault: boolean
  recipientName: string
  recipientPhone: string
  provinceId: string
  cityId: string
  postalCode: string
  addressLine: string
  customerType?: CustomerType
  [key: string]: unknown
}

export type AddressInput = {
  recipientName: string
  recipientPhone: string
  provinceId: string
  cityId: string
  postalCode: string
  addressLine: string
  customerType?: CustomerType
  isDefault?: boolean
  [key: string]: unknown
}
