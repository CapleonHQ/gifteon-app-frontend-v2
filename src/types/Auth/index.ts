export interface RegisterRequestBody {
  firstName: string
  lastName: string
  email: string
  gender?: string
  country?: string
  password?: string
}

export interface VerifyOtpRequestBody {
  email: string
  otp: string
}

export interface ResendVerificationRequestBody {
  email: string
}

export interface LoginRequestBody {
  email: string
  password: string
}
