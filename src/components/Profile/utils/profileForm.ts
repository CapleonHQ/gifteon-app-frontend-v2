import type { UserProfile } from '@/types/Account'

export type ProfileFormState = {
  firstName: string
  lastName: string
  phone: string
  email: string
  dob?: Date
  address: string
  gender: string
}

const parseApiDate = (value?: string | null): Date | undefined => {
  if (!value) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed
}

export const toProfileForm = (user: UserProfile | undefined): ProfileFormState => {
  if (!user) {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: undefined,
      address: '',
      gender: '',
    }
  }

  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phoneNumber || '',
    email: user.email || '',
    dob: parseApiDate(user.dateOfBirth),
    address: user.homeAddress || '',
    gender: user.gender || '',
  }
}
