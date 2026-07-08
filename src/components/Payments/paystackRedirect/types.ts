export type UiStatus =
  | 'verifying'
  | 'success'
  | 'failed'
  | 'canceled'
  | 'pending'
  | 'invalid'
  | 'error'

export type VerifiedStatus = Exclude<UiStatus, 'verifying'>

export type VerifyResult = {
  uiStatus: VerifiedStatus
  message?: string
}

export type RedirectHint = 'success' | 'cancel' | 'unknown'

export type VerifyErrorShape = {
  status?: number
  response?: { status?: number }
}
