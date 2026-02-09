import { PaginationParams } from '@/types/Common'

export interface ListingsQueryParams extends PaginationParams {
  categoryId?: string
  status?: string
  quantityStatus?: string
  productType?: string
}

export interface UpdateListingRequestBody {
  productName?: string
  unitPrice?: number
  stockQuantity?: number
  colors?: string[]
  tags?: string[]
  lowStockThreshold?: number
  couponDetails?: {
    id?: string
    name?: string
    discountValue?: number
    minimumAmount?: number
    maximumUsage?: number
    startDate?: string
    endDate?: string
  }
}

export interface CreateListingRequestBody {
  storeId: string
  categoryId: string
  productName: string
  productType: string
  description?: string
  unitPrice: number
  images?: string[]
  colors?: string[]
  tags?: string[]
  video?: string
  stockQuantity?: number
  lowStockThreshold?: number
  couponDetails?: {
    name?: string
    discountValue?: number
    minimumAmount?: number
    maximumUsage?: number
    startDate?: string
    endDate?: string
  }
}

export interface BulkCreateListingsRequestBody {
  listings: Array<CreateListingRequestBody>
}

export interface UpdateListingsStateRequestBody {
  ids: string[]
  status: string
}
