export interface UpdateProfileRequestBody {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  homeAddress?: string
  phoneNumber?: string
  profilePicture?: string
  interests?: string[]
}

export interface SetPinRequestBody {
  pin: string
}

export interface ChangePinRequestBody {
  oldPin: string
  newPin: string
}
