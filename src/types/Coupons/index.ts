export interface CreateCouponRequestBody {
  name: string
  discountValue: number
  minimumAmount?: number
  maximumUsage?: number
  startDate?: string
  endDate?: string
}

export interface UpdateCouponRequestBody {
  name?: string
  discountValue?: number
  maximumUsage?: number
  endDate?: string
}
