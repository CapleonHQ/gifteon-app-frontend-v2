import { useMutation } from '@tanstack/react-query'
import { createPage } from '@/api/services/pages'

type UseCreateGiftPageOptions = {
  onSuccess?: (link: string) => void
  onError?: (error: unknown) => void
}

const resolveCreatedLink = (data: { slug: string }) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/u/${data.slug}`
}

export const useCreateGiftPage = (options?: UseCreateGiftPageOptions) =>
  useMutation({
    mutationFn: async (formData: FormData) => {
      const resp = await createPage(formData)
      const data = resp.data
      if (!data) {
        throw new Error('Create page response missing data')
      }
      return resolveCreatedLink(data)
    },
    onSuccess: (link) => {
      options?.onSuccess?.(link)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
