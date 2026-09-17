export type SupportCategory = { id: string; title: string }

export type SupportTicketSummary = {
  id: string
  categoryId: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
}

export type SupportMessage = {
  id: string
  body: string
  isStaff: boolean
  createdAt: string
}

export type SupportTicket = Omit<SupportTicketSummary, 'updatedAt'> & {
  messages: SupportMessage[]
}

export type PresignedUpload = {
  uploadId: string
  storage: {
    url: string
    method?: string
    headers?: Record<string, string>
    [key: string]: unknown
  }
}
