import { clearAccessToken, clearRefreshToken } from './token'

export const AUTH_LOGOUT_EVENT = 'giftseon:logout'

export interface LogoutOptions {
  redirectTo?: string
  emitEvent?: boolean
}

const isBrowser = (): boolean => typeof window !== 'undefined'

const emitLogoutEvent = (): void => {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT))
}

export const logout = (options: LogoutOptions = {}): void => {
  clearAccessToken()
  clearRefreshToken()
  if (options.emitEvent !== false) {
    emitLogoutEvent()
  }
  if (options.redirectTo && isBrowser()) {
    window.location.assign(options.redirectTo)
  }
}
