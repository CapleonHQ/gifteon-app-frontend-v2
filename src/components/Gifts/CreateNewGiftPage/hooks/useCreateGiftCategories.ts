import { useQuery } from '@tanstack/react-query'
import { getPageCategories } from '@/api/services/pages'
import {
  extractCategoryOptions,
  sortCategoryOptions,
} from '@/components/Gifts/CreateNewGiftPage/utils/categories'

export const useCreateGiftCategories = () => {
  const query = useQuery({
    queryKey: ['gift-page-create-categories'],
    queryFn: () => getPageCategories(),
  })

  return {
    ...query,
    categories: sortCategoryOptions(extractCategoryOptions(query.data)),
  }
}
