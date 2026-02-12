export type PageVisibility = 'Public' | 'Shareable' | 'Private'
export type PageStatus = 'Active' | 'Ended'

export type PageSummary = {
  id: string
  title: string
  category: string
  visibility: PageVisibility
  createdOn: string
  totalGifts: number
  totalWishes: number
  views: number
  status: PageStatus
  image: string
  isActive: boolean
  publicUrl: string
}

export type PageDetails = PageSummary

export type PagesQueryParams = {
  limit?: number
  offset?: number
  search?: string
  status?: 'active' | 'ended'
  category?: string
  visibility?: 'public' | 'shareable' | 'private'
  fromDate?: string
  toDate?: string
}

export type PagesListData = {
  pages: PageSummary[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export type CreatePageData = {
  id: string
  title: string
  content: string
  active: boolean
  titleFont: string
  titleColor: string
  textAlignment: 'left' | 'middle' | 'right'
  titleFormat: string
  titleSize: number
  buttonLabel: string
  buttonTextColor: string
  buttonBackgroundColor: string
  contentFont: string
  contentColor: string
  contentSize: number
  slug: string
  coverImageUrl: string
  userId: string
  categoryId: string
  templateId: string
  updatedAt: string
  createdAt: string
  deletedAt: string | null
}
