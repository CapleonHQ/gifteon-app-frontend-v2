export type GiftsFilterState = {
  fromDate?: Date
  toDate?: Date
  status: 'all' | 'published' | 'archived' | 'ended'
  category: string
  visibility: string
}
