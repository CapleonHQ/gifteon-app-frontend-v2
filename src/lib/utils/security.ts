export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export const INITIAL_SETUP_WINDOW_MS = 4.5 * 60 * 1000

export const sanitizeOtp = (value: string) => value.replace(/\D/g, '').slice(0, 6)

export const sanitizePin = (value: string) => value.replace(/\D/g, '').slice(0, 4)
