import { type GiftsFilterState } from '@/types/Gifts/filters'
import { type PagesQueryParams } from '@/types/Pages'

const toDateParam = (value?: Date) => {
  if (!value) return undefined
  return value.toISOString().slice(0, 10)
}

export const buildFilterParams = (filters: GiftsFilterState): PagesQueryParams => {
  const params: PagesQueryParams = {}

  if (filters.status !== 'all') {
    params.status = filters.status
  }

  if (filters.category !== 'all') {
    params.category = filters.category
  }

  if (filters.visibility !== 'all') {
    params.visibility = filters.visibility as 'public' | 'shareable' | 'private'
  }

  const fromDate = toDateParam(filters.fromDate)
  const toDate = toDateParam(filters.toDate)

  if (fromDate) params.startdate = fromDate
  if (toDate) params.enddate = toDate

  return params
}
