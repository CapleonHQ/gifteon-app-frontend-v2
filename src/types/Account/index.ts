export interface UpdateProfileRequestBody {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  homeAddress?: string
  phoneNumber?: string
  profilePicture?: string
  interests?: string[]
}

export type UpdateProfilePayload = UpdateProfileRequestBody | FormData

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
  giftseonTag?: string | null
  temporaryTag?: boolean
  country: string
  profilePicture: string | null
  interests: string[] | null
  status: string
  kycEnabled: boolean
  kycLevel?: number
  loggedIn: number
  lastLoginAt: string
  createdAt: string
  updatedAt: string
  pinActivated: boolean
}

export interface SetPinRequestBody {
  pin: string
}

export interface ChangePinRequestBody {
  oldPin: string
  newPin: string
}

export interface VerifyTagRequestBody {
  tag: string
}

export interface VerifyTagResponseData {
  exists: boolean
}

export interface ChangeTagRequestBody {
  tag: string
}
