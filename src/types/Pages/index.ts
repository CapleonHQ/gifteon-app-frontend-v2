export type PageVisibility = 'Public' | 'Shareable' | 'Private'
export type PageStatus = 'Active' | 'Ended'

export type PageApiPrivacy = 'public' | 'private' | 'shareable'

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

export type PagesListApiData = {
  pages: PageApiItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export type PageDetailsApiData = PageApiItem

export type CreatePageData = PageApiItem
