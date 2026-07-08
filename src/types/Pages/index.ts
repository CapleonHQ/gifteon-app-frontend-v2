import type { PageContribution } from '@/types/Contributions'

export type PageVisibility = 'Public' | 'Shareable' | 'Private'
export type PageStatus = 'Active' | 'Deactivated' | 'Ended'

export type PageApiPrivacy = 'public' | 'private' | 'shareable'
export type PageShareProvider =
  | 'twitter'
  | 'linkedin'
  | 'whatsapp'
  | 'copy_link'
  | 'qr_code'
  | 'other'

export type ClaimGiftRequestItem = {
  contributionId: string
}

export type ClaimGiftsRequestBody = {
  items: ClaimGiftRequestItem[]
}
export type PageListApiStatus =
  | 'published'
  | 'draft'
  | 'archived'
  | 'inactive'
  | string

export type PageApiUser = {
  id: string
  firstName?: string | null
  lastName?: string | null
}

export type PageApiSocial = {
  id: string
  provider: string
  url: string
}

export type PageApiMedia = {
  id: string
  url: string
  mediaType: 'image' | 'video' | string
  alt: string | null
}

export type PageApiCategory = {
  id: string
  name: string
  avatar: string | null
}

export type PageApiTemplate = {
  id: string
  name: string
}

export type PageApiSettings = {
  id: string
  whoIsFor: string
  hasMusic: boolean
  allowCustomGifts: boolean
  privacy: PageApiPrivacy
  acceptCashGift: boolean
  currency: string
  allowParticipation: boolean
  receiverName: string | null
  receiverEmail: string | null
  receiverDeliveryAddress: string | null
  receiverPhoneNumber: string | null
  minimumAmount: string | null
  maximumAmount: string | null
  amount: string | null
  targetAmount: string | null
  hasStoreItems: boolean
  deletedAt: string | null
  storeItems: Array<Record<string, never>>
  socials: PageApiSocial[]
  customGifts: Array<Record<string, never>>
}

export type PageApiItem = {
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
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  settings: PageApiSettings
  media: PageApiMedia[]
  EventCategory: PageApiCategory | null
  template: PageApiTemplate | null
}

export type PageListApiItem = {
  id: string
  title: string
  slug: string
  coverImageUrl: string | null
  status: PageListApiStatus
  createdAt: string
  updatedAt: string
  categoryName: string | null
  templateName: string | null
  contributions: number
  visibility: PageApiPrivacy
  totalGifts: number
  totalWishes: number
  totalViews: number
}

export type PageDetailsApiItem = {
  id: string
  title: string
  slug: string
  coverImageUrl: string
  createdAt: string
  updatedAt: string
  status: PageListApiStatus
  active: boolean
  categoryName: string
  visibility: PageApiPrivacy
  wishLists: Array<{
    id: string
    type: string | null
    title: string
    imageUrl: string | null
    itemId: string | null
    quantity: number
    unitPrice: string
    quantityGifted: number
    quantityClaimed: number
    quantityClaimable: number
    status: string
    source: string
  }>
  contributions: PageContribution[]
  chartData: {
    giftDistribution: {
      cash: number
      store: number
      custom: number
    }
    pageVisits: Array<{
      date: string
      count: string | number
    }>
  }
  engagement: {
    totalViews: number
    totalShares: number
    totalContributions: number
    totalWishes: number
    totalContributionsValue: number
  }
}

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

export type PageDetailsEngagement = {
  totalViews: number
  totalShares: number
  totalContributions: number
  totalWishes: number
  totalContributionsValue: number
}

export type PageDetailsVisitPoint = {
  date: string
  count: number
}

export type PageDetailsGiftDistribution = {
  cash: number
  store: number
  custom: number
}

export type PageDetailsChartData = {
  giftDistribution: PageDetailsGiftDistribution
  pageVisits: PageDetailsVisitPoint[]
}

export type PageDetails = PageSummary & {
  engagement: PageDetailsEngagement
  chartData: PageDetailsChartData
  contributions: PageContribution[]
}

export type PagesQueryParams = {
  limit?: number
  offset?: number
  search?: string
  s?: string
  status?: 'published' | 'archived' | 'ended' | 'active'
  category?: string
  visibility?: 'public' | 'shareable' | 'private'
  startdate?: string
  enddate?: string
}

export type PagesListData = {
  pages: PageSummary[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export type PagesListApiData = {
  pages: PageListApiItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export type PageDetailsApiData = PageDetailsApiItem

export type CreatePageData = PageApiItem
