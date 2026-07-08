import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  changePin,
  changeTag,
  getProfile,
  requestAccountOtp,
  setPassword,
  setPin,
  updateProfile,
  verifyTag,
} from '@/api/services/account'
import type { ApiResponse } from '@/types/Common'
import type {
  ChangeTagRequestBody,
  ChangePinRequestBody,
  ChangePasswordRequestBody,
  RequestAccountOtpRequestBody,
  VerifyTagRequestBody,
  UpdateProfilePayload,
  SetPasswordRequestBody,
  SetPinRequestBody,
} from '@/types/Account'
import type { UserProfile } from '@/types/Account'

export const useProfile = () => {
  return useQuery<ApiResponse<UserProfile>>({
    queryKey: ['account', 'profile'],
    queryFn: getProfile,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] })
    },
  })
}

export const useSetPin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SetPinRequestBody) => setPin(data),
    onSuccess: () => {
      queryClient.setQueryData<ApiResponse<UserProfile>>(
        ['account', 'profile'],
        (current) => {
          if (!current?.data) return current
          return {
            ...current,
            data: {
              ...current.data,
              pinActivated: true,
            },
          }
        }
      )
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] })
    },
  })
}

export const useRequestAccountOtp = () => {
  return useMutation({
    mutationFn: (data: RequestAccountOtpRequestBody) => requestAccountOtp(data),
  })
}

export const useSetPassword = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SetPasswordRequestBody) => setPassword(data),
    onSuccess: () => {
      queryClient.setQueryData<ApiResponse<UserProfile>>(
        ['account', 'profile'],
        (current) => {
          if (!current?.data) return current
          return {
            ...current,
            data: {
              ...current.data,
              passwordActivated: true,
            },
          }
        }
      )
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] })
    },
  })
}

export const useChangePin = () => {
  return useMutation({
    mutationFn: (data: ChangePinRequestBody) => changePin(data),
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequestBody) => changePassword(data),
  })
}

export const useVerifyTag = () => {
  return useMutation({
    mutationFn: (data: VerifyTagRequestBody) => verifyTag(data),
  })
}

export const useChangeTag = () => {
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<null>, unknown, ChangeTagRequestBody>({
    mutationFn: (data: ChangeTagRequestBody) => changeTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] })
    },
  })
}
