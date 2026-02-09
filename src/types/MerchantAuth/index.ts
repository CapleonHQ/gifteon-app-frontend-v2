export interface MerchantRegisterRequestBody {
  firstName: string
  lastName: string
  email: string
  gender?: string
  country?: string
  password: string
}

export interface MerchantVerifyOtpRequestBody {
  email: string
  otp: string
}

export interface MerchantLoginRequestBody {
  email: string
  password: string
}
