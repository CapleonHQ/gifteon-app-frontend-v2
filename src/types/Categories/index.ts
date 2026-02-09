import { PaginationParams } from '@/types/Common'

export interface ListingCategoriesQueryParams extends PaginationParams {
  categoryId?: string
  status?: string
  quantityStatus?: string
  productType?: string
}

export interface CreateListingCategoryRequestBody {
  name: string
}
