export interface UpdateProfileRequestBody {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  homeAddress?: string
  phoneNumber?: string
  profilePicture?: string
  interests?: string[]
}

export interface UserProfile {
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

export interface SetPinRequestBody {
  pin: string
}

export interface ChangePinRequestBody {
  oldPin: string
  newPin: string
}
