export type AuthUser = {
  id: string
  phone: string
  name: string | null
}

export type OtpChallenge = {
  challengeId: string
  expiresInSeconds: number
  resendAfterSeconds: number
  maskedPhone: string
  developmentCode?: string
}

export type CartMergeResult = {
  status: 'not_requested' | 'not_found' | 'already_merged' | 'merged' | string
  sourceCartId?: string
  targetCartId?: string
  mergedLineCount?: number
}

export type AuthSession = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: AuthUser
  isNewUser: boolean
  profileCompleted: boolean
  cartMerge: CartMergeResult
}

export type UserSession = {
  id: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string
  deviceId: string | null
  isCurrent: boolean
}
