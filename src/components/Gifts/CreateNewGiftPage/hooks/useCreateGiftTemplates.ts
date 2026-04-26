import { useQuery } from '@tanstack/react-query'
import { getTemplates } from '@/api/services/templates'
import {
  extractTemplateOptions,
  sortTemplateOptions,
} from '@/components/Gifts/CreateNewGiftPage/utils/templates'

export const useCreateGiftTemplates = () => {
  const query = useQuery({
    queryKey: ['gift-page-create-templates'],
    queryFn: () => getTemplates(),
  })

  return {
    ...query,
    templates: sortTemplateOptions(extractTemplateOptions(query.data)),
  }
}
