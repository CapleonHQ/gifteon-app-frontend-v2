import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { changePin, getProfile, setPin, updateProfile } from '@/api/services/account'
import type { ApiResponse } from '@/types/Common'
import type {
  ChangePinRequestBody,
  SetPinRequestBody,
  UpdateProfileRequestBody,
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
    mutationFn: (data: UpdateProfileRequestBody) => updateProfile(data),
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

export const useChangePin = () => {
  return useMutation({
    mutationFn: (data: ChangePinRequestBody) => changePin(data),
  })
}
