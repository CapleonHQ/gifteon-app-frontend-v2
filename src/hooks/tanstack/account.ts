import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '@/api/services/account'
import type { UpdateProfileRequestBody } from '@/types/Account'

export const useProfile = () => {
  return useQuery({
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
