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
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    type: string
  }
}

export interface RegisterResponse {
  status: string
  message: string
}

export interface ResendVerificationResponse {
  success: string
  message: string
}

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  gender: string
  provider: string
  phoneNumber: string | null
  dateOfBirth: string | null
  accountType: string
  homeAddress: string | null
  country: string
  profilePicture: string | null
  interests: string[] | null
  status: string
  kycEnabled: boolean
  loggedIn: number
  lastLoginAt: string
  createdAt: string
  updatedAt: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  accessToken: string
  refreshToken?: string
  user?: AuthUser
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    accessToken?: string
    refreshToken?: string
  }
}
